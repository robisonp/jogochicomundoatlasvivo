// Escalada com as Tias Kelly e Laura, depois de cada mundo. Jogo de memória: algumas agarras piscam numa
// ordem, com uma nota musical cada (subindo, como uma escada de sons). O Chico toca nelas na mesma ordem e sobe.
// Errou: ele escorrega, a corda segura e as tias o descem com calma; a sequência pisca de novo.
// Nunca trava: depois de 2 erros a próxima agarra certa brilha de leve; depois de 4, pisca uma de cada vez.
import Phaser from 'phaser';
import { ajustarTela } from '../core/Tela';
import { SaveManager } from '../core/SaveManager';
import { Player } from '../entities/Player';
import { PEDRA_ALTURA, PEDRA_LARGURA, PEDRA_TOPO, meiaLarguraPedra } from '../art/Escalada';
import { escaladaDe, FALAS_ESCALADA, type Escalada, type Fala } from '../data/escaladas';
import { TEMAS, type MundoId } from '../data/mundos';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { botaoGrande } from '../ui/widgets';

export interface DadosEscalada {
  mundo: MundoId;
  /** Depois do topo: o mapa (mundos 1 a 7) ou a festa final (Mundo 8). */
  depois: 'Mapa' | 'Fim';
  fim?: Record<string, unknown>;
}

interface Agarra {
  img: Phaser.GameObjects.Image;
  aura: Phaser.GameObjects.Image;
  anel: Phaser.GameObjects.Arc;
  x: number;
  y: number;
}

type Estado = 'olhando' | 'vez' | 'movendo' | 'caindo' | 'topo';

export class EscaladaScene extends Phaser.Scene {
  private dados!: DadosEscalada;
  private cfg!: Escalada;
  private chico!: Player;
  private cordas!: Phaser.GameObjects.Graphics;
  private kelly!: Phaser.GameObjects.Image;
  private laura!: Phaser.GameObjects.Image;
  /** Agarras da pedra e a ordem certa (índices em `agarras`): também usados pelos testes automatizados. */
  agarras: Agarra[] = [];
  sequencia: number[] = [];
  passo = 0;
  erros = 0;
  estado: Estado = 'olhando';
  /** Onde o Chico está agora (pés) e qual pose usar. */
  private pos = { x: 0, pes: 0 };
  private pose: 'normal' | 'escalando' | 'caido' | 'festa' = 'normal';
  private movendo = false;
  private chaoY = 0;
  private pedra = { x0: 0, y0: 0, k: 1 };
  private dica?: Phaser.Tweens.Tween;

  constructor() {
    super('Escalada');
  }

  init(data: DadosEscalada) {
    this.dados = data;
    this.cfg = escaladaDe(data.mundo) ?? escaladaDe('caatinga')!;
    this.agarras = [];
    this.sequencia = [];
    this.passo = 0;
    this.erros = 0;
    this.estado = 'olhando';
    this.pose = 'normal';
    this.movendo = false;
    this.dica = undefined;
  }

