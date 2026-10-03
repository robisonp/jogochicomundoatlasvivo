// Menu de entrada: o letreiro do jogo cai do céu, o botão COMEÇAR pulsa e a família espera no chão.
// COMEÇAR leva ao mapa-múndi (que continua de onde parou). O livro abre o Atlas e a panela, a Cozinha da Vovó.
// No celular, COMEÇAR também liga a tela cheia e trava a tela deitada (quando o navegador deixa).
import Phaser from 'phaser';
import { engrenagemAdulta, estiloTexto } from '../ui/widgets';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { Player } from '../entities/Player';
import { FAMILIA, type Familiar } from '../data/familia';
import { ajustarTela } from '../core/Tela';

export class TitleScene extends Phaser.Scene {
  private chico?: Player;
  private saudou = false;
  private saindo = false;
  private nuvens: { img: Phaser.GameObjects.Image; v: number }[] = [];

  constructor() {
    super('Titulo');
  }

  create() {
    ajustarTela();
    const { width: W, height: H } = this.scale;
    this.saudou = false;
    this.saindo = false;
    this.nuvens = [];
    this.cameras.main.fadeIn(350, 29, 43, 58);

    this.add.image(0, 0, 'ceu').setOrigin(0).setDisplaySize(W, H);
    const sol = this.add.image(W * 0.86, 110, 'sol');
    this.tweens.add({ targets: sol, angle: 360, duration: 40000, repeat: -1 });
    for (const [x, y, s, v] of [
      [0.12, 96, 1, 14],
      [0.55, 64, 0.7, 9],
      [0.8, 250, 0.55, 20],
    ]) {
      this.nuvens.push({ img: this.add.image(W * x, y, 'nuvem').setScale(s), v });
    }
    this.add.tileSprite(0, H - 470, W, 320, 'serra').setOrigin(0);
    this.add.tileSprite(0, H - 330, W, 260, 'mata-fundo').setOrigin(0);
    this.add.tileSprite(0, H - 110, W, 110, 'terra').setOrigin(0);
    this.add.tileSprite(0, H - 128, W, 64, 'terra-topo').setOrigin(0);
    this.time.addEvent({ delay: 6500, loop: true, startAt: 3500, callback: () => this.passaroVoando() });

    // Chico parado, respirando e piscando.
    const chao = this.add.zone(W / 2, H - 64, W * 3, 128);
    this.physics.add.existing(chao, true);
    this.chico = new Player(this, W * 0.3, H - 200);
    this.physics.add.collider(this.chico.sprite, chao);

    // Letreiro: cai do céu e fica balançando de leve
    const logo = this.add.image(W / 2, -180, 'logo').setScale(0.82);
    this.tweens.add({
      targets: logo,
      y: 148,
      duration: 900,
      ease: 'Bounce.easeOut',
      onComplete: () => this.tweens.add({ targets: logo, y: 140, angle: { from: -1, to: 1 }, yoyo: true, repeat: -1, duration: 1800, ease: 'Sine.easeInOut' }),
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
      // chegam pulando, um de cada vez
      p.setY(H + 40);
      this.tweens.add({ targets: p, y: H - 128, delay: 300 + i * 110, duration: 420, ease: 'Back.easeOut' });
      this.tweens.add({ targets: p, angle: { from: -2, to: 2 }, yoyo: true, repeat: -1, duration: 900 + i * 130, ease: 'Sine.easeInOut' });
      p.on('pointerdown', () => {
        AudioManager.desbloquear();
        this.saudou = true;
        VoiceManager.falar(apresentacao[id], id);
        this.tweens.add({ targets: p, y: { from: H - 128, to: H - 150 }, yoyo: true, duration: 180 });
      });
    });
    // Tias Kelly e Laura aparecem no Chamador do Atlas, do lado do letreiro
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

    // O livro do Atlas e a panela da Cozinha, com o nome numa plaquinha (para os adultos)
    this.atalho(W * 0.72, H - 190, 'atlas', 1.3, 'Atlas', 0, () => this.scene.start('Atlas'));
    this.atalho(W * 0.86, H - 190, 'btn-cozinha', 1, 'Cozinha', 150, () => this.scene.start('Cozinha'));

    // COMEÇAR: aparece depois do letreiro e fica pulsando
    const comecar = this.add.image(W / 2, H * 0.5 + 34, 'btn-comecar').setScale(0).setInteractive({ useHandCursor: true });
    this.tweens.add({
      targets: comecar,
      scale: 1,
      delay: 650,
      duration: 450,
      ease: 'Back.easeOut',
      onComplete: () => this.tweens.add({ targets: comecar, scale: 1.06, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' }),
    });
    comecar.on('pointerdown', () => {
      this.tweens.killTweensOf(comecar);
      this.tweens.add({ targets: comecar, scale: { from: 0.88, to: 1.04 }, duration: 160 });
      this.comecar();
    });

    engrenagemAdulta(this, W - 60, H - 60, () => {
      this.scene.pause();
      this.scene.launch('Adulto', { voltarPara: 'Titulo' });
    });

    // Primeiro toque em qualquer lugar: libera o som e dá boas-vindas.
    this.input.once('pointerdown', () => this.saudar());
    this.input.keyboard?.once('keydown', () => this.saudar());
    this.input.keyboard?.on('keydown-SPACE', () => this.comecar());
    this.input.keyboard?.on('keydown-ENTER', () => this.comecar());
  }

  private atalho(x: number, y: number, textura: string, escala: number, nome: string, atraso: number, abrir: () => void) {
    const img = this.add.image(x, y, textura).setScale(escala).setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: img, y: y - 12, yoyo: true, repeat: -1, delay: atraso, duration: 1200, ease: 'Sine.easeInOut' });
    this.add.image(x, y + 84, 'plaquinha');
    this.add.text(x, y + 84, nome, estiloTexto(22, '#fff4d6')).setOrigin(0.5);
    img.on('pointerdown', () => {
      if (this.saindo) return;
      AudioManager.desbloquear();
      AudioManager.tocar('botao');
      this.saudou = true;
      abrir();
    });
  }

