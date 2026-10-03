// Cozinha da Vovó Lili: o Chico ajuda a avó separando ingredientes. Só figuras e voz, sem texto para ler.
// Cada receita treina uma ideia: cor (salada de frutas), forma (sopa), tamanho (feira) e contar (bolo).
// As receitas abrem com os selos das aventuras (0, 1, 3 e 5 selos). Errar não tira nada: a vovó explica
// e o ingrediente volta para o lugar. Dá para arrastar o ingrediente OU tocar nele e depois na tigela.
import Phaser from 'phaser';
import { ajustarTela } from '../core/Tela';
import { SaveManager } from '../core/SaveManager';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';

type ReceitaId = 'salada' | 'sopa' | 'feira' | 'bolo';

interface Ingrediente {
  id: string;
  nome: string;
  /** Em qual recipiente vai (o índice em `alvos`), ou -1 se não entra na receita. */
  grupo: number;
  escala?: number;
}

interface Receita {
  id: ReceitaId;
  prato: string;
  selos: number;
  explicacao: string;
  final: string;
  ingredientes: Ingrediente[];
}

const RECEITAS: Receita[] = [
  {
    id: 'salada',
    prato: 'prato-salada',
    selos: 0,
    explicacao: 'Vamos fazer salada de frutas! Coloque cada fruta na tigela da mesma cor.',
    final: 'Ficou uma delícia! Obrigada pela ajuda, Chico!',
    ingredientes: [
      { id: 'morango', nome: 'Morango', grupo: 0 },
      { id: 'maca', nome: 'Maçã', grupo: 0 },
      { id: 'banana', nome: 'Banana', grupo: 1 },
      { id: 'abacaxi', nome: 'Abacaxi', grupo: 1 },
      { id: 'uva', nome: 'Uva', grupo: 2 },
      { id: 'kiwi', nome: 'Kiwi', grupo: 2 },
    ],
  },
  {
    id: 'sopa',
    prato: 'prato-sopa',
    selos: 1,
    explicacao: 'Vamos fazer sopa de legumes! Os redondinhos vão numa panela, e os compridos na outra.',
    final: 'Ficou uma delícia! Obrigada pela ajuda, Chico!',
    ingredientes: [
      { id: 'tomate', nome: 'Tomate', grupo: 0 },
      { id: 'batata', nome: 'Batata', grupo: 0 },
      { id: 'cebola', nome: 'Cebola', grupo: 0 },
      { id: 'cenoura', nome: 'Cenoura', grupo: 1 },
      { id: 'vagem', nome: 'Vagem', grupo: 1 },
      { id: 'milho', nome: 'Milho', grupo: 1 },
    ],
  },
  {
    id: 'feira',
    prato: 'prato-feira',
    selos: 3,
    explicacao: 'A feira chegou! As coisas grandes vão na cesta grande, e as pequenas na cesta pequena.',
    final: 'Que feira bonita! Obrigada pela ajuda, Chico!',
    ingredientes: [
      { id: 'melancia', nome: 'Melancia', grupo: 0, escala: 1.25 },
      { id: 'abobora', nome: 'Abóbora', grupo: 0, escala: 1.15 },
      { id: 'abacaxi', nome: 'Abacaxi', grupo: 0, escala: 1.15 },
      { id: 'uva', nome: 'Uva', grupo: 1, escala: 0.55 },
      { id: 'morango', nome: 'Morango', grupo: 1, escala: 0.5 },
      { id: 'jabuticaba', nome: 'Jabuticaba', grupo: 1, escala: 0.5 },
    ],
  },
  {
    id: 'bolo',
    prato: 'prato-bolo',
    selos: 5,
    explicacao: 'Vamos fazer bolo de cenoura! Coloque três ovos e duas cenouras na tigela.',
    final: 'Ficou uma delícia! Obrigada pela ajuda, Chico!',
    ingredientes: [
      { id: 'ovo', nome: 'Ovo', grupo: 0 },
      { id: 'cenoura', nome: 'Cenoura', grupo: 0 },
      { id: 'ovo', nome: 'Ovo', grupo: 0 },
      { id: 'tomate', nome: 'Tomate', grupo: -1 },
      { id: 'ovo', nome: 'Ovo', grupo: 0 },
      { id: 'cenoura', nome: 'Cenoura', grupo: 0 },
      { id: 'banana', nome: 'Banana', grupo: -1 },
    ],
  },
];