  create() {
    ajustarTela();
    const { width: W, height: H } = this.scale;
    this.chaoY = H - 96;
    this.cenario(W, H);

    // a pedra, com a base no chão
    const k = Math.min(1, (this.chaoY + 14 - 120) / PEDRA_ALTURA);
    const pedra = this.add.image(W / 2, this.chaoY + 14, `paredao-${this.cfg.mundo}`).setOrigin(0.5, 1).setScale(k).setDepth(2);
    this.pedra = { x0: pedra.x - (PEDRA_LARGURA * k) / 2, y0: pedra.y - PEDRA_ALTURA * k, k };
    // ancoragens no topo, por onde passam as duas cordas
    for (const lado of [-1, 1]) this.add.image(W / 2 + lado * 52 * k, this.pedra.y0 + (PEDRA_TOPO + 10) * k, 'ancora').setDepth(3);

    // as tias, uma de cada lado, segurando as cordas (olhando para a pedra)
    const base = meiaLarguraPedra(PEDRA_ALTURA - 20) * k;
    this.kelly = this.add.image(W / 2 - base - 80, this.chaoY, 'familia', 'corpo-kelly').setOrigin(0.5, 1).setScale(0.5).setDepth(6);
    this.laura = this.add.image(W / 2 + base + 80, this.chaoY, 'familia', 'corpo-laura').setOrigin(0.5, 1).setScale(0.5).setFlipX(true).setDepth(6);
    for (const tia of [this.kelly, this.laura]) {
      const cap = this.add.image(tia.x, tia.y - tia.displayHeight + 14, 'capacete').setScale(0.62).setDepth(6.1);
      tia.setData('capacete', cap);
    }
    this.cordas = this.add.graphics().setDepth(5);

    // o Chico, de capacete, no pé da pedra
    this.chico = new Player(this, W / 2, this.chaoY - 60);
    this.chico.colocarCapacete();
    this.pos = { x: W / 2 - 20, pes: this.chaoY };

    this.criarAgarras();

    // botões: voltar ao mapa, ouvir de novo e olhar a sequência de novo
    botaoGrande(this, 60, 58, 'btn-voltar', () => this.sair('Mapa'), 1).setDepth(30);
    const som = this.add.image(W - 60, 58, 'btn-som').setInteractive({ useHandCursor: true }).setDepth(30);
    som.on('pointerdown', () => {
      AudioManager.tocar('botao');
      VoiceManager.repetir();
    });
    const olhar = this.add.image(W - 60, 168, 'btn-olhar').setInteractive({ useHandCursor: true }).setDepth(30);
    this.tweens.add({ targets: olhar, scale: 1.08, yoyo: true, repeat: -1, duration: 800, ease: 'Sine.easeInOut' });
    olhar.on('pointerdown', () => {
      if (this.estado !== 'vez') return;
      AudioManager.tocar('botao');
      this.mostrarSequencia(() => this.suaVez(false));
    });

    // chegada: as tias falam e depois a sequência pisca
    const primeira = !SaveManager.data.escaladas.length;
    const falas: Fala[] = [...(primeira ? FALAS_ESCALADA.primeiraVez : []), this.cfg.chegada, FALAS_ESCALADA.olhar];
    falas.forEach((f, i) => VoiceManager.falar(f.texto, f.quem, i > 0));
    this.depoisDaFala(() => this.mostrarSequencia(() => this.suaVez(true)), 1200);
  }

  // ------------------------------------------------------------------ montagem

  private cenario(W: number, H: number) {
    const tema = TEMAS[this.cfg.mundo];
    this.add.image(0, 0, tema.ceu).setOrigin(0).setDisplaySize(W, H).setDepth(-10);
    if (tema.solBaixo) this.add.image(W * 0.78, H * 0.42, 'sol').setTint(0xffe0a0).setDepth(-9);
    else if (tema.sol) this.add.image(W * 0.82, 120, 'sol').setDepth(-9);
    if (tema.nuvens) {
      this.add.image(W * 0.16, 110, 'nuvem').setDepth(-9);
      this.add.image(W * 0.66, 70, 'nuvem').setScale(0.7).setDepth(-9);
    }
    tema.fundo.forEach((camada, i) => {
      this.add
        .tileSprite(0, this.chaoY + camada.afundar - camada.altura, W, camada.altura, camada.textura)
        .setOrigin(0)
        .setDepth(-8 + i);
    });
    const [interno, topo] = Object.values(tema.solidos)[0];
    this.add.tileSprite(0, this.chaoY, W, 64, topo).setOrigin(0).setDepth(1);
    this.add.tileSprite(0, this.chaoY + 64, W, H - this.chaoY, interno).setOrigin(0).setDepth(1);
  }

  /** Coordenadas da textura da pedra → tela. */
  private naTela(lx: number, ly: number): [number, number] {
    return [this.pedra.x0 + lx * this.pedra.k, this.pedra.y0 + ly * this.pedra.k];
  }

