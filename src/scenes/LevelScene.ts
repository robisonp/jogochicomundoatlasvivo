import Phaser from 'phaser';
import { TILE, PLAYER } from '../config';
import { Player } from '../entities/Player';
import { InputManager } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { SaveManager } from '../core/SaveManager';
import { LINHAS, type LevelDef, type AnimalNaFase } from '../levels/types';
import { FASES, CAMPANHA, proximaFase } from '../levels';

const LINHAS_EXTRAS = 3;
/** Caracteres que viram chão sólido, e a textura de cada um (bloco interno / bloco com topo). */
const SOLIDOS: Record<string, [string, string]> = {
  '#': ['terra', 'terra-topo'],
  R: ['rocha', 'rocha-topo'],
};
const TEXTURA_BICHO: Record<AnimalNaFase['id'], string> = { moco: 'moco', 'tatu-bola': 'tatu' };

interface Plataforma {
  img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  x0: number;
  y0: number;
  eixo: 'x' | 'y';
  amp: number;
  periodo: number;
  fase: number;
}

interface Bicho {
  img: Phaser.GameObjects.Image;
  def: AnimalNaFase;
  ativado: boolean;
}

interface FontePedrinhas {
  x: number;
  y: number;
  t: number;
}

interface Placa {
  img: Phaser.GameObjects.Image;
  indice: number;
  ouvida: boolean;
}

