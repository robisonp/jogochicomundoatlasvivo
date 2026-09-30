// Constantes globais do jogo. Números de "sensação" do movimento ficam em PLAYER para ajuste rápido.

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const TILE = 64;

export const PLAYER = {
  gravity: 2200,
  maxRun: 340,
  groundAccel: 2600,
  groundDecel: 3000,
  airAccel: 1900,
  airDecel: 1200,
  jumpVelocity: 860,
  // Soltar o botão cedo corta o pulo: pulo curto e pulo alto no mesmo botão.
  jumpCutFactor: 0.45,
  maxFall: 1150,
  coyoteMs: 120,
  jumpBufferMs: 140,
  climbSpeed: 260,
  // Hitbox menor que o desenho (colisão generosa).
  bodyWidth: 34,
  bodyHeight: 78,
  respawnMs: 450,
};

// Poder "Virar bola" (tatu-bola): protege por alguns segundos. Andar enrolado devagar é estilização do jogo.
export const BOLA = {
  duracaoMs: 3500,
  // piscar avisando que a bola vai abrir
  avisoMs: 900,
  fatorVelocidade: 0.5,
};

// Água: o Chico boia; a braçada sobe; com o "Nado da Onça" pode mergulhar e entrar na água funda.
export const AGUA = {
  fatorGravidade: 0.12,
  maxQueda: 240,
  empuxo: 1500,
  bracada: 400,
  saltoSaida: 0.85,
  mergulho: 900,
  fatorVelocidade: 0.7,
};

// Arrancada do guepardo: explosão curta de velocidade e depois recarga (dossiê: sprint dura poucos segundos).
export const ARRANCADA = {
  duracaoMs: 550,
  fatorVelocidade: 2.3,
  recargaMs: 1600,
};

// Super pulo do canguru: pulo bem mais alto e mais longo, só a partir do chão (dossiê: saltos longos).
// A velocidade fica logo abaixo do limite de queda do motor (maxFall), que também limita a subida.
export const SUPERPULO = {
  velocidade: 1140,
  fatorVelocidade: 1.25,
  bufferMs: 160,
};

// Cavar do wombat (passivo): só terra fofa, e leva um instante (dossiê: não cavar qualquer material de uma vez).
export const CAVAR = {
  tempoMs: 380,
};

// Gelo: no chão de gelo o Chico acelera e freia bem menos (escorrega).
export const GELO = {
  fatorAcel: 0.3,
  fatorFreio: 0.15,
};

// Mergulho na neve da raposa-do-ártico: salto alto e queda de cabeça que quebra a neve fofa
// (dossiê: salto seguido de mergulho de cabeça na neve).
export const MERGULHO = {
  salto: 0.95,
  queda: 950,
  velocidadeX: 160,
};

// Tobogã do pinguim-de-adélia: desliza de barriga, rápido e baixinho (passa em túneis de um bloco de altura).
// Dossiê: o adélia desliza de barriga na neve e no gelo ("tobogganing").
export const TOBOGA = {
  duracaoMs: 1100,
  fatorVelocidade: 1.6,
  /** Altura do corpo deitado (em pé: PLAYER.bodyHeight). */
  altura: 34,
};

// Vento Viravolta: velocidade que o vento soma ao Chico (px/s) nas rajadas.
export const VENTO = {
  forca: 190,
  // enrolado em bola, o vento empurra bem menos (estilização do jogo)
  fatorBola: 0.25,
  // ciclo de rajada: forte por um tempo, fraco por outro (dá para esperar o vento acalmar)
  rajadaMs: 2400,
  calmaMs: 1400,
};

export const COLORS = {
  sky: 0x8fd3ff,
  ui: 0xffffff,
  uiShadow: 0x1d2b3a,
  accent: 0xf6c177,
  good: 0x5cc26a,
};
