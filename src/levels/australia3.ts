// Mundo 4 — Austrália · Fase 18: Corrida do Emu. Trecho de velocidade: o emu corre na frente mostrando o caminho.
// Dossiê: o emu é corredor rápido (VERDADEIRO) e não voa; vive em áreas abertas da Austrália.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AUSTRALIA_3: LevelDef = {
  id: 'australia-3',
  nome: 'Corrida do Emu',
  mundo: 'australia',
  abertura: { texto: 'Olha que ave alta! Será que ela corre depressa?', quem: 'narrador' },
  animais: [
    {
      id: 'emu',
      fala: 'Minhas asas são pequenas, mas minhas pernas são ótimas para correr!',
      curiosidade: 'Sou uma ave enorme que não precisa voar!',
      // corre até perto do fim da fase (trechos de 28 + 32 + 32 colunas; para na coluna 20 do último)
      demo: { tipo: 'guiar', ate: 106 },
    },
  ],
  placas: [
    { texto: 'Siga o emu! Pule as pedrinhas e os buracos sem parar de correr.', quem: 'robi' },
    { texto: 'Pedra alta! Aperte a pata para o super pulo.', quem: 'lili' },
    { texto: 'Buraco largo! Corra e dê um super pulo.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Corra atrás do emu!',
    1: 'Pule as pedras e os buracos pequenos.',
    2: 'Aperte a pata para subir na pedra alta.',
    3: 'Corra e aperte a pata pertinho da beirada.',
  },
  trechos: [
    // 1 — O emu aparece e sai correndo
    [
      '............................',
      '..............o.o.o.........',
      '............................',
      '.P....A.....................',
      '############################',
      '############################',
      '############################',
    ],
    // 2 — Pedrinhas, buracos pequenos e um espinifex
    [
      '................................',
      '........o..........o.........o..',
      '................................',
      '.C.S....R.........RR.........^..',
      '############...#########...#####',
      '############...#########...#####',
      '############...#########...#####',
    ],
    // 3 — Pedra alta, espinifex e degrau
    [
      '................................',
      '..........ooo..........ooo......',
      '..........RRR...................',
      '..........RRR..........RR.......',
      '.C.S......RRR.....^^...RR.......',
      '################################',
      '################################',
      '################################',
    ],
    // 4 — Buraco largo e o Atlas
    [
      '..............................',
      '.........o.o..................',
      '..............................',
      '.C.S...................G......',
      '#######....###################',
      '#######....###################',
      '#######....###################',
    ],
  ],
};
