// Mundo 2 — Amazônia · Fase 8: Nado da Onça. A onça-pintada atravessa o rio fundo e o Chico ganha o
// poder passivo "Nado da Onça": entrar na água funda (escura) e mergulhar.
// Dossiê: onça é excelente nadadora (VERDADEIRO); "contra a correnteza" foi removido.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AMAZONIA_3: LevelDef = {
  id: 'amazonia-3',
  nome: 'Nado da Onça',
  mundo: 'amazonia',
  abertura: { texto: 'A água escura é funda. Quem será que sabe nadar nela?', quem: 'narrador' },
  animais: [
    {
      id: 'onca',
      fala: 'Eu atravesso rios nadando com muita habilidade!',
      curiosidade: 'Sou o maior felino das Américas!',
      demo: { tipo: 'nadar', dx: 12 },
      daPoder: 'onca',
    },
  ],
  placas: [
    { texto: 'Tem um tronco no rio! Mergulhe por baixo: aperte para baixo e siga em frente.', quem: 'marcos' },
    { texto: 'Olha as pegadas lá no fundo! Mergulhe para pegar.', quem: 'robi' },
  ],
  dicas: {
    0: 'Espere a onça atravessar o rio. Depois, nade como ela!',
    1: 'Aperte para baixo e para a frente para passar por baixo do tronco.',
    2: 'Aperte para baixo para mergulhar e o pulo para subir.',
  },
  trechos: [
    // 1 — A onça atravessa o rio fundo
    [
      '...........o.o.o..........',
      '..........................',
      '..P....A..................',
      '########wwwwwwwwwwww######',
      '########wwwwwwwwwwww######',
      '########wwwwwwwwwwww######',
    ],
    // 2 — Tronco caído: só passa mergulhando por baixo
    [
      '..............................',
      '.............RR...............',
      '.............RR...............',
      '.............RR...............',
      '.............RR...............',
      '.............RR........o......',
      '.C.S.........RR...............',
      '####wwwwwwwwwRRwwwwwwwwww#####',
      '####wwwwwwwwwwwwwwwwwwwww#####',
      '####wwwwwwwwwwwwwwwwwwwww#####',
    ],
    // 3 — Pegadas no fundo do rio
    [
      '..........................',
      '.......====.....====......',
      '..........................',
      '.C.S......................',
      '###wwwwwwwwwwwwwwwwwww####',
      '###wwwwowwwwwowwwwwowww###',
      '###wwwwwwwwwwwwwwwwwww####',
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
