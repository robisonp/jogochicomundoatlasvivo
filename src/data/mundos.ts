// Visual e som de cada mundo. A fase diz em qual mundo está (`mundo` em LevelDef) e a cena usa este tema.

export type MundoId = 'caatinga' | 'amazonia' | 'savana' | 'australia' | 'artico';
/** Tema visual: um por mundo, mais variações (a mata de eucaliptos da Austrália). */
export type TemaId = MundoId | 'australia-mata';
export type TemaMusica = 'baiao' | 'mata' | 'savana' | 'outback' | 'artico';

export interface TemaMundo {
  /** Caractere sólido → [textura interna, textura com topo]. */
  solidos: Record<string, [string, string]>;
  laje: string;
  espinhos: string;
  ceu: string;
  sol: boolean;
  /** Sol baixinho perto do horizonte (sol da meia-noite). */
  solBaixo?: boolean;
  nuvens: boolean;
  /** Textura das plataformas que se movem (M/V). Padrão: página do Atlas. */
  plataforma?: string;
  /** Textura dos rastros (:). Padrão: cascos na terra. */
  rastro?: string;
  /** Fundo dos túneis (t) e atrás da terra/neve que quebra. Padrão: terra escura. */
  toca?: string;
  /** Camadas de fundo (parallax): textura, altura, quanto a base fica abaixo da linha do chão e fator de rolagem. */
  fundo: { textura: string; altura: number; afundar: number; fator: number }[];
  musica: TemaMusica;
  /** Poder que o botão da pata usa neste mundo. */
  poderBotao: 'bola' | 'arrancada' | 'superpulo' | 'mergulho';
}

export const TEMAS: Record<TemaId, TemaMundo> = {
  caatinga: {
    solidos: { '#': ['terra', 'terra-topo'], R: ['rocha', 'rocha-topo'] },
    laje: 'laje',
    espinhos: 'espinhos',
    ceu: 'ceu',
    sol: true,
    nuvens: true,
    fundo: [
      { textura: 'serra', altura: 320, afundar: 20, fator: 0.15 },
      { textura: 'mata-fundo', altura: 260, afundar: 10, fator: 0.4 },
    ],
    musica: 'baiao',
    poderBotao: 'bola',
  },
  amazonia: {
    solidos: { '#': ['terra-mata', 'terra-mata-topo'], R: ['tronco', 'tronco-topo'] },
    laje: 'galho',
    espinhos: 'espinheiro',
    ceu: 'ceu-mata',
    sol: false,
    nuvens: false,
    fundo: [
      { textura: 'floresta-longe', altura: 320, afundar: 20, fator: 0.15 },
      { textura: 'floresta-perto', altura: 300, afundar: 10, fator: 0.4 },
    ],
    musica: 'mata',
    poderBotao: 'bola',
  },
  savana: {
    solidos: { '#': ['terra-savana', 'terra-savana-topo'], R: ['rocha', 'rocha-topo'] },
    laje: 'copa-acacia',
    espinhos: 'espinho-acacia',
    ceu: 'ceu-savana',
    sol: true,
    nuvens: true,
    fundo: [
      { textura: 'savana-longe', altura: 320, afundar: 20, fator: 0.15 },
      { textura: 'savana-perto', altura: 280, afundar: 10, fator: 0.4 },
    ],
    musica: 'savana',
    poderBotao: 'arrancada',
  },
  // Interior seco (Outback): terra vermelha, capim-espinifex e morros de arenito.
  australia: {
    solidos: { '#': ['terra-outback', 'terra-outback-topo'], R: ['arenito', 'arenito-topo'] },
    laje: 'galho-eucalipto',
    espinhos: 'espinifex',
    ceu: 'ceu-outback',
    sol: true,
    nuvens: false,
    fundo: [
      { textura: 'outback-longe', altura: 320, afundar: 20, fator: 0.15 },
      { textura: 'outback-perto', altura: 280, afundar: 10, fator: 0.4 },
    ],
    musica: 'outback',
    poderBotao: 'superpulo',
  },
  // Mata de eucaliptos úmida do leste: rios do ornitorrinco, coalas e vaga-lumes.
  'australia-mata': {
    solidos: { '#': ['terra-mata', 'terra-mata-topo'], R: ['rocha', 'rocha-topo'] },
    laje: 'galho-eucalipto',
    // o espinifex é do interior seco; na mata úmida o perigo é um arbusto espinhento
    espinhos: 'arbusto-espinhos',
    ceu: 'ceu-eucaliptal',
    sol: true,
    nuvens: true,
    fundo: [
      { textura: 'eucaliptal-longe', altura: 320, afundar: 20, fator: 0.15 },
      { textura: 'eucaliptal-perto', altura: 340, afundar: 10, fator: 0.4 },
    ],
    musica: 'outback',
    poderBotao: 'superpulo',
  },
  // Ártico no verão: tundra, neve, gelo marinho e o sol da meia-noite baixinho no horizonte.
  artico: {
    solidos: { '#': ['neve', 'neve-topo'], R: ['rocha-artica', 'rocha-artica-topo'], I: ['gelo', 'gelo-topo'] },
    laje: 'laje-gelo',
    espinhos: 'gelo-pontudo',
    ceu: 'ceu-artico',
    sol: true,
    solBaixo: true,
    nuvens: true,
    plataforma: 'placa-gelo',
    rastro: 'rastro-urso',
    toca: 'caverna-gelo',
    fundo: [
      { textura: 'artico-longe', altura: 320, afundar: 20, fator: 0.15 },
      { textura: 'artico-perto', altura: 240, afundar: 10, fator: 0.4 },
    ],
    musica: 'artico',
    poderBotao: 'mergulho',
  },
};
