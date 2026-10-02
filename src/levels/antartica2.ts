// Mundo 6 — Antártica · Fase 27: Deslize do Pinguim. O pinguim-de-adélia ensina o Tobogã (botão da pata).
// Dossiê: o adélia desliza de barriga na neve e no gelo ("tobogganing") — VERDADEIRO. Forma grandes colônias.
// Deitado, o Chico fica baixinho e passa por túneis de um bloco de altura.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ANTARTICA_2: LevelDef = {
  id: 'antartica-2',
  nome: 'Deslize do Pinguim',
  mundo: 'antartica',
  aguaGelada: true,
  abertura: { texto: 'Olha quem está chegando, andando bem devagarinho!', quem: 'narrador' },
  animais: [
    {
      id: 'pinguim',
      fala: 'Na neve macia, deslizo de barriga como num tobogã!',
      curiosidade: 'Minhas asas funcionam como nadadeiras debaixo d’água!',
      demo: { tipo: 'deslizar', dx: 6 },
      daPoder: 'toboga',
    },
  ],
  placas: [
    { texto: 'Túnel baixinho! Aperte a pata e deslize de barriga como o pinguim.', quem: 'robi' },
    { texto: 'Um túnel bem comprido! Deitado, você continua deslizando até sair.', quem: 'lili' },
  ],
  dicas: {
    0: 'Espere o pinguim mostrar como desliza.',
    1: 'Perto do túnel, aperte o botão da pata para deslizar.',
    2: 'Aperte a pata antes do túnel e depois pule o gelo pontudo.',
    3: 'Suba os degraus até o Atlas.',
  },
  trechos: [
    // 1 — O pinguim desliza de barriga
    [
      '..............................',
      '..............................',
      '..............................',
      '..P...A.......:.:.:....X......',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 2 — Túnel baixinho: só passa deslizando
    [
      '..............................',
      '..........RRRRRRRRRR..........',
      '..........RRRRRRRRRR..........',
      '..........RRRRRRRRRR..........',
      '.C.S......oo..o...o.....X.....',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 3 — Túnel comprido e gelo pontudo depois
    [
      '..................................',
      '.......RRRRRRRRRRRRRRRR...........',
      '.......RRRRRRRRRRRRRRRR...........',
      '.......RRRRRRRRRRRRRRRR...........',
      '.C.S...o.o.o.o.o.o.o.o......^^....',
      '##################################',
      '##################################',
      '##################################',
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
