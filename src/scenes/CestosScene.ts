// Minijogo do Araripe (fase 38): dois cestos, "é dinossauro" (pegada verde) e "não é dinossauro" (X vermelho).
// Dossiê: pterossauros e répteis marinhos NÃO eram dinossauros; os passarinhos de hoje SÃO dinossauros.
// Para quem não lê: cada figura é falada, e dá para arrastar a figura OU tocar no cesto.
import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';

interface Item {
  textura: string;
  pergunta: string;
  dino: boolean;
  explicacao: string;
}

const ITENS: Item[] = [
  {
    textura: 'staurikosaurus-hd',
    pergunta: 'E o Staurikosaurus? É dinossauro?',
    dino: true,
    explicacao: 'O Staurikosaurus é um dos dinossauros mais antigos conhecidos!',
  },
  {
    textura: 'pterossauro-hd',
    pergunta: 'E o pterossauro? É dinossauro?',
    dino: false,
    explicacao: 'O pterossauro voava na época dos dinossauros, mas não era um dinossauro!',
  },
  {
    textura: 'asa-branca-hd',
    pergunta: 'E a asa-branca? É dinossauro?',
    dino: true,
    explicacao: 'Os passarinhos de hoje são os dinossauros que ainda vivem!',
  },
  {
    textura: 'reptil-marinho-hd',
    pergunta: 'E este réptil do mar? É dinossauro?',
    dino: false,
    explicacao: 'Os répteis marinhos nadavam na época dos dinossauros, mas não eram dinossauros!',
  },
  {
    textura: 'irritator-hd',
    pergunta: 'E o Irritator? É dinossauro?',
    dino: true,
    explicacao: 'O Irritator era um dinossauro, da família dos espinossaurídeos!',
  },
];

export class CestosScene extends Phaser.Scene {
  private fim!: Record<string, unknown>;
  private indice = 0;
  private carta?: Phaser.GameObjects.Container;
  private cestos: { img: Phaser.GameObjects.Image; dino: boolean }[] = [];
  private travado = false;

  constructor() {
    super('Cestos');
  }

  init(data: { fim: Record<string, unknown> }) {
    this.fim = data.fim;
    this.indice = 0;
    this.cestos = [];
    this.travado = false;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0xf3e6c4).setOrigin(0).setInteractive();
    this.add.rectangle(0, H * 0.72, W, H * 0.28, 0xd9c49a).setOrigin(0);

    const esquerda = this.add.image(W * 0.25, H - 110, 'cesto-dino');
    const direita = this.add.image(W * 0.75, H - 110, 'cesto-nao');
    this.cestos = [
      { img: esquerda, dino: true },
      { img: direita, dino: false },
    ];
    for (const c of this.cestos) {
      c.img.setInteractive({ useHandCursor: true });
      c.img.on('pointerdown', () => this.escolher(c.dino));
    }

    const repetir = this.add.image(60, 58, 'btn-som').setInteractive({ useHandCursor: true });
    repetir.on('pointerdown', () => {
      AudioManager.tocar('botao');
      VoiceManager.repetir();
    });

    VoiceManager.falar('Hora de separar! No cesto verde, quem é dinossauro. No cesto vermelho, quem não é dinossauro.', 'narrador');
    this.time.delayedCall(600, () => this.mostrar());
  }

  private mostrar() {
    const { width: W, height: H } = this.scale;
    const item = ITENS[this.indice];
    const fundo = this.add.image(0, 0, 'carta').setScale(2);
    const img = this.add.image(0, 0, item.textura);
    img.setScale(Math.min((fundo.displayWidth - 40) / img.width, (fundo.displayHeight - 40) / img.height));
    const carta = this.add.container(W / 2, H * 0.36, [fundo, img]).setSize(fundo.displayWidth, fundo.displayHeight);
    carta.setScale(0);
    this.tweens.add({ targets: carta, scale: 1, duration: 350, ease: 'Back.easeOut' });
    carta.setInteractive({ draggable: true, useHandCursor: true });
    carta.on('drag', (_p: Phaser.Input.Pointer, x: number, y: number) => carta.setPosition(x, y));
    carta.on('dragend', () => {
      const alvo = this.cestos.find((c) => Phaser.Math.Distance.Between(carta.x, carta.y, c.img.x, c.img.y) < 170);
      if (alvo) this.escolher(alvo.dino);
      else this.tweens.add({ targets: carta, x: W / 2, y: H * 0.36, duration: 250 });
    });
    carta.on('pointerdown', () => VoiceManager.falar(item.pergunta, 'narrador'));
    this.carta = carta;
    this.travado = false;
    VoiceManager.falar(item.pergunta, 'narrador', true);
  }

  private escolher(dino: boolean) {
    const carta = this.carta;
    if (!carta || this.travado) return;
    const { width: W, height: H } = this.scale;
    const item = ITENS[this.indice];
    const cesto = this.cestos.find((c) => c.dino === dino)!;
    if (dino === item.dino) {
      this.travado = true;
      AudioManager.tocar('certo');
      VoiceManager.falar(`Isso! ${item.explicacao}`, 'narrador');
      this.tweens.add({ targets: cesto.img, scale: { from: 1.15, to: 1 }, duration: 300 });
      this.tweens.add({
        targets: carta,
        x: cesto.img.x,
        y: cesto.img.y - 20,
        scale: 0.25,
        alpha: 0,
        duration: 450,
        ease: 'Quad.easeIn',
        onComplete: () => {
          carta.destroy();
          this.indice++;
          if (this.indice < ITENS.length) this.time.delayedCall(2600, () => this.mostrar());
          else this.terminar();
        },
      });
    } else {
      // sem "errado" feio: explica e a figura volta para tentar de novo
      AudioManager.tocar('quase');
      VoiceManager.falar(`Quase! ${item.explicacao}`, 'narrador');
      this.tweens.add({ targets: carta, x: W / 2, y: H * 0.36, duration: 300 });
      this.tweens.add({ targets: carta, angle: { from: -8, to: 8 }, yoyo: true, repeat: 2, duration: 90, onComplete: () => carta.setAngle(0) });
    }
  }

  private terminar() {
    AudioManager.tocar('vitoria');
    VoiceManager.falar('Muito bem! Você separou tudo como um paleontólogo!', 'narrador', true);
    const { width: W, height: H } = this.scale;
    this.add
      .particles(W / 2, H * 0.3, 'brilho', {
        lifespan: 1600,
        speed: { min: 150, max: 420 },
        angle: { min: 200, max: 340 },
        gravityY: 500,
        scale: { start: 1.6, end: 0.2 },
        tint: [0xff6b6b, 0xffd766, 0x5cc26a, 0x5bb0e8, 0xc77dff],
        emitting: false,
      })
      .explode(80);
    this.time.delayedCall(4200, () => {
      this.scene.launch('Fim', this.fim);
      this.scene.stop();
    });
  }
}
