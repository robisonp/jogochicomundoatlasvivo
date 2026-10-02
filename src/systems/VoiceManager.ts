// Vozes. Quando a família gravou a fala (public/vozes/<pessoa>/<código>.<ext>, códigos em data/vozes.ts),
// toca a gravação; senão, usa a voz sintética do aparelho com o "perfil" (tom/velocidade) do personagem.
// Gravações e voz sintética passam pela mesma fila, então "fala e depois curiosidade" continua em ordem.
import arquivos from 'virtual:vozes';
import { SaveManager } from '../core/SaveManager';
import { GRAVACOES } from '../data/vozes';

export type Personagem = 'narrador' | 'lili' | 'marcos' | 'marcela' | 'july' | 'robi' | 'kelly' | 'laura' | 'bicho';

interface Perfil {
  pitch: number;
  rate: number;
  // Preferência de voz, quando o aparelho oferece mais de uma em pt-BR.
  prefere: 'feminina' | 'masculina' | 'qualquer';
}

const PERFIS: Record<Personagem, Perfil> = {
  narrador: { pitch: 1.0, rate: 1.0, prefere: 'qualquer' },
  lili: { pitch: 0.95, rate: 0.9, prefere: 'feminina' },
  marcos: { pitch: 0.8, rate: 0.95, prefere: 'masculina' },
  marcela: { pitch: 1.1, rate: 0.95, prefere: 'feminina' },
  july: { pitch: 1.15, rate: 1.05, prefere: 'feminina' },
  robi: { pitch: 0.95, rate: 1.1, prefere: 'masculina' },
  kelly: { pitch: 1.2, rate: 1.05, prefere: 'feminina' },
  laura: { pitch: 1.05, rate: 1.0, prefere: 'feminina' },
  // Animais falam em primeira pessoa (falas do dossiê), com voz mais aguda e alegre.
  bicho: { pitch: 1.45, rate: 1.05, prefere: 'qualquer' },
};

// Heurística: nomes comuns de vozes femininas/masculinas em pt-BR nos motores de TTS.
const FEM = /(female|feminin|mulher|francisca|thalita|luciana|maria|vitoria|leila|brenda|giovanna|yara|manuela|elza|raquel|ana|pt-br-x-afs|pt-br-x-pte)/i;
const MASC = /(\bmale|masculin|homem|antonio|daniel|felipe|donato|fabio|julio|humberto|nicolau|valerio|ricardo|pt-br-x-ptd|pt-br-x-ptl)/i;

/** Texto comparável: sem diferença de espaços, aspas curvas ou maiúsculas. */
const normalizar = (t: string) => t.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

/** Código a partir do nome do arquivo, tolerante: "lili-001", "Lili_1", "lili 001" → "lili-001". */
function codigoDoArquivo(caminho: string): string | null {
  const nome = caminho.split('/').pop()!.replace(/\.[a-z0-9]+$/i, '').toLowerCase();
  const m = nome.replace(/[^a-z0-9]/g, '').match(/^([a-z]+?)0*(\d+)$/);
  return m ? `${m[1]}-${m[2].padStart(3, '0')}` : null;
}

/** "lili|texto normalizado" → caminho do arquivo gravado. */
const ARQUIVO_DA_FALA = new Map<string, string>();
for (const caminho of arquivos) {
  const codigo = codigoDoArquivo(caminho);
  const texto = codigo ? GRAVACOES[codigo] : undefined;
  if (codigo && texto) ARQUIVO_DA_FALA.set(`${codigo.split('-')[0]}|${normalizar(texto)}`, caminho);
}

interface Item {
  texto: string;
  quem: Personagem;
  arquivo?: string;
}

class VoiceManagerImpl {
  private vozes: SpeechSynthesisVoice[] = [];
  private ultima?: { texto: string; quem: Personagem };
  /** Quem quer saber quando alguém fala (o HUD mostra o rosto de quem da família está falando). */
  private ouvintes = new Set<(quem: Personagem) => void>();
  private fila: Item[] = [];
  private tocando = false;
  private audio?: HTMLAudioElement;
  /** Segurança: se o aparelho não avisar que a fala acabou, a fila anda mesmo assim. */
  private relogio?: number;
  /** Cada fala tocada ganha um número; avisos atrasados de falas antigas são ignorados. */
  private vez = 0;

  aoFalar(fn: (quem: Personagem) => void): () => void {
    this.ouvintes.add(fn);
    return () => this.ouvintes.delete(fn);
  }

