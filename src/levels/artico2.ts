// Mundo 5 — Ártico · Fase 22: Pegadas na Neve. Seguir as pegadas do urso-polar até o mar.
// Dossiê: o urso-polar vive no gelo marinho e nas costas do Ártico e é excelente nadador (VERDADEIRO).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ARTICO_2: LevelDef = {
  id: 'artico-2',
  nome: 'Pegadas na Neve',
  mundo: 'artico',
  aguaGelada: true,
  abertura: { texto: 'Olha essas pegadas enormes na neve! De quem será?', quem: 'narrador' },
  animais: [
    {
      id: 'urso-polar',
      fala: 'Minhas patas enormes também funcionam muito bem na água!',
      curiosidade: 'Preciso do gelo do mar para viver no Ártico!',
      demo: { tipo: 'nadar', dx: 18 },
    },
  ],
  placas: [
    { texto: 'Siga as pegadas grandes na neve!', quem: 'robi' },
    { texto: 'Oi, Chico! Tia Kelly aqui. As pegadas sobem pelas bordas de gelo!', quem: 'kelly' },
    { texto: 'O urso nada muito bem. Você pula pelas bordas de gelo, filho!', quem: 'july' },
  ],
  dicas: {
    0: 'Siga as pegadas para a direita.',
    1: 'Pule nas bordas de gelo, uma de cada vez.',
    2: 'Pule de borda em borda por cima da água.',
  },
  trechos: [
    // 1 — Pegadas grandes na neve
    [
      '..............................',
      '..............................',
      '..............................',
      '..P.S.:..:..:..#..:..:..:.....',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 2 — As pegadas sobem pelas bordas de gelo (embaixo, gelo pontudo)
    [
      '................................',
      '.............:.o.:.o.:..........',
      '............=========...........',
      '................................',
      '......=====............=====....',
      '.C.S..:.:.....^...^...^.........',
      '################################',
      '################################',
      '################################',
    ],
    // 3 — O urso entra no mar e nada; o Chico vai pelas bordas de gelo
    [
      '..............................',
      '..............................',
      '..........o.....o.....o.......',
      '..............................',
      '.C.S.A...===...===...===......',
      '#######~~~~~~~~~~~~~~~~~######',
      '#######~~~~~~~~~~~~~~~~~######',
      '#######~~~~~~~~~~~~~~~~~######',
    ],
    // 4 — O Atlas
    [
      '........................',
      '..................G.....',
      '..............##########',
      '..........##############',
      '.C....##################',
      '########################',
      '########################',
      '########################',
    ],
  ],
};
