// Mundo 6 — Antártica · Fase 28: Debaixo do Gelo. O Vovô Marcos constrói um submarino; bolhas marcam o caminho.
// Correção de lógica: o Chico não nada no mar gelado (regra do Ártico). Aqui ele vai no submarino do Vovô Marcos
// (o Construtor Viajante do GDD), que protege do frio e deixa mergulhar por baixo do gelo.
// Dossiê: a foca-de-weddell mergulha por baixo do gelo e faz muitos sons debaixo d'água.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ANTARTICA_3: LevelDef = {
  id: 'antartica-3',
  nome: 'Debaixo do Gelo',
  mundo: 'antartica',
  aguaGelada: true,
  submarino: true,
  abertura: { texto: 'Chico, construí um submarino para você! Na água, ele te protege do frio.', quem: 'marcos' },
  animais: [
    {
      id: 'foca-de-weddell',
      fala: 'Eu mergulho por baixo do gelo para explorar o mar!',
      curiosidade: 'Faço sons incríveis debaixo d’água!',
      demo: { tipo: 'nadar', dx: 10 },
    },
  ],
  placas: [
    { texto: 'Entre na água com o submarino e siga a foca!', quem: 'marcos' },
    { texto: 'Siga as bolhas! Elas mostram o caminho debaixo do gelo. Aperte para baixo para descer.', quem: 'lili' },
    { texto: 'Um pedaço de gelo desce bem fundo. Passe por baixo dele, filho!', quem: 'july' },
  ],
  dicas: {
    0: 'Pule na água: o submarino te protege.',
    1: 'Aperte para baixo para descer e siga as bolhas para a direita.',
    2: 'Desça bem fundo para passar por baixo do gelo.',
    3: 'Suba os degraus até o Atlas.',
  },
  trechos: [
    // 1 — A foca e o mar
    [
      '............................',
      '............o..o..o.........',
      '..P.S.......................',
      '#######~~~A~~~~~~~~~~~######',
      '#######wwwwwwwwwwwwwww######',
      '#######wwwwwwwwwwwwwww######',
      '#######wwwwwwwwwwwwwww######',
      '#######wwwwwwwwwwwwwww######',
    ],
    // 2 — Debaixo da placa de gelo, seguindo as bolhas
    [
      '................................',
      '................................',
      '.C.S............................',
      '####~~IIIIIIIIIIIIIIIIIIII~~~###',
      '####wwwwwwwwwwwwwwwwwwwwwwwww###',
      '####wwwwZwwwwwwZwwwwwwwZwwwww###',
      '####wwwwwwwowwwwwowwwwwwwowww###',
      '####wwwwwwwwwwwwwwwwwwwwwwwww###',
    ],
    // 3 — Gelo que desce fundo: passar por baixo
    [
      '................................',
      '................................',
      '.C.S............................',
      '####~~IIIIIIIIIIIIIIIIIIIII~~###',
      '####wwwwwwwwwwIIwwwwwwwwwwwww###',
      '####wwwwwwwwwwIIwwwwwwwwwwwww###',
      '####wwwwwwZwwwwwwwwwwwwZwwwww###',
      '####wwwwwowwwwwwwwwwowwwwwoww###',
    ],
    // 4 — O Atlas
    [
      '......................',
      '..................G...',
      '..............########',
      '.C....################',
      '######################',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