  /** Sorteia o caminho (de baixo até o topo, em zigue-zague) e espalha as outras agarras pela pedra. */
  private criarAgarras() {
    const { agarras: total, passos } = this.cfg;
    const meio = PEDRA_LARGURA / 2;
    const yBaixo = PEDRA_ALTURA - 72;
    const yAlto = PEDRA_TOPO + 92;
    const locais: { x: number; y: number }[] = [];
    let x = meio + Phaser.Math.Between(-90, 90);
    let dir = Math.random() < 0.5 ? -1 : 1;
    for (let i = 0; i < passos; i++) {
      const y = yBaixo - (i * (yBaixo - yAlto)) / Math.max(1, passos - 1) + Phaser.Math.Between(-10, 10);
      if (i > 0) {
        const limite = meiaLarguraPedra(y) - 55;
        let nx = x + dir * Phaser.Math.Between(80, 150);
        if (Math.abs(nx - meio) > limite) {
          dir = -dir;
          nx = x + dir * Phaser.Math.Between(80, 150);
        }
        x = Phaser.Math.Clamp(nx, meio - limite, meio + limite);
        if (Math.random() < 0.7) dir = -dir;
      }
      locais.push({ x, y });
    }
    // agarras que não são do caminho: longe umas das outras, por toda a pedra
    // (se a pedra ficar cheia, aceita agarras um pouco mais perto, mas nunca uma em cima da outra)
    const longe = (px: number, py: number, d: number) => locais.every((l) => Phaser.Math.Distance.Between(px, py, l.x, l.y) > d);
    for (let tentativa = 0; locais.length < total && tentativa < 6000; tentativa++) {
      const y = Phaser.Math.Between(yAlto - 20, yBaixo + 20);
      const limite = meiaLarguraPedra(y) - 45;
      const px = meio + Phaser.Math.Between(-limite, limite);
      if (longe(px, y, tentativa < 3000 ? 80 : 64)) locais.push({ x: px, y });
    }
    // ordem de criação embaralhada (a primeira agarra criada não é a primeira do caminho)
    const ordem = Phaser.Utils.Array.Shuffle(locais.map((_, i) => i));
    const indiceDe = new Map<number, number>();
    ordem.forEach((localIdx, i) => {
      const l = locais[localIdx];
      const [sx, sy] = this.naTela(l.x, l.y);
      const aura = this.add.image(sx, sy, 'aura').setDepth(3.5).setAlpha(0);
      const anel = this.add.circle(sx, sy, 30).setStrokeStyle(5, 0x5cc26a).setDepth(3.6).setVisible(false);
      const img = this.add.image(sx, sy, 'agarras', String(Phaser.Math.Between(0, 5))).setDepth(4).setAngle(Phaser.Math.Between(-25, 25)).setScale(0);
      img.setInteractive(new Phaser.Geom.Circle(32, 27, 46), Phaser.Geom.Circle.Contains);
      img.on('pointerdown', () => this.tocarAgarra(i));
      // aparecem de baixo para cima: o Chico "olha" a pedra toda
      this.tweens.add({ targets: img, scale: 1, delay: 300 + (PEDRA_ALTURA - l.y) * 2.2, duration: 260, ease: 'Back.easeOut' });
      this.agarras.push({ img, aura, anel, x: sx, y: sy });
      indiceDe.set(localIdx, i);
    });
    this.sequencia = Array.from({ length: passos }, (_, p) => indiceDe.get(p)!);
  }

  // ------------------------------------------------------------------ jogo

  /** Espera as falas acabarem (com um limite de segurança) antes de seguir. */
  private depoisDaFala(fn: () => void, extraMs = 400) {
    let feito = false;
    const seguir = () => {
      if (feito || !this.sys.isActive()) return;
      feito = true;
      this.time.delayedCall(extraMs, fn);
    };
    VoiceManager.quandoAcabar(seguir);
    this.time.delayedCall(30000, seguir);
  }

  /** Pisca as agarras do caminho (todas, ou só a próxima no modo "uma de cada vez"). */
  private mostrarSequencia(fim: () => void) {
    this.estado = 'olhando';
    this.dica?.stop();
    const deUmaEmUma = this.erros >= 4;
    const lista = deUmaEmUma ? [this.passo] : this.sequencia.map((_, i) => i).slice(this.passo);
    const intervalo = this.cfg.piscaMs + 260;
    lista.forEach((p, n) => this.time.delayedCall(n * intervalo, () => this.piscar(this.sequencia[p], p)));
    this.time.delayedCall(lista.length * intervalo + 150, fim);
  }

  private piscar(i: number, passo: number) {
    const a = this.agarras[i];
    AudioManager.nota(passo);
    this.tweens.add({ targets: a.img, scale: { from: 1, to: 1.5 }, yoyo: true, duration: this.cfg.piscaMs / 2, ease: 'Sine.easeInOut' });
    a.aura.setScale(0.6).setAlpha(0).setTint(0xfff6b0);
    this.tweens.add({ targets: a.aura, alpha: 0.95, scale: 1.25, yoyo: true, duration: this.cfg.piscaMs / 2, ease: 'Sine.easeInOut' });
  }

