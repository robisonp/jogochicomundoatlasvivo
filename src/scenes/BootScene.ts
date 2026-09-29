import Phaser from 'phaser';
import { gerarTexturas } from '../art/Textures';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
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
