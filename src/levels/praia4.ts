// Mundo 7 — Praia do Brasil · Fase 34: O Berçário do Mar. Manguezal: lama, raízes, galhos e a maré.
// Dossiê (manguezal): onde a água doce e a salgada podem se encontrar; abrigo para muitos animais (“berçário
// para muitos animais”, não para todos). Raízes do mangue aparecem na maré baixa.
// Caranguejo-uçá: vive no manguezal, cava tocas. Cavalo-marinho: cauda que segura; o papai carrega os filhotes.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const PRAIA_4: LevelDef = {
  id: 'praia-4',
  nome: 'O Berçário do Mar',
  mundo: 'praia',
  tema: 'praia-mangue',
  abertura: { texto: 'Entre a terra e o mar, o manguezal vira abrigo para muitos filhotes!', quem: 'narrador' },
  animais: [
    {
      id: 'caranguejo',
      fala: 'Minha toca fica escondida no chão do manguezal!',
      curiosidade: 'Ajudo a transformar folhas velhas do mangue!',
      demo: { tipo: 'correr', dx: 2 },
    },
    {
      id: 'cavalo-marinho',
      fala: 'Minha cauda funciona como uma mãozinha para eu me segurar!',
      curiosidade: 'Nos cavalos-marinhos, o papai carrega os filhotes!',
      demo: { tipo: 'ficar' },
    },
  ],
  placas: [
    { texto: 'No manguezal, a água do rio encontra a água do mar!', quem: 'marcela' },
    { texto: 'Na maré baixa, as raízes aparecem. Cuidado com as ostras!', quem: 'lili' },
    { texto: 'Tem um bichinho escondido entre as raízes. Nade devagar!', quem: 'july' },
  ],
  dicas: {
    0: 'Ande pela lama e veja o caranguejo.',
    1: 'Com a água alta, nade por cima das ostras. Pule nos galhos.',
    2: 'Nade e pule por cima das raízes.',
    3: 'Ande até o Atlas.',
  },
  trechos: [
    // 1 — Lama do mangue e o caranguejo
    [
      '..................................',
      '..........o..o..o.................',
      '..................................',
      '..P.S..............A.....RR.......',
      '##################################',
      '##################################',
      '##################################',
    ],
    // 2 — Maré entre as raízes, com ostras no fundo e galhos por cima
    [
      '...................................',
      '.........o.o.o.......o.o.o.........',
      '........=====.......=====..........',
      '....RR%%%%%%%%%%%%%%%%%%%%RR.......',
      '.C.SRR%%%R%%%%%%%R%%%%%%%%RR.......',
      '######%%%R%%%^^%%R%%%^^%%%#########',
      '###################################',
      '###################################',
    ],
    // 3 — O cavalo-marinho entre as raízes
    [
      '.................................',
      '..........o...o...o..............',
      '.................................',
      '.C.S.............................',
      '#####~~~~~R~~~~~~~R~~~~~~~~~~~###',
      '#####~~~~~R~~A~~~~R~~~~~~~~~~~###',
      '#####~~~~~R~~~~~~~R~~~~~~~~~~~###',
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
