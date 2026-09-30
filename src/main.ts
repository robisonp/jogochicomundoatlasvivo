import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { LevelScene } from './scenes/LevelScene';
import { HudScene } from './scenes/HudScene';
import { PauseScene } from './scenes/PauseScene';
import { CestosScene } from './scenes/CestosScene';
import { EsqueletoScene } from './scenes/EsqueletoScene';
import { EndScene } from './scenes/EndScene';
import { AdultScene } from './scenes/AdultScene';
import { AtlasScene } from './scenes/AtlasScene';
import { MapaScene } from './scenes/MapaScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#8fd3ff',
  scale: {
    // EXPAND: preenche a tela do tablet sem barras, mantendo pelo menos 1280x720 visíveis.
    mode: Phaser.Scale.EXPAND,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: new URLSearchParams(location.search).has('debug') },
  },
  input: { gamepad: true, activePointers: 4 },
  render: { antialias: true },
  // A ordem define quem é desenhado por cima.
  scene: [BootScene, TitleScene, MapaScene, AtlasScene, LevelScene, HudScene, PauseScene, EndScene, CestosScene, EsqueletoScene, AdultScene],
});

// Exposto apenas para testes automatizados.
(window as any).__game = game;