  private suaVez(primeira: boolean) {
    this.estado = 'vez';
    if (primeira && this.erros === 0) {
      VoiceManager.falar(FALAS_ESCALADA.suaVez.texto, FALAS_ESCALADA.suaVez.quem);
      if (!SaveManager.data.escaladas.length) VoiceManager.falar(FALAS_ESCALADA.maoPe.texto, FALAS_ESCALADA.maoPe.quem, true);
    }
    this.mostrarDica();
  }

  /** Depois de 2 erros, a próxima agarra certa brilha de leve enquanto é a vez do Chico. */
  private mostrarDica() {
    this.dica?.stop();
    if (this.erros < 2 || this.passo >= this.sequencia.length) return;
    const a = this.agarras[this.sequencia[this.passo]];
    a.aura.setTint(0xffffff).setScale(0.9).setAlpha(0);
    this.dica = this.tweens.add({ targets: a.aura, alpha: 0.45, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
  }

  /** Toque numa agarra (também usado pelos testes automatizados). */
  tocarAgarra(i: number) {
    if (this.estado !== 'vez') return;
    const a = this.agarras[i];
    if (i === this.sequencia[this.passo]) {
      this.dica?.stop();
      a.aura.setAlpha(0);
      AudioManager.nota(this.passo);
      AudioManager.tocar('escalar');
      a.anel.setVisible(true);
      this.tweens.add({ targets: a.img, scale: { from: 1.35, to: 1 }, duration: 250 });
      this.passo++;
      // as mãos chegam na agarra: os pés ficam um pouco abaixo dela
      this.moverChico(a.x - 6, Math.min(this.chaoY, a.y + 104), 650, () => {
        if (this.passo >= this.sequencia.length) this.chegarNoTopo();
        else if (this.erros >= 4) this.mostrarSequencia(() => this.suaVez(false));
        else this.suaVez(false);
      });
    } else {
      AudioManager.tocar('quase');
      this.tweens.add({ targets: a.img, angle: a.img.angle + 14, yoyo: true, repeat: 2, duration: 70 });
      this.cair();
    }
  }

  private moverChico(x: number, pes: number, duracao: number, fim: () => void) {
    this.estado = 'movendo';
    this.pose = 'escalando';
    this.movendo = true;
    this.tweens.add({
      targets: this.pos,
      x,
      pes,
      duration: duracao,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.movendo = false;
        fim();
      },
    });
  }

  /** Errou: escorrega, a corda segura, ele balança e as tias o descem até o chão. */
  private cair() {
    this.estado = 'caindo';
    this.dica?.stop();
    const fala = FALAS_ESCALADA.caiu[this.erros % 2];
    this.erros++;
    this.pose = 'caido';
    this.movendo = false;
    const subiu = this.pos.pes < this.chaoY - 5;
    VoiceManager.falar(fala.texto, fala.quem);
    if (this.erros === 2) VoiceManager.falar(FALAS_ESCALADA.dica.texto, FALAS_ESCALADA.dica.quem, true);
    if (this.erros === 4) VoiceManager.falar(FALAS_ESCALADA.passoAPasso.texto, FALAS_ESCALADA.passoAPasso.quem, true);
    const x0 = this.pos.x;
    // escorregão curto, balanço na corda e a descida devagar
    this.tweens.add({ targets: this.pos, pes: this.pos.pes + (subiu ? 26 : 0), duration: 180, ease: 'Quad.easeIn' });
    this.tweens.addCounter({
      from: 0,
      to: 1,
      delay: 200,
      duration: subiu ? 1500 : 600,
      ease: 'Sine.easeInOut',
      onUpdate: (tw) => {
        const t = tw.getValue() ?? 0;
        this.pos.x = Phaser.Math.Linear(x0, this.scale.width / 2 - 20, t) + Math.sin(t * Math.PI * 4) * 16 * (1 - t);
      },
    });
    this.tweens.add({
      targets: this.pos,
      pes: this.chaoY,
      delay: 380,
      duration: subiu ? 1300 : 300,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.pose = 'normal';
        this.passo = 0;
        for (const a of this.agarras) a.anel.setVisible(false);
        this.depoisDaFala(() => this.mostrarSequencia(() => this.suaVez(false)), 500);
      },
    });
    // as tias seguram firme: puxam a corda
    for (const tia of [this.kelly, this.laura]) this.tweens.add({ targets: tia, angle: tia.flipX ? 6 : -6, yoyo: true, duration: 300 });
  }

