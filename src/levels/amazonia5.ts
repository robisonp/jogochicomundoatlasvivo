// Mundo 2 — Amazônia · Fase 10: Tempestade no Rio. Combina cipó, nado, mergulho e vento; termina no Selo da Amazônia.
// Dossiê (ambiente Amazônia): partes da floresta podem ficar inundadas durante a cheia.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AMAZONIA_5: LevelDef = {
  id: 'amazonia-5',
  nome: 'Tempestade no Rio',
  mundo: 'amazonia',
  abertura: { texto: 'Última aventura da Amazônia! Vamos buscar o Selo da Amazônia!', quem: 'marcela' },
  chuva: {
    comeca: { texto: 'Uma tempestade na floresta!', quem: 'narrador' },
    verde: { texto: 'A chuva passou. Na cheia, partes da floresta ficam alagadas!', quem: 'narrador' },
  },
  selo: { id: 'amazonia', fala: { texto: 'Você conquistou o Selo da Amazônia!', quem: 'narrador' } },
  placas: [
    { texto: 'Pule no galho ou nade. A tempestade vai passar!', quem: 'robi' },
    { texto: 'Lá em cima o vento é forte. Nadando, o vento não te empurra!', quem: 'lili' },
    { texto: 'Mais um tronco no rio. Mergulhe por baixo!', quem: 'marcos' },
  ],
  dicas: {
    0: 'Nade até o outro lado e pule perto da margem.',
    1: 'Nade pela água: o vento só sopra lá em cima.',
    2: 'Aperte para baixo e para a frente para passar por baixo do tronco.',
  },
  trechos: [
    // 1 — A tempestade começa (U); rio raso e um galho
    [
      '..............o.o.........',
      '..........................',
      '..............====........',
      '..P..U.S..................',
      '#########~~~~~~~~~~~######',
      '#########~~~~~~~~~~~######',
      '#########~~~~~~~~~~~######',
    ],
    // 2 — Vento contra nos galhos; nadando, dá para fugir do vento
    [
      '..........................',
      '.....<<<<<<<<<<<<<<<<<....',
      '.....<<<<<<<<<<<<<<<<<....',
      '.....<<<o<<<<<<<o<<<<<....',
      '.....<<====<<====<<<<<....',
      '.C.S.<<<<<<<<<<<<<<<<<....',
      '####wwwwwwwwwwwwwwwwww####',
      '####wwwwwwwwwwwwwwwwww####',
      '####wwwwwwwwwwwwwwwwww####',
    ],
    // 3 — Tronco no rio fundo: mergulhar por baixo
    [
      '.......................o....',
      '..............RR.......J....',
      '..............RR.......J....',
      '..............RR.......J....',
      '..............RR.......J....',
      '..............RR.......J....',
      '.C.S..........RR.......J....',
      '####wwwwwwwwwwRRwwww########',
      '####wwwwwwwwwwwwwwww########',
      '####wwwwwwwwwwwwwwww########',
    ],
    // 4 — O Selo da Amazônia
    [
      '......................',
      '..................G...',
      '..............########',
      '..........############',
      '..X...################',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
