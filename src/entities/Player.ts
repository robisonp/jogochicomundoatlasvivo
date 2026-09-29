// Chico: corpo físico simples (hitbox menor que o desenho) + visual recortado em partes animadas por código.
import Phaser from 'phaser';
import { PLAYER, BOLA } from '../config';
import type { Intent } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';

type Estado = 'normal' | 'escalando' | 'caido' | 'festa' | 'bola';

export class Player {
  readonly sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  readonly visual: Phaser.GameObjects.Container;
  estado: Estado = 'normal';
  direcao: 1 | -1 = 1;
  /** Poder "Virar bola" liberado (tatu-bola). */
  temPoderBola = false;

  private partes: {
    corpo: Phaser.GameObjects.Image;
    cabeca: Phaser.GameObjects.Container;
    olhos: Phaser.GameObjects.Image;
    bracoFrente: Phaser.GameObjects.Image;
    bracoTras: Phaser.GameObjects.Image;
    pernaFrente: Phaser.GameObjects.Image;
    pernaTras: Phaser.GameObjects.Image;
    mochila: Phaser.GameObjects.Image;
  };
  private coyote = 0;
  private buffer = 0;
  private noChao = false;
  private tempoAnim = 0;
  private proximaPiscada = 2;
  private escadaX: number | null = null;
  // Apoio em plataforma atravessável/móvel neste frame (colisão real, não sobreposição).
  private apoiado = false;
  private squash = 1;
  private poeira: Phaser.GameObjects.Particles.ParticleEmitter;
  private bolaVisual: Phaser.GameObjects.Container;
  private bolaImg: Phaser.GameObjects.Image;
  private bolaTempo = 0;

  constructor(private scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'px');
    this.sprite.setVisible(false);
    this.sprite.body.setSize(PLAYER.bodyWidth, PLAYER.bodyHeight);
    this.sprite.body.setMaxVelocityY(PLAYER.maxFall);
    this.sprite.body.setGravityY(PLAYER.gravity);
    this.sprite.setCollideWorldBounds(false);

    // Montagem do boneco (coordenadas relativas aos pés).
    const pernaTras = scene.add.image(-6, -30, 'chico-perna').setOrigin(0.5, 0.05).setTint(0xd8d8d8);
    const bracoTras = scene.add.image(-4, -58, 'chico-braco').setOrigin(0.5, 0.1).setTint(0xd0d0d0);
    const mochila = scene.add.image(-17, -52, 'chico-mochila');
    const pernaFrente = scene.add.image(6, -30, 'chico-perna').setOrigin(0.5, 0.05);
    const corpo = scene.add.image(0, -48, 'chico-corpo');
    const cabecaImg = scene.add.image(0, 0, 'chico-cabeca');
    const olhos = scene.add.image(8, -4, 'chico-olhos');
    const chapeu = scene.add.image(-2, -24, 'chico-chapeu');
    const cabeca = scene.add.container(2, -90, [cabecaImg, olhos, chapeu]);
    const bracoFrente = scene.add.image(4, -60, 'chico-braco').setOrigin(0.5, 0.1);
    this.visual = scene.add.container(x, y, [pernaTras, bracoTras, mochila, pernaFrente, corpo, cabeca, bracoFrente]);
    this.visual.setDepth(10);
    this.partes = { corpo, cabeca, olhos, bracoFrente, bracoTras, pernaFrente, pernaTras, mochila };

    this.poeira = scene.add.particles(0, 0, 'poeira', {
      lifespan: 380,
      speedX: { min: -90, max: 90 },
      speedY: { min: -120, max: -30 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.8, end: 0 },
      emitting: false,
    });
    this.poeira.setDepth(9);