  /** Um passarinho (ou a arara) atravessa o céu de vez em quando. */
  private passaroVoando() {
    const { width: W } = this.scale;
    const daEsquerda = Math.random() < 0.5;
    const textura = Math.random() < 0.7 ? 'asa-branca' : 'arara';
    const y = Phaser.Math.Between(200, 280);
    const ave = this.add.image(daEsquerda ? -60 : W + 60, y, textura).setScale(0.9).setFlipX(!daEsquerda);
    this.tweens.add({ targets: ave, x: daEsquerda ? W + 60 : -60, duration: 7000, onComplete: () => ave.destroy() });
    this.tweens.add({ targets: ave, y: y - 24, yoyo: true, repeat: 6, duration: 500, ease: 'Sine.easeInOut' });
  }

  private saudar() {
    AudioManager.desbloquear();
    if (this.saudou) return;
    this.saudou = true;
    VoiceManager.falar('Oi, Chico! Toque no botão verde para jogar.', 'narrador');
  }

  private comecar() {
    if (this.saindo) return;
    this.saindo = true;
    this.saudou = true;
    AudioManager.desbloquear();
    AudioManager.tocar('botao');
    // Tela cheia e tela deitada no celular/tablet (se o navegador permitir).
    try {
      if (!this.scale.isFullscreen && this.sys.game.device.input.touch) {
        this.scale.once(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
          const orientacao = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
          orientacao?.lock?.('landscape').catch(() => {});
        });
        this.scale.startFullscreen();
      }
    } catch {
      /* ignora */
    }
    // O Chico sai correndo para a aventura e a tela escurece até o mapa-múndi.
    this.time.delayedCall(550, () => {
      this.cameras.main.fadeOut(450, 29, 43, 58);
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('Mapa'));
    });
  }

  update(_t: number, dms: number) {
    const { width: W } = this.scale;
    for (const n of this.nuvens) {
      n.img.x += (n.v * dms) / 1000;
      if (n.img.x - n.img.displayWidth / 2 > W) n.img.x = -n.img.displayWidth / 2;
    }
    this.chico?.update(
      {
        left: false,
        right: this.saindo,
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
