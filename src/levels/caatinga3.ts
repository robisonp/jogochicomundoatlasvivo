// Mundo 1 — Caatinga · Fase 3: O Tatu-bola. O Chico ganha o poder "Virar bola".
// Dossiê: fechar-se completamente em bola é VERDADEIRO; sair rolando NÃO é comportamento normal.
// Por isso o poder protege por alguns segundos; o deslocamento lento enrolado é estilização do jogo.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const CAATINGA_3: LevelDef = {
  id: 'caatinga-3',
  nome: 'O Tatu-bola',
  mundo: 'caatinga',
  abertura: { texto: 'Psiu! Tem alguém escondido ali na frente.', quem: 'narrador' },
  animais: [
    {
      id: 'tatu-bola',
      fala: 'Quando há perigo, eu me fecho numa bola!',
      curiosidade: 'Sou um tatu que só vive no Brasil!',
      demo: { tipo: 'bola' },
      daPoder: 'bola',
    },
  ],
  placas: [
    { texto: 'Pedrinhas caindo! Aperte o botão da pata e vire bola!', quem: 'lili' },
    { texto: 'Espinhos no chão e pedra em cima. Vire bola e passe devagar!', quem: 'marcos' },
    { texto: 'Pule os buracos e vire bola quando as pedrinhas caírem!', quem: 'robi' },
  ],
  dicas: {
    0: 'Aperte o botão da pata para virar bola.',
    1: 'Vire bola antes de passar pelas pedrinhas.',
    2: 'Vire bola e ande devagar por cima dos espinhos.',
    3: 'Pule o buraco primeiro, depois vire bola.',
  },
  trechos: [
    // 1 — Encontro com o tatu-bola
    [
      '............................',
      '..............o.o...........',
      '............................',
      '..P.........A...........##..',
      '############################',
      '############################',
      '############################',
    ],
    // 2 — Chuva de pedrinhas debaixo do barranco
    [
      'RRRRRRRRRRRRRRRRRRRRRR....',
      'RRRRRRRRRRRRRRRRRRRRRR....',
      'RRRRRRRRRRRRRRRRRRRRRR....',
      'RRRRRRRRRRRRRRRRRRRRRR....',
      'RRRRRRRRRRRRRRRRRRRRRR....',
      '....RRRRRRRRRRRRRRRRRR....',
      '.......Q..Q..Q..Q..Q......',
      '..........................',
      '...................o......',
      '.C.S......................',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 3 — Espinhos sob a pedra: o teto baixo não deixa pular, só dá para passar como bola
    [
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '....RRRRRRRRRRRRR.........',
      '..........................',
      '.C.S.....^^^^^.....o......',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 4 — Combinação: buracos, pedrinhas e caminho secreto no alto (escada até a laje de pedra)
    [
      '...................ooo........',
      '..................=====.......',
      '..........H...................',
      '..........HRRRRRRRRRRRR.......',
      '..........H...Q....Q..........',
      '..........H...................',
      '.C.S....o.H...............o...',
      '#######...######...#####...###',
      '#######...######...#####...###',
      '#######...######...#####...###',
    ],
    // 5 — O Atlas
    [
      '......................',
      '..................G...',
      '..............########',
      '..........############',
      '......################',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
