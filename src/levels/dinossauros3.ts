// Mundo 8 — Dinossauros · Fase 38: Escavação no Araripe (CE), hoje. O Chico escava fósseis com o botão Ação:
// o crânio do Irritator e um pterossauro. No fim, o minijogo dos dois cestos: "é dinossauro" / "não é".
// Dossiê: do Irritator se conhece principalmente o crânio; pterossauros NÃO eram dinossauros.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const DINOSSAUROS_3: LevelDef = {
  id: 'dinossauros-3',
  nome: 'Escavação no Araripe',
  mundo: 'dinossauros',
  tema: 'dino-araripe',
  minijogo: 'cestos',
  abertura: { texto: 'Chapada do Araripe, no Ceará! Aqui os cientistas encontram fósseis nas rochas.', quem: 'marcela' },
  animais: [
    {
      id: 'irritator',
      fossil: 'fossil-irritator',
      fala: 'Meu esqueleto não apareceu inteiro: cientistas estudam principalmente meu crânio!',
      curiosidade: 'Eu sou um espinossaurídeo!',
      demo: { tipo: 'ficar' },
    },
    {
      id: 'pterossauro',
      fossil: 'fossil-pterossauro',
      fala: 'Eu voava na época dos dinossauros, mas não sou um dinossauro!',
      curiosidade: 'No Araripe, meus ossos ficaram guardados na rocha com muitos detalhes!',
      demo: { tipo: 'ficar' },
    },
  ],
  placas: [
    { texto: 'Um fóssil é uma parte ou marca de um ser vivo muito antigo, guardada nas rochas.', quem: 'lili' },
    { texto: 'O paleontólogo estuda fósseis para descobrir como era a vida no passado. Hoje, o paleontólogo é você!', quem: 'robi' },
    { texto: 'Suba as camadas de rocha com o super pulo!', quem: 'marcos' },
    { texto: 'Mais um monte de escavação! Aperte o botão da mão perto dele.', quem: 'july' },
  ],
  dicas: {
    0: 'Chegue perto do monte de terra e aperte o botão da mão.',
    1: 'Pule de camada em camada. Na mais alta, use o super pulo.',
    2: 'Escave o monte com o botão da mão.',
    3: 'Ande até o Atlas.',
  },
  trechos: [
    // 1 — O primeiro fóssil
    [
      '...............................',
      '.........o...o.................',
      '...............................',
      '...............................',
      '..P.S..............A...........',
      '###############################',
      '###############################',
      '###############################',
    ],
    // 2 — Camadas de rocha
    [
      '.................o.o.o..........',
      '................RRRRRRR.........',
      '................RRRRRRR.........',
      '..........RRRRRRRRRRRRR.........',
      '.C.S..RRRRRRRRRRRRRRRRR.........',
      '################################',
      '################################',
      '################################',
    ],
    // 3 — O pterossauro na pedra
    [
      '..............................',
      '..........o...o...o...........',
      '..............................',
      '..............................',
      '.C.S..^^.............A........',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 4 — O Atlas
    [
      '......................',
      '......................',
      '..................G...',
      '..............########',
      '.C........############',
      '######################',
      '######################',
      '######################',
    ],
  ],
};
