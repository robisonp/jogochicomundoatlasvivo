import Phaser from 'phaser';
import { gerarTexturas } from '../art/Textures';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    gerarTexturas(this);
    const params = new URLSearchParams(location.search);
    // ?fase=<id> abre direto uma fase (útil para testes).
    const fase = params.get('fase');
    if (fase) this.scene.start('Level', { faseId: fase });
    else this.scene.start('Titulo');
  }
}
