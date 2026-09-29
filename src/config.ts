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

export const COLORS = {
  sky: 0x8fd3ff,
  ui: 0xffffff,
  uiShadow: 0x1d2b3a,
  accent: 0xf6c177,
  good: 0x5cc26a,
};
