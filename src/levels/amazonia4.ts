// Mundo 2 — Amazônia · Fase 9: Vozes da Floresta. Seguir os chamados: ondas visuais + som mostram o cipó certo
// (o alto-falante do tablet quase não tem estéreo, então a direção vem das ondas). A perereca-leiteira.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AMAZONIA_4: LevelDef = {
  id: 'amazonia-4',
  nome: 'Vozes da Floresta',
  mundo: 'amazonia',
  abertura: { texto: 'Escute a floresta! Tem muitos bichos chamando.', quem: 'narrador' },
  animais: [
    {
      id: 'perereca',
      fala: 'Meus dedos grudentos me ajudam a subir bem alto!',
      curiosidade: 'Posso viver lá no alto das árvores da floresta!',
      demo: { tipo: 'pular', dx: 1, dy: -2 },
    },
  ],
  placas: [
    { texto: 'Onde aparecem ondinhas, tem um bicho chamando. Siga o chamado!', quem: 'marcela' },
    { texto: 'Qual cipó tem ondinhas lá em cima? Suba por ele!', quem: 'lili' },
    { texto: 'Escute de novo e procure as ondinhas!', quem: 'robi' },
  ],
  dicas: {
    0: 'Pule o tronco baixinho.',
    1: 'Suba no cipó que tem as ondinhas amarelas lá em cima.',
    2: 'O chamado agora está no primeiro cipó.',
  },
  trechos: [
    // 1 — A perereca sobe no tronco
    [
      '........................',
      '........................',
      '.........RR.............',
      '..P..S..ARR......X......',
      '########################',
      '########################',
      '########################',
    ],
    // 2 — Três cipós: o do chamado (Z) leva por cima do paredão
    [
      '....o.....o.....Z......o......',
      '....J.....J.....J=========....',
      '...=J=...=J=....J.....RRR.....',
      '....J.....J.....J.....RRR.....',
      '....J.....J.....J.....RRR.....',
      '....J.....J.....J.....RRR.....',
      '....J.....J.....J.....RRR.....',
      '....J.....J.....J.....RRR.....',
      '.C.SJ.....J.....J.....RRR.....',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 3 — Agora o chamado está no primeiro cipó
    [
      '....Z....o.............o....',
      '....J====J=====........J....',
      '....J....J....RRR.....=J=...',
      '....J....J....RRR......J....',
      '....J....J....RRR......J....',
      '....J....J....RRR......J....',
      '....J....J....RRR......J....',
      '....J....J....RRR......J....',
      '.C.SJ....J....RRR......J....',
      '############################',
      '############################',
      '############################',
    ],
    // 4 — O Atlas
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
