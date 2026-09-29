// Mundo 4 — Austrália · Fase 19: O Rio do Ornitorrinco. Nado e mergulho seguindo sinais debaixo d'água.
// Dossiê: o ornitorrinco nada e encontra comida sentindo sinais elétricos de outros animais (VERDADEIRO).
// Cuidado do dossiê: eletrorrecepção NÃO é "dar choque" — aqui os sinais só mostram o caminho.
// Precisa do Nado da Onça (Mundo 2) para a água funda.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AUSTRALIA_4: LevelDef = {
  id: 'australia-4',
  nome: 'O Rio do Ornitorrinco',
  mundo: 'australia',
  tema: 'australia-mata',
  abertura: { texto: 'Um riacho na mata! Quem será que mora aqui?', quem: 'narrador' },
  animais: [
    {
      id: 'ornitorrinco',
      fala: 'Debaixo d’água, sinto pequenos sinais elétricos ao meu redor!',
      curiosidade: 'Sou um mamífero que põe ovos!',
      demo: { tipo: 'nadar', dx: 8 },
    },
  ],
  placas: [
    { texto: 'Siga os sinais azuis debaixo d’água! Aperte para baixo para mergulhar.', quem: 'marcos' },
    { texto: 'Pedras no rio! Mergulhe por baixo delas.', quem: 'lili' },
  ],
  dicas: {
    0: 'Nade para a direita e pule perto da margem.',
    1: 'Aperte para baixo para mergulhar até os sinais azuis.',
    2: 'Mergulhe por baixo das pedras e suba do outro lado.',
  },
  trechos: [
    // 1 — O ornitorrinco nada no riacho
    [
      '..........................',
      '...........o.o.o..........',
      '..P.......................',
      '######~~~A~~~~~~~~~#######',
      '######~~~~~~~~~~~~~#######',
      '######~~~~~~~~~~~~~#######',
      '######~~~~~~~~~~~~~#######',
    ],
    // 2 — Poço fundo: os sinais mostram a passagem por baixo da pedra
    [
      '..............RRRR............',
      '..............RRRR............',
      '.C.S..........RRRR............',
      '####wwwwwwwwwwRRRRwwwwwww#####',
      '####wwwwwwwwwwRRRRwwwwwww#####',
      '####wwwwwwwZwwwwwwwwZwwww#####',
      '####wwwwwwwwwwwowwwwwwwww#####',
    ],
    // 3 — Corredeira com duas pedras
    [
      '.......RR..........RR...........',
      '.......RR..........RR...........',
      '.C.S...RR..........RR...........',
      '###~~~~RR~~~~~~~~~~RR~~~~~######',
      '###~~~~RR~~~~~~~~~~RR~~~~~######',
      '###wwwwZwwwwwowwwwwwwZwwww######',
      '###wwwwwwwwwwwwwwwwwwwwwww######',
    ],
    // 4 — O Atlas
    [
      '.......o.o.o............',
      '........................',
      '.C................G.....',
      '########################',
      '########################',
      '########################',
      '########################',
    ],
  ],
};
