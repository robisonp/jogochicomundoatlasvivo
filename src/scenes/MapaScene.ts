// Mapa-múndi: a rota do Chico pelos 8 mundos (GDD: mapa 2D com rota animada; continente e país falados).
// Toque num mundo aberto para escolher a fase; o botão verde continua de onde parou.
// Na primeira vez, a Tia Marcela liga pelo Chamador do Atlas e conta a história do livro.
import Phaser from 'phaser';
import { ajustarTela } from '../core/Tela';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { SaveManager } from '../core/SaveManager';
import { CAMPANHA } from '../levels';
import type { LevelDef } from '../levels/types';
import { MAPA_MUNDOS, type MundoNoMapa } from '../data/mapa';
import { MAPA, lonLatParaMapa } from '../art/Mapa';
import { botaoGrande, estiloTexto } from '../ui/widgets';

interface Marcador {
  mundo: MundoNoMapa;
  x: number;
  y: number;
  fases: LevelDef[];
}

export class MapaScene extends Phaser.Scene {
  private marcadores: Marcador[] = [];
  private escala = 1;
  private origem = { x: 0, y: 0 };
  private chico!: Phaser.GameObjects.Container;
  private painel?: Phaser.GameObjects.Container;
  private ocupado = false;

  constructor() {
    super('Mapa');
  }

