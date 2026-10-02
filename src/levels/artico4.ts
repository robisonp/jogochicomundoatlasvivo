// Mundo 5 — Ártico · Fase 24: Corrida das Renas. Velocidade no gelo, com a rena mostrando o caminho.
// Dossiê: renas/caribus são sociais e algumas populações fazem grandes migrações; rena e caribu são a mesma espécie.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ARTICO_4: LevelDef = {
  id: 'artico-4',
  nome: 'Corrida das Renas',
  mundo: 'artico',
  aguaGelada: true,
  abertura: { texto: 'As renas vão atravessar a tundra. Vamos junto?', quem: 'narrador' },
  animais: [
    {
      id: 'rena',
      fala: 'Minhas patas me ajudam a caminhar pelas terras frias!',
      curiosidade: 'Rena e caribu são nomes usados para animais da mesma espécie!',
      // corre até perto do fim (trechos de 28 + 32 + 32 colunas; para na coluna 20 do último)
      demo: { tipo: 'guiar', ate: 106 },
    },
  ],
  placas: [
    { texto: 'Gelo e água gelada! Pule antes da beirada, sem parar.', quem: 'robi' },
    { texto: 'Pedras e gelo pontudo! Siga a rena.', quem: 'lili' },
    { texto: 'Último gelo! Pule a água e chegue no Atlas.', quem: 'marcela' },
  ],
  dicas: {
    0: 'Corra atrás da rena!',
    1: 'No gelo, pule um pouquinho antes da água.',
    2: 'Pule as pedras e o gelo pontudo.',
    3: 'Pule a água gelada logo na beirada.',
  },
  trechos: [
    // 1 — A rena sai correndo
    [
      '............................',
      '..............o.o.o.........',
      '............................',
      '.P....A...............X.....',
      '############################',
      '############################',
      '############################',
    ],
    // 2 — Gelo e água gelada
    [
      '................................',
      '........o..........o.........o..',
      '................................',
      '.C.S........................^...',
      '#####IIIIII~~~IIIIII~~~#########',
      '###########~~~######~~~#########',
      '###########~~~######~~~#########',
    ],
    // 3 — Pedras e gelo pontudo
    [
      '................................',
      '..........oo...............oo...',
      '..........RR...............RR...',
      '.C.S......RR........^^.....RR...',
      '################################',
      '################################',
      '################################',
    ],
    // 4 — Último gelo e o Atlas
    [
      '..............................',
      '.........o.o..................',
      '..............................',
      '.C.S...................G......',
      '#######IIIII~~~IIIIIIIII######',
      '############~~~###############',
      '############~~~###############',
    ],
  ],
};