const ELOGIOS = ['Isso!', 'Muito bem!', 'Perfeito, Chico!'];
const CONTAGEM: Record<string, string[]> = {
  ovo: ['Um ovo!', 'Dois ovos!', 'Três ovos!'],
  cenoura: ['Uma cenoura!', 'Duas cenouras!'],
};

interface Alvo {
  img: Phaser.GameObjects.Image;
  /** Lugares onde os ingredientes se acomodam (relativos ao centro do recipiente). */
  vagas: { x: number; y: number; tipo?: string; ocupada: boolean; sombra?: Phaser.GameObjects.Image }[];
  escalaDentro: number;
}

interface ItemNaMesa {
  ing: Ingrediente;
  img: Phaser.GameObjects.Image;
  x0: number;
  y0: number;
  escala: number;
  pronto: boolean;
}

export class CozinhaScene extends Phaser.Scene {
  /** Recipientes e ingredientes da receita aberta (também usados pelos testes automatizados). */
  alvos: Alvo[] = [];
  itens: ItemNaMesa[] = [];
  receita?: Receita;
  private camada: Phaser.GameObjects.GameObject[] = [];
  private selecionado?: ItemNaMesa;
  private lili!: Phaser.GameObjects.Image;
  private elogio = 0;
  private terminando = false;

  constructor() {
    super('Cozinha');
  }

  init() {
    this.alvos = [];
    this.itens = [];
    this.camada = [];
    this.receita = undefined;
    this.selecionado = undefined;
    this.elogio = 0;
    this.terminando = false;
  }

