// Mundo 2 — Amazônia · Fase 7: O Rio. Nado básico em água rasa (clara); o boto-cor-de-rosa.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AMAZONIA_2: LevelDef = {
  id: 'amazonia-2',
  nome: 'O Rio',
  mundo: 'amazonia',
  abertura: { texto: 'Um rio! Vamos nadar?', quem: 'narrador' },
  animais: [
    {
      id: 'boto',
      fala: 'Eu viro meu corpo depressa entre árvores e rios!',
      curiosidade: 'Minha cabeça se mexe mais que a de muitos golfinhos!',
      demo: { tipo: 'nadar', dx: 5 },
    },
  ],
  placas: [
    { texto: 'Na água, aperte o pulo para dar uma braçada. Perto da margem, o pulo tira você do rio!', quem: 'lili' },
    { texto: 'Nade ou pule pelos galhos. Você escolhe!', quem: 'robi' },
    { texto: 'Tem uma ilhazinha no meio do rio. Descanse nela!', quem: 'marcos' },
  ],
  dicas: {
    0: 'Nade para a direita e aperte o pulo perto da margem.',
    1: 'Nos galhos, pule de um para o outro. Se cair, é só nadar.',
    2: 'Suba na ilha, pegue impulso e pule de volta para a água.',
  },
  trechos: [
    // 1 — Primeiro rio e o boto
    [
      '..............o.o.........',
      '..........................',
      '..P..S....................',
      '######~~~~~~~A~~~~~~######',
      '######~~~~~~~~~~~~~~######',
      '######~~~~~~~~~~~~~~######',
    ],
    // 2 — Rio largo com galhos por cima
    [
      '.......o.o.......o.o......',
      '......====......====......',
      '..........................',
      '.C.S......................',
      '###~~~~~~~~~~~~~~~~~~~####',
      '###~~~~~~~~~~~~~~~~~~~####',
      '###~~~~~~~~~~~~~~~~~~~####',
    ],
    // 3 — Ilhazinha no meio do rio
    [
      '.........o..o..........',
      '.......................',
      '.C.S...................',
      '####~~~~~~##~~~~~~~####',
      '####~~~~~~##~~~~~~~####',
      '####~~~~~~##~~~~~~~####',
    ],
    // 4 — O Atlas
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
