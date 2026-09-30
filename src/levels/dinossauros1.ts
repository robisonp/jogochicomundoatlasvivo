// Mundo 8 — Dinossauros · Fase 36: O Vale dos Dinossauros (Sousa, PB, hoje). Pegadas no lajedo, passarelas
// e o Portal do Tempo. Dossiê: em Sousa foram encontradas principalmente pegadas e trilhas (centenas), não
// esqueletos; hoje há o Monumento Natural Vale dos Dinossauros, com passarelas.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const DINOSSAUROS_1: LevelDef = {
  id: 'dinossauros-1',
  nome: 'O Vale dos Dinossauros',
  mundo: 'dinossauros',
  abertura: { texto: 'Chegamos ao Vale dos Dinossauros, em Sousa, na Paraíba! Olhe bem para o chão.', quem: 'marcela' },
  portal: { texto: 'O Portal do Tempo! Vamos ver quando estas pegadas foram feitas?', quem: 'marcela' },
  animais: [
    {
      id: 'pegadas-sousa',
      quem: 'narrador',
      fala: 'Aqui não encontramos o dinossauro: encontramos os passos que ele deixou!',
      curiosidade: 'São centenas de pegadas e trilhas por aqui!',
      demo: { tipo: 'ficar' },
    },
  ],
  placas: [
    { texto: 'Siga as pegadas na rocha, Chico!', quem: 'robi' },
    { texto: 'Ande pelas passarelas. Elas ajudam a cuidar das pegadas!', quem: 'lili' },
    { texto: 'Pedra alta! Aperte a pata para o super pulo.', quem: 'marcos' },
    { texto: 'Olha lá o Portal do Tempo! Entre nele!', quem: 'marcela' },
  ],
  dicas: {
    0: 'Siga as pegadas para a direita.',
    1: 'Passe pelas passarelas, sem cair nos buracos.',
    2: 'Aperte a pata para dar o super pulo na pedra alta.',
    3: 'Entre no Portal do Tempo.',
  },
  trechos: [
    // 1 — Pegadas no lajedo
    [
      '..................................',
      '..........o...o...o...............',
      '..................................',
      '..................................',
      '..P.S....:.:.:.:.:.:....A.........',
      '##################################',
      '##################################',
      '##################################',
    ],
    // 2 — Passarelas sobre as valas
    [
      '...............................',
      '.........o.o........o.o........',
      '...............................',
      '...............................',
      '.C.S...........................',
      '######=========###=========####',
      '######.........###.........####',
      '######.........###.........####',
    ],
    // 3 — Pedra alta: super pulo
    [
      '..............o.o.o.........',
      '...........RRRRRRRR.........',
      '...........RRRRRRRR.........',
      '...........RRRRRRRR.........',
      '.C.S.......RRRRRRRR....:.:..',
      '############################',
      '############################',
      '############################',
    ],
    // 4 — O Portal do Tempo
    [
      '........................',
      '........................',
      '........................',
      '........................',
      '.C.S......:.:.:....G....',
      '########################',
      '########################',
      '########################',
    ],
  ],
};
