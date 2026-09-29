// Mundo 1 — Caatinga · Fase 2: Lajedo do Mocó. Subir e descer lajedos, uma fenda com escada e páginas voando.
// O mocó vive e se abriga entre rochas e fendas e é escalador ágil (dossiê: VERDADEIRO).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const CAATINGA_2: LevelDef = {
  id: 'caatinga-2',
  nome: 'Lajedo do Mocó',
  mundo: 'caatinga',
  abertura: { texto: 'Olha quantas pedras! Isso se chama lajedo.', quem: 'narrador' },
  animais: [
    {
      id: 'moco',
      fala: 'Eu conheço cada cantinho entre estas pedras!',
      curiosidade: 'Minhas patas me ajudam a subir nos lajedos!',
      // O mocó sobe o lajedo na frente, mostrando o caminho.
      demo: { tipo: 'pular', dx: 8, dy: -3 },
    },
  ],
  placas: [
    { texto: 'Tem uma fenda na pedra. Entre por baixo e suba a escada!', quem: 'marcos' },
    { texto: 'As páginas sobem e descem. Espere e pule!', quem: 'marcela' },
  ],
  dicas: {
    0: 'Pule um degrau de pedra de cada vez.',
    1: 'Passe por baixo da pedra e aperte para cima na escada.',
    2: 'Espere a página chegar pertinho, e aí pula!',
    3: 'Lá de cima, pule para a laje de pedra.',
  },
  trechos: [
    // 1 — Chegada e o mocó mostrando o caminho pelas pedras
    [
      '..........................',
      '..............o...........',
      '.............RRR....o.....',
      '..........RRRRRR...RRR....',
      '..P...A...RRRRRRR..RRRR...',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 2 — A fenda: passar por baixo da pedra e subir por dentro dela
    [
      '........................',
      '.........H....o.o.o.o...',
      '......RRRHRRRRRRRRRRR...',
      '......RRRHRRRRRRRRRRR...',
      '......RRRHRRRRRRRRRRR...',
      '......RRRHRRRRRRRRRRR...',
      '......RRRHRRRRRRRRRRR...',
      '.........HRRRRRRRRRRR...',
      '..C.S....HRRRRRRRRRRR.o.',
      '########################',
      '########################',
      '########################',
    ],
    // 3 — Vão entre dois pilares de pedra, com páginas voando
    [
      '.....o.....o...o.....o...',
      '.........................',
      '.........................',
      '......RR...V...M.....RR..',
      '..C.S.RR.............RR..',
      '######RR.............RR##',
      '######RR.............RR##',
      '######RR.............RR##',
    ],
    // 4 — Grande lajedo em degraus, laje secreta lá em cima
    [
      '..................ooo.........',
      '.................=====........',
      '..............................',
      '............RRR...............',
      '.........RRRRRR.......o.......',
      '......RRRRRRRRR.......RRRRR...',
      '...RRRRRRRRRRRR.....RRRRRRR...',
      '.C.RRRRRRRRRRRR....RRRRRRRR...',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 5 — Subida até o Atlas
    [
      '....................',
      '...............G....',
      '............RRRRRRRR',
      '.........RRRRRRRRRRR',
      '......RRRRRRRRRRRRRR',
      '####################',
      '####################',
      '####################',
    ],
  ],
};
