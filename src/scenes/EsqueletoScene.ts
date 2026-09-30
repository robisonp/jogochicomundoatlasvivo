// Minijogo do Rio Grande do Sul (fase 39): montar o esqueleto do Buriolestes em 5 peças.
// Dossiê: um exemplar foi encontrado quase completo e articulado, onde hoje fica São João do Polêsine (RS).
// Peças: crânio; coluna e costelas; braços; bacia; pernas e cauda. Tocar numa peça diz o nome dela.
import Phaser from 'phaser';
import { ESQUELETO_ALTURA, ESQUELETO_LARGURA, PECAS_ESQUELETO } from '../art/Dinossauros';
import { SaveManager } from '../core/SaveManager';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';

export class EsqueletoScene extends Phaser.Scene {
  private fim!: Record<string, unknown>;
  private encaixadas = 0;
  /** Peças e onde cada uma se encaixa (também usado pelos testes automatizados). */
  pecas: { id: string; img: Phaser.GameObjects.Image; alvoX: number; alvoY: number }[] = [];

  constructor() {
    super('Esqueleto');
  }

  init(data: { fim: Record<string, unknown> }) {
    this.fim = data.fim;
    this.encaixadas = 0;
    this.pecas = [];
  }

  create() {
    const { width: W, height: H } = this.scale;
    // sítio de escavação: areia com a grade de cordinhas dos paleontólogos
    this.add.rectangle(0, 0, W, H, 0xe6d3a6).setOrigin(0).setInteractive();
    const grade = this.add.graphics().lineStyle(2, 0xc9a86a, 0.8);
    for (let x = 0; x < W; x += 80) grade.lineBetween(x, 0, x, H);
    for (let y = 0; y < H; y += 80) grade.lineBetween(0, y, W, y);
    this.add.rectangle(0, H * 0.74, W, H * 0.26, 0xcdb487).setOrigin(0);

    const k = Math.min(1.25, (W * 0.8) / ESQUELETO_LARGURA, (H * 0.55) / ESQUELETO_ALTURA);
    const cx = W / 2;
    const cy = H * 0.38;
    const x0 = cx - (ESQUELETO_LARGURA * k) / 2;
    const y0 = cy - (ESQUELETO_ALTURA * k) / 2;
    this.add.image(cx, cy, 'esqueleto-contorno').setScale(k);

    const repetir = this.add.image(60, 58, 'btn-som').setInteractive({ useHandCursor: true });
    repetir.on('pointerdown', () => {
      AudioManager.tocar('botao');
      VoiceManager.repetir();
    });

    // peças espalhadas na bandeja, fora de ordem
    const ordem = [3, 0, 4, 1, 2];
    ordem.forEach((indice, i) => {
      const p = PECAS_ESQUELETO[indice];
      const alvoX = x0 + (p.x + p.w / 2) * k;
      const alvoY = y0 + (p.y + p.h / 2) * k;
      const escalaBandeja = Math.min(k, (W / 5 - 20) / p.w, (H * 0.22) / p.h);
      const bx = (W / 5) * (i + 0.5);
      const by = H * 0.87;
      const img = this.add.image(bx, by, `osso-${p.id}`).setScale(escalaBandeja).setAngle(i % 2 ? -8 : 8);
      img.setInteractive({ draggable: true, useHandCursor: true });
      this.pecas.push({ id: p.id, img, alvoX, alvoY });
      img.on('pointerdown', () => {
        VoiceManager.falar(`Este é ${p.nome}.`, 'narrador');
        this.tweens.add({ targets: img, scale: k, angle: 0, duration: 150 });
        img.setDepth(5);
      });
      img.on('drag', (_ptr: Phaser.Input.Pointer, x: number, y: number) => img.setPosition(x, y));
      img.on('dragend', () => {
        if (Phaser.Math.Distance.Between(img.x, img.y, alvoX, alvoY) < 90 * k) {
          img.disableInteractive();
          this.tweens.add({ targets: img, x: alvoX, y: alvoY, scale: k, angle: 0, duration: 200, ease: 'Back.easeOut' });
          AudioManager.tocar('encaixe');
          this.encaixadas++;
          if (this.encaixadas === PECAS_ESQUELETO.length) this.time.delayedCall(400, () => this.completo(cx, cy));
          else VoiceManager.falar(`Isso! ${p.nome.charAt(0).toUpperCase()}${p.nome.slice(1)} no lugar!`, 'narrador');
        } else {
          this.tweens.add({ targets: img, x: bx, y: by, scale: escalaBandeja, angle: i % 2 ? -8 : 8, duration: 280 });
        }
      });
    });

    VoiceManager.falar(
      'Os cientistas acharam um esqueleto quase completo no Rio Grande do Sul! Arraste cada osso para o lugar certo.',
      'narrador',
    );
  }

  private completo(cx: number, cy: number) {
    AudioManager.tocar('vitoria');
    SaveManager.conquistar('animais', 'buriolestes');
    VoiceManager.falar('Você montou o esqueleto do Buriolestes!', 'narrador');
    VoiceManager.falar('Meu esqueleto foi encontrado quase completo!', 'bicho', true);
    // o Atlas Vivo mostra como ele era, embaixo, na bandeja (que ficou vazia)
    const { height: H } = this.scale;
    const vivo = this.add.image(cx, H * 0.87, 'buriolestes-hd').setAlpha(0);
    vivo.setScale((H * 0.22) / vivo.height);
    this.tweens.add({ targets: vivo, alpha: 1, delay: 1200, duration: 900 });
    this.tweens.add({ targets: vivo, y: vivo.y - 8, yoyo: true, repeat: -1, delay: 2100, duration: 500, ease: 'Sine.easeInOut' });
    this.add
      .particles(cx, cy, 'brilho', {
        lifespan: 1600,
        speed: { min: 150, max: 420 },
        angle: { min: 200, max: 340 },
        gravityY: 500,
        scale: { start: 1.6, end: 0.2 },
        tint: [0xff6b6b, 0xffd766, 0x5cc26a, 0x5bb0e8, 0xc77dff],
        emitting: false,
      })
      .setDepth(10)
      .explode(80);
    this.time.delayedCall(5200, () => {
      this.scene.launch('Fim', this.fim);
      this.scene.stop();
    });
  }
}
