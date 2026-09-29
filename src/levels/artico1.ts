// Mundo 5 — Ártico · Fase 21: Sol da Meia-Noite. Gelo escorregadio e o dia que não acaba.
// Dossiê: ao norte do Círculo Polar Ártico, no verão, há dias em que o Sol não se põe; a coruja-das-neves
// pode caçar de dia no verão ártico ("coruja = sempre noturna" é simplificação errada).
// Água do mar gelada: o Chico não nada nela (a Mamãe July tira ele e volta ao checkpoint).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ARTICO_1: LevelDef = {
  id: 'artico-1',
  nome: 'Sol da Meia-Noite',
  mundo: 'artico',
  aguaGelada: true,
  abertura: { texto: 'No verão, há lugares onde o Sol nem se põe!', quem: 'narrador' },
  animais: [
    {
      id: 'coruja-das-neves',
      fala: 'No verão do Ártico, posso caçar até com o sol brilhando!',
      curiosidade: 'Nem toda coruja precisa esperar a noite!',
      demo: { tipo: 'voar', dx: 10, dy: -3 },
    },
  ],
  placas: [
    { texto: 'Chão de gelo! Ele escorrega. Solte a seta antes da água.', quem: 'lili' },
    { texto: 'A água do mar aqui é gelada demais para nadar. Pule por cima!', quem: 'july' },
    { texto: 'Degraus de gelo! Pule com calma.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Ande até a coruja.',
    1: 'No gelo, solte a seta um pouquinho antes para parar.',
    2: 'Pule a água gelada logo que chegar na beirada.',
    3: 'Suba os degraus de gelo com pulinhos.',
  },
  trechos: [
    // 1 — A coruja-das-neves no sol da meia-noite
    [
      '..........................',
      '..............o.o.o.......',
      '..........................',
      '..P.....A.................',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 2 — Gelo liso até a água gelada
    [
      '..............................',
      '..........o.o.o...............',
      '..............................',
      '.C.S..........................',
      '#####IIIIIIIII~~~IIIIIII######',
      '##############~~~#############',
      '##############~~~#############',
    ],
    // 3 — Ilhas de gelo no mar
    [
      '................................',
      '......o.....o.....o.....o.......',
      '................................',
      '.C.S............................',
      '#####~~~III~~~III~~~IIII~~~#####',
      '#####~~~###~~~###~~~####~~~#####',
      '#####~~~###~~~###~~~####~~~#####',
    ],
    // 4 — Degraus de gelo e o Atlas
    [
      '..........................',
      '..................G.......',
      '..............IIIIIIIIIIII',
      '..........IIII############',
      '.C.S..IIII################',
      '##########################',
      '##########################',
      '##########################',
    ],
  ],
};
