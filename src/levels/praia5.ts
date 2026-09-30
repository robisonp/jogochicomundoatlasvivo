// Mundo 7 — Praia do Brasil · Fase 35: Praia Depois da Tempestade. O mar trouxe lixo (l): o Chico recolhe.
// Junta tudo do mundo: maré, ouriços no fundo e o salto girando do golfinho. Termina no Selo da Praia.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const PRAIA_5: LevelDef = {
  id: 'praia-5',
  nome: 'Praia Depois da Tempestade',
  mundo: 'praia',
  abertura: { texto: 'A tempestade passou e o mar trouxe lixo para a areia. Vamos deixar a praia limpinha, filho?', quem: 'july' },
  selo: { id: 'praia', fala: { texto: 'Você conquistou o Selo da Praia!', quem: 'narrador' } },
  placas: [
    { texto: 'Encoste no lixo para recolher!', quem: 'july' },
    { texto: 'Lixo lá em cima da pedra! Espere a maré subir e salte girando.', quem: 'robi' },
    { texto: 'Ouriços no fundo! Nade por cima com a água bem alta.', quem: 'lili' },
    { texto: 'O selo está na pedra alta. Salte girando da água!', quem: 'marcos' },
  ],
  dicas: {
    0: 'Ande pela areia e encoste no lixo.',
    1: 'Espere a água subir e aperte a pata para saltar.',
    2: 'Com a água bem alta, nade por cima dos ouriços.',
    3: 'Na água, aperte a pata e salte até o selo.',
  },
  trechos: [
    // 1 — Areia com lixo
    [
      '..................................',
      '..........o.....o.....o...........',
      '..................................',
      '..P.S...l.....l....RR....l.....l..',
      '##################################',
      '##################################',
      '##################################',
    ],
    // 2 — Maré + giro: lixo na pedra alta
    [
      '..............l...l.......',
      '.............RRRRRRRRRRRRR',
      '.............RRRRRRRRRRRRR',
      '.............RRRRRRRRRRRRR',
      '.......R%%%%%RRRRRRRRRRRRR',
      '.C.S..RR%%%%%RRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRR',
    ],
    // 3 — Ouriços no fundo e lixo na areia depois
    [
      '..............................',
      '..........o..o..o.............',
      '..............................',
      '.......RR%%%%%%%RR............',
      '.C.S...RR%%%%%%%RR....l...l...',
      '#######RR^^^^^^^RR############',
      '##############################',
      '##############################',
    ],
    // 4 — O Selo da Praia na pedra alta, saindo do mar
    [
      '...............................',
      '.....................G.........',
      '..................RRRRRRRRRRRRR',
      '..................RRRRRRRRRRRRR',
      '.C.S.....l........RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
    ],
  ],
};
