// Interface por cima da fase: controles de toque, repetir áudio, pausa e contador de pegadas.
import Phaser from 'phaser';
import { TouchControls } from '../ui/TouchControls';
import { VoiceManager } from '../systems/VoiceManager';
import { AudioManager } from '../systems/AudioManager';
import type { LevelScene } from './LevelScene';
import { ehFamiliar } from '../data/familia';

export class HudScene extends Phaser.Scene {
  private level!: LevelScene;
  private controles!: TouchControls;
  private btnSom!: Phaser.GameObjects.Image;
  private btnPausa!: Phaser.GameObjects.Image;
  private iconePegada!: Phaser.GameObjects.Image;
  private textoPegadas!: Phaser.GameObjects.Text;
  private iconeLixo?: Phaser.GameObjects.Image;
  private textoLixo?: Phaser.GameObjects.Text;
  private retrato!: Phaser.GameObjects.Image;
  private sumirRetrato?: Phaser.Time.TimerEvent;

  constructor() {
    super('Hud');
  }

  init(data: { level: LevelScene }) {
    this.level = data.level;
  }

  create() {
    this.controles = new TouchControls(this, { poder: this.level.temPoder });
    const aoGanharPoder = (v: boolean) => this.controles.setPoder(v);
    this.level.events.on('poder', aoGanharPoder);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.level.events.off('poder', aoGanharPoder));

    this.btnSom = this.add.image(0, 0, 'btn-som').setInteractive({ useHandCursor: true });
    this.btnSom.on('pointerdown', () => {
      AudioManager.tocar('botao');
      VoiceManager.repetir();
      this.tweens.add({ targets: this.btnSom, scale: { from: 0.85, to: 1 }, duration: 200 });
    });

    this.btnPausa = this.add.image(0, 0, 'btn-pausa').setInteractive({ useHandCursor: true });
    this.btnPausa.on('pointerdown', () => {
      AudioManager.tocar('botao');
      this.controles.limpar();
      this.level.pausar();
    });

