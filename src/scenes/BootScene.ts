import Phaser from 'phaser';
import { gerarTexturas } from '../art/Textures';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Arte da família (corpo inteiro "corpo-<id>" e retrato "rosto-<id>") numa folha só (atlas):
    // uma textura para todos evita misturar imagens ao desenhar muitas ao mesmo tempo.
    // O resto do jogo é desenhado por código.
    this.load.atlas('familia', 'familia/familia.png', 'familia/familia.json');
  }

  create() {
    gerarTexturas(this);
    const params = new URLSearchParams(location.search);
    // ?fase=<id> abre direto uma fase; ?mapa e ?atlas abrem essas telas (útil para testes).
    const fase = params.get('fase');
    if (params.has('atlas')) this.scene.start('Atlas');
    else if (params.has('mapa')) this.scene.start('Mapa');
    else if (fase) this.scene.start('Level', { faseId: fase });
    else this.scene.start('Titulo');
  }
}
