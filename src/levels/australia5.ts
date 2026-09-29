// Mundo 4 — Austrália · Fase 20: Noite na Mata. Noite com trilha de vaga-lumes; o coala no eucalipto.
// Dossiê: vaga-lumes australianos vivem em vegetação úmida (não no Outback seco); coala vive em matas de
// eucalipto e passa grande parte do tempo nas árvores. Combina super pulo e cavar. Termina no Selo da Austrália.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AUSTRALIA_5: LevelDef = {
  id: 'australia-5',
  nome: 'Noite na Mata',
  mundo: 'australia',
  tema: 'australia-mata',
  noite: true,
  abertura: { texto: 'Chegou a noite na mata. Siga as luzinhas dos vaga-lumes!', quem: 'marcela' },
  selo: { id: 'australia', fala: { texto: 'Você conquistou o Selo da Austrália!', quem: 'narrador' } },
  animais: [
    {
      id: 'coala',
      fala: 'Minhas garras me seguram firme nos eucaliptos!',
      curiosidade: 'Eu sou um marsupial, não um urso!',
      demo: { tipo: 'ficar' },
    },
  ],
  placas: [
    { texto: 'Espinhos embaixo! Suba no tronco do eucalipto e vá pelo galho.', quem: 'july' },
    { texto: 'Terra fofa! Cave para baixo e siga os vaga-lumes.', quem: 'marcos' },
    { texto: 'Pedra alta! Dê um super pulo até o selo.', quem: 'robi' },
  ],
  dicas: {
    0: 'Siga os vaga-lumes para a direita.',
    1: 'Encoste no tronco e aperte para cima.',
    2: 'Fique em cima da terra fofa e aperte para baixo.',
    3: 'Pule os espinhos e aperte a pata perto da pedra.',
  },
  trechos: [
    // 1 — Vaga-lumes mostram o caminho
    [
      '..........................',
      '..........................',
      '......*.....*.....*....*..',
      '..........................',
      '..P.......o...o...o.......',
      '##########################',
      '##########################',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 2 — Tronco de eucalipto, galho comprido e o coala
    [
      '..............................',
      '.........E..o.A.o.*...........',
      '.........E==========..........',
      '.........E....................',
      '.........E....................',
      '.C.S.....E^^^^^^^^^^...*......',
      '##############################',
      '##############################',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 3 — Cavar para baixo e seguir a toca iluminada
    [
      '.................................',
      '..............#####..............',
      '..............#####..............',
      '..............#####..............',
      '..............#####..............',
      '.C.S...*......#####.......*......',
      '#######FF#################H######',
      '#######FF#################H######',
      '#######ttttt*ttttoott*ttttH######',
      '#######tttttttttttttttttttH######',
      '#################################',
    ],
    // 4 — Pedra alta e o Selo da Austrália
    [
      '........................G.....',
      '....................RRRRRR....',
      '..............*.....RRRRRR....',
      '....................RRRRRR....',
      '.C.S.........^^.....RRRRRR....',
      '##############################',
      '##############################',
      '##############################',
      '##############################',
      '##############################',
    ],
  ],
};
