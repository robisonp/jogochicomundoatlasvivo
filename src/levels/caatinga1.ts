// Mundo 1 — Caatinga · Fase 1: A Página Seca. Correr, pular, subir e explorar (base do movimento).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const CAATINGA_1: LevelDef = {
  id: 'caatinga-1',
  nome: 'A Página Seca',
  mundo: 'caatinga',
  abertura: { texto: 'Aqui a chuva é rara, mas a Caatinga está cheia de vida! Anda para a direita.', quem: 'narrador' },
  placas: [
    { texto: 'Aperte o botão de pulo! Segura para pular mais alto.', quem: 'robi' },
    { texto: 'Cuidado com os espinhos do xique-xique! Pula por cima.', quem: 'lili' },
    { texto: 'As páginas do Atlas estão voando! Pula nelas.', quem: 'marcela' },
    { texto: 'Suba na escada de corda. Aperte para cima!', quem: 'marcos' },
    { texto: 'Agora corre! Pega todas as pegadas!', quem: 'robi' },
  ],
  dicas: {
    0: 'Aperte o pulo e segure para ir mais alto.',
    1: 'Pule antes de chegar nos espinhos.',
    2: 'Espere a página chegar pertinho, e aí pula!',
    3: 'Aperte para cima quando estiver na escada.',
  },
  trechos: [
    // 1 — Começo: andar e primeiro pulo
    [
      '........................',
      '..............o.o.......',
      '........................',
      '..P.....S.....###......X',
      '########################',
      '########################',
      '########################',
    ],
    // 2 — Primeiros buracos (2 e 3 blocos)
    [
      '..........................',
      '......o.......o...........',
      '..........................',
      '..........................',
      '######..######...#########',
      '######..######...#########',
      '######..######...#########',
    ],
    // 3 — Checkpoint e espinhos
    [
      '........o.......o.o.....',
      '........................',
      '..C..S....^.......^^....',
      '########################',
      '########################',
      '########################',
    ],
    // 4 — Lajes em escada sobre um buraco
    [
      '..................o.........',
      '................====........',
      '............................',
      '..........====..............',
      '............................',
      '.....====...............o...',
      '#####...................####',
      '#####...................####',
      '#####...................####',
    ],
    // 5 — Páginas voando sobre o buraco
    [
      '.........o......o.........',
      '..........................',
      '..C.S.....................',
      '####....M......M.....#####',
      '####.................#####',
      '####.................#####',
    ],
    // 6 — Escada de corda e caminho secreto lá em cima
    [
      '..............................',
      '...H..o.o.o.o.o.o.o...........',
      '...H=============.............',
      '...H..........................',
      '...H..........................',
      '...H..........................',
      '...H..........................',
      '...H..........................',
      '.C.H.S...^.......^............',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 7 — Corrida
    [
      '.....o.o.o..........o.o.o.....',
      '..............................',
      '.C.S.......##.............##..',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 8 — Subida até o Atlas
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
