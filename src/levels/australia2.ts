// Mundo 4 — Austrália · Fase 17: Tocas do Wombat. O wombat ensina a cavar (poder passivo).
// Dossiê: o wombat cava tocas e túneis (VERDADEIRO); não transformar o poder em cavar qualquer material
// de uma vez — por isso só a terra fofa se cava, e leva um instante.
// Ambiente: mata aberta de eucaliptos (habitat do wombat-comum: florestas abertas, campos e matagais).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AUSTRALIA_2: LevelDef = {
  id: 'australia-2',
  nome: 'Tocas do Wombat',
  mundo: 'australia',
  tema: 'australia-mata',
  abertura: { texto: 'Que mata bonita! Alguém aqui gosta muito de cavar.', quem: 'narrador' },
  animais: [
    {
      id: 'wombat',
      fala: 'Minhas patas fortes cavam túneis debaixo da terra!',
      curiosidade: 'Minha casa pode ficar escondida no chão!',
      demo: { tipo: 'cavar' },
      daPoder: 'cavar',
    },
  ],
  placas: [
    { texto: 'Terra fofa no chão! Fique em cima dela e aperte para baixo para cavar.', quem: 'marcos' },
    { texto: 'Cave para dentro do morro. Depois cave para baixo!', quem: 'lili' },
  ],
  dicas: {
    0: 'Ande contra a terra fofa e espere um pouquinho: você cava!',
    1: 'Fique em cima da terra fofa e aperte para baixo.',
    2: 'Cave para a frente até a parede. Depois aperte para baixo.',
  },
  trechos: [
    // 1 — O wombat cava a entrada da toca; o Chico cava o túnel pelo morro
    [
      '..............................',
      '........###########...........',
      '........###########...........',
      '........###########...........',
      '........FFFFFFFFFFF...o.o.o...',
      '.P.....AFFFFFFFFFFF...........',
      '##############################',
      '##############################',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 2 — Cavar para baixo e passar por baixo do paredão
    [
      '.................................',
      '..............#####..............',
      '..............#####..............',
      '..............#####..............',
      '..............#####..............',
      '.C.S..........#####.......o......',
      '#######FF#################H######',
      '#######FF#################H######',
      '#######tttttttttoottttttttH######',
      '#######tttttttttoottttttttH######',
      '#################################',
    ],
    // 3 — Para dentro do morro, depois para baixo, e sai pelos degraus
    [
      '..............................',
      '..........#########...........',
      '..........#########...........',
      '..........#########...........',
      '.C.S......FFFFF####...........',
      '..........FFFFF####....o......',
      '#############FF#####....######',
      '#############FF#####...#######',
      '#############tttoooo..########',
      '#############ttttttt.#########',
      '##############################',
    ],
    // 4 — O Atlas
    [
      '........o.o.............',
      '........................',
      '...................G....',
      '................########',
      '.C..........############',
      '########################',
      '########################',
      '########################',
      '########################',
      '########################',
    ],
  ],
};
