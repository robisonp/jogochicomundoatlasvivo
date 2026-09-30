// Mundo 7 — Praia do Brasil · Fase 31: Um Dia na Praia. Areia, mar raso, jangada, pedras com ouriços e o píer.
// Dossiê: a tartaruga-de-pente vive no mar; as fêmeas saem do mar para colocar ovos na areia.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const PRAIA_1: LevelDef = {
  id: 'praia-1',
  nome: 'Um Dia na Praia',
  mundo: 'praia',
  abertura: { texto: 'Chico, hoje a aventura é na praia, pertinho de casa!', quem: 'july' },
  animais: [
    {
      id: 'tartaruga',
      fala: 'Eu vivo no mar, mas as mamães voltam à praia para colocar ovos!',
      curiosidade: 'Existem várias espécies de tartarugas marinhas no Brasil!',
      demo: { tipo: 'nadar', dx: 9 },
    },
  ],
  placas: [
    { texto: 'Olha os rastros na areia! Siga até o mar.', quem: 'july' },
    { texto: 'Esta é a jangada do Vovô! Pule nela ou nade, você escolhe.', quem: 'marcos' },
    { texto: 'Cuidado com os ouriços! Pule de pedra em pedra.', quem: 'lili' },
    { texto: 'Nade até a pedra, suba nela e depois no píer!', quem: 'robi' },
  ],
  dicas: {
    0: 'Siga os rastros até o mar e nade para a direita.',
    1: 'Pule na jangada quando ela chegar perto, ou nade.',
    2: 'Pule nas pedras. Não pise nos ouriços.',
    3: 'Nade até a pedra, pule no píer e ande até o Atlas.',
  },
  trechos: [
    // 1 — Rastros na areia e a tartaruga
    [
      '....................................',
      '..........o...o...o.................',
      '....................................',
      '..P.S....:.:.:.:.:..A...............',
      '#######################~~~~~~~~~~~~~',
      '#######################~~~~~~~~~~~~~',
      '#######################~~~~~~~~~~~~~',
    ],
    // 2 — A jangada do Vovô Marcos
    [
      '...............................',
      '........o...o...o..............',
      '...............................',
      '.C.S......M....................',
      '######~~~~~~~~~~~~~~~~~~~~~####',
      '######~~~~~~~~~~~~~~~~~~~~~####',
      '######~~~~~~~~~~~~~~~~~~~~~####',
    ],
    // 3 — Pedras com ouriços
    [
      '...............o..............',
      '..............RRR.............',
      '..........RR..RRR..RR.........',
      '.C.S......RR^^RRR^^RR.....o...',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 4 — O píer e o Atlas
    [
      '............................',
      '....................o...G...',
      '...............======#######',
      '.C.S......=====......#######',
      '#####~~~RR~~~~~~~~~~~#######',
      '#####~~~RR~~~~~~~~~~~#######',
      '#####~~~RR~~~~~~~~~~~#######',
    ],
  ],
};
