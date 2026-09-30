// Mundo 6 — Antártica · Fase 26: Um Continente sem País. Chegada numa estação de pesquisa; a orca no mar.
// Dossiê: nenhum país governa a Antártida sozinho; o Tratado da Antártida reservou o continente para a paz e a ciência.
// O Brasil mantém a Estação Antártica Comandante Ferraz. Sem ursos-polares, iglus ou povos nativos.
// Água gelada: o Chico não nada no mar (a Mamãe July tira ele e ele volta ao checkpoint).
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ANTARTICA_1: LevelDef = {
  id: 'antartica-1',
  nome: 'Um Continente sem País',
  mundo: 'antartica',
  aguaGelada: true,
  abertura: { texto: 'Aqui, países trabalham juntos para estudar um continente de gelo!', quem: 'narrador' },
  animais: [
    {
      id: 'orca',
      fala: 'Minha família e eu viajamos juntas pelo oceano!',
      curiosidade: 'Apesar do tamanho, eu sou um tipo de golfinho!',
      demo: { tipo: 'nadar', dx: 12 },
    },
  ],
  placas: [
    { texto: 'Esta é uma estação de pesquisa. Cientistas de muitos países estudam o gelo aqui. O Brasil também tem uma estação na Antártica!', quem: 'marcos' },
    { texto: 'A água daqui também é gelada demais. Pule de gelo em gelo, filho!', quem: 'july' },
    { texto: 'Olha a orca! Aposto que você chega do outro lado pelas bordas de gelo!', quem: 'robi' },
  ],
  dicas: {
    0: 'Ande para a direita, perto da estação.',
    1: 'Pule de uma ilha de gelo para a outra.',
    2: 'Pule nas bordas de gelo, uma de cada vez.',
    3: 'Suba os degraus até o Atlas.',
  },
  trechos: [
    // 1 — A estação de pesquisa
    [
      '............................',
      '............................',
      '............................',
      '..P...&....S.....o.o.o......',
      '############################',
      '############################',
      '############################',
    ],
    // 2 — Ilhas de gelo no mar
    [
      '..............................',
      '.........o.......o............',
      '..............................',
      '.C.S..........................',
      '#####~~~III~~~III~~~III~~~####',
      '#####~~~###~~~###~~~###~~~####',
      '#####~~~###~~~###~~~###~~~####',
    ],
    // 3 — A orca e as bordas de gelo
    [
      '................................',
      '................................',
      '..........o.....o.....o.........',
      '................................',
      '.C.S.....===...===...===........',
      '######~~A~~~~~~~~~~~~~~~~~~#####',
      '######~~~~~~~~~~~~~~~~~~~~~#####',
      '######~~~~~~~~~~~~~~~~~~~~~#####',
    ],
    // 4 — O Atlas
    [
      '..........................',
      '..................G.......',
      '..............############',
      '..........################',
      '.C....####################',
      '##########################',
      '##########################',
      '##########################',
    ],
  ],
};
