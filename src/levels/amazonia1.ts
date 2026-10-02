// Mundo 2 — Amazônia · Fase 6: O Dossel Verde. Subir por cipós e andar pelos galhos; arara e preguiça.
// Tias Kelly e Laura ligam pelo Chamador do Atlas (placas de som).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AMAZONIA_1: LevelDef = {
  id: 'amazonia-1',
  nome: 'O Dossel Verde',
  mundo: 'amazonia',
  abertura: { texto: 'Uma floresta enorme, cheia de rios, árvores e sons!', quem: 'narrador' },
  animais: [
    {
      id: 'arara',
      fala: 'Minhas asas me levam por cima das grandes árvores!',
      demo: { tipo: 'voar', dx: 10, dy: -3 },
    },
    {
      id: 'preguica',
      fala: 'Minhas garras me ajudam a ficar firme nos galhos!',
      curiosidade: 'Mesmo vivendo nas árvores, eu também sei nadar!',
      demo: { tipo: 'ficar' },
    },
  ],
  placas: [
    { texto: 'Oi, Chico! Aqui é a tia Kelly. Na floresta, a gente sobe pelos cipós!', quem: 'kelly' },
    { texto: 'Pule de galho em galho, bem devagar.', quem: 'lili' },
    { texto: 'Oi, Chico! Tia Laura aqui. Suba no tronco e olhe a floresta lá de cima!', quem: 'laura' },
  ],
  dicas: {
    0: 'Encoste no cipó e aperte para cima.',
    1: 'Pule de um galho para o outro.',
    2: 'Suba pelo cipó do lado do tronco.',
  },
  trechos: [
    // 1 — Primeiro cipó até o galho da arara
    [
      '.........J...A..o.o.....',
      '.........J======........',
      '.........J..............',
      '.........J..............',
      '.........J..............',
      '.........J..............',
      '..P..S...J..............',
      '########################',
      '########################',
      '########################',
    ],
    // 2 — De galho em galho sobre o buraco; a preguiça pendurada lá em cima
    [
      '..........=====...........',
      '............A.............',
      '...........ooo............',
      '..........=====...........',
      '...=====..........=====...',
      '.C.S......................',
      '###..................#####',
      '###..................#####',
      '###..................#####',
    ],
    // 3 — Tronco gigante: sobe por um cipó, desce pelo outro
    [
      '........ooooo.........',
      '......J.......J.......',
      '......JRRRRRRRJ.......',
      '......JRRRRRRRJ.......',
      '......JRRRRRRRJ.......',
      '......JRRRRRRRJ.......',
      '......JRRRRRRRJ.......',
      '......JRRRRRRRJ.......',
      '.C.S..JRRRRRRRJ.......',
      '######################',
      '######################',
      '######################',
    ],
    // 4 — O Atlas
    [
      '......................',
      '..................G...',
      '..............########',
      '..........############',
      '.X....################',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