  create() {
    ajustarTela();
    const { width: W, height: H } = this.scale;
    this.marcadores = [];
    this.painel = undefined;
    this.ocupado = false;
    this.add.rectangle(0, 0, W, H, 0x3b6e8f).setOrigin(0);

    this.escala = Math.min(1, (W - 40) / MAPA.largura, (H - 150) / MAPA.altura);
    const s = this.escala;
    this.origem = { x: W / 2 - (MAPA.largura * s) / 2, y: H / 2 + 30 - (MAPA.altura * s) / 2 };
    this.add.image(this.origem.x, this.origem.y, 'mapa-mundi').setOrigin(0).setScale(s);
    this.add.text(W / 2, 48, 'Mapa do Atlas', estiloTexto(44, '#fff4d6')).setOrigin(0.5);

    for (const m of MAPA_MUNDOS) {
      const [x, y] = this.noMapa(m.mostrar ?? m);
      this.marcadores.push({ mundo: m, x, y, fases: CAMPANHA.filter((f) => f.mundo === m.id) });
    }
    this.desenharRota();
    for (const mk of this.marcadores) this.desenharMarcador(mk);

    // Chico (a cabeça dele) no mundo atual
    const atual = this.marcadorAtual();
    const cabeca = this.add.image(0, 0, 'chico', 'cabeca').setScale(0.6);
    this.chico = this.add.container(atual.x, atual.y - 58, [cabeca]).setDepth(20);
    this.tweens.add({ targets: this.chico, y: this.chico.y - 8, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

    // Voltar, Atlas e o botão verde de continuar
    const voltar = botaoGrande(this, 60, 58, 'btn-voltar', () => this.scene.start('Titulo'), 1);
    voltar.setDepth(30);
    botaoGrande(this, W - 70, 62, 'atlas', () => this.scene.start('Atlas'), 0.55).setDepth(30);
    const jogar = botaoGrande(this, W - 100, H - 90, 'btn-jogar', () => this.continuar(), 0.7).setDepth(30);
    this.tweens.add({ targets: jogar, scale: 0.76, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });

    this.input.keyboard?.on('keydown-ENTER', () => this.continuar());
    this.input.keyboard?.on('keydown-SPACE', () => this.continuar());
    this.input.keyboard?.on('keydown-ESC', () => (this.painel ? this.fecharPainel() : this.scene.start('Titulo')));

    if (!SaveManager.data.introVista) this.introducao();
    else this.anunciarNovoMundo();
  }

  // ------------------------------------------------------------------ estado

  private noMapa(p: { lon: number; lat: number }): [number, number] {
    const [x, y] = lonLatParaMapa(p.lon, p.lat);
    return [this.origem.x + x * this.escala, this.origem.y + y * this.escala];
  }

  private concluida(f: LevelDef) {
    return !!SaveManager.data.fases[f.id]?.concluida;
  }

  /** Mundo aberto: o primeiro, ou o anterior tem o selo, ou já jogou alguma fase dele. */
  private aberto(i: number): boolean {
    const mk = this.marcadores[i];
    if (!mk.fases.length) return false;
    if (i === 0) return true;
    const ant = this.marcadores[i - 1].mundo;
    return (!!ant.seloId && SaveManager.data.selos.includes(ant.seloId)) || mk.fases.some((f) => this.concluida(f));
  }

  private faseAberta(mk: Marcador, j: number) {
    return j === 0 || this.concluida(mk.fases[j]) || this.concluida(mk.fases[j - 1]);
  }

  /** Mundo onde o Chico está: o último aberto que ainda tem fase por fazer (ou o último aberto). */
  private marcadorAtual(): Marcador {
    const abertos = this.marcadores.filter((_, i) => this.aberto(i));
    return abertos.find((mk) => mk.fases.some((f) => !this.concluida(f))) ?? abertos[abertos.length - 1] ?? this.marcadores[0];
  }

  // ------------------------------------------------------------------ desenho

  private desenharRota() {
    const g = this.add.graphics().setDepth(5);
    for (let i = 1; i < this.marcadores.length; i++) {
      const a = this.marcadores[i - 1];
      const b = this.marcadores[i];
      const feita = this.aberto(i);
      const passos = Math.max(6, Math.round(Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y) / 18));
      for (let k = 0; k < passos; k++) {
        if (!feita && k % 2 === 1) continue;
        const t0 = k / passos;
        const t1 = (k + 0.6) / passos;
        // rota em arco suave (como a de um avião)
        const pt = (t: number) => {
          const x = Phaser.Math.Linear(a.x, b.x, t);
          const y = Phaser.Math.Linear(a.y, b.y, t) - Math.sin(Math.PI * t) * 40;
          return [x, y];
        };
        const [x0, y0] = pt(t0);
        const [x1, y1] = pt(t1);
        g.lineStyle(feita ? 6 : 4, feita ? 0xf2a93b : 0xffffff, feita ? 1 : 0.6);
        g.lineBetween(x0, y0, x1, y1);
      }
    }
    // linhas finas dos marcadores deslocados até o lugar de verdade
    for (const mk of this.marcadores) {
      if (!mk.mundo.mostrar) continue;
      const [x, y] = this.noMapa(mk.mundo);
      g.lineStyle(3, 0x1d2b3a, 0.6);
      g.lineBetween(mk.x, mk.y, x, y);
      g.fillStyle(0x1d2b3a, 0.8);
      g.fillCircle(x, y, 4);
    }
  }

  private desenharMarcador(mk: Marcador) {
    const i = this.marcadores.indexOf(mk);
    const aberto = this.aberto(i);
    const existe = !!mk.fases.length;
    const conquistado = !!mk.mundo.seloId && SaveManager.data.selos.includes(mk.mundo.seloId);
    const img = this.add.image(mk.x, mk.y, existe ? mk.mundo.selo! : 'mundo-embreve').setScale(0.55).setDepth(10);
    if (existe && !aberto) img.setTint(0xa8a090).setTintMode(Phaser.TintModes.MULTIPLY);
    if (existe && !aberto) this.add.image(mk.x + 22, mk.y + 22, 'cadeado').setScale(0.6).setDepth(11);
    if (conquistado) {
      const brilho = this.add.image(mk.x, mk.y, 'brilho').setScale(4).setDepth(9).setTint(0xffd766).setAlpha(0.6);
      this.tweens.add({ targets: brilho, alpha: 0.2, yoyo: true, repeat: -1, duration: 900 });
    }
    img.setInteractive({ useHandCursor: true });
    img.on('pointerdown', () => {
      if (this.ocupado) return;
      AudioManager.desbloquear();
      AudioManager.tocar('botao');
      this.tweens.add({ targets: img, scale: { from: 0.45, to: 0.55 }, duration: 200 });
      if (!existe) VoiceManager.falar(`${mk.mundo.nome}: esta página do Atlas vem em breve!`, 'narrador');
      else if (!aberto) VoiceManager.falar(`${mk.mundo.nome}! Termine o mundo de antes para chegar aqui.`, 'narrador');
      else this.abrirPainel(mk);
    });
  }

  // ------------------------------------------------------------------ painel das fases

  private abrirPainel(mk: Marcador) {
    this.fecharPainel();
    const { width: W, height: H } = this.scale;
    VoiceManager.falar(`${mk.mundo.nome}, ${mk.mundo.lugar}!`, 'narrador');
    const fundo = this.add.rectangle(0, 0, W, H, 0x1d2b3a, 0.55).setOrigin(0).setInteractive();
    fundo.on('pointerdown', () => this.fecharPainel());
    const larg = Math.min(W - 60, 760);
    const caixa = this.add.rectangle(W / 2, H / 2, larg, 300, 0xfff4d6).setStrokeStyle(6, 0x1d2b3a).setInteractive();
    const selo = this.add.image(W / 2, H / 2 - 150, mk.mundo.selo!).setScale(0.8);
    const titulo = this.add.text(W / 2, H / 2 - 70, mk.mundo.nome, estiloTexto(40, '#fff4d6')).setOrigin(0.5);
    const itens: Phaser.GameObjects.GameObject[] = [fundo, caixa, selo, titulo];
    const n = mk.fases.length;
    mk.fases.forEach((f, j) => {
      const x = W / 2 + (j - (n - 1) / 2) * 130;
      const y = H / 2 + 40;
      const feita = this.concluida(f);
      const aberta = this.faseAberta(mk, j);
      const b = this.add.image(x, y, feita ? 'fase-feita' : aberta ? 'fase-aberta' : 'fase-fechada');
      itens.push(b);
      if (feita) itens.push(this.add.image(x, y - 4, 'visto'));
      else if (aberta) {
        itens.push(this.add.image(x, y - 4, 'pegada').setScale(1.2));
        this.tweens.add({ targets: b, scale: 1.08, yoyo: true, repeat: -1, duration: 600 });
      } else itens.push(this.add.image(x, y - 2, 'cadeado').setScale(0.8));
      // o número da fase ajuda os adultos (a criança usa as cores e os símbolos)
      itens.push(this.add.text(x, y + 62, `${CAMPANHA.indexOf(f) + 1}`, estiloTexto(24)).setOrigin(0.5));
      b.setInteractive({ useHandCursor: true });
      b.on('pointerdown', () => {
        AudioManager.tocar('botao');
        if (!aberta) {
          VoiceManager.falar('Essa aventura abre depois da anterior.', 'narrador');
          return;
        }
        this.scene.start('Level', { faseId: f.id });
      });
    });
    this.painel = this.add.container(0, 0, itens).setDepth(40);
    this.painel.setAlpha(0);
    this.tweens.add({ targets: this.painel, alpha: 1, duration: 200 });
  }

  private fecharPainel() {
    this.painel?.destroy();
    this.painel = undefined;
  }

  private continuar() {
    if (this.ocupado) return;
    AudioManager.desbloquear();
    const fase = CAMPANHA.find((f) => !this.concluida(f)) ?? CAMPANHA[0];
    this.scene.start('Level', { faseId: fase.id });
  }

  // ------------------------------------------------------------------ história e viagens

  /** Primeira vez: a Tia Marcela liga pelo Chamador do Atlas e conta a história. */
  private introducao() {
    const { width: W, height: H } = this.scale;
    this.ocupado = true;
    const fundo = this.add.rectangle(0, 0, W, H, 0x1d2b3a, 0.6).setOrigin(0).setDepth(50).setInteractive();
    const tela = this.add.image(W / 2, H / 2, 'chamador').setScale(2.6).setDepth(51);
    const rosto = this.add.image(W / 2, H / 2 - 20, 'familia', 'rosto-marcela').setScale(1.9).setDepth(52);
    const livro = this.add.image(W / 2 + 150, H / 2 + 40, 'atlas').setScale(0.8).setDepth(53);
    this.tweens.add({ targets: tela, angle: { from: -3, to: 3 }, yoyo: true, repeat: 3, duration: 90 });
    this.tweens.add({ targets: livro, y: livro.y - 10, yoyo: true, repeat: -1, duration: 800 });
    AudioManager.tocar('checkpoint');
    const falas = [
      'Oi, Chico! Aqui é a Tia Marcela. Mandei para você pelo correio um livro muito especial: o Atlas Vivo!',
      'O Vento Viravolta bagunçou as páginas. Os bichos sumiram e os selos se perderam.',
      'Viaje pelo mapa, encontre os bichos e aprenda o que eles sabem fazer. A família toda vai ajudar!',
    ];
    let k = 0;
    const proxima = () => {
      if (k < falas.length) {
        VoiceManager.falar(falas[k++], 'marcela');
        return;
      }
      [fundo, tela, rosto, livro].forEach((o) => o.destroy());
      SaveManager.data.introVista = true;
      SaveManager.salvar();
      this.ocupado = false;
      this.anunciarNovoMundo();
    };
    // cada toque passa para a próxima fala (o áudio precisa de um toque para começar)
    fundo.on('pointerdown', () => {
      AudioManager.desbloquear();
      proxima();
    });
    this.time.delayedCall(400, proxima);
  }

  /** Mundo recém-aberto: o Chico viaja pela rota até lá e o narrador diz onde fica. */
  private anunciarNovoMundo() {
    const i = this.marcadores.findIndex((mk, idx) => this.aberto(idx) && !SaveManager.data.anunciados.includes(mk.mundo.id));
    if (i < 0) return;
    const mk = this.marcadores[i];
    SaveManager.conquistar('anunciados', mk.mundo.id);
    if (i === 0) {
      VoiceManager.falar(`Primeira parada: a ${mk.mundo.nome}, ${mk.mundo.lugar}! Toque no botão verde.`, 'narrador');
      return;
    }
    const de = this.marcadores[i - 1];
    this.ocupado = true;
    this.tweens.killTweensOf(this.chico);
    this.chico.setPosition(de.x, de.y - 58);
    VoiceManager.falar(`Vamos para ${mk.mundo.nome}, ${mk.mundo.lugar}!`, 'narrador');
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 3200,
      ease: 'Sine.easeInOut',
      onUpdate: (tw) => {
        const t = tw.getValue() ?? 0;
        this.chico.setPosition(
          Phaser.Math.Linear(de.x, mk.x, t),
          Phaser.Math.Linear(de.y, mk.y, t) - Math.sin(Math.PI * t) * 40 - 58,
        );
      },
      onComplete: () => {
        this.ocupado = false;
        AudioManager.tocar('checkpoint');
        this.tweens.add({ targets: this.chico, y: this.chico.y - 8, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
      },
    });
  }
}
