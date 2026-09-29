// Mundo 1 — Caatinga · Fase 4: Chuva no Sertão. A chuva chega e a Caatinga fica verde; estreia o Vento Viravolta.
// Dossiê (ambiente Caatinga): na seca muitas plantas perdem folhas; quando chove, a paisagem muda muito rápido.
// Asa-branca: a fala científica vem do dossiê; a ligação com a chuva aparece só como cultura (a música do sertão).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const CAATINGA_4: LevelDef = {
  id: 'caatinga-4',
  nome: 'Chuva no Sertão',
  mundo: 'caatinga',
  abertura: { texto: 'Na seca, muitas plantas da Caatinga ficam sem folhas.', quem: 'narrador' },
  chuva: {
    comeca: { texto: 'Olha a chuva chegando no sertão!', quem: 'narrador' },
    verde: { texto: 'Quando chove, a Caatinga fica verde bem depressa!', quem: 'narrador' },
  },
  animais: [
    {
      id: 'asa-branca',
      fala: 'Eu voo por muitos lugares procurando comida e água!',
      curiosidade: 'Nem toda asa-branca faz a mesma viagem todo ano!',
      demo: { tipo: 'voar', dx: 12, dy: -7 },
    },
  ],
  placas: [
    { texto: 'Tem uma música muito famosa do sertão sobre a asa-branca!', quem: 'marcela' },
    { texto: 'É o Vento Viravolta! Espere o vento acalmar e aí pule.', quem: 'lili' },
    { texto: 'Com o vento nas costas, o pulo vai mais longe! Pule na hora do vento forte.', quem: 'robi' },
  ],
  dicas: {
    0: 'Pule nas pedras e depois na página.',
    1: 'Quando tiver poucas folhas voando, o vento está fraco. Aí pule!',
    2: 'Pule quando passarem muitas folhas: é o vento forte ajudando.',
  },
  trechos: [
    // 1 — Seca, e a asa-branca
    [
      '..........o.o.............',
      '..........................',
      '..P..S....A.......##......',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 2 — A chuva começa (U); pedras e uma página sobre o buraco
    [
      '..............o...........',
      '..........................',
      '...........RR.............',
      '........RRRRR.......o.....',
      '..U..RRRRRRRR.............',
      '#############....M....####',
      '#############.........####',
      '#############.........####',
    ],
    // 3 — Vento contra: esperar a calmaria para pular o vão
    [
      '.....<<<<<<<<<<<<<<<<<<.....',
      '.....<<<<<<<<o<<<<<<<<<.....',
      '.....<<<<<<<<<<<<<<<<<<.....',
      '.....<<<<<<<<<<<<<<<<<<.....',
      '.C.S.<<<<<<<<<<<<<<<<<<.....',
      '#############..#############',
      '#############..#############',
      '#############..#############',
    ],
    // 4 — Vento a favor sobre o buraco (só no ar, para não empurrar ninguém para dentro)
    [
      '........>>>>>>........o...',
      '........>>>>>>............',
      '........>>>>>>............',
      '........>>>>>>............',
      '........>>>>>>............',
      '.C.S....>>>>>>............',
      '########.....#############',
      '########.....#############',
      '########.....#############',
    ],
    // 5 — Caatinga verde e o Atlas
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
