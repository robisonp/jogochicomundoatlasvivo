// Mundo 8 — Dinossauros · Fase 40: O Atlas Inteiro. Final: cada trecho usa o poder de um bicho de outro mundo
// (bola do tatu-bola, arrancada do guepardo, super pulo do canguru, tobogã do pinguim, salto do golfinho).
// No fim, a família inteira e as páginas do Atlas com dinossauros de outros países (Carnotaurus, Argentinosaurus,
// Velociraptor com penas, T. rex). Termina no Selo dos Dinossauros e na festa do Atlas completo.
// Duração-alvo: 3 minutos.
import type { LevelDef } from './types';

export const DINOSSAUROS_5: LevelDef = {
  id: 'dinossauros-5',
  nome: 'O Atlas Inteiro',
  mundo: 'dinossauros',
  final: true,
  poderPorTrecho: ['bola', 'arrancada', 'superpulo', 'toboga', 'giro', 'giro'],
  abertura: { texto: 'Última aventura! Use o poder de cada bicho que você conheceu.', quem: 'marcela' },
  selo: { id: 'dinossauros', fala: { texto: 'Você conquistou o Selo dos Dinossauros!', quem: 'narrador' } },
  animais: [
    {
      id: 'carnotaurus',
      pagina: true,
      fala: 'Meus fósseis guardaram até marcas da pele!',
      curiosidade: 'Meus fósseis foram encontrados onde hoje fica a Argentina.',
      demo: { tipo: 'ficar' },
    },
    {
      id: 'velociraptor',
      pagina: true,
      fala: 'Eu era menor que nos filmes, e meu corpo tinha penas!',
      curiosidade: 'Meus fósseis foram encontrados onde hoje fica a Mongólia.',
      demo: { tipo: 'ficar' },
    },
    {
      id: 'argentinosaurus',
      pagina: true,
      fala: 'Sou enorme, mas os cientistas precisaram estimar meu tamanho pelos ossos encontrados!',
      curiosidade: 'Estou entre os maiores dinossauros conhecidos!',
      demo: { tipo: 'ficar' },
    },
    {
      id: 'trex',
      pagina: true,
      fala: 'Vivi bem no final da era dos grandes dinossauros não aviários!',
      curiosidade: 'Meus fósseis foram encontrados onde hoje ficam os Estados Unidos e o Canadá.',
      demo: { tipo: 'ficar' },
    },
  ],
  placas: [
    { texto: 'Espinhos! Aperte a pata e role em bola, como o tatu-bola.', quem: 'lili' },
    { texto: 'Buracos grandes! Aperte a pata e corra rápido como o guepardo.', quem: 'robi' },
    { texto: 'Pedra alta! Super pulo, como o canguru!', quem: 'marcos' },
    { texto: 'Túnel baixinho! Deite e deslize como o pinguim.', quem: 'july' },
    { texto: 'Pedra no mar! Na água, salte girando como o golfinho.', quem: 'marcela' },
    { texto: 'Você foi muito longe, Chico! Da Caatinga até os dinossauros!', quem: 'robi' },
    { texto: 'Olha: o Atlas mostra dinossauros de outros países também!', quem: 'lili' },
    { texto: 'Cada bicho que você encontrou deixou o Atlas mais vivo!', quem: 'marcos' },
    { texto: 'Parabéns, Chico! Estou vendo tudo daqui de longe!', quem: 'kelly' },
    { texto: 'Que aventura, Chico! Um beijo daqui de longe!', quem: 'laura' },
    { texto: 'Falta só o último selo, Chico!', quem: 'marcela' },
    { texto: 'Estou muito orgulhosa de você, filho!', quem: 'july' },
  ],
  dicas: {
    0: 'Aperte a pata para virar bola e role por cima dos espinhos.',
    1: 'Aperte a pata correndo para pular os buracos grandes.',
    2: 'Aperte a pata para o super pulo.',
    3: 'Aperte a pata para deslizar pelo túnel.',
    4: 'Entre na água e aperte a pata para saltar girando.',
    5: 'Ande até o selo e ouça a família.',
  },
  trechos: [
    // 1 — Bola (tatu-bola): espinhos
    [
      '..............................',
      '..........o...o...o...........',
      '..............................',
      '..............................',
      '..P.S......^^^^^.......X......',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 2 — Arrancada (guepardo): buracos grandes
    [
      '............o.o.........o.o.....',
      '................................',
      '................................',
      '................................',
      '.C.S............................',
      '########......########......####',
      '########......########......####',
      '########......########......####',
    ],
    // 3 — Super pulo (canguru): pedra alta
    [
      '..............o.o.o.........',
      '...........RRRRRRRR.........',
      '...........RRRRRRRR.........',
      '...........RRRRRRRR.........',
      '.C.S.......RRRRRRRR...X.....',
      '############################',
      '############################',
      '############################',
    ],
    // 4 — Tobogã (pinguim): túnel baixinho
    [
      '..................................',
      '..................................',
      '..........RRRRRRRRRRRR............',
      '..........RRRRRRRRRRRR............',
      '.C.S......o.o.o.o.o.o......X......',
      '##################################',
      '##################################',
      '##################################',
    ],
    // 5 — Salto do golfinho: pedra no mar
    [
      '...............................',
      '...................o.o.o.......',
      '..................RRRRRRRRRRRRR',
      '..................RRRRRRRRRRRRR',
      '.C.S..............RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
    ],
    // 6 — A família, as páginas do Atlas e o Selo dos Dinossauros
    [
      '...............................................................................',
      '...............................................................................',
      '...............................................................................',
      '...............................................................................',
      '.C.S...A.....S.....A.....S.........A.........S....S.....A.....S....S.....G.....',
      '###############################################################################',
      '###############################################################################',
      '###############################################################################',
    ],
  ],
};
