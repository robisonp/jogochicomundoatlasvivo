// Controles na tela do tablet: direcional de um lado, botões grandes do outro (lado configurável na área adulta).
import Phaser from 'phaser';
import { touchState } from '../systems/InputManager';
import { SaveManager } from '../core/SaveManager';

type Papel = 'dpad' | 'jump' | 'action' | 'power';

interface Botao {
  papel: Exclude<Papel, 'dpad'>;
  img: Phaser.GameObjects.Image;
  raio: number;
  visivel: boolean;
}

const DPAD_RAIO = 130;
const ZONA_MORTA = 22;

export class TouchControls {
  private dpad: Phaser.GameObjects.Image;
  private setas: Record<'left' | 'right' | 'up' | 'down', Phaser.GameObjects.Image>;
  private botoes: Botao[];
  private ponteiros = new Map<number, Papel>();
  private dpadPonteiro?: Phaser.Input.Pointer;
  readonly ativo: boolean;

  constructor(private scene: Phaser.Scene, opcoes: { poder: boolean }) {
    const params = new URLSearchParams(location.search);
    this.ativo = scene.sys.game.device.input.touch || params.has('toque');
    scene.input.addPointer(3);

    this.dpad = scene.add.image(0, 0, 'dpad-base').setDepth(100);
    const seta = (rot: number) => scene.add.image(0, 0, 'dpad-seta').setRotation(rot).setDepth(101).setAlpha(0.85);
    this.setas = { right: seta(0), down: seta(Math.PI / 2), left: seta(Math.PI), up: seta(-Math.PI / 2) };

    this.botoes = [
      { papel: 'jump', img: scene.add.image(0, 0, 'btn-pular').setDepth(100), raio: 80, visivel: true },
      { papel: 'action', img: scene.add.image(0, 0, 'btn-acao').setDepth(100), raio: 60, visivel: true },
      { papel: 'power', img: scene.add.image(0, 0, 'btn-poder').setDepth(100), raio: 60, visivel: opcoes.poder },
    ];

    this.posicionar();
    this.setVisivel(this.ativo);

    scene.input.on('pointerdown', this.aoTocar, this);
    scene.input.on('pointermove', this.aoMover, this);
    scene.input.on('pointerup', this.aoSoltar, this);
    scene.input.on('pointerupoutside', this.aoSoltar, this);
    scene.scale.on('resize', this.posicionar, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.scale.off('resize', this.posicionar, this);
      this.limpar();
    });
  }

  private setVisivel(v: boolean) {
    this.dpad.setVisible(v);
    Object.values(this.setas).forEach((s) => s.setVisible(v));
    this.botoes.forEach((b) => b.img.setVisible(v && b.visivel));
  }

  posicionar() {
    const { width: W, height: H } = this.scene.scale;
    const dpadDireita = SaveManager.data.settings.controles === 'dpad-direita';
    const lado = (x: number) => (dpadDireita ? x : W - x); // x medido a partir da borda esquerda
    const dx = dpadDireita ? W - 200 : 200;
    const dy = H - 190;
    this.dpad.setPosition(dx, dy);
    this.setas.right.setPosition(dx + 74, dy);
    this.setas.left.setPosition(dx - 74, dy);
    this.setas.up.setPosition(dx, dy - 74);
    this.setas.down.setPosition(dx, dy + 74);

    const [pular, acao, poder] = this.botoes;
    pular.img.setPosition(lado(160), H - 150);
    acao.img.setPosition(lado(345), H - 115);
    poder.img.setPosition(lado(190), H - 345);
  }

  private aoTocar(p: Phaser.Input.Pointer) {
    if (!this.ativo) return;
    // Direcional: área generosa
    if (Phaser.Math.Distance.Between(p.x, p.y, this.dpad.x, this.dpad.y) < DPAD_RAIO * 1.35) {
      this.ponteiros.set(p.id, 'dpad');
      this.dpadPonteiro = p;
      this.atualizar();
      return;
    }
    let melhor: Botao | undefined;
    let melhorD = Infinity;
    for (const b of this.botoes) {
      if (!b.visivel) continue;
      const d = Phaser.Math.Distance.Between(p.x, p.y, b.img.x, b.img.y);
      if (d < b.raio * 1.45 && d < melhorD) {
        melhor = b;
        melhorD = d;
      }
    }
    if (melhor) {
      this.ponteiros.set(p.id, melhor.papel);
      this.atualizar();
    }
  }

  private aoMover(p: Phaser.Input.Pointer) {
    if (this.ponteiros.get(p.id) === 'dpad') this.atualizar();
  }

  private aoSoltar(p: Phaser.Input.Pointer) {
    if (!this.ponteiros.has(p.id)) return;
    if (this.ponteiros.get(p.id) === 'dpad') this.dpadPonteiro = undefined;
    this.ponteiros.delete(p.id);
    this.atualizar();
  }

  private atualizar() {
    touchState.left = touchState.right = touchState.up = touchState.down = false;
    touchState.jump = touchState.action = touchState.power = false;

    for (const papel of this.ponteiros.values()) {
      if (papel === 'jump') touchState.jump = true;
      if (papel === 'action') touchState.action = true;
      if (papel === 'power') touchState.power = true;
    }

    const p = this.dpadPonteiro;
    if (p && p.isDown) {
      const dx = p.x - this.dpad.x;
      const dy = p.y - this.dpad.y;
      if (Math.hypot(dx, dy) > ZONA_MORTA) {
        // Diagonais permitidas: cada eixo conta se não for muito menor que o outro.
        if (Math.abs(dx) > Math.abs(dy) * 0.45) {
          touchState.right = dx > 0;
          touchState.left = dx < 0;
        }
        if (Math.abs(dy) > Math.abs(dx) * 0.45) {
          touchState.down = dy > 0;
          touchState.up = dy < 0;
        }
      }
    }

    // Retorno visual
    for (const [k, s] of Object.entries(this.setas)) {
      const on = touchState[k as keyof typeof touchState];
      s.setAlpha(on ? 1 : 0.6).setScale(on ? 1.2 : 1);
    }
    for (const b of this.botoes) {
      const on = touchState[b.papel];
      b.img.setScale(on ? 0.9 : 1).setAlpha(on ? 1 : 0.85);
    }
  }

  limpar() {
    this.ponteiros.clear();
    this.dpadPonteiro = undefined;
    this.atualizar();
  }
}
