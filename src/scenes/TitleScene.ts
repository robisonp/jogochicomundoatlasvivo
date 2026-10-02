import Phaser from 'phaser';
import { botaoGrande, engrenagemAdulta, estiloTexto } from '../ui/widgets';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { Player } from '../entities/Player';
import { FAMILIA, type Familiar } from '../data/familia';

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
    // O livro do Atlas abre a coleção de bichos.
    const atlas = this.add.image(W * 0.72, H - 190, 'atlas').setScale(1.3).setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: atlas, y: atlas.y - 12, yoyo: true, repeat: -1, duration: 1200, ease: 'Sine.easeInOut' });
    atlas.on('pointerdown', () => {
      AudioManager.desbloquear();
      AudioManager.tocar('botao');
      this.saudou = true;
      this.scene.start('Atlas');
    });
    // A família do Chico, em pé no chão. Tocar em alguém: a pessoa se apresenta.
    const apresentacao: Record<Familiar, string> = {
      lili: 'Oi, Chico! Eu sou a Vovó Lili. Quando precisar, eu dou uma dica.',
      marcos: 'Oi, Chico! Eu sou o Vovô Marcos. Eu construo escadas e pontes para você.',
      marcela: 'Oi, Chico! Eu sou a Tia Marcela. Fui eu que mandei o Atlas Vivo!',
      robi: 'E aí, Chico! Eu sou o Tio Robi. Aposto que você consegue!',
      july: 'Oi, filho! Eu sou a Mamãe July. Estou sempre aqui para te ajudar!',
      kelly: 'Oi, Chico! Aqui é a Tia Kelly, lá de longe!',
      laura: 'Oi, Chico! Aqui é a Tia Laura, lá de longe!',
    };
    const presentes: Familiar[] = ['july', 'lili', 'marcos', 'marcela', 'robi'];
    presentes.forEach((id, i) => {
      const p = this.add
        .image(W * 0.4 + i * 64, H - 128, 'familia', `corpo-${id}`)
        .setOrigin(0.5, 1)
        .setScale(0.42)
        .setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: p, angle: { from: -2, to: 2 }, yoyo: true, repeat: -1, duration: 900 + i * 130, ease: 'Sine.easeInOut' });
      p.on('pointerdown', () => {
        AudioManager.desbloquear();
        this.saudou = true;
        VoiceManager.falar(apresentacao[id], id);
        this.tweens.add({ targets: p, y: { from: H - 128, to: H - 150 }, yoyo: true, duration: 180 });
      });
    });
    // Tias Kelly e Laura aparecem no Chamador do Atlas, lá em cima
    (['kelly', 'laura'] as Familiar[]).forEach((id, i) => {
      if (FAMILIA[id].presencial) return;
      const tela = this.add.image(0, 0, 'chamador');
      const rosto = this.add.image(0, -8, 'familia', `rosto-${id}`).setScale(0.62);
      const c = this.add.container(W * 0.1 + i * 130, H * 0.45, [tela, rosto]).setScale(0.7).setSize(150, 124);
      c.setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: c, y: c.y - 10, yoyo: true, repeat: -1, duration: 1100 + i * 200, ease: 'Sine.easeInOut' });
      c.on('pointerdown', () => {
        AudioManager.desbloquear();
        this.saudou = true;
        VoiceManager.falar(apresentacao[id], id);
      });
    });

    // A panela abre a Cozinha da Vovó Lili.
    const cozinha = this.add.image(W * 0.86, H - 190, 'btn-cozinha').setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: cozinha, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 1000, ease: 'Sine.easeInOut' });
    cozinha.on('pointerdown', () => {
      AudioManager.desbloquear();
      AudioManager.tocar('botao');
      this.saudou = true;
      this.scene.start('Cozinha');
    });

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
    // Vai para o mapa-múndi: de lá, o botão verde continua de onde parou.
    this.scene.start('Mapa');
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