  create() {
    ajustarTela();
    const { width: W, height: H } = this.scale;
    this.input.dragDistanceThreshold = 10;
    this.cenario(W, H);

    this.lili = this.add.image(120, H - 40, 'familia', 'corpo-lili').setOrigin(0.5, 1).setScale(0.62).setDepth(4);
    this.lili.setInteractive({ useHandCursor: true }).on('pointerdown', () => VoiceManager.repetir());
    const respira = this.tweens.add({ targets: this.lili, scaleY: 0.635, yoyo: true, repeat: -1, duration: 1300, ease: 'Sine.easeInOut' });
    // a vovó dá um pulinho sempre que fala
    const pararDeOuvir = VoiceManager.aoFalar((quem) => {
      if (quem !== 'lili') return;
      respira.pause();
      this.tweens.add({ targets: this.lili, y: { from: H - 40, to: H - 58 }, yoyo: true, duration: 170, onComplete: () => respira.resume() });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, pararDeOuvir);

    const voltar = this.add.image(60, 58, 'btn-voltar').setInteractive({ useHandCursor: true }).setDepth(20);
    voltar.on('pointerdown', () => {
      AudioManager.tocar('botao');
      if (this.receita && !this.terminando) this.escolherReceita(false);
      else if (!this.receita) this.scene.start('Titulo');
    });
    const repetir = this.add.image(W - 60, 58, 'btn-som').setInteractive({ useHandCursor: true }).setDepth(20);
    repetir.on('pointerdown', () => {
      AudioManager.tocar('botao');
      VoiceManager.repetir();
    });

    VoiceManager.falar('Que bom que você veio, Chico! Vamos cozinhar juntos?', 'lili');
    this.escolherReceita(true);
  }

  private cenario(W: number, H: number) {
    // parede de azulejos, janela com céu e bancada de madeira
    this.add.rectangle(0, 0, W, H, 0xf6e6c4).setOrigin(0).setInteractive();
    const g = this.add.graphics();
    g.lineStyle(2, 0xe2cc9f, 1);
    for (let x = 0; x < W; x += 56) g.lineBetween(x, H * 0.3, x, H * 0.62);
    for (let y = H * 0.3; y < H * 0.62; y += 56) g.lineBetween(0, y, W, y);
    g.fillStyle(0xe8a25a, 1).fillRect(0, H * 0.28, W, 12);
    g.fillStyle(0x3a2a1a, 1).fillRoundedRect(W / 2 - 160, 26, 320, 150, 14);
    g.fillStyle(0x9fd4f2, 1).fillRoundedRect(W / 2 - 150, 36, 300, 130, 10);
    g.fillStyle(0xffffff, 0.9).fillEllipse(W / 2 - 60, 80, 90, 34).fillEllipse(W / 2 + 70, 120, 70, 26);
    g.fillStyle(0x3a2a1a, 1).fillRect(W / 2 - 4, 36, 8, 130).fillRect(W / 2 - 150, 98, 300, 8);
    g.fillStyle(0xb57a43, 1).fillRect(0, H * 0.62, W, H * 0.38);
    g.fillStyle(0x8e5a2c, 1).fillRect(0, H * 0.62, W, 14);
    g.lineStyle(3, 0x9a6634, 0.6);
    for (let y = H * 0.7; y < H; y += 46) g.lineBetween(0, y, W, y);
  }

  /** Tela de escolha: os 4 pratos, os ainda fechados com cadeado e os selos que faltam. */
  private escolherReceita(primeira: boolean) {
    this.limpar();
    this.receita = undefined;
    this.terminando = false;
    const { width: W, height: H } = this.scale;
    const selos = SaveManager.data.selos.length;
    const passo = (W - 300) / RECEITAS.length;
    RECEITAS.forEach((r, i) => {
      const x = 300 + passo * (i + 0.5) - 20;
      const y = H * 0.56;
      const aberta = selos >= r.selos;
      const fundo = this.add.graphics().setDepth(5);
      fundo.fillStyle(aberta ? 0xfffaf0 : 0xd8cfc0, 1).fillRoundedRect(x - 110, y - 120, 220, 240, 22);
      fundo.lineStyle(5, aberta ? 0xf08a3a : 0x8a7e6e, 1).strokeRoundedRect(x - 110, y - 120, 220, 240, 22);
      const prato = this.add.image(x, y - 10, r.prato).setScale(0.78).setDepth(6);
      this.camada.push(fundo, prato);
      if (!aberta) {
        prato.setAlpha(0.35);
        this.camada.push(this.add.image(x, y - 10, 'cadeado').setScale(1.2).setDepth(7));
        // bolinhas dos selos: as cheias já foram conquistadas, as vazias ainda faltam
        for (let k = 0; k < r.selos; k++) {
          const bx = x + (k - (r.selos - 1) / 2) * 30;
          const b = this.add.circle(bx, y + 88, 11, k < selos ? 0xf2b93b : 0xffffff).setStrokeStyle(3, 0x8a6a2a).setDepth(7);
          this.camada.push(b);
        }
      }
      const zona = this.add.zone(x, y, 220, 240).setInteractive({ useHandCursor: true }).setDepth(8);
      this.camada.push(zona);
      this.tweens.add({ targets: [fundo, prato], y: '-=8', yoyo: true, repeat: -1, duration: 900 + i * 120, ease: 'Sine.easeInOut' });
      zona.on('pointerdown', () => {
        AudioManager.tocar('botao');
        if (aberta) this.abrir(r);
        else {
          VoiceManager.falar('Essa receita abre quando você ganhar mais selos nas aventuras!', 'lili');
          this.tweens.add({ targets: prato, angle: { from: -6, to: 6 }, yoyo: true, repeat: 2, duration: 80, onComplete: () => prato.setAngle(0) });
        }
      });
    });
    VoiceManager.falar('Escolha uma receita!', 'lili', primeira);
  }

  private abrir(r: Receita) {
    this.limpar();
    this.receita = r;
    this.terminando = false;
    const { width: W, height: H } = this.scale;
    const yAlvo = H - 120;
    if (r.id === 'salada') {
      const cores = [0xe5402f, 0xf7d23e, 0x6cbf3a];
      cores.forEach((cor, i) => {
        const a = this.recipiente('tigela', 420 + i * 290, yAlvo, 1, 2, 0.6);
        this.camada.push(this.add.circle(a.img.x, a.img.y + 18, 20, cor).setStrokeStyle(4, 0x2b2b2b).setDepth(3));
      });
    } else if (r.id === 'sopa') {
      ['marca-redondo', 'marca-comprido'].forEach((marca, i) => {
        const a = this.recipiente('panela', 520 + i * 400, yAlvo, 1.05, 3, 0.6);
        this.camada.push(this.add.image(a.img.x, a.img.y + 18, marca).setDepth(3));
      });
    } else if (r.id === 'feira') {
      this.recipiente('cesta', 520, yAlvo - 10, 1.2, 3, 0.85);
      this.recipiente('cesta', 950, yAlvo + 20, 0.62, 3, 0.42);
    } else {
      // bolo: uma tigela grande com o contorno de cada ingrediente que falta
      const a = this.recipiente('tigela', 720, yAlvo, 1.6, 0, 0.7);
      ['ovo', 'ovo', 'ovo', 'cenoura', 'cenoura'].forEach((tipo, k) => {
        const x = (k - 2) * 70;
        const y = (-60 + 22) * 1.6 - 42 * 0.7; // boca da tigela
        const sombra = this.add
          .image(a.img.x + x, a.img.y + y, `ing-${tipo}`)
          .setScale(0.7)
          .setTint(0x7a6a58)
          .setTintMode(Phaser.TintModes.FILL)
          .setAlpha(0.45)
          .setDepth(1);
        this.camada.push(sombra);
        a.vagas.push({ x, y, tipo, ocupada: false, sombra });
      });
    }

    // ingredientes na prateleira, fora de ordem
    const lista = Phaser.Utils.Array.Shuffle([...r.ingredientes]);
    const x0 = 300;
    const passo = (W - 80 - x0) / Math.max(1, lista.length - 1);
    const prateleira = H * 0.47;
    const tabua = this.add.graphics().setDepth(5);
    tabua.fillStyle(0x8e5a2c, 1).fillRoundedRect(x0 - 70, prateleira, W - x0 + 50, 16, 6);
    tabua.fillStyle(0x6e4220, 1).fillRect(x0 - 40, prateleira + 16, 14, 26).fillRect(W - 70, prateleira + 16, 14, 26);
    this.camada.push(tabua);
    lista.forEach((ing, i) => {
      const escala = (ing.escala ?? 0.9) * (lista.length > 6 ? 0.9 : 1);
      const x = x0 + passo * i;
      const y = prateleira - 44 * escala;
      const img = this.add.image(x, y, `ing-${ing.id}`).setScale(0).setDepth(6);
      this.tweens.add({ targets: img, scale: escala, delay: 150 + i * 90, duration: 300, ease: 'Back.easeOut' });
      const item: ItemNaMesa = { ing, img, x0: x, y0: y, escala, pronto: false };
      this.itens.push(item);
      this.camada.push(img);
      img.setInteractive({ draggable: true, useHandCursor: true });
      img.on('pointerdown', () => {
        if (item.pronto || this.terminando) return;
        VoiceManager.falar(ing.nome, 'narrador');
        this.selecionar(item);
      });
      img.on('dragstart', () => {
        if (item.pronto) return;
        img.setDepth(10);
        this.tweens.killTweensOf(img);
        img.setScale(escala * 1.1).setAngle(0);
      });
      img.on('drag', (_p: Phaser.Input.Pointer, x2: number, y2: number) => !item.pronto && img.setPosition(x2, y2));
      img.on('dragend', () => {
        if (item.pronto) return;
        const alvo = this.alvoPerto(img.x, img.y);
        if (alvo >= 0) this.soltar(item, alvo);
        else this.devolver(item);
      });
    });

    VoiceManager.falar(r.explicacao, 'lili');
  }

  /** Cria um recipiente com `n` vagas em fila na boca dele. */
  private recipiente(textura: string, x: number, y: number, escala: number, n: number, escalaDentro: number): Alvo {
    const img = this.add.image(x, y, textura).setScale(escala).setDepth(2);
    img.setInteractive({ useHandCursor: true });
    const boca = -img.displayHeight / 2 + (textura === 'cesta' ? 56 : textura === 'panela' ? 30 : 22) * escala;
    const largura = img.displayWidth * 0.6;
    const vagas = Array.from({ length: n }, (_, k) => ({
      x: n > 1 ? -largura / 2 + (largura / (n - 1)) * k : 0,
      y: boca - 42 * escalaDentro,
      ocupada: false,
    }));
    const alvo: Alvo = { img, vagas, escalaDentro };
    const indice = this.alvos.length;
    img.on('pointerdown', () => {
      if (this.selecionado && !this.selecionado.pronto) this.soltar(this.selecionado, indice);
    });
    this.alvos.push(alvo);
    this.camada.push(img);
    img.setScale(0);
    this.tweens.add({ targets: img, scale: escala, duration: 300, ease: 'Back.easeOut' });
    return alvo;
  }

  private alvoPerto(x: number, y: number) {
    let melhor = -1;
    let dist = Infinity;
    this.alvos.forEach((a, i) => {
      const d = Phaser.Math.Distance.Between(x, y, a.img.x, a.img.y - a.img.displayHeight * 0.2);
      if (d < Math.max(130, a.img.displayWidth * 0.6) && d < dist) {
        dist = d;
        melhor = i;
      }
    });
    return melhor;
  }

  private selecionar(item: ItemNaMesa) {
    if (this.selecionado && this.selecionado !== item && !this.selecionado.pronto) {
      const s = this.selecionado;
      this.tweens.killTweensOf(s.img);
      s.img.setScale(s.escala).setAngle(0);
    }
    this.selecionado = item;
    this.tweens.killTweensOf(item.img);
    item.img.setScale(item.escala);
    this.tweens.add({ targets: item.img, scale: item.escala * 1.15, yoyo: true, repeat: -1, duration: 380, ease: 'Sine.easeInOut' });
  }

  /** Tenta colocar o ingrediente no recipiente `indice` (arrastando ou tocando nos dois). */
  soltar(item: ItemNaMesa, indice: number) {
    if (item.pronto || this.terminando || !this.receita) return;
    const alvo = this.alvos[indice];
    const vaga = alvo.vagas.find((v) => !v.ocupada && (!v.tipo || v.tipo === item.ing.id));
    if (item.ing.grupo !== indice || !vaga) {
      AudioManager.tocar('quase');
      VoiceManager.falar('Hmm, essa não combina aqui. Tente outra!', 'lili');
      this.devolver(item);
      return;
    }
    item.pronto = true;
    vaga.ocupada = true;
    if (this.selecionado === item) this.selecionado = undefined;
    item.img.disableInteractive();
    this.tweens.killTweensOf(item.img);
    item.img.setDepth(1).setAngle(0);
    this.tweens.add({ targets: item.img, x: alvo.img.x + vaga.x, y: alvo.img.y + vaga.y, scale: alvo.escalaDentro, duration: 260, ease: 'Back.easeOut' });
    if (vaga.sombra) this.tweens.add({ targets: vaga.sombra, alpha: 0, duration: 260 });
    this.tweens.add({ targets: alvo.img, scaleY: { from: alvo.img.scaleX * 1.08, to: alvo.img.scaleX }, duration: 260 });
    AudioManager.tocar('certo');

    if (this.receita.id === 'bolo') {
      const n = alvo.vagas.filter((v) => v.ocupada && v.tipo === item.ing.id).length;
      VoiceManager.falar(CONTAGEM[item.ing.id][n - 1], 'lili');
    } else {
      VoiceManager.falar(ELOGIOS[this.elogio++ % ELOGIOS.length], 'lili');
    }
    if (this.itens.filter((i) => i.ing.grupo >= 0).every((i) => i.pronto)) this.pronto();
  }

  private devolver(item: ItemNaMesa) {
    this.tweens.killTweensOf(item.img);
    item.img.setDepth(6);
    if (this.selecionado === item) this.selecionado = undefined;
    this.tweens.add({ targets: item.img, x: item.x0, y: item.y0, scale: item.escala, angle: 0, duration: 300, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: item.img, angle: { from: -10, to: 10 }, yoyo: true, repeat: 2, delay: 300, duration: 80, onComplete: () => item.img.setAngle(0) });
  }

  /** Tudo no lugar: o prato pronto aparece, a vovó agradece e volta para a escolha de receitas. */
  private pronto() {
    const r = this.receita!;
    this.terminando = true;
    const { width: W, height: H } = this.scale;
    const forno = r.id === 'bolo';
    if (forno) VoiceManager.falar('Três ovos e duas cenouras! Agora a vovó coloca no forno.', 'lili', true);
    this.time.delayedCall(forno ? 2600 : 900, () => {
      for (const o of this.camada) {
        if ('alpha' in o) this.tweens.add({ targets: o, alpha: 0, duration: 400 });
      }
      const prato = this.add.image(W / 2 + 60, H * 0.5, r.prato).setScale(0).setDepth(12);
      this.camada.push(prato);
      this.tweens.add({ targets: prato, scale: 1.9, delay: 350, duration: 550, ease: 'Back.easeOut' });
      this.time.delayedCall(450, () => {
        AudioManager.tocar('vitoria');
        VoiceManager.falar(r.final, 'lili');
        const confete = this.add
          .particles(W / 2 + 60, H * 0.32, 'brilho', {
            lifespan: 1600,
            speed: { min: 150, max: 420 },
            angle: { min: 200, max: 340 },
            gravityY: 500,
            scale: { start: 1.6, end: 0.2 },
            tint: [0xff6b6b, 0xffd766, 0x5cc26a, 0x5bb0e8, 0xc77dff],
            emitting: false,
          })
          .setDepth(13);
        confete.explode(80);
        this.camada.push(confete);
      });
      this.time.delayedCall(5200, () => this.escolherReceita(false));
    });
  }

  private limpar() {
    for (const o of this.camada) {
      this.tweens.killTweensOf(o);
      o.destroy();
    }
    this.camada = [];
    this.alvos = [];
    this.itens = [];
    this.selecionado = undefined;
  }
}
