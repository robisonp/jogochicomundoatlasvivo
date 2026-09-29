// Visual e som de cada mundo. A fase diz em qual mundo está (`mundo` em LevelDef) e a cena usa este tema.

export type MundoId = 'caatinga' | 'amazonia';
export type TemaMusica = 'baiao' | 'mata';

export interface TemaMundo {
  /** Caractere sólido → [textura interna, textura com topo]. */
  solidos: Record<string, [string, string]>;
  laje: string;
  espinhos: string;
  ceu: string;
  sol: boolean;
  nuvens: boolean;
  /** Camadas de fundo (parallax): textura, altura a partir de baixo e fator de rolagem. */
  fundo: { textura: string; altura: number; base: number; fator: number }[];
  musica: TemaMusica;
}

export const TEMAS: Record<MundoId, TemaMundo> = {
  caatinga: {
    solidos: { '#': ['terra', 'terra-topo'], R: ['rocha', 'rocha-topo'] },
    laje: 'laje',
    espinhos: 'espinhos',
    ceu: 'ceu',
    sol: true,
    nuvens: true,
    fundo: [
      { textura: 'serra', altura: 320, base: 470, fator: 0.15 },
      { textura: 'mata-fundo', altura: 260, base: 330, fator: 0.4 },
    ],
    musica: 'baiao',
  },
  amazonia: {
    solidos: { '#': ['terra-mata', 'terra-mata-topo'], R: ['tronco', 'tronco-topo'] },
    laje: 'galho',
    espinhos: 'espinheiro',
    ceu: 'ceu-mata',
    sol: false,
    nuvens: false,
    fundo: [
      { textura: 'floresta-longe', altura: 320, base: 520, fator: 0.15 },
      { textura: 'floresta-perto', altura: 300, base: 380, fator: 0.4 },
    ],
    musica: 'mata',
  },
};
