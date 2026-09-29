// Mundo 5 — Ártico · Fase 25: Mar Congelado. Placas de gelo no mar, a foca-anelada e o resgate da Mamãe July.
// Dossiê: a foca-anelada vive entre a água e o gelo marinho. O Chico não nada no mar gelado:
// se cair, a Mamãe July tira ele e ele volta ao checkpoint. Termina no Selo do Ártico.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ARTICO_5: LevelDef = {
  id: 'artico-5',
  nome: 'Mar Congelado',
  mundo: 'artico',
  aguaGelada: true,
  abertura: { texto: 'Última aventura do Ártico! O mar está cheio de placas de gelo.', quem: 'marcela' },
  selo: { id: 'artico', fala: { texto: 'Você conquistou o Selo do Ártico!', quem: 'narrador' } },
  animais: [
    {
      id: 'foca',
      fala: 'Eu encontro meu caminho entre a água e o gelo!',
      curiosidade: 'O gelo também é parte da minha casa!',
      demo: { tipo: 'nadar', dx: 5 },
    },
  ],
  placas: [
    { texto: 'Filho, espere a placa de gelo chegar pertinho e pule nela!', quem: 'july' },
    { texto: 'Duas placas de gelo! Uma de cada vez, com calma.', quem: 'july' },
    { texto: 'Paredão de pedra! Mergulhe na neve fofa e passe por baixo.', quem: 'robi' },
  ],
  dicas: {
    0: 'Espere a placa de gelo chegar perto de você e pule.',
    1: 'Pule na placa, espere ela chegar do outro lado e pule de novo.',
    2: 'Fique em cima da neve fofa e aperte a pata.',
    3: 'Espere a placa e depois suba os degraus de gelo.',
  },
  trechos: [
    // 1 — A foca e a primeira placa de gelo
    [
      '............................',
      '............o...............',
      '..P.S.......................',
      '########~~A~~M~~~###########',
      '########~~~~~~~~~###########',
      '########~~~~~~~~~###########',
      '########~~~~~~~~~###########',
    ],
    // 2 — Duas placas, com uma ilha de neve no meio
    [
      '................................',
      '.........o.........o............',
      '.C.S............................',
      '######~~~M~~~~~####~~M~~~~~#####',
      '######~~~~~~~~~####~~~~~~~~#####',
      '######~~~~~~~~~####~~~~~~~~#####',
      '######~~~~~~~~~####~~~~~~~~#####',
    ],
    // 3 — Paredão: por baixo, pela neve fofa
    [
      '.........RRRR.................',
      '.........RRRR.................',
      '.........RRRR.................',
      '.........RRRR.................',
      '.C.S.....RRRR.......o.........',
      '######NN#########...##########',
      '######ttttoottttt..###########',
      '######ttttttttttt.############',
      '##############################',
    ],
    // 4 — Última placa e o iceberg com o Selo do Ártico
    [
      '............................',
      '.........o..............G...',
      '......................IIIIII',
      '..................IIII######',
      '.C.S..........IIII##########',
      '#####~~~M~~~################',
      '#####~~~~~~~################',
      '#####~~~~~~~################',
      '#####~~~~~~~################',
    ],
  ],
};
