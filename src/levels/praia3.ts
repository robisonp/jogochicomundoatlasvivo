// Mundo 7 — Praia do Brasil · Fase 33: Salto do Golfinho. O golfinho-rotador ensina o salto girando.
// Na água, o botão da pata faz o Chico saltar bem alto, girando: alcança pedras altas saindo do mar.
// Dossiê: o golfinho-rotador salta e gira em torno do próprio eixo; Fernando de Noronha é área muito estudada.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const PRAIA_3: LevelDef = {
  id: 'praia-3',
  nome: 'Salto do Golfinho',
  mundo: 'praia',
  abertura: { texto: 'Em Fernando de Noronha, no mar do Brasil, os golfinhos-rotadores saltam girando!', quem: 'robi' },
  animais: [
    {
      id: 'golfinho',
      fala: 'Eu nado rápido e posso girar no ar quando salto!',
      curiosidade: 'Meu giro no salto deu origem ao nome golfinho-rotador!',
      demo: { tipo: 'girar' },
      daPoder: 'giro',
    },
  ],
  placas: [
    { texto: 'Entre na água e veja o golfinho!', quem: 'marcela' },
    { texto: 'Na água, aperte o botão da pata para saltar girando!', quem: 'lili' },
    { texto: 'Pedra alta! Espere a maré subir e depois salte girando.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Nade perto do golfinho. Depois, na água, aperte a pata.',
    1: 'Na água, aperte a pata e salte para cima das pedras.',
    2: 'Espere a água subir e aperte a pata para saltar.',
    3: 'Ande até o Atlas.',
  },
  trechos: [
    // 1 — O golfinho e a primeira pedra alta
    [
      '...............................',
      '...................o.o.o.......',
      '..................RRRRRRRRRRRRR',
      '..................RRRRRRRRRRRRR',
      '..P.S.............RRRRRRRRRRRRR',
      '#####~~~~~~A~~~~~~RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
      '#####~~~~~~~~~~~~~RRRRRRRRRRRRR',
    ],
    // 2 — Pedras no mar: salto girando de uma para outra
    [
      '..................................',
      '.........o.........o.........o....',
      '........RRR.......RRR.......RRR...',
      '........RRR.......RRR.......RRR...',
      '.C.S....RRR.......RRR.......RRR...',
      '####~~~~RRR~~~~~~~RRR~~~~~~~RRR###',
      '####~~~~RRR~~~~~~~RRR~~~~~~~RRR###',
      '####~~~~RRR~~~~~~~RRR~~~~~~~RRR###',
    ],
    // 3 — Maré + giro: a pedra mais alta
    [
      '..............o.o.o.......',
      '.............RRRRRRRRRRRRR',
      '.............RRRRRRRRRRRRR',
      '.............RRRRRRRRRRRRR',
      '.......R%%%%%RRRRRRRRRRRRR',
      '.C.S..RR%%%%%RRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRR',
      '######RR~~~~~RRRRRRRRRRRRR',
    ],
    // 4 — O Atlas
    [
      '......................',
      '..................G...',
      '..............########',
      '..........############',
      '.C....################',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