    // Chico enrolado: bola de carapaça com o chapéu por cima (o chapéu não gira).
    this.bolaImg = scene.add.image(0, 0, 'chico-bola');
    const chapeuBola = scene.add.image(0, -30, 'chico-chapeu').setScale(0.8);
    this.bolaVisual = scene.add.container(x, y, [this.bolaImg, chapeuBola]).setDepth(10).setVisible(false);
  }

  /** Enrolado em bola: espinhos e pedrinhas não machucam. */
  get protegido() {
    return this.estado === 'bola';
  }

  private entrarBola() {
    this.estado = 'bola';
    this.bolaTempo = BOLA.duracaoMs;
    this.visual.setVisible(false);
    this.bolaVisual.setVisible(true).setAlpha(1);
    this.squash = 0.8;
    AudioManager.tocar('bola');
    this.poeira.explode(6, this.x, this.pes);
  }

  private sairBola(comSom = true) {
    if (this.estado !== 'bola') return;
    this.estado = 'normal';
    this.visual.setVisible(true);
    this.bolaVisual.setVisible(false);
    if (comSom) {
      AudioManager.tocar('desbola');
      this.squash = 1.2;
    }
  }

  get x() {
    return this.sprite.x;
  }
  get y() {
    return this.sprite.y;
  }
  get body() {
    return this.sprite.body;
  }
  get pes() {
    return this.sprite.body.bottom;
  }

  /** Chamado pelo collider de lajes/páginas quando o Chico pisa nelas. */
  apoiar() {
    this.apoiado = true;
  }

  /** Chamado pela cena quando o corpo está sobre uma escada neste frame. */
  marcarEscada(x: number | null) {
    this.escadaX = x;
  }

  update(i: Intent, dt: number) {
    const b = this.sprite.body;
    const ms = dt * 1000;

    // Só "blocked" (chão estático) ou apoio real em plataforma: sobreposição com escada não conta como chão.
    const apoiado = this.apoiado;
    this.apoiado = false;

    if (this.estado === 'caido' || this.estado === 'festa') {
      this.animar(dt);
      return;
    }

    const eraNoChao = this.noChao;
    this.noChao = b.blocked.down || apoiado;
    if (this.noChao && !eraNoChao && b.velocity.y >= 0) this.aterrissou();

    // --- Poder "Virar bola": apertar de novo renova o tempo
    if (i.powerPressed && this.temPoderBola) {
      if (this.estado === 'bola') this.bolaTempo = BOLA.duracaoMs;
      else if (this.estado === 'normal') this.entrarBola();
    }
    if (this.estado === 'bola') {
      this.bolaTempo -= ms;
      if (this.bolaTempo <= 0) this.sairBola();
    }
    const enrolado = this.estado === 'bola';

    this.coyote = this.noChao ? PLAYER.coyoteMs : Math.max(0, this.coyote - ms);
    this.buffer = i.jumpPressed ? PLAYER.jumpBufferMs : Math.max(0, this.buffer - ms);

    // --- Escada
    if (this.estado === 'escalando') {
      if (this.escadaX === null) {
        this.soltarEscada(i.up ? -560 : 0);
      } else if (this.buffer > 0) {
        this.buffer = 0;
        this.soltarEscada(-PLAYER.jumpVelocity * 0.85);
        AudioManager.tocar('pulo');
      } else {
        const vy = (i.up ? -1 : 0) + (i.down ? 1 : 0);
        b.setVelocity(0, vy * PLAYER.climbSpeed);
        this.sprite.x = Phaser.Math.Linear(this.sprite.x, this.escadaX, 0.35);
        if (vy !== 0 && Math.floor(this.tempoAnim * 6) !== Math.floor((this.tempoAnim + dt) * 6)) {
          AudioManager.tocar('escalar');
        }
        if (this.noChao && i.down) this.soltarEscada(0);
        if (i.left || i.right) {
          this.direcao = i.left ? -1 : 1;
          if (!i.up && !i.down) this.soltarEscada(0);
        }
        this.animar(dt);
        return;
      }
    } else if (!enrolado && this.escadaX !== null && (i.up || (i.down && !this.noChao))) {
      this.estado = 'escalando';
      b.setAllowGravity(false);
      b.setGravityY(0);
      b.setVelocity(0, 0);
    }

    // --- Corrida horizontal com aceleração suave
    const alvo = (i.right ? 1 : 0) - (i.left ? 1 : 0);
    if (alvo !== 0) this.direcao = alvo as 1 | -1;
    const vx = b.velocity.x;
    const acel = this.noChao
      ? alvo !== 0
        ? PLAYER.groundAccel
        : PLAYER.groundDecel
      : alvo !== 0
        ? PLAYER.airAccel
        : PLAYER.airDecel;
    // Virar de direção é mais rápido que acelerar (resposta imediata).
    const virando = alvo !== 0 && Math.sign(vx) === -alvo;
    const a = virando ? acel * 1.8 : acel;
    let nvx = vx;
    const meta = alvo * PLAYER.maxRun * (enrolado ? BOLA.fatorVelocidade : 1);
    if (nvx < meta) nvx = Math.min(meta, nvx + a * dt);
    else if (nvx > meta) nvx = Math.max(meta, nvx - a * dt);
    b.setVelocityX(nvx);

    // --- Pulo: coyote time + jump buffer + altura variável
    // Enrolado em bola não pula (o tatu-bola fechado não salta).
    if (!enrolado && this.buffer > 0 && this.coyote > 0) {
      b.setVelocityY(-PLAYER.jumpVelocity);
      this.buffer = 0;
      this.coyote = 0;
      this.noChao = false;
      this.squash = 0.8;
      AudioManager.tocar('pulo');
      this.poeira.explode(5, this.x, this.pes);
    }
    if (!i.jumpHeld && b.velocity.y < 0 && !this.noChao) {
      b.setVelocityY(b.velocity.y * PLAYER.jumpCutFactor);
    }

    this.animar(dt);
  }

  private soltarEscada(vy: number) {
    const b = this.sprite.body;
    this.estado = 'normal';
    b.setAllowGravity(true);
    b.setGravityY(PLAYER.gravity);
    b.setVelocityY(vy);
  }

  private aterrissou() {
    this.squash = 1.2;
    AudioManager.tocar('aterrissar');
    this.poeira.explode(6, this.x, this.pes);
  }

  // ---------------------------------------------------------------- animação procedural

  private animar(dt: number) {
    this.tempoAnim += dt;
    const b = this.sprite.body;
    const p = this.partes;
    const v = this.visual;
    v.setPosition(this.sprite.x, b.bottom);
    v.scaleX = this.direcao;

    if (this.estado === 'bola') {
      this.bolaVisual.setPosition(this.sprite.x, b.bottom - 32);
      this.bolaImg.rotation += (b.velocity.x * dt) / 30;
      this.squash = Phaser.Math.Linear(this.squash, 1, Math.min(1, dt * 12));
      this.bolaVisual.scaleY = Phaser.Math.Clamp(this.squash > 1 ? 1 / this.squash : 2 - this.squash, 0.8, 1.2);
      // pisca quando está para abrir
      this.bolaVisual.setAlpha(this.bolaTempo < BOLA.avisoMs && Math.floor(this.tempoAnim * 10) % 2 === 0 ? 0.55 : 1);
      return;
    }

    // piscar
    this.proximaPiscada -= dt;
    if (this.proximaPiscada < 0) {
      p.olhos.setTexture('chico-olhos-fechados');
      if (this.proximaPiscada < -0.12) {
        p.olhos.setTexture('chico-olhos');
        this.proximaPiscada = 2 + Math.random() * 3;
      }
    }

    // squash & stretch volta ao normal
    this.squash = Phaser.Math.Linear(this.squash, 1, Math.min(1, dt * 12));
    const sy = this.squash > 1 ? 1 / this.squash : 2 - this.squash;
    v.scaleY = Phaser.Math.Clamp(sy, 0.8, 1.2);

    const t = this.tempoAnim;
    const velX = Math.abs(b.velocity.x);
    let pernaF = 0;
    let pernaT = 0;
    let bracoF = 0;
    let bracoT = 0;
    let quique = 0;
    let inclinacao = 0;

    if (this.estado === 'festa') {
      bracoF = -2.6 + Math.sin(t * 14) * 0.3;
      bracoT = -2.4 - Math.sin(t * 14) * 0.3;
      quique = -Math.abs(Math.sin(t * 7)) * 18;
    } else if (this.estado === 'caido') {
      bracoF = -2.2;
      bracoT = -2.2;
      pernaF = 0.4;
      pernaT = -0.4;
    } else if (this.estado === 'escalando') {
      const fase = Math.sin(t * 10) * (b.velocity.y !== 0 ? 1 : 0);
      bracoF = -2.8 + fase * 0.4;
      bracoT = -2.8 - fase * 0.4;
      pernaF = fase * 0.5;
      pernaT = -fase * 0.5;
    } else if (!this.noChao) {
      // no ar: pose de pulo ou de queda
      if (b.velocity.y < 0) {
        bracoF = -2.4;
        bracoT = 0.8;
        pernaF = -0.7;
        pernaT = 0.5;
      } else {
        bracoF = -1.8;
        bracoT = -1.4;
        pernaF = 0.3;
        pernaT = -0.3;
      }
    } else if (velX > 20) {
      const freq = 8 + (velX / 340) * 8;
      const amp = 0.5 + (velX / 340) * 0.45;
      const s = Math.sin(t * freq);
      pernaF = s * amp;
      pernaT = -s * amp;
      bracoF = -s * amp * 0.9;
      bracoT = s * amp * 0.9;
      quique = -Math.abs(Math.cos(t * freq)) * 4;
      inclinacao = (velX / 340) * 0.08;
    } else {
      // parado: respiração
      quique = Math.sin(t * 2.5) * 1.2;
      bracoF = 0.1 + Math.sin(t * 2.5) * 0.04;
      bracoT = -0.1;
    }

    p.pernaFrente.rotation = pernaF;
    p.pernaTras.rotation = pernaT;
    p.bracoFrente.rotation = bracoF;
    p.bracoTras.rotation = bracoT;
    p.corpo.y = -48 + quique * 0.6;
    p.mochila.y = -52 + quique * 0.6;
    p.bracoFrente.y = -60 + quique * 0.6;
    p.bracoTras.y = -58 + quique * 0.6;
    p.cabeca.y = -90 + quique;
    v.rotation = inclinacao;
  }

  // ---------------------------------------------------------------- eventos

  cair(onDone: () => void) {
    if (this.estado === 'caido') return;
    this.sairBola(false);
    this.estado = 'caido';
    AudioManager.tocar('ai');
    const b = this.sprite.body;
    b.setAllowGravity(false);
    b.setVelocity(0, 0);
    this.scene.tweens.add({
      targets: this.visual,
      alpha: 0,
      duration: PLAYER.respawnMs * 0.8,
      ease: 'Quad.easeIn',
    });
    this.scene.time.delayedCall(PLAYER.respawnMs, onDone);
  }

  renascer(x: number, y: number) {
    const b = this.sprite.body;
    this.sprite.setPosition(x, y);
    b.reset(x, y);
    b.setAllowGravity(true);
    b.setGravityY(PLAYER.gravity);
    this.estado = 'normal';
    this.visual.setAlpha(1);
    this.visual.setPosition(x, b.bottom);
    this.scene.tweens.add({ targets: this.visual, scaleY: { from: 0.6, to: 1 }, duration: 220, ease: 'Back.easeOut' });
  }

  comemorar() {
    this.estado = 'festa';
    const b = this.sprite.body;
    b.setVelocityX(0);
  }
}
