// Save local no navegador, com schema versionado para migração entre versões do jogo.
// Guarda apenas progresso e configurações; nenhum dado pessoal da criança.

export type ControlLayout = 'dpad-direita' | 'dpad-esquerda';

export interface Settings {
  volumeVoz: number;
  volumeMusica: number;
  volumeEfeitos: number;
  controles: ControlLayout;
  reduzirMovimento: boolean;
}

export interface LevelProgress {
  concluida: boolean;
  pegadas: string[];
  melhorTempoMs?: number;
}

export interface SaveData {
  versao: number;
  fases: Record<string, LevelProgress>;
  // Tentativas agregadas por trecho (checkpoint), usadas só para oferecer ajuda.
  tentativas: Record<string, number>;
  settings: Settings;
}

const KEY = 'chico-atlas-vivo:save';
const VERSAO_ATUAL = 1;

export const DEFAULT_SETTINGS: Settings = {
  volumeVoz: 1,
  volumeMusica: 0.6,
  volumeEfeitos: 0.8,
  controles: 'dpad-direita',
  reduzirMovimento: false,
};

function novoSave(): SaveData {
  return { versao: VERSAO_ATUAL, fases: {}, tentativas: {}, settings: { ...DEFAULT_SETTINGS } };
}

// Cada entrada migra da versão N para N+1. Ex.: migracoes[1] leva um save v1 para v2.
const migracoes: Record<number, (s: any) => any> = {};

function migrar(raw: any): SaveData {
  let s = raw;
  while (typeof s?.versao === 'number' && s.versao < VERSAO_ATUAL && migracoes[s.versao]) {
    s = migracoes[s.versao](s);
  }
  if (s?.versao !== VERSAO_ATUAL) return novoSave();
  return {
    ...novoSave(),
    ...s,
    settings: { ...DEFAULT_SETTINGS, ...(s.settings ?? {}) },
  };
}

class SaveManagerImpl {
  data: SaveData;

  constructor() {
    this.data = this.carregar();
    // Pede ao navegador para não apagar o save automaticamente.
    try {
      navigator.storage?.persist?.();
    } catch {
      /* sem suporte: segue normal */
    }
  }

  private carregar(): SaveData {
    try {
      const txt = localStorage.getItem(KEY);
      return txt ? migrar(JSON.parse(txt)) : novoSave();
    } catch {
      return novoSave();
    }
  }

  salvar(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* armazenamento indisponível: o jogo continua sem salvar */
    }
  }

  fase(id: string): LevelProgress {
    if (!this.data.fases[id]) this.data.fases[id] = { concluida: false, pegadas: [] };
    return this.data.fases[id];
  }

  registrarTentativa(trecho: string): number {
    const n = (this.data.tentativas[trecho] ?? 0) + 1;
    this.data.tentativas[trecho] = n;
    this.salvar();
    return n;
  }

  exportar(): string {
    return btoa(unescape(encodeURIComponent(JSON.stringify(this.data))));
  }

  importar(codigo: string): boolean {
    try {
      this.data = migrar(JSON.parse(decodeURIComponent(escape(atob(codigo.trim())))));
      this.salvar();
      return true;
    } catch {
      return false;
    }
  }

  apagarTudo(): void {
    this.data = novoSave();
    this.salvar();
  }
}

export const SaveManager = new SaveManagerImpl();
