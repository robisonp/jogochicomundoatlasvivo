// Mundo 4 — Austrália · Fase 16: Saltos do Outback. O canguru-vermelho ensina o Super pulo (botão da pata).
// Dossiê: o canguru se desloca por saltos longos (VERDADEIRO); saltos recordes não são o salto de todo dia.
// Ambiente (dossiê): interior seco, solo avermelhado, formações rochosas, capins adaptados à seca.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const AUSTRALIA_1: LevelDef = {
  id: 'australia-1',
  nome: 'Saltos do Outback',
  mundo: 'australia',
  abertura: { texto: 'No interior da Austrália, a água é rara e a paisagem parece enorme!', quem: 'narrador' },
  animais: [
    {
      id: 'canguru',
      fala: 'Minhas pernas fortes me levam bem longe a cada salto!',
      curiosidade: 'Uso minha cauda para me apoiar e me equilibrar!',
      demo: { tipo: 'pular', dx: 3, dy: -4 },
      daPoder: 'superpulo',
    },
  ],
  placas: [
    { texto: 'Pedra alta! Aperte o botão da pata para dar um super pulo!', quem: 'robi' },
    { texto: 'Buraco grande! Corra e dê um super pulo pertinho da beirada.', quem: 'lili' },
    { texto: 'Capim de espinhos! Passe por cima com o super pulo.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Espere o canguru mostrar o salto dele. Depois, aperte o botão da pata.',
    1: 'Aperte o botão da pata para pular bem alto.',
    2: 'Corra e aperte a pata bem pertinho da beirada do buraco.',
    3: 'Corra e aperte a pata antes dos espinhos.',
  },
  trechos: [
    // 1 — O canguru sobe na pedra alta com um salto só
    [
      '........................',
      '...........oo...........',
      '.........RRRR...........',
      '.........RRRR...........',
      '.........RRRR...........',
      '.P....A..RRRR...........',
      '########################',
      '########################',
      '########################',
    ],
    // 2 — Morros de arenito
    [
      '..............................',
      '.......................ooo....',
      '..............ooo......RRRR...',
      '..............RRRR.....RRRR...',
      '..............RRRR.....RRRR...',
      '.C.S..........RRRR.....RRRR...',
      '##############################',
      '##############################',
      '##############################',
    ],
    // 3 — Buracos grandes
    [
      '................................',
      '...........o.o.o................',
      '................................',
      '................................',
      '.C.S......................o.....',
      '#######.....#######.....########',
      '#######.....#######.....########',
      '#######.....#######.....########',
    ],
    // 4 — Espinifex e o Atlas lá no alto
    [
      '....................................',
      '.........o.o.o...............G......',
      '............................RRRR....',
      '............................RRRR....',
      '.C.S........................RRRR....',
      '.......^^^^^.........^^^....RRRR....',
      '####################################',
      '####################################',
      '####################################',
    ],
  ],
};
