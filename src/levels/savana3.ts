// Mundo 3 — Savana · Fase 13: A Força do Elefante. Empurrar pedregulhos para fazer degrau e tapar vala de espinhos.
// Dossiê: elefantes quebram galhos, empurram e derrubam árvores (VERDADEIRO) — não "levantam qualquer árvore".
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const SAVANA_3: LevelDef = {
  id: 'savana-3',
  nome: 'A Força do Elefante',
  mundo: 'savana',
  abertura: { texto: 'Olha que bicho enorme ali na frente!', quem: 'narrador' },
  animais: [
    {
      id: 'elefante',
      fala: 'Minha tromba e meu corpo forte movem grandes galhos!',
      curiosidade: 'Eu ajudo a mudar a paisagem da savana!',
      demo: { tipo: 'empurrar' },
      daPoder: 'forca',
    },
  ],
  placas: [
    { texto: 'A pedra é alta demais! Empurre o pedregulho até ela e suba nele.', quem: 'marcos' },
    { texto: 'Vala de espinhos! Empurre a pedra para dentro e passe por cima.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Espere o elefante mostrar a força dele.',
    1: 'Ande contra o pedregulho até ele encostar na pedra alta. Depois suba nele.',
    2: 'Empurre o pedregulho para dentro da vala e pule o pedacinho que sobrou.',
  },
  trechos: [
    // 1 — O elefante empurra um tronco e ensina a força
    [
      '..............................',
      '..............................',
      '..P......A....................',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 2 — Paredão de pedra: o pedregulho vira degrau
    [
      '................ooo.......',
      '................RRR.......',
      '................RRR.......',
      '................RRR.......',
      '.C.S..B.........RRR.......',
      '##########################',
      '##########################',
      '##########################',
    ],
    // 3 — Vala de espinhos: o pedregulho tapa metade, o resto é um pulo curto
    [
      '.........o...o..........',
      '........................',
      '.C.S..B.................',
      '########....############',
      '########^^^^############',
      '########################',
    ],
    // 4 — O Atlas
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
