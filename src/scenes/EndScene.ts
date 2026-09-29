import Phaser from 'phaser';
import { botaoGrande, estiloTexto } from '../ui/widgets';

export class EndScene extends Phaser.Scene {
  private dados!: { faseId: string; pegas: number; total: number; tempoMs: number };

  constructor() {
    super('Fim');
  }

  init(data: EndScene['dados']) {
    this.dados = data;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.scene.stop('Hud');
    this.add.rectangle(0, 0, W, H, 0x1d2b3a, 0.6).setOrigin(0).setInteractive();

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

    const recomecar = () => {
      this.scene.stop('Level');
      this.scene.start('Level', { faseId: this.dados.faseId });
    };
    const casa = () => {
      this.scene.stop('Level');
      this.scene.start('Titulo');
    };
    botaoGrande(this, W / 2 - 150, H / 2 + 140, 'btn-denovo', recomecar, 0.8);
    botaoGrande(this, W / 2 + 150, H / 2 + 140, 'btn-casa', casa, 0.8);
  }
}
