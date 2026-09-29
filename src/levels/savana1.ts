// Mundo 3 — Savana (Quênia e Tanzânia) · Fase 11: Pegadas na Savana. Seguir rastros; zebra e avestruz.
// Dossiê: savana não é ausência de árvores; kopjes (afloramentos rochosos) e acácias espaçadas.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const SAVANA_1: LevelDef = {
  id: 'savana-1',
  nome: 'Pegadas na Savana',
  mundo: 'savana',
  abertura: { texto: 'Aqui, campos enormes mudam com a chegada das chuvas!', quem: 'narrador' },
  animais: [
    {
      id: 'zebra',
      fala: 'Minhas listras são diferentes das listras de qualquer outra zebra!',
      curiosidade: 'Eu gosto de viver junto de outras zebras!',
      demo: { tipo: 'correr', dx: 8 },
    },
    {
      id: 'avestruz',
      fala: 'Eu não voo, mas minhas pernas correm muito depressa!',
      curiosidade: 'Sou a maior ave que vive hoje!',
      demo: { tipo: 'correr', dx: 12 },
    },
  ],
  placas: [
    { texto: 'Olha no chão: são rastros! Os rastros mostram por onde os bichos passaram.', quem: 'marcela' },
    { texto: 'Suba nas pedras do kopje e pule para a copa da acácia!', quem: 'robi' },
    { texto: 'Siga os rastros no chão!', quem: 'lili' },
  ],
  dicas: {
    0: 'Pule o arbusto de espinhos.',
    1: 'Suba nas pedras, um degrau de cada vez.',
    2: 'Siga os rastros e pule os espinhos.',
  },
  trechos: [
    // 1 — Rastros da zebra
    [
      '..............o.o.........',
      '..........................',
      '..P..S...A..::::::...^....',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 2 — Kopje e copa de acácia
    [
      '..............o.o.o.........',
      '.............======.........',
      '............................',
      '........RRR.................',
      '.....RRRRRR.........RRR.....',
      '.C.S.RRRRRR....^....RRR.....',
      '############################',
      '############################',
      '############################',
    ],
    // 3 — O avestruz; rastros por baixo, acácias por cima
    [
      '...........o.o.o..........',
      '..........=======.........',
      '..........................',
      '.....====.................',
      '.C.S......A..:::::::..^...',
      '##########################',
      '##########################',
      '##########################',
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
