// Mundo 5 — Ártico · Fase 23: O Pulo da Raposa. A raposa-do-ártico ensina o Mergulho na neve (botão da pata).
// Dossiê: salto seguido de mergulho de cabeça na neve (VERDADEIRO); ela localiza o alimento sob a neve antes de saltar.
// Só a neve fofa quebra: o mergulho não atravessa gelo nem rocha.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ARTICO_3: LevelDef = {
  id: 'artico-3',
  nome: 'O Pulo da Raposa',
  mundo: 'artico',
  aguaGelada: true,
  abertura: { texto: 'Shhh... Tem alguém escutando debaixo da neve.', quem: 'narrador' },
  animais: [
    {
      id: 'raposa-artica',
      fala: 'Escuto debaixo da neve e... pulo de cabeça!',
      curiosidade: 'Minha pelagem ajuda a enfrentar o frio do Ártico!',
      demo: { tipo: 'mergulhar' },
      daPoder: 'mergulho',
    },
  ],
  placas: [
    { texto: 'Gelo pontudo demais para pular! Mergulhe na neve fofa e passe por baixo.', quem: 'robi' },
    { texto: 'Um buraco fundo de neve fofa! Mergulhe bem no meio.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Fique em cima da neve fofa e aperte a pata.',
    1: 'Aperte a pata em cima da neve fofa e siga o túnel até a escada.',
    2: 'Mergulhe na neve fofa e continue caindo até o túnel.',
  },
  trechos: [
    // 1 — A raposa mergulha; o Chico passa por baixo do paredão
    [
      '..............................',
      '.............RRRR.............',
      '.............RRRR.............',
      '.............RRRR.............',
      '.............RRRR.............',
      '..P....A.....RRRR.............',
      '#########NN######....#########',
      '#########NN######...##########',
      '#########tttttttt..###########',
      '#########tttttttt.############',
      '##############################',
    ],
    // 2 — Campo de gelo pontudo: o caminho é por baixo
    [
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '..............................',
      '.C.S.....^^^^^^^^^^^^....o....',
      '######NN##############H#######',
      '######NN##############H#######',
      '######ttttoootttttttttH#######',
      '######ttttttttttttttttH#######',
      '##############################',
    ],
    // 3 — Poço de neve fofa (três camadas)
    [
      '..............................',
      '..........RRRR................',
      '..........RRRR................',
      '..........RRRR................',
      '..........RRRR................',
      '.C.S......RRRR................',
      '#####NN############.....######',
      '#####NN############....#######',
      '#####NN############...########',
      '#####ttttoooottttt..##########',
      '#####tttttttttttttt.##########',
      '##############################',
    ],
    // 4 — O Atlas
    [
      '........................',
      '........................',
      '........................',
      '...................G....',
      '................########',
      '.C..........############',
      '########################',
      '########################',
      '########################',
      '########################',
      '########################',
      '########################',
    ],
  ],
};
