// Mundo 8 — Dinossauros · Fase 39: Monte o Esqueleto (Rio Grande do Sul, no Triássico). O Staurikosaurus,
// um dos dinossauros mais antigos conhecidos; a Pangeia. No fim, o minijogo de montar o Buriolestes (5 peças).
// Dossiê: Buriolestes tem esqueleto quase completo (cerca de 233 milhões de anos), ótimo para montar.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const DINOSSAUROS_4: LevelDef = {
  id: 'dinossauros-4',
  nome: 'Monte o Esqueleto',
  mundo: 'dinossauros',
  tema: 'dino-antigo',
  minijogo: 'esqueleto',
  abertura: { texto: 'Rio Grande do Sul, no Triássico: quando a história dos dinossauros estava apenas começando!', quem: 'narrador' },
  animais: [
    {
      id: 'staurikosaurus',
      fala: 'Eu vivi no Brasil quando os primeiros dinossauros estavam aparecendo!',
      curiosidade: 'Eu sou um dos dinossauros mais antigos conhecidos!',
      demo: { tipo: 'correr', dx: 7 },
    },
  ],
  placas: [
    { texto: 'Há muito tempo, os continentes estavam unidos numa terra só, e foram se separando devagar.', quem: 'marcela' },
    { texto: 'Pule de pedra em pedra!', quem: 'robi' },
    { texto: 'Atravesse o rio nadando!', quem: 'july' },
    { texto: 'Lá na frente tem um esqueleto para montar!', quem: 'lili' },
  ],
  dicas: {
    0: 'Ande para a direita e veja o Staurikosaurus.',
    1: 'Pule de pedra em pedra. Use o super pulo na mais alta.',
    2: 'Nade e pule para a margem.',
    3: 'Ande até o Atlas.',
  },
  trechos: [
    // 1 — O Staurikosaurus
    [
      '..................................',
      '..........o...o...o...............',
      '..................................',
      '..................................',
      '..P.S..........A..................',
      '##################################',
      '##################################',
      '##################################',
    ],
    // 2 — Pedras
    [
      '..............................',
      '.................o............',
      '................RRR...........',
      '..........RR....RRR....RR.....',
      '.C.S......RR....RRR....RR.....',
      '##########RR^^^^RRR^^^^RR#####',
      '##############################',
      '##############################',
    ],
    // 3 — O rio
    [
      '...............................',
      '..........o...o...o............',
      '...............................',
      '...............................',
      '.C.S...........................',
      '#####~~~~~~~~~~~~~~~~~~~~~~####',
      '#####~~~~~~~~~~~~~~~~~~~~~~####',
      '#####~~~~~~~~~~~~~~~~~~~~~~####',
    ],
    // 4 — O Atlas
    [
      '......................',
      '......................',
      '..................G...',
      '..............########',
      '.C........############',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
