// Vozes sintéticas. Cada personagem tem um "perfil" (tom/velocidade) aplicado à voz pt-BR do aparelho.
// Futuro: se existir um arquivo pré-gerado em audio/voz/<id>.mp3, ele terá prioridade sobre a síntese.
import { SaveManager } from '../core/SaveManager';

export type Personagem = 'narrador' | 'lili' | 'marcos' | 'marcela' | 'july' | 'robi' | 'kelly' | 'laura';

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
};

// Heurística: nomes comuns de vozes femininas/masculinas em pt-BR nos motores de TTS.
const FEM = /(female|feminin|mulher|francisca|thalita|luciana|maria|vitoria|leila|brenda|giovanna|yara|manuela|elza|raquel|ana|pt-br-x-afs|pt-br-x-pte)/i;
const MASC = /(male|masculin|homem|antonio|daniel|felipe|donato|fabio|julio|humberto|nicolau|valerio|ricardo|pt-br-x-ptd|pt-br-x-ptl)/i;

class VoiceManagerImpl {
  private vozes: SpeechSynthesisVoice[] = [];
  private ultima?: { texto: string; quem: Personagem };

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

  private escolherVoz(p: Perfil): SpeechSynthesisVoice | undefined {
    const br = this.vozes.filter((v) => /br/i.test(v.lang));
    const lista = br.length ? br : this.vozes;
    if (p.prefere === 'feminina') return lista.find((v) => FEM.test(v.name + v.voiceURI)) ?? lista[0];
    if (p.prefere === 'masculina') return lista.find((v) => MASC.test(v.name + v.voiceURI)) ?? lista[0];
    return lista[0];
  }

  /** Fala curta (2 a 8 segundos). Interrompe a fala anterior para não acumular. */
  falar(texto: string, quem: Personagem = 'narrador'): void {
    this.ultima = { texto, quem };
    const synth = window.speechSynthesis;
    if (!synth) return;
    const vol = SaveManager.data.settings.volumeVoz;
    if (vol <= 0) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    const p = PERFIS[quem];
    u.lang = 'pt-BR';
    const voz = this.escolherVoz(p);
    if (voz) u.voice = voz;
    u.pitch = p.pitch;
    u.rate = p.rate;
    u.volume = vol;
    synth.speak(u);
  }

  repetir(): void {
    if (this.ultima) this.falar(this.ultima.texto, this.ultima.quem);
  }

  calar(): void {
    window.speechSynthesis?.cancel();
  }
}

export const VoiceManager = new VoiceManagerImpl();
