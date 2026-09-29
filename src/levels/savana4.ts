// Mundo 3 — Savana · Fase 14: Olhos no Alto. Rotas altas pelas copas das acácias; a girafa-masai.
// Dossiê: pescoço alto para alcançar folhas altas; a girafa-masai vive no Quênia e na Tanzânia.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const SAVANA_4: LevelDef = {
  id: 'savana-4',
  nome: 'Olhos no Alto',
  mundo: 'savana',
  abertura: { texto: 'Vamos olhar a savana lá de cima?', quem: 'narrador' },
  animais: [
    {
      id: 'girafa',
      fala: 'Meu pescoço alto alcança folhas que ficam lá em cima!',
      curiosidade: 'A girafa-masai vive no Quênia e na Tanzânia!',
      demo: { tipo: 'ficar' },
    },
  ],
  placas: [
    { texto: 'Oi, Chico! Tia Kelly aqui. Suba nas pedras e nas copas, bem alto!', quem: 'kelly' },
    { texto: 'Entre as copas, pule e aperte a pata no ar!', quem: 'robi' },
    { texto: 'Tia Laura aqui! Agora desça de copa em copa, com cuidado.', quem: 'laura' },
  ],
  dicas: {
    0: 'Suba as pedras, depois pule para a copa da acácia.',
    1: 'Pule da copa e aperte a pata para voar até a próxima.',
    2: 'Desça pulando de uma copa para a outra.',
  },
  trechos: [
    // 1 — A girafa
    [
      '............................',
      '............................',
      '............................',
      '..P.....A.....S.............',
      '############################',
      '############################',
      '############################',
    ],
    // 2 — Subida: kopje, copas e um salto grande com arrancada
    [
      '..................o.o.o.......',
      '.........................=====',
      '..............=====...........',
      '..........====................',
      '..............................',
      '.......RR.....................',
      '....RRRRR.....................',
      '.C.SRRRRR.....................',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 3 — Descida de copa em copa
    [
      '..........................',
      '====......................',
      '......=====.....o.........',
      '..............=====.......',
      '......................====',
      '.C.S......................',
      '##########################',
      '##########################',
      '##########################',
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
