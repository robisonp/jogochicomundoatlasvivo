// Mundo 6 — Antártica · Fase 29: O Canto das Baleias. O canto da baleia-jubarte (ondas azuis) marca as placas de gelo.
// Dossiê: os machos da jubarte fazem longas sequências de sons, os "cantos" (não dizer que é "porque está apaixonada").
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ANTARTICA_4: LevelDef = {
  id: 'antartica-4',
  nome: 'O Canto das Baleias',
  mundo: 'antartica',
  aguaGelada: true,
  chamado: 'baleia',
  abertura: { texto: 'Escute! Tem alguém cantando no mar.', quem: 'narrador' },
  animais: [
    {
      id: 'jubarte',
      fala: 'Os machos da minha espécie fazem longas canções no oceano!',
      curiosidade: 'Viajo milhares de quilômetros entre diferentes mares!',
      demo: { tipo: 'nadar', dx: 14 },
    },
  ],
  placas: [
    { texto: 'Uma baleia enorme! Passe pelas bordas de gelo.', quem: 'marcela' },
    { texto: 'Oi, Chico! Tia Kelly aqui. O canto da baleia mostra onde a placa de gelo passa!', quem: 'kelly' },
    { texto: 'Espere a placa de gelo chegar pertinho e pule, filho!', quem: 'july' },
  ],
  dicas: {
    0: 'Pule nas bordas de gelo, uma de cada vez.',
    1: 'Espere a placa de gelo chegar perto e pule nela.',
    2: 'Pule na placa, depois na ilha de pedra, depois na outra placa.',
    3: 'Suba os degraus até o Atlas.',
  },
  trechos: [
    // 1 — A jubarte passa perto da costa
    [
      '..............................',
      '..............................',
      '..........o.....o.....o.......',
      '..............................',
      '..P.S....===...===...===......',
      '######~~~A~~~~~~~~~~~~~~~~~###',
      '######~~~~~~~~~~~~~~~~~~~~~###',
      '######~~~~~~~~~~~~~~~~~~~~~###',
    ],
    // 2 — Placas de gelo marcadas pelo canto
    [
      '................................',
      '................................',
      '.......o.o.........o.o..........',
      '..........Z........Z............',
      '.C.S............................',
      '######~~~~M~~~~~~~~M~~~#########',
      '######~~~~~~~~~~~~~~~~~#########',
      '######~~~~~~~~~~~~~~~~~#########',
    ],
    // 3 — Placa, ilha e placa
    [
      '................................',
      '.....o.o.......o.o.......o......',
      '........Z.............Z.........',
      '................................',
      '.C.S............................',
      '#####~~~M~~~~~####~~~~M~~~~#####',
      '#####~~~~~~~~~####~~~~~~~~~#####',
      '#####~~~~~~~~~####~~~~~~~~~#####',
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