    this.iconePegada = this.add.image(0, 0, 'pegada').setScale(1.1);
    this.textoPegadas = this.add.text(0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '40px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#1d2b3a',
      strokeThickness: 8,
    });
    this.atualizarPegadas(this.level.contarPegadasFase());
    // Lixo da praia (só nas fases que têm)
    const lixo = this.level.contarLixo();
    if (lixo.total > 0) {
      this.iconeLixo = this.add.image(0, 0, 'lixo-garrafa').setScale(0.9);
      this.textoLixo = this.add.text(0, 0, '', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '34px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#1d2b3a',
        strokeThickness: 7,
      });
      const aoLixo = (l: { pegos: number; total: number }) => {
        this.textoLixo?.setText(`${l.pegos}/${l.total}`);
        if (this.iconeLixo) this.tweens.add({ targets: this.iconeLixo, scale: { from: 1.3, to: 0.9 }, duration: 250 });
      };
      aoLixo(lixo);
      this.level.events.on('lixo', aoLixo);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.level.events.off('lixo', aoLixo));
    }
    this.level.events.on('pegadas', this.atualizarPegadas, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.level.events.off('pegadas', this.atualizarPegadas, this));

    // Rosto de quem da família está falando (dicas da Vovó Lili, resgates da Mamãe July, placas...).
    this.retrato = this.add.image(0, 0, 'familia', 'rosto-lili').setVisible(false).setDepth(50);
    const pararDeOuvir = VoiceManager.aoFalar((quem) => {
      if (!ehFamiliar(quem)) {
        this.retrato.setVisible(false);
        return;
      }
      this.retrato.setTexture('familia', `rosto-${quem}`).setVisible(true).setAlpha(1);
      this.tweens.killTweensOf(this.retrato);
      this.tweens.add({ targets: this.retrato, scale: { from: 0.3, to: 0.8 }, duration: 300, ease: 'Back.easeOut' });
      this.tweens.add({ targets: this.retrato, angle: { from: -4, to: 4 }, yoyo: true, repeat: 5, duration: 220, delay: 300 });
      this.sumirRetrato?.remove();
      this.sumirRetrato = this.time.delayedCall(3800, () =>
        this.tweens.add({ targets: this.retrato, alpha: 0, duration: 400, onComplete: () => this.retrato.setVisible(false) }),
      );
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, pararDeOuvir);

    // Momento do bicho: a figura dele cresce no meio da tela e o jogo espera a fala acabar.
    const aoFocar = (d: { textura: string; quadro?: string; x: number; y: number }) => this.focarBicho(d);
    this.level.events.on('foco-bicho', aoFocar);
    // Poder novo: cerimônia com o bicho passando o poder para o Chico
    const aoPoder = (d: { textura: string; titulo: string; instrucao: string; botao: boolean }) => this.cerimoniaPoder(d);
    this.level.events.on('poder-novo', aoPoder);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.level.events.off('foco-bicho', aoFocar);
      this.level.events.off('poder-novo', aoPoder);
    });

    this.posicionar();
    this.scale.on('resize', this.posicionar, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.posicionar, this));
    // Ao voltar da pausa, nenhum botão fica "preso".
    const aoRetomar = () => this.controles.limpar();
    this.events.on(Phaser.Scenes.Events.RESUME, aoRetomar);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.events.off(Phaser.Scenes.Events.RESUME, aoRetomar));
    // Entrando direto numa fase (sem passar pelo título), o primeiro toque ou tecla libera o áudio.
    this.input.on('pointerdown', () => AudioManager.desbloquear());
    this.input.keyboard?.on('keydown', () => AudioManager.desbloquear());
  }

  update() {
    this.controles.setCarga(this.level.cargaPoder);
  }

  private focarBicho(d: { textura: string; quadro?: string; x: number; y: number }) {
    const { width: W, height: H } = this.scale;
    this.controles.limpar();
    // fundo escuro que também segura os toques (ninguém aperta pular ou pausa sem querer)
    const fundo = this.add.rectangle(0, 0, W, H, 0x10202e, 0.6).setOrigin(0).setDepth(40).setAlpha(0).setInteractive();
    this.tweens.add({ targets: fundo, alpha: 1, duration: 250 });
    const carta = this.add.image(0, 0, 'carta').setScale(2.2);
    const img = this.add.image(0, -6, d.textura, d.quadro);
    img.setScale(Math.min((carta.displayWidth - 44) / img.width, (carta.displayHeight - 44) / img.height));
    const cx = W / 2;
    const cy = H * 0.47;
    const cartao = this.add.container(d.x, d.y, [carta, img]).setDepth(41).setScale(0.2);
    this.tweens.add({ targets: cartao, x: cx, y: cy, scale: 1, duration: 500, ease: 'Back.easeOut' });
    // o bicho "fala": a figura balança de leve
    this.tweens.add({ targets: img, angle: { from: -3, to: 3 }, yoyo: true, repeat: -1, duration: 420, delay: 500, ease: 'Sine.easeInOut' });
    this.add
      .particles(cx, cy, 'brilho', {
        lifespan: 800,
        speed: { min: 80, max: 240 },
        scale: { start: 1.2, end: 0 },
        tint: [0xfff1a8, 0xffd766, 0x5cc26a],
        emitting: false,
      })
      .setDepth(42)
      .explode(24);
    // ouvir de novo
    const repetir = this.add.image(cx + carta.displayWidth / 2 + 70, cy, 'btn-som').setDepth(42).setAlpha(0).setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: repetir, alpha: 1, delay: 500, duration: 250 });
    repetir.on('pointerdown', () => {
      AudioManager.tocar('botao');
      VoiceManager.repetir();
    });

    // libera quando a fala acabar (no mínimo 2,2 s de figura na tela; no máximo 30 s, por segurança)
    const inicio = this.time.now;
    let soltou = false;
    const soltar = () => {
      if (soltou) return;
      soltou = true;
      this.time.delayedCall(Math.max(400, 2200 - (this.time.now - inicio)), () => {
        repetir.destroy();
        this.tweens.killTweensOf(img);
        this.tweens.add({ targets: cartao, x: d.x, y: d.y, scale: 0.15, alpha: 0, duration: 380, ease: 'Quad.easeIn', onComplete: () => cartao.destroy() });
        this.tweens.add({
          targets: fundo,
          alpha: 0,
          duration: 380,
          onComplete: () => {
            fundo.destroy();
            this.level.soltarFoco();
          },
        });
      });
    };
    // repetir a fala também espera ela acabar de novo
    const esperar = () => VoiceManager.quandoAcabar(() => (VoiceManager.estaFalando ? esperar() : soltar()));
    this.time.delayedCall(300, esperar);
    this.time.delayedCall(30000, soltar);
  }

  /**
   * Poder novo: o bicho (à esquerda) passa um rio de brilhos para o Chico (à direita), o Chico brilha,
   * aparece o nome do poder e o narrador explica. No fim, o símbolo do poder voa até o botão da pata.
   */
  private cerimoniaPoder(d: { textura: string; titulo: string; instrucao: string; botao: boolean }) {
    const { width: W, height: H } = this.scale;
    this.controles.limpar();
    const itens: Phaser.GameObjects.GameObject[] = [];
    const fundo = this.add.rectangle(0, 0, W, H, 0x10202e, 0.75).setOrigin(0).setDepth(40).setAlpha(0).setInteractive();
    this.tweens.add({ targets: fundo, alpha: 1, duration: 300 });
    itens.push(fundo);

    // o bicho, num cartão
    const bx = W * 0.27;
    const by = H * 0.5;
    const carta = this.add.image(0, 0, 'carta').setScale(1.7);
    const bicho = this.add.image(0, -6, d.textura);
    bicho.setScale(Math.min((carta.displayWidth - 40) / bicho.width, (carta.displayHeight - 40) / bicho.height));
    const cartao = this.add.container(bx, by, [carta, bicho]).setDepth(41).setScale(0);
    this.tweens.add({ targets: cartao, scale: 1, duration: 450, ease: 'Back.easeOut' });
    itens.push(cartao);

    // o Chico, com uma auréola dourada que acende quando o poder chega
    const cx = W * 0.73;
    const cy = H * 0.56;
    const aura = this.add.image(cx, cy - 20, 'aura').setScale(3.2).setTint(0xffd766).setAlpha(0).setDepth(41);
    const chico = this.add.image(cx, cy + 120, 'familia', 'corpo-chico').setOrigin(0.5, 1).setScale(0.62).setDepth(42).setAlpha(0);
    this.tweens.add({ targets: chico, alpha: 1, duration: 400 });
    itens.push(aura, chico);

    // nome do poder lá em cima (para os adultos; o Chico ouve o narrador)
    const titulo = this.add
      .text(W / 2, H * 0.14, d.titulo, { fontFamily: 'system-ui, sans-serif', fontSize: '40px', fontStyle: 'bold', color: '#fff4d6', stroke: '#1d2b3a', strokeThickness: 8, align: 'center', wordWrap: { width: W - 160 } })
      .setOrigin(0.5)
      .setDepth(43)
      .setScale(0);
    itens.push(titulo);

    AudioManager.tocar('poder');
    // o rio de brilhos: do bicho até o Chico
    const rio = this.add
      .particles(bx, by, 'brilho', {
        lifespan: 900,
        speed: { min: 20, max: 60 },
        scale: { start: 1.6, end: 0.4 },
        alpha: { start: 1, end: 0.6 },
        tint: [0xfff1a8, 0xffd766, 0xffffff],
        moveToX: cx,
        moveToY: cy - 40,
        frequency: 25,
        quantity: 2,
      })
      .setDepth(42);
    itens.push(rio);
    this.time.delayedCall(1700, () => {
      rio.stop();
      AudioManager.tocar('vitoria');
      this.cameras.main.flash(250, 255, 240, 170);
      this.tweens.add({ targets: aura, alpha: 0.9, duration: 250 });
      this.tweens.add({ targets: aura, scale: 3.6, yoyo: true, repeat: -1, duration: 500, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: chico, y: chico.y - 26, yoyo: true, repeat: 3, duration: 260, ease: 'Sine.easeOut' });
      this.tweens.add({ targets: titulo, scale: 1, duration: 450, ease: 'Back.easeOut' });
      const estouro = this.add
        .particles(cx, cy - 40, 'brilho', {
          lifespan: 1100,
          speed: { min: 120, max: 360 },
          scale: { start: 1.6, end: 0 },
          tint: [0xfff1a8, 0xffd766, 0x5cc26a, 0x5bb0e8, 0xc77dff],
          emitting: false,
        })
        .setDepth(43);
      estouro.explode(60);
      itens.push(estouro);
      VoiceManager.falar(d.titulo, 'narrador');
      VoiceManager.falar(d.instrucao, 'narrador', true);

      // depois da explicação (pelo menos 3,5 s), o símbolo do poder voa até o botão e o Chico segue
      const inicio = this.time.now;
      let fim = false;
      const terminar = () => {
        if (fim) return;
        fim = true;
        this.time.delayedCall(Math.max(300, 3500 - (this.time.now - inicio)), () => {
          const destino = this.controles.posicaoPoder;
          const simbolo = this.add.image(cx, cy - 60, d.botao ? 'btn-poder' : 'brilho').setDepth(44).setScale(d.botao ? 1.3 : 3);
          itens.push(simbolo);
          const voar = d.botao && destino.visivel;
          this.tweens.add({
            targets: simbolo,
            x: voar ? destino.x : cx,
            y: voar ? destino.y : cy - 60,
            scale: voar ? 1 : 0,
            duration: 650,
            ease: 'Quad.easeInOut',
            onComplete: () => {
              this.tweens.add({ targets: itens, alpha: 0, duration: 300 });
              this.time.delayedCall(320, () => {
                for (const o of itens) o.destroy();
                this.level.liberarDepoisDoPoder();
              });
            },
          });
        });
      };
      const esperar = () => VoiceManager.quandoAcabar(() => (VoiceManager.estaFalando ? esperar() : terminar()));
      this.time.delayedCall(300, esperar);
      this.time.delayedCall(20000, terminar);
    });
  }

  private posicionar() {
    const W = this.scale.width;
    this.btnSom.setPosition(60, 58);
    this.iconePegada.setPosition(140, 58);
    this.textoPegadas.setPosition(172, 34);
    this.btnPausa.setPosition(W - 60, 58);
    this.retrato.setPosition(W / 2, 66);
    this.iconeLixo?.setPosition(140, 124);
    this.textoLixo?.setPosition(172, 104);
  }

  private atualizarPegadas(p: { pegas: number; total: number }) {
    this.textoPegadas.setText(`${p.pegas}/${p.total}`);
    this.tweens.add({ targets: this.iconePegada, scale: { from: 1.5, to: 1.1 }, duration: 250, ease: 'Back.easeOut' });
  }
}
