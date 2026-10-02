// Fim de fase com bicho novo: a figurinha voa para dentro do Atlas e, depois, uma adivinha só com figuras:
// "Quem sou eu?" — o bicho dá 3 pistas (do dossiê: o que come, como é, o que sabe fazer) e o Chico escolhe
// entre 3 bichos do mesmo mundo.
// Errar só explica e deixa tentar de novo; depois de 2 erros, a figura certa pisca. Nada de pontos ou "errado".
import Phaser from 'phaser';
import { ANIMAIS, comArtigo, entraNaAdivinha, fichaDe, type FichaAnimal } from '../data/animais';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';

export interface DadosRevelacao {
  /** Ids das fichas que entraram no Atlas nesta fase. */
  novos: string[];
  /** Quantas adivinhas fazer (0 nas fases que já têm minijogo). */
  adivinhas: number;
  /** Cena seguinte (minijogo) ou a tela de fim. */
  depois: 'Fim' | 'Cestos' | 'Esqueleto';
  fim: Record<string, unknown>;
}

export class RevelacaoScene extends Phaser.Scene {
  private dados!: DadosRevelacao;
  private livro!: Phaser.GameObjects.Image;
  private itens: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('Revelacao');
  }

  init(data: DadosRevelacao) {
    this.dados = data;
    this.itens = [];
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0x1d2b3a, 0.82).setOrigin(0).setInteractive();
    this.livro = this.add.image(W / 2, H * 0.8, 'atlas').setScale(1.3).setAlpha(0);
    this.tweens.add({ targets: this.livro, alpha: 1, duration: 300 });
    const repetir = this.add.image(60, 58, 'btn-som').setInteractive({ useHandCursor: true });
    repetir.on('pointerdown', () => {
      AudioManager.tocar('botao');
      VoiceManager.repetir();
    });

    const fichas = this.dados.novos.map(fichaDe).filter((f): f is FichaAnimal => !!f);
    this.revelar(fichas, 0, () => {
      const perguntas = fichas.filter(entraNaAdivinha).slice(0, this.dados.adivinhas);
      this.adivinha(perguntas, 0);
    });
  }

  /** Cada figurinha nova aparece grande e voa para dentro do livro. */
  private revelar(fichas: FichaAnimal[], i: number, fim: () => void) {
    if (i >= fichas.length) {
      fim();
      return;
    }
    const { width: W, height: H } = this.scale;
    const f = fichas[i];
    const carta = this.cartaDe(f, 1.7);
    carta.setPosition(W / 2, H * 0.38).setScale(0);
    this.tweens.add({ targets: carta, scale: 1, duration: 450, ease: 'Back.easeOut' });
    this.brilho(W / 2, H * 0.38, 30);
    AudioManager.tocar('pegada');
    VoiceManager.falar(`Nova figurinha no Atlas: ${comArtigo(f)}!`, 'narrador');
    this.time.delayedCall(2600, () => {
      this.tweens.add({
        targets: carta,
        x: this.livro.x,
        y: this.livro.y - 10,
        scale: 0.15,
        alpha: 0.2,
        duration: 600,
        ease: 'Quad.easeIn',
        onComplete: () => {
          carta.destroy();
          AudioManager.tocar('certo');
          this.tweens.add({ targets: this.livro, scale: { from: 1.55, to: 1.3 }, duration: 300, ease: 'Back.easeOut' });
          this.brilho(this.livro.x, this.livro.y - 30, 24);
          this.time.delayedCall(500, () => this.revelar(fichas, i + 1, fim));
        },
      });
    });
  }

  /** "Quem sou eu?": as 3 pistas do bicho e 3 figuras do mesmo mundo. */
  private adivinha(perguntas: FichaAnimal[], i: number) {
    this.itens.forEach((o) => o.destroy());
    this.itens = [];
    if (i >= perguntas.length) {
      this.terminar();
      return;
    }
    const { width: W, height: H } = this.scale;
    const alvo = perguntas[i];
    const outros = Phaser.Utils.Array.Shuffle(
      ANIMAIS.filter((a) => a.mundo === alvo.mundo && a.id !== alvo.id && entraNaAdivinha(a)),
    ).slice(0, 2);
    const opcoes = Phaser.Utils.Array.Shuffle([alvo, ...outros]);
    this.tweens.add({ targets: this.livro, alpha: 0.35, duration: 300 });

    // alto-falante grande: tocar repete as pistas
    const pistas = (inicio: string, enfileirar: boolean) => {
      VoiceManager.falar(inicio, 'narrador', enfileirar);
      for (const p of alvo.pistas ?? []) VoiceManager.falar(p, 'bicho', true);
      VoiceManager.falar('Quem sou eu?', 'narrador', true);
    };
    const falar = () => pistas('Adivinha! Escute as pistas.', false);
    const som = this.add.image(W / 2, H * 0.17, 'btn-som').setScale(1.5).setInteractive({ useHandCursor: true });
    this.tweens.add({ targets: som, scale: 1.65, yoyo: true, repeat: -1, duration: 600, ease: 'Sine.easeInOut' });
    som.on('pointerdown', () => {
      AudioManager.tocar('botao');
      falar();
    });
    this.itens.push(som);

    let erros = 0;
    let respondeu = false;
    const passo = Math.min(330, (W - 200) / 3);
    const cartas = opcoes.map((f, k) => {
      const carta = this.cartaDe(f, 1.25);
      carta.setPosition(W / 2 + (k - 1) * passo, H * 0.55).setScale(0);
      this.tweens.add({ targets: carta, scale: 1, delay: 200 + k * 120, duration: 350, ease: 'Back.easeOut' });
      carta.setSize(200, 175).setInteractive({ useHandCursor: true });
      carta.on('pointerdown', () => {
        if (respondeu || !carta.getData('ativa')) return;
        if (f.id === alvo.id) {
          respondeu = true;
          AudioManager.tocar('certo');
          VoiceManager.falar('Isso!', 'narrador');
          VoiceManager.falar(`Eu sou ${comArtigo(alvo)}!`, 'bicho', true);
          this.tweens.killTweensOf(carta);
          this.tweens.add({ targets: carta, scale: 1.25, x: W / 2, duration: 400, ease: 'Back.easeOut' });
          cartas.forEach((c) => c !== carta && this.tweens.add({ targets: c, alpha: 0, scale: 0.6, duration: 300 }));
          this.brilho(W / 2, H * 0.5, 50);
          this.time.delayedCall(3200, () => this.adivinha(perguntas, i + 1));
        } else {
          erros++;
          carta.setData('ativa', false);
          AudioManager.tocar('quase');
          VoiceManager.falar(`Quase! Esse é ${comArtigo(f)}.`, 'narrador');
          pistas('Escute as pistas de novo.', true);
          this.tweens.add({ targets: carta, angle: { from: -8, to: 8 }, yoyo: true, repeat: 2, duration: 80, onComplete: () => carta.setAngle(0) });
          this.tweens.add({ targets: carta, alpha: 0.4, duration: 300 });
          // depois de 2 erros, a figura certa pisca para ninguém ficar travado
          if (erros >= 2) {
            const certa = cartas[opcoes.indexOf(alvo)];
            this.tweens.add({ targets: certa, scale: 1.12, yoyo: true, repeat: -1, duration: 400, ease: 'Sine.easeInOut' });
          }
        }
      });
      carta.setData('ativa', true).setData('ficha', f.id);
      return carta;
    });
    this.itens.push(...cartas);
    falar();
  }

  private terminar() {
    // depois da adivinha, lembra onde ficam as fichas (sem falar por cima do minijogo que vem depois)
    if (this.dados.depois === 'Fim') VoiceManager.falar('Para ver tudo o que os bichos sabem, toque no livro roxo do mapa!', 'narrador', true);
    this.time.delayedCall(this.dados.depois === 'Fim' ? 900 : 300, () => {
      this.scene.launch(this.dados.depois, { fim: this.dados.fim, ...this.dados.fim });
      this.scene.stop();
    });
  }

  private cartaDe(f: FichaAnimal, escala: number) {
    const fundo = this.add.image(0, 0, 'carta').setScale(escala);
    const img = this.add.image(0, -4, `${f.textura}-hd`);
    img.setScale(Math.min((fundo.displayWidth - 36) / img.width, (fundo.displayHeight - 36) / img.height));
    return this.add.container(0, 0, [fundo, img]);
  }

  private brilho(x: number, y: number, n: number) {
    this.add
      .particles(x, y, 'brilho', {
        lifespan: 900,
        speed: { min: 80, max: 260 },
        scale: { start: 1.2, end: 0 },
        tint: [0xfff1a8, 0xffd766, 0x5cc26a, 0x5bb0e8],
        emitting: false,
      })
      .explode(n);
  }
}
