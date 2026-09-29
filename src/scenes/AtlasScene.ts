// Atlas Vivo: coleção dos bichos encontrados. Funciona por símbolos e voz (a criança não precisa ler).
// Página esquerda: figurinhas do mundo e o selo. Página direita: ficha do bicho escolhido.
import Phaser from 'phaser';
import { SaveManager } from '../core/SaveManager';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { ANIMAIS, MUNDOS_ATLAS, type FichaAnimal } from '../data/animais';

const TINTA = '#4a3520';
const TINTA_CLARA = '#8a7a5a';
const estiloPagina = (tamanho: number, cor = TINTA): Phaser.Types.GameObjects.Text.TextStyle => ({
  fontFamily: 'system-ui, sans-serif',
  fontSize: `${tamanho}px`,
  fontStyle: 'bold',
  color: cor,
  align: 'center',
});

export class AtlasScene extends Phaser.Scene {
  private cartas: { ficha: FichaAnimal; fundo: Phaser.GameObjects.Image }[] = [];
  private ficha: Phaser.GameObjects.GameObject[] = [];
  private paginaDireita = { x: 0, y: 0 };
  private topo = 0;

  constructor() {
    super('Atlas');
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.cartas = [];
    this.ficha = [];
    this.add.rectangle(0, 0, W, H, 0x3b2a1e).setOrigin(0);
    // mesa de madeira
    const g = this.add.graphics();
    g.lineStyle(2, 0x4a3526, 1);
    for (let y = 40; y < H; y += 60) g.lineBetween(0, y, W, y + 8);

    const escala = Math.min(1, (W - 40) / 1120, (H - 90) / 620);
    const livro = this.add.image(W / 2, H / 2 + 30, 'livro').setScale(escala);
    const esquerdaX = livro.x - 280 * escala;
    this.paginaDireita = { x: livro.x + 280 * escala, y: livro.y };
    this.topo = livro.y - 310 * escala;
    const s = escala;

    const mundo = MUNDOS_ATLAS[0];
    const titulo = this.add.text(esquerdaX - 60 * s, this.topo + 70 * s, mundo.nome, estiloPagina(Math.round(44 * s))).setOrigin(0.5);
    this.tocavel(titulo, () => VoiceManager.falar(mundo.abertura, 'narrador'));

    // Selo do mundo: brilha quando conquistado; senão, um espaço vazio esperando.
    const temSelo = SaveManager.data.selos.includes(mundo.selo);
    const seloX = esquerdaX + 170 * s;
    const seloY = this.topo + 75 * s;
    if (temSelo) {
      const selo = this.add.image(seloX, seloY, mundo.texturaSelo).setScale(0.75 * s);
      this.tweens.add({ targets: selo, angle: { from: -6, to: 6 }, yoyo: true, repeat: -1, duration: 1400, ease: 'Sine.easeInOut' });
      this.tocavel(selo, () => VoiceManager.falar('Selo do Sertão! Você completou a Caatinga!', 'narrador'));
    } else {
      const vazio = this.add.circle(seloX, seloY, 40 * s, 0xe8dcb8).setStrokeStyle(4, 0xd8c79b);
      this.tocavel(vazio, () => VoiceManager.falar('Complete todas as aventuras da Caatinga para ganhar este selo.', 'narrador'));
    }

    // Figurinhas: 3 em cima, 2 embaixo
    const posicoes = [
      [-170, 0],
      [0, 0],
      [170, 0],
      [-85, 160],
      [85, 160],
    ];
    const encontrados = SaveManager.data.animais;
    ANIMAIS.forEach((ficha, i) => {
      const [dx, dy] = posicoes[i];
      const x = esquerdaX + dx * s;
      const y = this.topo + (225 + dy) * s;
      const fundo = this.add.image(x, y, 'carta').setScale(s);
      const img = this.add.image(x, y, `${ficha.textura}-hd`);
      img.setScale(Math.min((120 * s) / img.width, (95 * s) / img.height));
      const achou = encontrados.includes(ficha.id);
      if (!achou) {
        // Silhueta: dá para ver a forma, mas o bicho ainda não foi encontrado.
        img.setTint(0x6b5a3a).setTintMode(Phaser.TintModes.FILL).setAlpha(0.35);
      }
      this.tocavel(fundo, () => {
        if (achou) this.abrirFicha(ficha);
        else VoiceManager.falar('Esse bicho ainda está escondido numa aventura da Caatinga!', 'narrador');
      });
      this.cartas.push({ ficha, fundo });
    });

    const voltar = this.add.image(60, 58, 'btn-voltar');
    this.tocavel(voltar, () => this.scene.start('Titulo'));

    const qtd = ANIMAIS.filter((a) => encontrados.includes(a.id)).length;
    if (qtd === 0) {
      this.textoEspera('O Atlas está esperando os bichos das aventuras!');
      VoiceManager.falar('O Atlas ainda está vazio. Encontre bichos nas aventuras!', 'narrador');
    } else {
      this.textoEspera('Toque em um bicho');
      VoiceManager.falar('Este é o Atlas Vivo! Toque em um bicho.', 'narrador');
    }
  }

