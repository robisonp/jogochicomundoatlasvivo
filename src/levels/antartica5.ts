// Mundo 6 — Antártica · Fase 30: Tempestade Branca. O Vento Viravolta sopra forte; o albatroz-errante plana no vento.
// Dossiê (ambiente): a Antártida é extremamente fria, seca e ventosa. O albatroz-errante plana grandes distâncias.
// Deitado no tobogã, o Chico fica baixinho e o vento quase não empurra. Termina no Selo da Antártica.
// Duração-alvo: 2 a 3 minutos.
import type { LevelDef } from './types';

export const ANTARTICA_5: LevelDef = {
  id: 'antartica-5',
  nome: 'Tempestade Branca',
  mundo: 'antartica',
  aguaGelada: true,
  nevasca: true,
  abertura: { texto: 'Última aventura da Antártica! O Vento Viravolta trouxe uma tempestade branca!', quem: 'marcela' },
  selo: { id: 'antartica', fala: { texto: 'Você conquistou o Selo da Antártica!', quem: 'narrador' } },
  animais: [
    {
      id: 'albatroz',
      fala: 'Com minhas asas enormes, viajo muito longe sem bater asas o tempo todo!',
      curiosidade: 'Minhas asas abertas podem passar de três metros!',
      demo: { tipo: 'voar', dx: 14, dy: -4 },
    },
  ],
  placas: [
    { texto: 'Vento forte! Quando ele acalmar, ande para a frente.', quem: 'lili' },
    { texto: 'Deite e deslize! Baixinho, o vento quase não empurra.', quem: 'robi' },
    { texto: 'Último pedaço! Pule nas bordas de gelo até o selo.', quem: 'marcos' },
  ],
  dicas: {
    0: 'Siga para a direita.',
    1: 'Espere a neve parar de voar forte e ande.',
    2: 'Aperte a pata para deslizar pelo túnel.',
    3: 'Pule de borda em borda e suba até o selo.',
  },
  trechos: [
    // 1 — O albatroz plana na ventania
    [
      '............................',
      '............................',
      '............................',
      '..P.....A...:.:.:...........',
      '############################',
      '############################',
      '############################',
    ],
    // 2 — Vento contra
    [
      '................................',
      '................................',
      '.........o.....o.....o..........',
      '......<<<<<<<<<<<<<<<<<<<<<.....',
      '.C.S..<<<<<<<<<<<<<<<<<<<<<.....',
      '################################',
      '################################',
      '################################',
    ],
    // 3 — Túnel com vento: deslizando
    [
      '..................................',
      '..........RRRRRRRRRRRR............',
      '..........RRRRRRRRRRRR............',
      '..........RRRRRRRRRRRR............',
      '.C.S..<<<<<o<o<o<o<o<o<<<<........',
      '##################################',
      '##################################',
      '##################################',
    ],
    // 4 — Bordas de gelo e o Selo da Antártica
    [
      '..............................',
      '........................G.....',
      '....................##########',
      '.........o......o...##########',
      '.C.S..===..===..===.##########',
      '####~~~~~~~~~~~~~~~~##########',
      '####~~~~~~~~~~~~~~~~##########',
      '####~~~~~~~~~~~~~~~~##########',
    ],
  ],
};
