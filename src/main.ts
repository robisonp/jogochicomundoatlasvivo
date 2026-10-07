import Phaser from 'phaser';
import { observarTela, tamanhoIdeal } from './core/Tela';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { LevelScene } from './scenes/LevelScene';
import { HudScene } from './scenes/HudScene';
import { PauseScene } from './scenes/PauseScene';
import { CestosScene } from './scenes/CestosScene';
import { EsqueletoScene } from './scenes/EsqueletoScene';
import { RevelacaoScene } from './scenes/RevelacaoScene';
import { CozinhaScene } from './scenes/CozinhaScene';
import { EscaladaScene } from './scenes/EscaladaScene';
import { EndScene } from './scenes/EndScene';
import { AdultScene } from './scenes/AdultScene';
import { AtlasScene } from './scenes/AtlasScene';
import { MapaScene } from './scenes/MapaScene';

const inicial = tamanhoIdeal();
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#8fd3ff',
  scale: {
    // O tamanho segue a proporção da tela (pelo menos 1280x720 visíveis) e é refeito pelas telas de menu
    // quando a tela do aparelho muda (src/core/Tela.ts). FIT garante que nada fique fora da tela no meio tempo.
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: inicial.w,
    height: inicial.h,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: new URLSearchParams(location.search).has('debug') },
  },
  input: { gamepad: true, activePointers: 4 },
  // No máximo 4 texturas por lote de desenho: com mais, peças do Chico e da família apareciam cortadas
  // (visto no navegador de teste). Custa algumas chamadas de desenho a mais, sem diferença perceptível.
  render: { antialias: true, maxTextures: 4 },
  // A ordem define quem é desenhado por cima.
  scene: [BootScene, TitleScene, MapaScene, AtlasScene, LevelScene, HudScene, PauseScene, EndScene, CestosScene, EsqueletoScene, RevelacaoScene, CozinhaScene, EscaladaScene, AdultScene],
});

observarTela(game);

// Exposto apenas para testes automatizados.
(window as any).__game = game;
