import Phaser from 'phaser';
import { botaoGrande, engrenagemAdulta } from '../ui/widgets';
import { VoiceManager } from '../systems/VoiceManager';
import { AudioManager } from '../systems/AudioManager';
import type { LevelScene } from './LevelScene';

export class PauseScene extends Phaser.Scene {
  private faseId = '';

  constructor() {
    super('Pausa');
  }

  init(data: { faseId: string }) {
    this.faseId = data.faseId;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.scene.pause('Hud');
    AudioManager.pararMusica();
    VoiceManager.calar();
    this.add.rectangle(0, 0, W, H, 0x1d2b3a, 0.75).setOrigin(0).setInteractive();

    const continuar = () => {
      const level = this.scene.get('Level') as LevelScene;
      this.scene.resume('Level');
      this.scene.resume('Hud');
      level.retomar();
      AudioManager.tocarMusica();
      this.scene.stop();
    };
    const recomecar = () => {
      this.scene.stop('Hud');
      this.scene.stop('Level');
      this.scene.start('Level', { faseId: this.faseId });
      this.scene.stop();
    };
    const casa = () => {
      this.scene.stop('Hud');
      this.scene.stop('Level');
      this.scene.start('Titulo');
      this.scene.stop();
    };

    botaoGrande(this, W / 2, H / 2, 'btn-jogar', continuar, 1.1);
    botaoGrande(this, W / 2 - 280, H / 2 + 20, 'btn-denovo', recomecar, 0.75);
    botaoGrande(this, W / 2 + 280, H / 2 + 20, 'btn-casa', casa, 0.75);
    engrenagemAdulta(this, W - 60, H - 60, () => this.scene.launch('Adulto', { voltarPara: 'Pausa' }));

    VoiceManager.falar('Pausa. Toque no verde para continuar.', 'narrador');
  }
}
