// Mundo 3 — Savana · Fase 15: A Grande Travessia. Rio, pedregulho, arrancada e espinhos; termina no Selo da Savana.
// Dossiê (ambiente): as chuvas influenciam profundamente o movimento de muitos animais.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const SAVANA_5: LevelDef = {
  id: 'savana-5',
  nome: 'A Grande Travessia',
  mundo: 'savana',
  abertura: { texto: 'Última aventura da Savana! Vamos buscar o Selo da Savana!', quem: 'marcela' },
  selo: { id: 'savana', fala: { texto: 'Você conquistou o Selo da Savana!', quem: 'narrador' } },
  placas: [
    { texto: 'Um rio no caminho! Nade até o outro lado e pule perto da margem.', quem: 'lili' },
    { texto: 'Empurre o pedregulho até a pedra alta e suba!', quem: 'marcos' },
    { texto: 'Buraco e espinhos! Pule e aperte a pata no ar.', quem: 'robi' },
  ],
  dicas: {
    0: 'Nade para a direita e pule perto da margem.',
    1: 'Ande contra o pedregulho até ele encostar na pedra alta.',
    2: 'Pule e aperte a pata no ar para ir longe.',
  },
  trechos: [
    // 1 — O rio
    [
      '...........o.o.o..........',
      '..........................',
      '..P..S....................',
      '########~~~~~~~~~~~#######',
      '########~~~~~~~~~~~#######',
      '########~~~~~~~~~~~#######',
    ],
    // 2 — Pedregulho e paredão
    [
      '................ooo.......',
      '................RRR.......',
      '................RRR.......',
      '................RRR.......',
      '.C.S..B.........RRR.......',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 3 — Buraco largo e campo de espinhos
    [
      '..........o.o.o.............',
      '............................',
      '............................',
      '.C.S......................X.',
      '#######....^^^^#############',
      '#######....#################',
      '#######....#################',
    ],
    // 4 — O Selo da Savana
    [
      '......................',
      '..................G...',
      '..............########',
      '..........############',
      '......################',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