export class LevelScene extends Phaser.Scene {
  private def!: LevelDef;
  private player!: Player;
  private entrada!: InputManager;
  private solidos!: Phaser.Physics.Arcade.StaticGroup;
  private lajes!: Phaser.Physics.Arcade.StaticGroup;
  private espinhos!: Phaser.Physics.Arcade.StaticGroup;
  private escadas!: Phaser.Physics.Arcade.StaticGroup;
  private pegadas!: Phaser.Physics.Arcade.StaticGroup;
  private plataformas: Plataforma[] = [];
  private placas: Placa[] = [];
  private checkpoints: { img: Phaser.GameObjects.Image; x: number; y: number; indice: number; ativo: boolean }[] = [];
  private inicio = { x: 0, y: 0 };
  private checkpointAtual = 0;
  private respawn = { x: 0, y: 0 };
  private objetivo!: Phaser.Physics.Arcade.Image;
  private larguraMundo = 0;
  private alturaMundo = LINHAS * TILE;
  private totalPegadas = 0;
  private pegadasPegas = new Set<string>();
  private tempo = 0;
  private terminou = false;
  private pausado = false;
  private fundo: { img: Phaser.GameObjects.TileSprite; fator: number }[] = [];
  private olharFrente = 0;
  private dicaMostrada = new Set<number>();
  private iconeAcao!: Phaser.GameObjects.Image;
  private relogioPlataformas = 0;
  private bichos: Bicho[] = [];
  private fontesPedrinhas: FontePedrinhas[] = [];
  private pedrinhas!: Phaser.Physics.Arcade.Group;
  private estilhacos!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super('Level');
  }

  init(data: { faseId?: string }) {
    this.def = FASES[data.faseId ?? ''] ?? CAMPANHA[0];
    this.bichos = [];
    this.fontesPedrinhas = [];
    this.plataformas = [];
    this.placas = [];
    this.checkpoints = [];
    this.fundo = [];
    this.pegadasPegas = new Set(SaveManager.fase(this.def.id).pegadas);
    this.totalPegadas = 0;
    this.checkpointAtual = 0;
    this.tempo = 0;
    this.terminou = false;
    this.pausado = false;
    this.dicaMostrada = new Set();
    this.olharFrente = 0;
    this.relogioPlataformas = 0;
  }

  create() {
    this.entrada = new InputManager(this);
    this.criarFundo();
    this.construirFase();

    this.player = new Player(this, this.inicio.x, this.inicio.y);
    this.respawn = { ...this.inicio };

    // Colisões
    this.physics.add.collider(this.player.sprite, this.solidos);
    const apoiar = () => this.player.apoiar();
    this.physics.add.collider(this.player.sprite, this.lajes, apoiar, this.podePisar, this);
    this.physics.add.collider(
      this.player.sprite,
      this.plataformas.map((p) => p.img),
      apoiar,
      this.podePisar,
      this,
    );
    // Enrolado em bola, o Chico passa pelos espinhos sem se machucar.
    this.physics.add.overlap(this.player.sprite, this.espinhos, () => {
      if (!this.player.protegido) this.morrer();
    });
    this.physics.add.collider(this.pedrinhas, this.solidos, (pd) => this.quebrarPedrinha(pd as Phaser.Physics.Arcade.Image));
    this.physics.add.overlap(this.player.sprite, this.pedrinhas, (_pl, pd) => {
      const pedra = pd as Phaser.Physics.Arcade.Image;
      if (this.player.protegido) this.quicarPedrinha(pedra);
      else this.morrer();
    });
    this.player.temPoderBola = SaveManager.data.poderes.includes('bola');
    this.physics.add.overlap(this.player.sprite, this.pegadas, (_p, peg) =>
      this.pegar(peg as Phaser.Types.Physics.Arcade.ImageWithStaticBody),
    );
    this.physics.add.overlap(this.player.sprite, this.objetivo, () => this.concluir());

    // Câmera: segue com suavidade e antecipa a direção do movimento
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.larguraMundo, this.alturaMundo);
    cam.startFollow(this.player.sprite, true, 0.12, 0.1);
    cam.setDeadzone(80, 120);
    cam.setRoundPixels(true);
    this.physics.world.setBounds(0, -400, this.larguraMundo, this.alturaMundo + 800);

    this.iconeAcao = this.add.image(0, 0, 'btn-acao').setScale(0.45).setDepth(20).setVisible(false);

    this.scene.launch('Hud', { level: this });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.stop('Hud');
      VoiceManager.calar();
    });

    if (!SaveManager.data.settings.reduzirMovimento) cam.fadeIn(350);
    AudioManager.tocarMusica();
    if (this.def.abertura) {
      const a = this.def.abertura;
      this.time.delayedCall(500, () => VoiceManager.falar(a.texto, a.quem));
    }
  }

  // ------------------------------------------------------------------ construção

  private criarFundo() {
    const { width, height } = this.scale;
    this.add.image(0, 0, 'ceu').setOrigin(0).setScrollFactor(0).setDisplaySize(width, height).setDepth(-100);
    this.add.image(width * 0.78, 130, 'sol').setScrollFactor(0).setDepth(-99);
    for (let i = 0; i < 5; i++) {
      const n = this.add.image(i * 700 + 120, 80 + (i % 3) * 50, 'nuvem').setScrollFactor(0.08, 0).setDepth(-98);
      n.setScale(0.7 + (i % 2) * 0.4);
    }
    const serra = this.add
      .tileSprite(0, height - 470, width, 320, 'serra')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-97);
    const mata = this.add
      .tileSprite(0, height - 330, width, 260, 'mata-fundo')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(-96);
    this.fundo.push({ img: serra, fator: 0.15 }, { img: mata, fator: 0.4 });
    this.scale.on('resize', this.aoRedimensionar, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.aoRedimensionar, this));
  }

  private aoRedimensionar(size: Phaser.Structs.Size) {
    for (const f of this.fundo) f.img.setSize(size.width, f.img.height);
  }

  private construirFase() {
    // Junta os trechos em uma grade só.
    const grade: string[] = Array.from({ length: LINHAS }, () => '');
    for (const trecho of this.def.trechos) {
      const largura = Math.max(...trecho.map((l) => l.length));
      const linhas = [...Array(LINHAS - trecho.length).fill(''), ...trecho];
      for (let r = 0; r < LINHAS; r++) grade[r] += linhas[r].padEnd(largura, '.');
    }
    // Terra extra abaixo da fase: deixa a câmera mostrar o chão mais alto na tela, acima dos controles de toque.
    const ultima = grade[LINHAS - 1];
    for (let i = 0; i < LINHAS_EXTRAS; i++) grade.push(ultima.replace(/[^#R]/g, '.'));
    const linhas = grade.length;
    const cols = grade[0].length;
    this.larguraMundo = cols * TILE;
    this.alturaMundo = linhas * TILE;
    const at = (r: number, c: number) => (r >= 0 && r < linhas && c >= 0 && c < cols ? grade[r][c] : '.');
    const solido = (r: number, c: number) => at(r, c) in SOLIDOS;

    // Fundo escuro nos buracos (perigo legível para quem não lê).
    for (let c = 0; c < cols; c++) {
      if (!solido(LINHAS - 1, c)) {
        this.add.image(c * TILE, (LINHAS - 3) * TILE, 'buraco').setOrigin(0).setDepth(0).setDisplaySize(TILE, (LINHAS_EXTRAS + 3) * TILE);
      }
    }

    this.solidos = this.physics.add.staticGroup();
    this.lajes = this.physics.add.staticGroup();
    this.espinhos = this.physics.add.staticGroup();
    this.escadas = this.physics.add.staticGroup();
    this.pegadas = this.physics.add.staticGroup();
    this.pedrinhas = this.physics.add.group();
    this.estilhacos = this.add.particles(0, 0, 'poeira', {
      lifespan: 350,
      speedX: { min: -120, max: 120 },
      speedY: { min: -160, max: -40 },
      scale: { start: 0.7, end: 0 },
      tint: 0xb7aa98,
      emitting: false,
    });
    this.estilhacos.setDepth(7);

    // Chão: desenha bloco a bloco, mas cria corpos físicos mesclados (menos corpos, sem "tropeços" nas junções).
    const corpos: { c0: number; c1: number; r0: number; r1: number }[] = [];
    for (let r = 0; r < linhas; r++) {
      let c = 0;
      while (c < cols) {
        if (!solido(r, c)) {
          c++;
          continue;
        }
        const c0 = c;
        while (solido(r, c)) {
          const [interno, comTopo] = SOLIDOS[at(r, c)];
          this.add.image(c * TILE, r * TILE, solido(r - 1, c) ? interno : comTopo).setOrigin(0).setDepth(1);
          c++;
        }
        const anterior = corpos.find((k) => k.c0 === c0 && k.c1 === c - 1 && k.r1 === r - 1);
        if (anterior) anterior.r1 = r;
        else corpos.push({ c0, c1: c - 1, r0: r, r1: r });
      }
    }
    for (const k of corpos) {
      const w = (k.c1 - k.c0 + 1) * TILE;
      const h = (k.r1 - k.r0 + 1) * TILE;
      const z = this.add.zone(k.c0 * TILE + w / 2, k.r0 * TILE + h / 2, w, h);
      this.solidos.add(z);
    }

    // Demais objetos
    let placaIdx = 0;
    let bichoIdx = 0;
    let cpIdx = 1;
    // Varre por coluna (esquerda → direita) para numerar placas e checkpoints na ordem do percurso.
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < LINHAS; r++) {
        const ch = at(r, c);
        const x = c * TILE;
        const y = r * TILE;
        const cx = x + TILE / 2;
        switch (ch) {
          case 'P':
            this.inicio = { x: cx, y: y + TILE - PLAYER.bodyHeight / 2 };
            break;
          case '=': {
            const l = this.lajes.create(x, y, 'laje').setOrigin(0).setDepth(2) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            l.refreshBody();
            this.soDeCima(l.body);
            break;
          }
          case '^': {
            const e = this.espinhos.create(cx, y + TILE, 'espinhos').setOrigin(0.5, 1).setDepth(3) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            e.refreshBody();
            // hitbox menor que o desenho: só pune quando realmente encosta
            e.body.setSize(40, 28).setOffset(12, 20);
            this.tweens.add({ targets: e, scaleY: 0.94, yoyo: true, repeat: -1, duration: 700 + (c % 3) * 90, ease: 'Sine.easeInOut' });
            break;
          }
          case 'H': {
            const h = this.escadas.create(cx, y + TILE / 2, 'escada').setDepth(2) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            h.refreshBody();
            h.body.setSize(40, TILE);
            break;
          }
          case 'o': {
            const id = `${c},${r}`;
            const p = this.pegadas.create(cx, y + TILE / 2, 'pegada').setDepth(4) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            p.setData('id', id);
            p.refreshBody();
            this.totalPegadas++;
            // Pegada já encontrada em outra vez: aparece "fantasma".
            if (this.pegadasPegas.has(id)) p.setAlpha(0.35);
            this.tweens.add({ targets: p, y: p.y - 6, yoyo: true, repeat: -1, duration: 800, delay: (c * 97) % 800, ease: 'Sine.easeInOut' });
            break;
          }
          case 'C': {
            const img = this.add.image(cx, y + TILE, 'checkpoint').setOrigin(0.5, 1).setDepth(2);
            this.checkpoints.push({ img, x: cx, y: y + TILE - PLAYER.bodyHeight / 2, indice: cpIdx++, ativo: false });
            break;
          }
          case 'S': {
            const img = this.add.image(cx, y + TILE, 'placa').setOrigin(0.5, 1).setDepth(2);
            this.placas.push({ img, indice: placaIdx++, ouvida: false });
            break;
          }
          case 'M':
          case 'V': {
            const img = this.physics.add.image(cx, y + 14, 'pagina').setDepth(5) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            img.body.setAllowGravity(false);
            img.body.setImmovable(true);
            this.soDeCima(img.body);
            const n = this.plataformas.length;
            this.plataformas.push({
              img,
              x0: cx,
              y0: y + 14,
              eixo: ch === 'M' ? 'x' : 'y',
              amp: TILE * 2.5,
              periodo: 3.2,
              fase: n % 2 === 0 ? 0 : Math.PI,
            });
            break;
          }
          case 'A': {
            const def = this.def.animais?.[bichoIdx++];
            if (!def) break;
            // Os desenhos olham para a direita; o bicho espera o Chico olhando para a esquerda.
            const img = this.add.image(cx, y + TILE, TEXTURA_BICHO[def.id]).setOrigin(0.5, 1).setDepth(8).setFlipX(true);
            this.tweens.add({ targets: img, scaleY: 0.95, yoyo: true, repeat: -1, duration: 600, ease: 'Sine.easeInOut' });
            this.bichos.push({ img, def, ativado: false });
            break;
          }
          case 'Q': {
            this.fontesPedrinhas.push({ x: cx, y: y + 10, t: 0.4 + this.fontesPedrinhas.length * 0.35 });
            // poeirinha caindo avisa onde as pedrinhas vão cair
            this.add.particles(cx, y, 'poeira', {
              lifespan: 700,
              speedY: { min: 40, max: 90 },
              speedX: { min: -8, max: 8 },
              scale: { start: 0.35, end: 0.1 },
              alpha: { start: 0.8, end: 0 },
              tint: 0xb7aa98,
              frequency: 260,
            }).setDepth(2);
            break;
          }
          case 'G': {
            this.objetivo = this.physics.add.staticImage(cx, y + TILE, 'atlas').setOrigin(0.5, 1).setDepth(3);
            this.objetivo.refreshBody();
            this.tweens.add({ targets: this.objetivo, y: this.objetivo.y - 10, yoyo: true, repeat: -1, duration: 1100, ease: 'Sine.easeInOut' });
            this.add.particles(cx, y + TILE - 60, 'brilho', {
              lifespan: 1400,
              speed: { min: 10, max: 50 },
              scale: { start: 1.2, end: 0 },
              alpha: { start: 0.9, end: 0 },
              frequency: 90,
              tint: [0xfff1a8, 0xffd766, 0xffffff],
              emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 60) as any },
            }).setDepth(4);
            break;
          }
        }
      }
    }
  }

  private soDeCima(body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) {
    body.checkCollision.down = false;
    body.checkCollision.left = false;
    body.checkCollision.right = false;
  }

  /** Plataformas atravessáveis: só seguram o Chico quando ele vem de cima (e não está na escada). */
  private podePisar(p: unknown, plat: unknown): boolean {
    if (this.player.estado === 'escalando') return false;
    const pb = (p as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as Phaser.Physics.Arcade.Body;
    const lb = (plat as Phaser.Types.Physics.Arcade.GameObjectWithBody).body as Phaser.Physics.Arcade.Body;
    return pb.velocity.y >= 0 && pb.prev.y + pb.height <= lb.top + 12;
  }

  // ------------------------------------------------------------------ loop

  update(_t: number, deltaMs: number) {
    const dt = Math.min(deltaMs, 50) / 1000;
    const i = this.entrada.update();

    if (i.pausePressed && !this.terminou) this.pausar();
    if (this.pausado) return;
    if (!this.terminou) this.tempo += deltaMs;

    this.moverPlataformas(dt);

    // Escada sob o Chico?
    let escadaX: number | null = null;
    this.physics.overlap(this.player.sprite, this.escadas, (_p, e) => {
      escadaX = (e as Phaser.GameObjects.Image).x;
    });
    this.player.marcarEscada(escadaX);

    this.player.update(this.terminou ? this.semEntrada() : i, dt);

    // Câmera antecipa a direção
    const alvo = this.player.direcao * 110 * Math.min(1, Math.abs(this.player.body.velocity.x) / 200);
    this.olharFrente = Phaser.Math.Linear(this.olharFrente, alvo, dt * 2.5);
    // Chico um pouco abaixo do centro: o chão fica acima da área dos controles de toque.
    this.cameras.main.setFollowOffset(-this.olharFrente, 70);

    // Parallax
    const sx = this.cameras.main.scrollX;
    for (const f of this.fundo) f.img.tilePositionX = sx * f.fator;

    // Caiu no buraco
    if (this.player.y > LINHAS * TILE + 90 && this.player.estado !== 'caido') this.morrer();

    this.checarCheckpoints();
    this.checarPlacas(i.actionPressed);
    this.checarBichos();
    this.soltarPedrinhas(dt);
  }

  private semEntrada() {
    return {
      left: false,
      right: false,
      up: false,
      down: false,
      jumpHeld: false,
      jumpPressed: false,
      actionPressed: false,
      powerPressed: false,
      pausePressed: false,
    };
  }

  private moverPlataformas(dt: number) {
    this.relogioPlataformas += dt;
    const t = this.relogioPlataformas;
    for (const p of this.plataformas) {
      const w = (Math.PI * 2) / p.periodo;
      // velocidade = derivada da posição senoidal; o corpo se move pela física e "carrega" o Chico.
      const alvo = p.amp * Math.sin(t * w + p.fase);
      const atual = p.eixo === 'x' ? p.img.x - p.x0 : p.img.y - p.y0;
      const v = p.amp * w * Math.cos(t * w + p.fase) + (alvo - atual) * 4;
      if (p.eixo === 'x') p.img.body.setVelocity(v, 0);
      else p.img.body.setVelocity(0, v);
    }
  }

  private checarCheckpoints() {
    for (const cp of this.checkpoints) {
      if (cp.ativo || this.player.x < cp.x - 20) continue;
      cp.ativo = true;
      cp.img.setTexture('checkpoint-on');
      this.tweens.add({ targets: cp.img, scaleX: { from: 1.3, to: 1 }, scaleY: { from: 1.3, to: 1 }, duration: 350, ease: 'Back.easeOut' });
      if (cp.indice > this.checkpointAtual) {
        this.checkpointAtual = cp.indice;
        this.respawn = { x: cp.x, y: cp.y };
      }
      AudioManager.tocar('checkpoint');
    }
  }

  private checarPlacas(acao: boolean) {
    let perto: Placa | undefined;
    for (const p of this.placas) {
      if (Math.abs(this.player.x - p.img.x) < 70 && Math.abs(this.player.y - (p.img.y - 50)) < 90) perto = p;
    }
    if (perto) {
      this.iconeAcao.setVisible(true).setPosition(perto.img.x, perto.img.y - 140 + Math.sin(this.time.now / 180) * 6);
      if (!perto.ouvida || acao) {
        perto.ouvida = true;
        const f = this.def.placas[perto.indice];
        if (f) VoiceManager.falar(f.texto, f.quem);
        this.tweens.add({ targets: perto.img, scaleX: { from: 1.15, to: 1 }, scaleY: { from: 1.15, to: 1 }, duration: 250 });
      }
    } else {
      this.iconeAcao.setVisible(false);
    }
  }

  // ------------------------------------------------------------------ bichos

  get temPoder() {
    return this.player.temPoderBola;
  }

  private checarBichos() {
    for (const b of this.bichos) {
      if (b.ativado) continue;
      if (Math.abs(this.player.x - b.img.x) < 260 && Math.abs(this.player.y - b.img.y) < 240) this.ativarBicho(b);
    }
  }

  private ativarBicho(b: Bicho) {
    b.ativado = true;
    const { def, img } = b;
    // Página do Atlas: o animal fica registrado para a coleção.
    SaveManager.conquistar('animais', def.id);
    VoiceManager.falar(def.fala, 'bicho');
    if (def.curiosidade) VoiceManager.falar(def.curiosidade, 'bicho', true);
    this.add.particles(img.x, img.y - 30, 'brilho', {
      lifespan: 700,
      speed: { min: 60, max: 160 },
      scale: { start: 1, end: 0 },
      tint: [0xfff1a8, 0xffd766],
      quantity: 16,
      emitting: false,
    }).setDepth(9).explode(16);

    if (def.demo.tipo === 'pular') {
      // O mocó sobe o lajedo num salto, mostrando o caminho pelas pedras.
      const { dx, dy } = def.demo;
      const x0 = img.x;
      const y0 = img.y;
      img.setFlipX(false);
      this.time.delayedCall(900, () =>
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 1000,
          ease: 'Sine.easeInOut',
          onUpdate: (tw) => {
            const t = tw.getValue() ?? 0;
            img.setPosition(x0 + dx * TILE * t, y0 + dy * TILE * t - Math.sin(Math.PI * t) * 140);
          },
        }),
      );
    } else {
      // O tatu-bola se fecha quando uma pedrinha cai perto, e depois se abre de novo.
      this.time.delayedCall(1400, () => {
        const pedra = this.add.image(img.x, img.y - 320, 'pedrinha').setDepth(9);
        this.tweens.add({
          targets: pedra,
          y: img.y - 40,
          duration: 450,
          ease: 'Quad.easeIn',
          onStart: () => {
            this.time.delayedCall(200, () => {
              img.setTexture('tatu-bola');
              AudioManager.tocar('bola');
            });
          },
          onComplete: () => {
            AudioManager.tocar('pedra');
            this.tweens.add({ targets: pedra, x: pedra.x + 90, y: pedra.y - 60, alpha: 0, angle: 200, duration: 500, onComplete: () => pedra.destroy() });
            this.time.delayedCall(1500, () => {
              img.setTexture('tatu');
              AudioManager.tocar('desbola');
              if (def.daPoder === 'bola') this.ganharPoderBola(img);
            });
          },
        });
      });
    }
  }

  private ganharPoderBola(origem: Phaser.GameObjects.Image) {
    const faisca = this.add.image(origem.x, origem.y - 30, 'brilho').setScale(3).setDepth(20).setTint(0xffd766);
    this.tweens.add({
      targets: faisca,
      x: this.player.x,
      y: this.player.y,
      duration: 700,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        faisca.destroy();
        const novo = !this.player.temPoderBola;
        this.player.temPoderBola = true;
        SaveManager.conquistar('poderes', 'bola');
        AudioManager.tocar('poder');
        this.cameras.main.flash(200, 255, 240, 170);
        this.events.emit('poder', true);
        if (novo) VoiceManager.falar('Agora você também pode virar bola! Aperte o botão da pata.', 'narrador', true);
      },
    });
  }

  // ------------------------------------------------------------------ pedrinhas

  private soltarPedrinhas(dt: number) {
    const cam = this.cameras.main;
    const centro = cam.scrollX + cam.width / 2;
    for (const f of this.fontesPedrinhas) {
      // só caem perto da tela (economiza e não assusta de longe)
      if (Math.abs(f.x - centro) > cam.width) continue;
      f.t -= dt;
      if (f.t > 0) continue;
      f.t = 1.1 + Math.random() * 0.4;
      const p = this.pedrinhas.create(f.x + Phaser.Math.Between(-10, 10), f.y, 'pedrinha') as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      p.setDepth(6);
      p.body.setGravityY(1400);
      p.body.setSize(16, 16);
      p.setAngularVelocity(Phaser.Math.Between(-200, 200));
    }
    this.pedrinhas.getChildren().forEach((g) => {
      const p = g as Phaser.Physics.Arcade.Image;
      if (p.y > this.alturaMundo) p.destroy();
    });
  }

  private quebrarPedrinha(p: Phaser.Physics.Arcade.Image) {
    this.estilhacos.explode(5, p.x, p.y + 8);
    if (Math.abs(p.x - this.player.x) < 500) AudioManager.tocar('pedra');
    p.destroy();
  }

  /** Pedrinha bate na bola e é jogada para longe. */
  private quicarPedrinha(p: Phaser.Physics.Arcade.Image) {
    if (!p.body?.enable) return;
    p.disableBody(false, false);
    AudioManager.tocar('pedra');
    this.tweens.add({
      targets: p,
      x: p.x + Phaser.Math.Between(-90, 90),
      y: p.y - 90,
      alpha: 0,
      duration: 450,
      onComplete: () => p.destroy(),
    });
  }

  // ------------------------------------------------------------------ eventos

  private pegar(p: Phaser.Types.Physics.Arcade.ImageWithStaticBody) {
    const id = p.getData('id') as string;
    p.body.enable = false;
    AudioManager.tocar('pegada');
    this.pegadasPegas.add(id);
    this.events.emit('pegadas', this.contarPegadasFase());
    this.tweens.killTweensOf(p);
    this.tweens.add({
      targets: p,
      y: p.y - 60,
      alpha: 0,
      scale: 1.6,
      duration: 350,
      ease: 'Quad.easeOut',
      onComplete: () => p.destroy(),
    });
  }

  contarPegadasFase(): { pegas: number; total: number } {
    return { pegas: this.pegadasPegas.size, total: this.totalPegadas };
  }

  private morrer() {
    if (this.player.estado === 'caido' || this.terminou) return;
    const trecho = `${this.def.id}:${this.checkpointAtual}`;
    const tentativas = SaveManager.registrarTentativa(trecho);
    this.player.cair(() => {
      this.player.renascer(this.respawn.x, this.respawn.y);
      this.cameras.main.flash(150, 255, 255, 255);
      // Ajuda da Vovó Lili depois de várias tentativas no mesmo trecho (nunca resolve sozinha).
      const dica = this.def.dicas[this.checkpointAtual];
      if (dica && tentativas >= 4 && !this.dicaMostrada.has(this.checkpointAtual)) {
        this.dicaMostrada.add(this.checkpointAtual);
        VoiceManager.falar(dica, 'lili');
      }
    });
  }

  private concluir() {
    if (this.terminou) return;
    this.terminou = true;
    this.player.comemorar();
    AudioManager.pararMusica();
    AudioManager.tocar('vitoria');
    VoiceManager.falar('Você achou o Atlas! Muito bem, Chico!', 'narrador');

    const prog = SaveManager.fase(this.def.id);
    prog.concluida = true;
    prog.pegadas = [...this.pegadasPegas];
    if (!prog.melhorTempoMs || this.tempo < prog.melhorTempoMs) prog.melhorTempoMs = Math.round(this.tempo);
    SaveManager.salvar();

    this.add.particles(this.objetivo.x, this.objetivo.y - 80, 'brilho', {
      lifespan: 1600,
      speed: { min: 150, max: 420 },
      angle: { min: 200, max: 340 },
      gravityY: 500,
      scale: { start: 1.6, end: 0.2 },
      tint: [0xff6b6b, 0xffd766, 0x5cc26a, 0x5bb0e8, 0xc77dff],
      quantity: 60,
      emitting: false,
    }).setDepth(30).explode(80);

    this.time.delayedCall(1800, () => {
      this.scene.launch('Fim', {
        faseId: this.def.id,
        proximaId: proximaFase(this.def.id)?.id,
        ...this.contarPegadasFase(),
        tempoMs: this.tempo,
      });
      this.scene.pause();
    });
  }

  pausar() {
    if (this.pausado || this.terminou) return;
    this.pausado = true;
    this.physics.pause();
    this.scene.launch('Pausa', { faseId: this.def.id });
    this.scene.pause();
  }

  retomar() {
    this.pausado = false;
    this.physics.resume();
  }
}