  constructor() {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const carregar = () => {
      this.vozes = synth.getVoices().filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('pt'));
    };
    carregar();
    synth.addEventListener?.('voiceschanged', carregar);
  }

  get disponivel(): boolean {
    return !!window.speechSynthesis;
  }

  /** Falas da família que já têm gravação, em ordem de código (área dos adultos: contar e ouvir). */
  listarGravadas(): { quem: Personagem; texto: string; arquivo: string }[] {
    return Object.entries(GRAVACOES)
      .map(([codigo, texto]) => ({ quem: codigo.split('-')[0] as Personagem, texto, arquivo: ARQUIVO_DA_FALA.get(`${codigo.split('-')[0]}|${normalizar(texto)}`) }))
      .filter((g): g is { quem: Personagem; texto: string; arquivo: string } => !!g.arquivo);
  }

  private escolherVoz(p: Perfil): SpeechSynthesisVoice | undefined {
    const br = this.vozes.filter((v) => /br/i.test(v.lang));
    const lista = br.length ? br : this.vozes;
    if (p.prefere === 'feminina') return lista.find((v) => FEM.test(v.name + v.voiceURI)) ?? lista[0];
    if (p.prefere === 'masculina') return lista.find((v) => MASC.test(v.name + v.voiceURI)) ?? lista[0];
    return lista[0];
  }

  /**
   * Fala curta (2 a 8 segundos). Por padrão interrompe a fala anterior para não acumular;
   * com `enfileirar`, espera a anterior terminar (ex.: fala do bicho seguida da curiosidade).
   */
  falar(texto: string, quem: Personagem = 'narrador', enfileirar = false): void {
    this.ultima = { texto, quem };
    const item: Item = { texto, quem, arquivo: ARQUIVO_DA_FALA.get(`${quem}|${normalizar(texto)}`) };
    if (!enfileirar) {
      this.calar();
      this.fila = [item];
    } else {
      this.fila.push(item);
    }
    if (!this.tocando) this.proxima();
  }

  private proxima(): void {
    window.clearTimeout(this.relogio);
    if (this.audio) {
      this.audio.onended = null;
      this.audio.pause();
      this.audio = undefined;
    }
    const item = this.fila.shift();
    if (!item) {
      this.tocando = false;
      return;
    }
    this.tocando = true;
    const vez = ++this.vez;
    const acabou = () => {
      if (vez === this.vez) this.proxima();
    };
    for (const fn of this.ouvintes) fn(item.quem);
    const vol = SaveManager.data.settings.volumeVoz;
    if (vol <= 0) {
      acabou();
      return;
    }
    // segurança: anda depois de um tempo proporcional ao texto, mesmo sem o aviso de "terminou"
    this.relogio = window.setTimeout(acabou, 2500 + item.texto.length * 90);
    if (item.arquivo) {
      const a = new Audio(item.arquivo);
      a.volume = Math.min(1, vol);
      a.onended = acabou;
      // gravação: a segurança usa a duração real do arquivo (a vovó pode falar devagar)
      a.onloadedmetadata = () => {
        if (vez !== this.vez || !isFinite(a.duration)) return;
        window.clearTimeout(this.relogio);
        this.relogio = window.setTimeout(acabou, a.duration * 1000 + 1500);
      };
      // arquivo com problema: fala com a voz sintética
      a.onerror = () => {
        if (vez === this.vez) this.sintetizar(item, vol, acabou);
      };
      this.audio = a;
      a.play().catch(() => {
        if (vez === this.vez) this.sintetizar(item, vol, acabou);
      });
      return;
    }
    this.sintetizar(item, vol, acabou);
  }

  private sintetizar(item: Item, vol: number, acabou: () => void): void {
    const synth = window.speechSynthesis;
    if (!synth) {
      acabou();
      return;
    }
    const u = new SpeechSynthesisUtterance(item.texto);
    const p = PERFIS[item.quem];
    u.lang = 'pt-BR';
    const voz = this.escolherVoz(p);
    if (voz) u.voice = voz;
    u.pitch = p.pitch;
    u.rate = p.rate;
    u.volume = vol;
    u.onend = acabou;
    u.onerror = acabou;
    synth.speak(u);
  }

  repetir(): void {
    if (this.ultima) this.falar(this.ultima.texto, this.ultima.quem);
  }

  calar(): void {
    this.vez++;
    window.clearTimeout(this.relogio);
    this.fila = [];
    this.tocando = false;
    if (this.audio) {
      this.audio.onended = null;
      this.audio.pause();
      this.audio = undefined;
    }
    window.speechSynthesis?.cancel();
  }
}

export const VoiceManager = new VoiceManagerImpl();
