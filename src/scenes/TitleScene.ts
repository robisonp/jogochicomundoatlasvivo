import Phaser from 'phaser';
import { botaoGrande, engrenagemAdulta, estiloTexto } from '../ui/widgets';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { Player } from '../entities/Player';

export class TitleScene extends Phaser.Scene {
  private chico?: Player;
  private saudou = false;

  constructor() {
    super('Titulo');
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.saudou = false;
    this.add.image(0, 0, 'ceu').setOrigin(0).setDisplaySize(W, H);
    this.add.image(W * 0.8, 120, 'sol');
    this.add.image(W * 0.2, 110, 'nuvem');
    this.add.image(W * 0.62, 70, 'nuvem').setScale(0.7);
    this.add.tileSprite(0, H - 470, W, 320, 'serra').setOrigin(0);
    this.add.tileSprite(0, H - 330, W, 260, 'mata-fundo').setOrigin(0);
    this.add.tileSprite(0, H - 110, W, 110, 'terra').setOrigin(0);
    this.add.tileSprite(0, H - 128, W, 64, 'terra-topo').setOrigin(0);

    // Chico parado, respirando e piscando.
    const chao = this.add.zone(W / 2, H - 64, W, 128);
    this.physics.add.existing(chao, true);
    this.chico = new Player(this, W * 0.3, H - 200);
    this.physics.add.collider(this.chico.sprite, chao);

    this.add.text(W / 2, 120, 'CHICO E O ATLAS VIVO', estiloTexto(64, '#fff4d6')).setOrigin(0.5);
    const atlas = this.add.image(W * 0.72, H - 190, 'atlas').setScale(1.3);
    this.tweens.add({ targets: atlas, y: atlas.y - 12, yoyo: true, repeat: -1, duration: 1200, ease: 'Sine.easeInOut' });

    const jogar = botaoGrande(this, W / 2, H / 2 + 10, 'btn-jogar', () => this.jogar(), 1);
    this.tweens.add({ targets: jogar, scale: 1.08, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

    engrenagemAdulta(this, W - 60, H - 60, () => {
      this.scene.pause();
      this.scene.launch('Adulto', { voltarPara: 'Titulo' });
    });

    // Primeiro toque em qualquer lugar: libera o som e dá boas-vindas.
    this.input.once('pointerdown', () => this.saudar());
    this.input.keyboard?.once('keydown', () => this.saudar());
    this.input.keyboard?.on('keydown-SPACE', () => this.jogar());
    this.input.keyboard?.on('keydown-ENTER', () => this.jogar());
  }

  private saudar() {
    AudioManager.desbloquear();
    if (this.saudou) return;
    this.saudou = true;
    VoiceManager.falar('Oi, Chico! Toque no botão verde para jogar.', 'narrador');
  }

  private jogar() {
    AudioManager.desbloquear();
    // Tela cheia no tablet (se o navegador permitir).
    try {
      if (!this.scale.isFullscreen && this.sys.game.device.input.touch) this.scale.startFullscreen();
    } catch {
      /* ignora */
    }
    this.scene.start('Level', { faseId: 'teste-movimento' });
  }

  update(_t: number, dms: number) {
    this.chico?.update(
      {
        left: false,
        right: false,
        up: false,
        down: false,
        jumpHeld: false,
        jumpPressed: false,
        actionPressed: false,
        powerPressed: false,
        pausePressed: false,
      },
      dms / 1000,
    );
  }
}
