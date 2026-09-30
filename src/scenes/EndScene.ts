import Phaser from 'phaser';
import { botaoGrande, estiloTexto } from '../ui/widgets';
import type { Familiar } from '../data/familia';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';

export class EndScene extends Phaser.Scene {
  private dados!: { faseId: string; proximaId?: string; selo?: string; final?: boolean; pegas: number; total: number; tempoMs: number };

  constructor() {
    super('Fim');
  }

  init(data: EndScene['dados']) {
    this.dados = data;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.scene.stop('Hud');
    this.add.rectangle(0, 0, W, H, 0x1d2b3a, 0.6).setOrigin(0).setInteractive().setDepth(-2);

    // Selo do mundo conquistado: aparece girando no alto da tela.
    if (this.dados.selo) {
      const selo = this.add.image(W / 2, H / 2 - 265, this.dados.selo).setScale(0);
      this.tweens.add({ targets: selo, scale: 1, angle: 360, duration: 900, ease: 'Back.easeOut' });
    }

    // Pegadas encontradas, mostradas como ícones (sem precisar ler números).
    const { pegas, total } = this.dados;
    const porLinha = Math.min(total, 12);
    const esp = 64;
    for (let i = 0; i < total; i++) {
      const linha = Math.floor(i / porLinha);
      const col = i % porLinha;
      const x = W / 2 - ((porLinha - 1) * esp) / 2 + col * esp;
      const y = H / 2 - 170 + linha * esp;
      const img = this.add.image(x, y, 'pegada').setScale(1.2).setAlpha(i < pegas ? 1 : 0.25);
      if (i < pegas) {
        img.setScale(0);
        this.tweens.add({ targets: img, scale: 1.2, delay: 100 + i * 70, duration: 250, ease: 'Back.easeOut' });
      }
    }
    this.add.text(W / 2, H / 2 - 60 + Math.floor((total - 1) / porLinha) * esp, `${pegas}/${total}`, estiloTexto(40)).setOrigin(0.5);

    if (this.dados.final) this.festaFinal(W, H);

    const recomecar = () => {
      this.scene.stop('Level');
      this.scene.start('Level', { faseId: this.dados.faseId });
    };
    const casa = () => {
      this.scene.stop('Level');
      this.scene.start('Titulo');
    };
    const proxima = this.dados.proximaId;
    if (proxima) {
      // Seguir em frente é a ação principal: botão verde grande no meio.
      // Fim de um mundo (selo): vai para o mapa ver a viagem até o próximo mundo.
      const seguir = () => {
        this.scene.stop('Level');
        if (this.dados.selo) this.scene.start('Mapa');
        else this.scene.start('Level', { faseId: proxima });
      };
      const b = botaoGrande(this, W / 2, H / 2 + 150, 'btn-jogar', seguir, 0.9);
      this.tweens.add({ targets: b, scale: 0.98, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
      botaoGrande(this, W / 2 - 250, H / 2 + 160, 'btn-denovo', recomecar, 0.65);
      botaoGrande(this, W / 2 + 250, H / 2 + 160, 'btn-casa', casa, 0.65);
    } else {
      // na festa final, os botões sobem para a família caber embaixo
      const yb = this.dados.final ? H / 2 + 90 : H / 2 + 140;
      botaoGrande(this, W / 2 - 150, yb, 'btn-denovo', recomecar, 0.8);
      botaoGrande(this, W / 2 + 150, yb, 'btn-casa', casa, 0.8);
    }
  }

  /** Fim do jogo: a família inteira comemora (Kelly e Laura pelo Chamador do Atlas). */
  private festaFinal(W: number, H: number) {
    const presentes: Familiar[] = ['lili', 'marcos', 'july', 'marcela', 'robi'];
    presentes.forEach((id, i) => {
      const x = W / 2 + (i - 2) * 110;
      // desenhada antes do texto do placar: misturar texto e a folha da família no mesmo lote cortava as figuras
      const p = this.add.image(x, H + 10, 'familia', `corpo-${id}`).setOrigin(0.5, 1).setScale(0.38).setDepth(-1);
      this.tweens.add({ targets: p, y: H - 4, delay: 300 + i * 150, duration: 500, ease: 'Back.easeOut' });
      this.tweens.add({ targets: p, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, delay: 900, duration: 400 + i * 60 });
    });
    (['kelly', 'laura'] as Familiar[]).forEach((id, i) => {
      const tela = this.add.image(0, 0, 'chamador');
      const rosto = this.add.image(0, -8, 'familia', `rosto-${id}`).setScale(0.62);
      const c = this.add.container(i ? W - 110 : 110, H * 0.5, [tela, rosto]).setScale(0).setDepth(-1);
      this.tweens.add({ targets: c, scale: 0.8, delay: 1200 + i * 200, duration: 400, ease: 'Back.easeOut' });
    });
    for (let k = 0; k < 6; k++) {
      this.time.delayedCall(400 + k * 700, () =>
        this.add
          .particles(Phaser.Math.Between(100, W - 100), H * 0.2, 'brilho', {
            lifespan: 1600,
            speed: { min: 150, max: 380 },
            gravityY: 500,
            scale: { start: 1.4, end: 0.2 },
            tint: [0xff6b6b, 0xffd766, 0x5cc26a, 0x5bb0e8, 0xc77dff],
            emitting: false,
          })
          .explode(40),
      );
    }
    AudioManager.tocar('vitoria');
    VoiceManager.falar('Parabéns, Chico! Você completou o Atlas Vivo!', 'narrador', true);
    VoiceManager.falar('Estamos muito orgulhosos de você, filho!', 'july', true);
    VoiceManager.falar('O mundo inteiro cabe no seu Atlas. E ainda tem muito para descobrir!', 'marcela', true);
  }
}