  private chegarNoTopo() {
    const [, topoY] = this.naTela(0, PEDRA_TOPO + 6);
    this.moverChico(this.scale.width / 2, topoY, 700, () => {
      this.estado = 'topo';
      this.pose = 'festa';
      AudioManager.tocar('vitoria');
      SaveManager.conquistar('escaladas', this.cfg.mundo);
      const { width: W, height: H } = this.scale;
      this.add
        .particles(W / 2, topoY - 120, 'brilho', {
          lifespan: 1600,
          speed: { min: 150, max: 420 },
          angle: { min: 200, max: 340 },
          gravityY: 500,
          scale: { start: 1.6, end: 0.2 },
          tint: [0xff6b6b, 0xffd766, 0x5cc26a, 0x5bb0e8, 0xc77dff],
          emitting: false,
        })
        .setDepth(20)
        .explode(80);
      // as tias pulam de alegria
      for (const tia of [this.kelly, this.laura]) {
        const cap = tia.getData('capacete') as Phaser.GameObjects.Image;
        this.tweens.add({ targets: [tia, cap], y: '-=24', yoyo: true, repeat: 5, duration: 260, ease: 'Sine.easeOut' });
      }
      const falas = [FALAS_ESCALADA.chegou, this.cfg.topo, this.cfg.licao, FALAS_ESCALADA.mosquetao];
      falas.forEach((f, i) => VoiceManager.falar(f.texto, f.quem, i > 0));
      // o mosquetão da pedra aparece grande e brilhando
      this.time.delayedCall(1200, () => {
        const m = this.add.image(W / 2 + 240, H * 0.42, 'mosquetao').setTint(this.cfg.cor).setDepth(25).setScale(0);
        this.tweens.add({ targets: m, scale: 1.1, angle: { from: -40, to: 10 }, duration: 600, ease: 'Back.easeOut' });
        this.tweens.add({ targets: m, angle: -10, yoyo: true, repeat: -1, delay: 600, duration: 700, ease: 'Sine.easeInOut' });
        this.add.image(W / 2 + 240, H * 0.42, 'brilho').setScale(6).setTint(0xfff1a8).setAlpha(0.5).setDepth(24);
      });
      this.depoisDaFala(() => this.sair(this.dados.depois), 1500);
    });
  }

  private sair(destino: 'Mapa' | 'Fim') {
    VoiceManager.calar();
    if (destino === 'Fim' && this.dados.fim) this.scene.start('Fim', this.dados.fim);
    else this.scene.start('Mapa');
  }

  update(_t: number, dms: number) {
    this.chico.poseManual(this.pos.x, this.pos.pes, this.pose, this.movendo, dms / 1000);
    // cordas: da mão de cada tia até a ancoragem no topo e de lá até a cintura do Chico
    const g = this.cordas.clear();
    const { width: W } = this.scale;
    const ancY = this.pedra.y0 + (PEDRA_TOPO + 10) * this.pedra.k;
    const cintura = { x: this.pos.x, y: this.pos.pes - 50 };
    const cordas: [Phaser.GameObjects.Image, number, number][] = [
      [this.kelly, W / 2 - 52 * this.pedra.k, 0xf08a3a],
      [this.laura, W / 2 + 52 * this.pedra.k, 0x7c4fb8],
    ];
    for (const [tia, ax, cor] of cordas) {
      const mao = { x: tia.x + (tia.flipX ? -16 : 16), y: tia.y - 62 };
      for (const [larg, c] of [
        [7, 0x2a1c14],
        [3.5, cor],
      ] as const) {
        g.lineStyle(larg, c, 1);
        g.beginPath();
        g.moveTo(mao.x, mao.y);
        g.lineTo(ax, ancY);
        g.lineTo(cintura.x, cintura.y);
        g.strokePath();
      }
    }
  }
}
