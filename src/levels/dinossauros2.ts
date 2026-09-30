// Mundo 8 — Dinossauros · Fase 37: Pegadas do Cretáceo. Sousa muito tempo atrás (entre cerca de 145 e 125
// milhões de anos). Os dinossauros aparecem como silhuetas de GRUPOS (terópode, saurópode, ornitópode): as pegadas
// de Sousa são atribuídas a esses grupos, e ninguém sabe a espécie exata de quem deixou cada uma.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const DINOSSAUROS_2: LevelDef = {
  id: 'dinossauros-2',
  nome: 'Pegadas do Cretáceo',
  mundo: 'dinossauros',
  tema: 'dino-antigo',
  abertura: { texto: 'Viajamos no tempo! Estamos em Sousa, muito, muito tempo atrás, no Cretáceo.', quem: 'narrador' },
  portal: { texto: 'De volta para hoje! Agora vamos para a Chapada do Araripe, no Ceará.', quem: 'marcela' },
  animais: [
    {
      id: 'teropode',
      semFicha: true,
      quem: 'narrador',
      fala: 'Olha a sombra de um terópode! Muitas pegadas de Sousa foram deixadas por terópodes.',
      demo: { tipo: 'andar', dx: 12 },
    },
    {
      id: 'sauropode',
      semFicha: true,
      quem: 'narrador',
      fala: 'Um saurópode! Em Sousa também há pegadas de saurópodes.',
      demo: { tipo: 'andar', dx: 9 },
    },
    {
      id: 'ornitopode',
      semFicha: true,
      quem: 'narrador',
      fala: 'E um ornitópode! Eles também deixaram pegadas por aqui.',
      demo: { tipo: 'andar', dx: 8 },
    },
  ],
  placas: [
    { texto: 'Siga as pegadas! Elas mostram o caminho.', quem: 'lili' },
    { texto: 'Um lago! Nade até a outra margem.', quem: 'july' },
    { texto: 'Super pulo na rocha, e cuidado com as plantas espinhentas!', quem: 'robi' },
    { texto: 'O Portal do Tempo está esperando você!', quem: 'marcela' },
  ],
  dicas: {
    0: 'Siga as pegadas para a direita.',
    1: 'Nade no lago e pule para a margem.',
    2: 'Aperte a pata para o super pulo e passe pelas plantas espinhentas por cima.',
    3: 'Entre no Portal do Tempo.',
  },
  trechos: [
    // 1 — A sombra do terópode
    [
      '......................................',
      '...........o...o...o..................',
      '......................................',
      '......................................',
      '..P.S.......A.:.:.:.:.:.:.:...........',
      '######################################',
      '######################################',
      '######################################',
    ],
    // 2 — O lago e o saurópode
    [
      '.........................................',
      '.........o.o.............................',
      '........=====............................',
      '.........................................',
      '.C.S......................:.:.:.:.A......',
      '####~~~~~~~~~~~~~~~~~####################',
      '####~~~~~~~~~~~~~~~~~####################',
      '####~~~~~~~~~~~~~~~~~####################',
    ],
    // 3 — Rocha alta, plantas espinhentas e o ornitópode
    [
      '....................................',
      '.............o.o.o..................',
      '............RRRRRR..................',
      '............RRRRRR..................',
      '.C.S........RRRRRR^^^.......A.......',
      '####################################',
      '####################################',
      '####################################',
    ],
    // 4 — O Portal do Tempo
    [
      '........................',
      '........................',
      '........................',
      '........................',
      '.C.S......:.:.:....G....',
      '########################',
      '########################',
      '########################',
    ],
  ],
};
