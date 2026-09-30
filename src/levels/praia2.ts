// Mundo 7 — Praia do Brasil · Fase 32: A Maré Mudou. A água da maré (%) sobe e desce devagar.
// Maré alta: a água leva o Chico até a pedra alta e cobre os ouriços do fundo. Maré baixa: a areia aparece.
// Dossiê (litoral): a maré é a subida e descida do mar, causada principalmente pela Lua e também pelo Sol.
// Peixe-boi-marinho: mamífero, cauda larga e arredondada, come plantas.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const PRAIA_2: LevelDef = {
  id: 'praia-2',
  nome: 'A Maré Mudou',
  mundo: 'praia',
  abertura: { texto: 'A maré sobe e desce: a Lua puxa a água, e o Sol ajuda!', quem: 'narrador' },
  animais: [
    {
      id: 'peixe-boi',
      fala: 'Meu nome diz peixe, mas eu sou um mamífero!',
      curiosidade: 'Minha cauda larga me empurra devagar pela água!',
      demo: { tipo: 'nadar', dx: 6 },
    },
  ],
  placas: [
    { texto: 'Olha quem está na água! Nade com calma.', quem: 'marcela' },
    { texto: 'A pedra é alta demais. Entre na água e espere a maré subir: ela leva você lá para cima!', quem: 'lili' },
    { texto: 'Ouriços no fundo! Espere a água ficar bem alta e nade por cima deles.', quem: 'july' },
  ],
  dicas: {
    0: 'Nade para a direita.',
    1: 'Fique na água e espere ela subir. Depois pule na pedra.',
    2: 'Quando a água estiver bem alta, nade por cima dos ouriços.',
    3: 'Ande até o Atlas.',
  },
  trechos: [
    // 1 — O peixe-boi no estuário
    [
      '................................',
      '.........o.o.o..................',
      '................................',
      '..P.S...........................',
      '#####~~~~~~~~A~~~~~~~~~~~~~~####',
      '#####~~~~~~~~~~~~~~~~~~~~~~~####',
      '#####~~~~~~~~~~~~~~~~~~~~~~~####',
    ],
    // 2 — A maré sobe e leva o Chico até a pedra alta
    [
      '...........................',
      '...........................',
      '..............o.o.o........',
      '.......R%%%%%RRRRRRRRRRRRRR',
      '.C.S..RR%%%%%RRRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRRR',
    ],
    // 3 — Ouriços no fundo: só dá para passar com a maré alta
    [
      '..............................',
      '..........o..o..o.............',
      '..............................',
      '.......RR%%%%%%%RR............',
      '.C.S...RR%%%%%%%RR............',
      '#######RR^^^^^^^RR############',
      '##############################',
      '##############################',
    ],
    // 4 — O Atlas
    [
      '......................',
      '..................G...',
      '..............########',
      '..........############',
      '.C....################',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
