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
