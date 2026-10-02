// Mundo 3 — Savana · Fase 12: Corrida do Guepardo. O Chico ganha a Arrancada (botão da pata).
// Dossiê: o guepardo é muito rápido, mas o esforço máximo dura só alguns segundos — por isso a arrancada é curta e recarrega.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const SAVANA_2: LevelDef = {
  id: 'savana-2',
  nome: 'Corrida do Guepardo',
  mundo: 'savana',
  abertura: { texto: 'Psiu! Tem um bicho muito rápido ali na frente.', quem: 'narrador' },
  animais: [
    {
      id: 'guepardo',
      fala: 'Eu corro muito depressa, mas preciso descansar logo!',
      curiosidade: 'Minha corrida mais veloz dura só alguns segundos!',
      demo: { tipo: 'correr', dx: 16 },
      daPoder: 'arrancada',
    },
  ],
  placas: [
    { texto: 'Buraco grande! Corra, aperte a pata perto da beirada e vá longe!', quem: 'robi' },
    { texto: 'Muitos espinhos! Pule e aperte a pata lá no alto.', quem: 'lili' },
  ],
  dicas: {
    0: 'Aperte o botão da pata para dar uma arrancada.',
    1: 'Aperte a pata bem pertinho da beirada do buraco.',
    2: 'Pule primeiro e aperte a pata no ar.',
  },
  trechos: [
    // 1 — O guepardo dispara e ensina a arrancada
    [
      '............................',
      '..............o.o.o.........',
      '..P.....A.............X.....',
      '############################',
      '############################',
      '############################',
    ],
    // 2 — Buracos grandes
    [
      '...........o.o...............',
      '.............................',
      '.............................',
      '.C.S.........................',
      '########......########......##',
      '########......########......##',
      '########......########......##',
    ],
    // 3 — Campo de espinhos
    [
      '..........o...o...o.........',
      '............................',
      '............................',
      '.C.S......^^^^^^...........X',
      '############################',
      '############################',
      '############################',
    ],
    // 4 — Último buraco e o Atlas
    [
      '..............o.........',
      '........................',
      '...................G....',
      '................########',
      '#######.......##########',
      '#######.......##########',
      '#######.......##########',
    ],
  ],
};