  private escala() {
    return Math.min(1, (this.scale.width - 40) / 1120, (this.scale.height - 90) / 620);
  }

  /** Qualquer coisa tocável: som de clique, pulinho e a ação. */
  private tocavel(obj: Phaser.GameObjects.GameObject & { scale?: number }, acao: () => void) {
    const alvo = obj as unknown as Phaser.GameObjects.Image;
    alvo.setInteractive({ useHandCursor: true });
    alvo.on('pointerdown', () => {
      AudioManager.desbloquear();
      AudioManager.tocar('botao');
      const base = alvo.scale;
      this.tweens.add({ targets: alvo, scale: { from: base * 0.9, to: base }, duration: 160 });
      acao();
    });
  }

  private limparFicha() {
    this.ficha.forEach((o) => o.destroy());
    this.ficha = [];
  }

  private textoEspera(texto: string) {
    this.limparFicha();
    const { x } = this.paginaDireita;
    const s = this.escala();
    const estilo = { ...estiloPagina(Math.round(34 * s), TINTA_CLARA), wordWrap: { width: 440 * s } };
    this.ficha.push(this.add.text(x, this.topo + 290 * s, texto, estilo).setOrigin(0.5));
  }

  private abrirFicha(f: FichaAnimal) {
    this.limparFicha();
    for (const c of this.cartas) c.fundo.setTexture(c.ficha.id === f.id ? 'carta-on' : 'carta');
    const s = this.escala();
    const { x } = this.paginaDireita;
    const topo = this.topo;

    // Bicho grande e mapinha de onde vive
    const bicho = this.add.image(x - 95 * s, topo + 165 * s, `${f.textura}-hd`);
    bicho.setScale(Math.min((260 * s) / bicho.width, (170 * s) / bicho.height));
    const escalaBicho = bicho.scale;
    this.tweens.add({ targets: bicho, scale: { from: escalaBicho * 0.6, to: escalaBicho }, duration: 400, ease: 'Back.easeOut' });
    const mapa = this.add.image(x + 150 * s, topo + 165 * s, `mapa-${f.regiao}`).setScale(0.85 * s);
    const nome = this.add.text(x, topo + 300 * s, f.nome, estiloPagina(Math.round(48 * s))).setOrigin(0.5);
    this.ficha.push(bicho, mapa, nome);

    // Símbolos que falam (mesma ordem sempre)
    const botoes: [string, () => void][] = [
      ['ic-som', () => VoiceManager.falar(f.falas.apresentacao, 'bicho')],
      [
        'ic-mapa',
        () => {
          VoiceManager.falar(f.falas.mapa, 'narrador');
          this.tweens.add({ targets: mapa, scale: { from: 1.1 * s, to: 0.85 * s }, duration: 600, ease: 'Back.easeOut' });
        },
      ],
      ['ic-comida', () => VoiceManager.falar(f.falas.comida, 'narrador')],
      [
        'ic-regua',
        () => {
          VoiceManager.falar(f.falas.tamanho, 'narrador');
          this.tweens.add({ targets: bicho, scaleX: escalaBicho * 1.15, scaleY: escalaBicho * 1.15, yoyo: true, duration: 300 });
        },
      ],
      ['ic-estrela', () => VoiceManager.falar(f.falas.curiosidade, 'bicho')],
    ];
    botoes.forEach(([tex, acao], i) => {
      const b = this.add.image(x + (i - 2) * 100 * s, topo + 410 * s, tex).setScale(0.9 * s);
      this.tocavel(b, acao);
      this.ficha.push(b);
    });

    // Linha para os adultos (nome científico e conservação), não é lida em voz alta
    const estiloAdulto = { ...estiloPagina(Math.round(17 * s), TINTA_CLARA), wordWrap: { width: 460 * s } };
    this.ficha.push(this.add.text(x, topo + 510 * s, f.adulto.replace(' · IUCN', '\nIUCN'), estiloAdulto).setOrigin(0.5));

    VoiceManager.falar(f.falas.apresentacao, 'bicho');
  }
}
