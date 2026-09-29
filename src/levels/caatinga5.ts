// Mundo 1 — Caatinga · Fase 5: Selo do Sertão. Combina tudo do mundo: lajedo com fenda, pedrinhas,
// vento com espinhos (em bola o vento quase não empurra) e páginas voando. Termina no Selo do Sertão.
// Carcará e preá: falas do dossiê.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const CAATINGA_5: LevelDef = {
  id: 'caatinga-5',
  nome: 'Selo do Sertão',
  mundo: 'caatinga',
  abertura: { texto: 'Última aventura da Caatinga! Vamos buscar o Selo do Sertão!', quem: 'marcela' },
  selo: { id: 'sertao', fala: { texto: 'Você conquistou o Selo do Sertão! A Caatinga agora está no Atlas!', quem: 'narrador' } },
  animais: [
    {
      id: 'carcara',
      fala: 'Do alto, observo o sertão e encontro meu caminho!',
      demo: { tipo: 'voar', dx: 8, dy: -5 },
    },
    {
      id: 'prea',
      fala: 'Sou pequeno e conheço os caminhos por baixo da vegetação!',
      curiosidade: 'Minha cauda é tão pequena que quase não aparece!',
      demo: { tipo: 'correr', dx: 3 },
    },
  ],
  placas: [
    { texto: 'Pedrinhas de novo! Vire bola!', quem: 'lili' },
    { texto: 'Vento e espinhos! Vire bola: assim o vento quase não te empurra.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Pule a pedra e siga em frente.',
    1: 'Passe por baixo da pedra e suba a escada.',
    2: 'Vire bola debaixo das pedrinhas.',
    3: 'Vire bola antes dos espinhos e aperte de novo se precisar.',
    4: 'Espere a página chegar pertinho, e aí pula!',
  },
  trechos: [
    // 1 — O carcará
    [
      '...............o.o........',
      '..........................',
      '..........RRR.............',
      '..P.......RRR.A...........',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 2 — Fenda no lajedo
    [
      '.......H..o.o.......',
      '....RRRHRRRRRRR.....',
      '....RRRHRRRRRRR.....',
      '....RRRHRRRRRRR.....',
      '....RRRHRRRRRRR.....',
      '....RRRHRRRRRRR.....',
      '.......HRRRRRRR.....',
      '.C.....HRRRRRRR..o..',
      '####################',
      '####################',
      '####################',
    ],
    // 3 — Pedrinhas debaixo do barranco
    [
      'RRRRRRRRRRRRRRRRRRR.....',
      'RRRRRRRRRRRRRRRRRRR.....',
      'RRRRRRRRRRRRRRRRRRR.....',
      'RRRRRRRRRRRRRRRRRRR.....',
      'RRRRRRRRRRRRRRRRRRR.....',
      '...RRRRRRRRRRRRRRRR.....',
      '......Q..Q..Q..Q........',
      '........................',
      '...............o........',
      '.C.S....................',
      '########################',
      '########################',
      '########################',
    ],
    // 4 — Vento contra e espinhos debaixo da pedra
    [
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....<<<<<<<<<<<<<.........',
      '.C.S<<<<<^^^^<<<<...o.....',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 5 — O preá, a página voando e o Selo do Sertão
    [
      '...........o....o.............',
      '..........................G...',
      '......................RRRRRRRR',
      '.C..A..............RRRRRRRRRRR',
      '########...M.....#############',
      '########.........#############',
      '########.........#############',
    ],
  ],
};
