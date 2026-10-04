import Phaser from 'phaser';
import { TILE, PLAYER, VENTO, CAVAR, MARE } from '../config';
import { Player } from '../entities/Player';
import { InputManager } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { VoiceManager } from '../systems/VoiceManager';
import { SaveManager } from '../core/SaveManager';
import { LINHAS, type LevelDef, type AnimalNaFase, type Poder } from '../levels/types';
import { FASES, CAMPANHA, proximaFase } from '../levels';
import { TEMAS, type TemaMundo } from '../data/mundos';
import { FAMILIA, ehFamiliar } from '../data/familia';

const LINHAS_EXTRAS = 3;
const TEXTURA_BICHO: Record<AnimalNaFase['id'], string> = {
  moco: 'moco',
  'tatu-bola': 'tatu',
  'asa-branca': 'asa-branca',
  carcara: 'carcara',
  prea: 'prea',
  onca: 'onca',
  arara: 'arara',
  preguica: 'preguica',
  boto: 'boto',
  perereca: 'perereca',
  guepardo: 'guepardo',
  elefante: 'elefante',
  girafa: 'girafa',
  zebra: 'zebra',
  avestruz: 'avestruz',
  canguru: 'canguru',
  wombat: 'wombat',
  emu: 'emu',
  ornitorrinco: 'ornitorrinco',
  coala: 'coala',
  'urso-polar': 'urso-polar',
  'raposa-artica': 'raposa-artica',
  rena: 'rena',
  foca: 'foca',
  'coruja-das-neves': 'coruja-das-neves',
  pinguim: 'pinguim',
  'foca-de-weddell': 'foca-de-weddell',
  orca: 'orca',
  jubarte: 'jubarte',
  albatroz: 'albatroz',
  tartaruga: 'tartaruga',
  'peixe-boi': 'peixe-boi',
  golfinho: 'golfinho',
  caranguejo: 'caranguejo',
  'cavalo-marinho': 'cavalo-marinho',
  'pegadas-sousa': 'pegadas-sousa',
  irritator: 'irritator',
  pterossauro: 'pterossauro',
  staurikosaurus: 'staurikosaurus',
  buriolestes: 'buriolestes',
  carnotaurus: 'carnotaurus',
  argentinosaurus: 'argentinosaurus',
  velociraptor: 'velociraptor',
  trex: 'trex',
  teropode: 'teropode',
  sauropode: 'sauropode',
  ornitopode: 'ornitopode',
};

/** Coluna com maré: onde fica a superfície na maré alta e na baixa, e o fundo da água da maré. */
interface ColunaMare {
  alta: number;
  baixa: number;
  /** y onde a água da maré acaba (chão ou a água que nunca seca). */
  fundo: number;
  topo: Phaser.GameObjects.Image;
  corpo: Phaser.GameObjects.TileSprite;
}

/** Redemoinho do Vento Viravolta (X): anda para lá e para cá; pular em cima desmancha. */
interface Redemoinho {
  img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  dir: number;
  vivo: boolean;
  folhas: Phaser.GameObjects.Particles.ParticleEmitter;
  /** Onde nasceu: anda no máximo 3 blocos para cada lado (não chega nos checkpoints). */
  x0: number;
}

interface Pedregulho {
  img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  x0: number;
  y0: number;
}
/** Caracteres de água: rasa (~) e funda (w). */
const AGUA = new Set(['~', 'w']);

interface FonteSom {
  x: number;
  y: number;
  t: number;
}

interface ZonaVento {
  area: Phaser.Geom.Rectangle;
  dir: 1 | -1;
  folhas: Phaser.GameObjects.Particles.ParticleEmitter;
}

interface Plataforma {
  img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  x0: number;
  y0: number;
  eixo: 'x' | 'y';
  amp: number;
  periodo: number;
  fase: number;
  /** Posição do corpo no quadro anterior (para carregar o Chico junto). */
  ultimoX: number;
  ultimoY: number;
}

interface Bicho {
  img: Phaser.GameObjects.Image;
  def: AnimalNaFase;
  ativado: boolean;
  /** Bicho que corre na frente do Chico mostrando o caminho (o emu). */
  guia?: { xFinal: number; tempo: number };
  /** Fóssil ainda enterrado (monte de escavação). */
  escondido?: boolean;
  /** O narrador já explicou como escavar este monte. */
  avisado?: boolean;
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
  /** Quem da família fala nesta placa: em pé ao lado dela, ou pelo Chamador do Atlas (tias que moram longe). */
  pessoa?: Phaser.GameObjects.GameObject & { x: number; y: number; angle: number };
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
  /** Página voando em que o Chico está em pé (ele anda junto com ela). */
  private montado: Plataforma | null = null;
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
  /** Momento do bicho: o jogo para enquanto o bicho fala, com a figura dele grande na tela. */
  emFoco = false;
  private fundo: { img: Phaser.GameObjects.TileSprite; fator: number; afundar: number }[] = [];
  private olharFrente = 0;
  private dicaMostrada = new Set<number>();
  private iconeAcao!: Phaser.GameObjects.Image;
  private relogioPlataformas = 0;
  private bichos: Bicho[] = [];
  private fontesPedrinhas: FontePedrinhas[] = [];
  private pedrinhas!: Phaser.Physics.Arcade.Group;
  private estilhacos!: Phaser.GameObjects.Particles.ParticleEmitter;
  private flocos!: Phaser.GameObjects.Particles.ParticleEmitter;
  private ventos: ZonaVento[] = [];
  private relogioVento = 0;
  private rajadaForte = false;
  private gatilhoChuva: number | null = null;
  private chovendo = false;
  private chuvaCaindo = false;
  private toposTerra: { x: number; y: number }[] = [];
  private tema!: TemaMundo;
  /** Grade da fase (para saber onde há água). */
  private grade: string[] = [];
  private fontesSom: FonteSom[] = [];
  private respingos!: Phaser.GameObjects.Particles.ParticleEmitter;
  private pedregulhos: Pedregulho[] = [];
  private grupoPedregulhos!: Phaser.Physics.Arcade.Group;
  /** Terra fofa (F) por "coluna,linha": some quando o Chico cava com o poder do wombat. */
  private fofas = new Map<string, Phaser.Types.Physics.Arcade.ImageWithStaticBody>();
  private grupoFofas!: Phaser.Physics.Arcade.StaticGroup;
  private cavando: { id: string; t: number; som: number } | null = null;
  /** Neve fofa (N): quebra com o mergulho da raposa. */
  private neves = new Map<string, Phaser.Types.Physics.Arcade.ImageWithStaticBody>();
  private grupoNeves!: Phaser.Physics.Arcade.StaticGroup;
  /** Quantas vezes a Mamãe July já tirou o Chico da água gelada nesta fase (a fala não se repete demais). */
  private resgates = 0;
  /** Submarino do Vovô Marcos (aparece em volta do Chico quando ele está na água). */
  private submarino?: Phaser.GameObjects.Image;
  /** Tempestade branca: a tela clareia nas rajadas. */
  private brancura?: Phaser.GameObjects.Rectangle;
  /** Maré: colunas com água "%" e o relógio dela (0 = baixa, 1 = alta). */
  private mare = new Map<number, ColunaMare>();
  private nivelMare = 0;
  private relogioMare = 0;
  /** Lixo trazido pelo mar (l). */
  private lixos!: Phaser.Physics.Arcade.StaticGroup;
  private totalLixo = 0;
  private lixoPego = 0;
  /** Coluna onde começa cada trecho (para o poder por trecho da fase final). */
  private inicioTrechos: number[] = [];
  /** Fichas que entraram no Atlas pela primeira vez nesta fase (revelação e adivinha no fim). */
  private novosBichos: string[] = [];
  private redemoinhos: Redemoinho[] = [];
  private grupoRedemoinhos!: Phaser.Physics.Arcade.Group;
  /** Depois de renascer, um instante sem levar dano dos redemoinhos. */
  private semDanoAte = 0;
  private escuridao?: Phaser.GameObjects.Image;

  constructor() {
    super('Level');
  }

  init(data: { faseId?: string }) {
    this.def = FASES[data.faseId ?? ''] ?? CAMPANHA[0];
    this.tema = TEMAS[this.def.tema ?? this.def.mundo];
    this.fontesSom = [];
    this.pedregulhos = [];
    this.fofas = new Map();
    this.cavando = null;
    this.neves = new Map();
    this.resgates = 0;
    this.submarino = undefined;
    this.brancura = undefined;
    this.mare = new Map();
    this.novosBichos = [];
    this.redemoinhos = [];
    this.semDanoAte = 0;
    this.nivelMare = 0;
    this.relogioMare = 0;
    this.totalLixo = 0;
    this.lixoPego = 0;
    this.escuridao = undefined;
    this.bichos = [];
    this.fontesPedrinhas = [];
    this.ventos = [];
    this.relogioVento = 0;
    this.rajadaForte = false;
    this.gatilhoChuva = null;
    this.chovendo = false;
    this.chuvaCaindo = false;
    this.toposTerra = [];
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
    this.emFoco = false;
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
    this.physics.add.collider(this.player.sprite, this.grupoFofas);
    this.physics.add.collider(this.player.sprite, this.grupoNeves);
    const apoiar = () => this.player.apoiar();
    this.physics.add.collider(this.player.sprite, this.lajes, apoiar, this.podePisar, this);
    this.physics.add.collider(
      this.player.sprite,
      this.plataformas.map((p) => p.img),
      (_p, img) => {
        this.player.apoiar();
        this.montado = this.plataformas.find((p) => p.img === img) ?? null;
      },
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
    this.player.temPoderOnca = SaveManager.data.poderes.includes('onca');
    this.player.temPoderArrancada = SaveManager.data.poderes.includes('arrancada');
    this.player.temPoderForca = SaveManager.data.poderes.includes('forca');
    this.player.temPoderSuperPulo = SaveManager.data.poderes.includes('superpulo');
    this.player.temPoderCavar = SaveManager.data.poderes.includes('cavar');
    this.player.temPoderMergulho = SaveManager.data.poderes.includes('mergulho');
    this.player.temPoderToboga = SaveManager.data.poderes.includes('toboga');
    this.player.temPoderGiro = SaveManager.data.poderes.includes('giro');
    if (this.def.submarino) {
      // No submarino do Vovô Marcos dá para mergulhar mesmo na água funda e gelada.
      this.player.temPoderOnca = true;
      this.submarino = this.add.image(0, 0, 'submarino').setDepth(12).setVisible(false);
    }
    this.player.poderBotao = this.tema.poderBotao;
    this.atualizarPedregulhos();

    // Pedregulhos: caem, param com atrito e só se movem com a força do elefante.
    this.physics.add.collider(this.grupoPedregulhos, this.solidos);
    this.physics.add.collider(this.grupoPedregulhos, this.grupoPedregulhos);
    this.physics.add.collider(this.player.sprite, this.grupoPedregulhos, (_p, pd) => {
      const pb = this.player.body;
      const bb = (pd as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).body;
      // em cima do pedregulho dá para pular
      if (pb.bottom <= bb.top + 6) this.player.apoiar();
      else if (this.player.temPoderForca && Math.abs(bb.velocity.x) > 20 && Math.random() < 0.15) {
        AudioManager.tocar('empurrar');
        this.player.soltarPoeira(bb.x + (bb.velocity.x > 0 ? 0 : bb.width), bb.bottom);
      }
    });
    this.player.aoEntrarNaAgua = () => {
      AudioManager.tocar('splash');
      this.respingos.explode(12, this.player.x, this.aguaSuperficie(this.player.x, this.player.y) ?? this.player.y);
    };
    this.physics.add.overlap(this.player.sprite, this.pegadas, (_p, peg) =>
      this.pegar(peg as Phaser.Types.Physics.Arcade.ImageWithStaticBody),
    );
    this.physics.add.overlap(this.player.sprite, this.objetivo, () => this.concluir());
    this.physics.add.overlap(this.player.sprite, this.lixos, (_p, l) => this.recolherLixo(l as Phaser.Types.Physics.Arcade.ImageWithStaticBody));
    this.physics.add.collider(this.grupoRedemoinhos, this.solidos);
    this.physics.add.collider(this.grupoRedemoinhos, this.grupoFofas);
    this.physics.add.collider(this.grupoRedemoinhos, this.grupoNeves);
    this.physics.add.collider(this.grupoRedemoinhos, this.lajes);
    this.physics.add.overlap(this.player.sprite, this.grupoRedemoinhos, (_p, r) => this.tocarRedemoinho(r as Phaser.Types.Physics.Arcade.ImageWithDynamicBody));

    // Câmera: segue com suavidade e antecipa a direção do movimento
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.larguraMundo, this.alturaMundo);
    cam.startFollow(this.player.sprite, true, 0.12, 0.1);
    cam.setDeadzone(80, 120);
    cam.setRoundPixels(true);
    this.physics.world.setBounds(0, -400, this.larguraMundo, this.alturaMundo + 800);

    this.iconeAcao = this.add.image(0, 0, 'btn-acao').setScale(0.45).setDepth(20).setVisible(false);

    // Noite: tudo escuro, menos uma roda de luz em volta do Chico. Vaga-lumes e o objetivo ficam por cima.
    // Tempestade branca: neve soprando o tempo todo e a tela clareando nas rajadas
    if (this.def.nevasca) {
      const { width, height } = this.scale;
      this.brancura = this.add.rectangle(0, 0, width * 2, height * 2, 0xf4f8fc, 0.08).setOrigin(0).setScrollFactor(0).setDepth(29);
      this.add
        .particles(0, -20, 'floco', {
          x: { min: 0, max: width * 1.3 },
          lifespan: 2400,
          speedY: { min: 120, max: 230 },
          speedX: { min: -280, max: -140 },
          scale: { min: 0.4, max: 1 },
          alpha: { start: 0.9, end: 0.3 },
          frequency: 35,
        })
        .setScrollFactor(0)
        .setDepth(30);
    }
    if (this.def.noite) {
      this.escuridao = this.add.image(this.player.x, this.player.y, 'escuridao').setScale(16).setDepth(30);
      this.objetivo.setDepth(31);
    }

    this.scene.launch('Hud', { level: this });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.stop('Hud');
      VoiceManager.calar();
      AudioManager.chuva(false);
    });

    if (!SaveManager.data.settings.reduzirMovimento) cam.fadeIn(350);
    AudioManager.tocarMusica(this.tema.musica);
    if (this.def.abertura) {
      const a = this.def.abertura;
      this.time.delayedCall(500, () => VoiceManager.falar(a.texto, a.quem));
    }
  }

  // ------------------------------------------------------------------ construção

  private criarFundo() {
    const { width, height } = this.scale;
    const tema = this.tema;
    const noite = !!this.def.noite;
    this.add.image(0, 0, noite ? 'ceu-noite' : tema.ceu).setOrigin(0).setScrollFactor(0).setDisplaySize(width, height).setDepth(-100);
    if (noite) {
      this.add.tileSprite(0, 0, 2048, 360, 'estrelas').setOrigin(0).setScrollFactor(0).setDepth(-99.5);
      this.add.image(width * 0.8, 120, 'lua').setScrollFactor(0).setDepth(-99);
    } else if (tema.solBaixo) {
      // sol da meia-noite: baixinho, quase encostando no horizonte, e não se põe
      this.add.image(width * 0.7, height * 0.4, 'sol').setScrollFactor(0).setDepth(-99).setTint(0xffe0a0);
    } else if (tema.sol) this.add.image(width * 0.78, 130, 'sol').setScrollFactor(0).setDepth(-99);
    if (tema.nuvens && !noite) {
      for (let i = 0; i < 5; i++) {
        const n = this.add.image(i * 700 + 120, 80 + (i % 3) * 50, 'nuvem').setScrollFactor(0.08, 0).setDepth(-98);
        n.setScale(0.7 + (i % 2) * 0.4);
      }
    }
    tema.fundo.forEach((camada, i) => {
      const img = this.add
        .tileSprite(0, height - camada.altura, width, camada.altura, camada.textura)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(-97 + i);
      // de noite as camadas de fundo ficam azuladas e escuras
      if (noite) img.setTint(i === 0 ? 0x3a4a7a : 0x2a3558);
      this.fundo.push({ img, fator: camada.fator, afundar: camada.afundar });
    });
    this.scale.on('resize', this.aoRedimensionar, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.aoRedimensionar, this));
  }

  private aoRedimensionar(size: Phaser.Structs.Size) {
    for (const f of this.fundo) f.img.setSize(size.width, f.img.height);
  }

  private construirFase() {
    // Junta os trechos em uma grade só.
    const grade: string[] = Array.from({ length: LINHAS }, () => '');
    this.inicioTrechos = [];
    for (const trecho of this.def.trechos) {
      this.inicioTrechos.push(grade[0].length);
      const largura = Math.max(...trecho.map((l) => l.length));
      const linhas = [...Array(LINHAS - trecho.length).fill(''), ...trecho];
      for (let r = 0; r < LINHAS; r++) grade[r] += linhas[r].padEnd(largura, '.');
    }
    // Terra extra abaixo da fase: deixa a câmera mostrar o chão mais alto na tela, acima dos controles de toque.
    const ultima = grade[LINHAS - 1];
    // Embaixo dos rios fica o leito (terra): a água nunca "vaza" pelo fundo da fase.
    // Bicho, pegada ou chamado no fundo do rio (água dos dois lados) também ganham leito embaixo.
    const noRio = (c: number) => AGUA.has(ultima[c]) || ('AoZMV'.includes(ultima[c]) && AGUA.has(ultima[c - 1] ?? '.') && AGUA.has(ultima[c + 1] ?? '.'));
    const leito = [...ultima].map((ch, c) => (ch === '#' || ch === 'R' || ch === 'I' ? ch : ch === 'F' || ch === 'N' || noRio(c) ? '#' : '.')).join('');
    for (let i = 0; i < LINHAS_EXTRAS; i++) grade.push(leito);
    const linhas = grade.length;
    const cols = grade[0].length;
    this.larguraMundo = cols * TILE;
    this.alturaMundo = linhas * TILE;
    const at = (r: number, c: number) => (r >= 0 && r < linhas && c >= 0 && c < cols ? grade[r][c] : '.');
    const SOLIDOS = this.tema.solidos;
    const solido = (r: number, c: number) => at(r, c) in SOLIDOS;
    /**
     * Linha onde algo colocado em (r, c) fica em pé: a própria ou até 3 abaixo, se houver chão (ou galho) embaixo.
     * Água não é chão e ninguém desce para dentro dela (senão a placa ia parar no fundo do rio).
     */
    const molhado = (r: number, c: number) => AGUA.has(at(r, c)) || at(r, c) === '%';
    const pouso = (r: number, c: number): number | null => {
      for (let rr = r; rr <= r + 3; rr++) {
        if (solido(rr, c) || molhado(rr, c)) return null;
        if (molhado(rr + 1, c)) return null;
        if (solido(rr + 1, c) || at(rr + 1, c) === '=') return rr;
      }
      return null;
    };
    // Bicho ou pegada no meio do rio (água dos dois lados) também conta como água.
    const aguaEm = (r: number, c: number): string | null => {
      const ch = at(r, c);
      if (AGUA.has(ch)) return ch;
      if ('AoZMV'.includes(ch) && AGUA.has(at(r, c - 1)) && AGUA.has(at(r, c + 1))) return at(r, c - 1);
      return null;
    };
    this.grade = grade.map((linha, r) => [...linha].map((ch, c) => aguaEm(r, c) ?? ch).join(''));

    // Água: desenhada na frente do Chico (ele "entra" nela); a superfície tem ondinhas.
    for (let r = 0; r < LINHAS; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = aguaEm(r, c);
        if (!ch) continue;
        const funda = ch === 'w';
        const topo = !aguaEm(r - 1, c) && at(r - 1, c) !== '%';
        const textura = `agua-${funda ? 'funda' : 'rasa'}${topo ? '-topo' : ''}`;
        const img = this.add.image(c * TILE, r * TILE, textura).setOrigin(0).setDepth(11);
        if (topo) this.tweens.add({ targets: img, y: img.y + 3, yoyo: true, repeat: -1, duration: 900 + (c % 4) * 120, ease: 'Sine.easeInOut' });
      }
    }

    // Maré: em cada coluna com "%", a água sobe até o topo do "%" (alta) e desce até a base (baixa)
    for (let c = 0; c < cols; c++) {
      let r0 = -1;
      for (let r = 0; r < LINHAS; r++) if (at(r, c) === '%') { r0 = r; break; }
      if (r0 < 0) continue;
      let r1 = r0;
      while (at(r1, c) === '%') r1++;
      const debaixoEAgua = AGUA.has(at(r1, c));
      const col: ColunaMare = {
        alta: r0 * TILE + 8,
        baixa: debaixoEAgua ? r1 * TILE + 8 : r1 * TILE,
        fundo: r1 * TILE,
        topo: this.add.image(c * TILE, r1 * TILE, 'agua-rasa-topo').setOrigin(0).setDepth(11),
        corpo: this.add.tileSprite(c * TILE, r1 * TILE, TILE, 1, 'agua-rasa').setOrigin(0).setDepth(11),
      };
      this.mare.set(c, col);
    }

    // Tocas: fundo de terra escura atrás da terra fofa (aparece quando ela é cavada) e dos túneis "t".
    const naToca = (r: number, c: number) => {
      const ch = at(r, c);
      return ch === 't' || ('o*Z'.includes(ch) && (at(r, c - 1) === 't' || at(r, c + 1) === 't'));
    };
    for (let r = 0; r < LINHAS; r++) {
      for (let c = 0; c < cols; c++) {
        if ('FN'.includes(at(r, c)) || naToca(r, c)) this.add.image(c * TILE, r * TILE, this.tema.toca ?? 'fundo-toca').setOrigin(0).setDepth(0.5);
      }
    }

    // Fundo escuro nos buracos (perigo legível para quem não lê).
    for (let c = 0; c < cols; c++) {
      if (!solido(LINHAS - 1, c) && !aguaEm(LINHAS - 1, c) && !'FN'.includes(at(LINHAS - 1, c))) {
        this.add.image(c * TILE, (LINHAS - 3) * TILE, 'buraco').setOrigin(0).setDepth(0).setDisplaySize(TILE, (LINHAS_EXTRAS + 3) * TILE);
      }
    }

    this.solidos = this.physics.add.staticGroup();
    this.lajes = this.physics.add.staticGroup();
    this.espinhos = this.physics.add.staticGroup();
    this.escadas = this.physics.add.staticGroup();
    this.pegadas = this.physics.add.staticGroup();
    this.pedrinhas = this.physics.add.group();
    this.grupoPedregulhos = this.physics.add.group();
    this.grupoFofas = this.physics.add.staticGroup();
    this.grupoNeves = this.physics.add.staticGroup();
    this.lixos = this.physics.add.staticGroup();
    this.grupoRedemoinhos = this.physics.add.group({ allowGravity: true });
    this.respingos = this.add.particles(0, 0, 'bolha', {
      lifespan: 600,
      speedX: { min: -140, max: 140 },
      speedY: { min: -320, max: -120 },
      gravityY: 700,
      scale: { start: 1.2, end: 0.4 },
      emitting: false,
    });
    this.respingos.setDepth(12);
    this.estilhacos = this.add.particles(0, 0, 'poeira', {
      lifespan: 350,
      speedX: { min: -120, max: 120 },
      speedY: { min: -160, max: -40 },
      scale: { start: 0.7, end: 0 },
      tint: 0xb7aa98,
      emitting: false,
    });
    this.estilhacos.setDepth(7);
    this.flocos = this.add.particles(0, 0, 'floco', {
      lifespan: 600,
      speedX: { min: -160, max: 160 },
      speedY: { min: -260, max: -60 },
      gravityY: 600,
      scale: { start: 1, end: 0.3 },
      alpha: { start: 1, end: 0 },
      emitting: false,
    });
    this.flocos.setDepth(12);

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
          // chão de toca, embaixo da terra fofa ou leito de rio: sem capim por cima
          const temTopo = !solido(r - 1, c) && !'FN'.includes(at(r - 1, c)) && !naToca(r - 1, c) && !aguaEm(r - 1, c);
          this.add.image(c * TILE, r * TILE, temTopo ? comTopo : interno).setOrigin(0).setDepth(1);
          if (temTopo && at(r, c) === '#') this.toposTerra.push({ x: c * TILE, y: r * TILE });
          c++;
        }
        const anterior = corpos.find((k) => k.c0 === c0 && k.c1 === c - 1 && k.r1 === r - 1);
        if (anterior) anterior.r1 = r;
        else corpos.push({ c0, c1: c - 1, r0: r, r1: r });
      }
    }
    // Zonas de vento: células "<" e ">" viram retângulos por linha, cada um com suas folhas voando.
    for (let r = 0; r < LINHAS; r++) {
      let c = 0;
      while (c < cols) {
        const ch = at(r, c);
        if (ch !== '<' && ch !== '>') {
          c++;
          continue;
        }
        const c0 = c;
        while (at(r, c) === ch) c++;
        const area = new Phaser.Geom.Rectangle(c0 * TILE, r * TILE, (c - c0) * TILE, TILE);
        const dir = ch === '>' ? 1 : -1;
        const folhas = this.add.particles(0, 0, this.tema.particulaVento ?? 'folha', {
          lifespan: 1600,
          speedX: { min: dir * 260, max: dir * 420 },
          speedY: { min: -30, max: 30 },
          rotate: { min: 0, max: 360 },
          alpha: { start: 0.9, end: 0 },
          frequency: 350,
          emitZone: { type: 'random', source: area as any },
        });
        folhas.setDepth(9);
        this.ventos.push({ area, dir, folhas });
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
            const l = this.lajes.create(x, y, this.tema.laje).setOrigin(0).setDepth(2) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            l.refreshBody();
            this.soDeCima(l.body);
            break;
          }
          case '^': {
            const e = this.espinhos.create(cx, y + TILE, this.tema.espinhos).setOrigin(0.5, 1).setDepth(3) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            e.refreshBody();
            // hitbox menor que o desenho: só pune quando realmente encosta
            e.body.setSize(40, 28).setOffset(12, 20);
            this.tweens.add({ targets: e, scaleY: 0.94, yoyo: true, repeat: -1, duration: 700 + (c % 3) * 90, ease: 'Sine.easeInOut' });
            break;
          }
          case 'Z':
            this.fontesSom.push({ x: cx, y: y + TILE / 2, t: this.fontesSom.length * 0.8 });
            break;
          case 'H':
          case 'J':
          case 'E': {
            // H: escada de corda (Vovô Marcos); J: cipó da floresta; E: tronco de eucalipto. Todos se escalam igual.
            const textura = ch === 'J' ? 'cipo' : ch === 'E' ? 'tronco-eucalipto' : 'escada';
            const h = this.escadas.create(cx, y + TILE / 2, textura).setDepth(2) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
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
            // bandeira no chão: se o desenho da fase a deixou um pouco acima do chão, ela desce até ele
            const yc = (pouso(r, c) ?? r) * TILE + TILE;
            const img = this.add.image(cx, yc, 'checkpoint').setOrigin(0.5, 1).setDepth(2);
            this.checkpoints.push({ img, x: cx, y: yc - PLAYER.bodyHeight / 2, indice: cpIdx++, ativo: false });
            break;
          }
          case 'S': {
            // Placa e pessoa sempre em chão firme: se o desenho da fase deixou a placa na beira de um buraco,
            // ela vai para o bloco com chão mais perto (até 2 blocos para o lado).
            let cp = c;
            if (pouso(r, c) === null) cp = c + ([-1, 1, -2, 2].find((d) => pouso(r, c + d) !== null) ?? 0);
            const rp = pouso(r, cp) ?? r;
            const temChao = (cc: number) => pouso(rp, cc) === rp;
            const px = cp * TILE + TILE / 2;
            const yp = rp * TILE + TILE;
            const img = this.add.image(px, yp, 'placa').setOrigin(0.5, 1).setDepth(2).setData('movida', cp !== c || rp !== r);
            const quem = this.def.placas[placaIdx]?.quem;
            let pessoa: Placa['pessoa'];
            if (quem && ehFamiliar(quem)) {
              if (FAMILIA[quem].presencial) {
                // em pé ao lado da placa, olhando para o Chico (que vem da esquerda), no lado que tem chão;
                // sem chão dos dois lados, fica na frente da placa
                // (do lado da bandeira, fica um bloco mais longe para não ficar em cima dela)
                const livre = (cc: number) => temChao(cc) && at(rp, cc) !== 'C';
                const dx = livre(cp + 1) ? 46 : livre(cp - 1) ? -46 : temChao(cp - 2) && livre(cp - 2) ? -46 - TILE : 18;
                pessoa = this.add
                  .image(px + dx, yp, 'familia', `corpo-${quem}`)
                  .setOrigin(0.5, 1)
                  .setScale(0.5)
                  .setFlipX(true)
                  .setDepth(2.5)
                  .setData('y0', yp);
              } else {
                // chamada de vídeo: o tabletzinho flutua em cima da placa
                const tela = this.add.image(0, 0, 'chamador');
                const rosto = this.add.image(0, -8, 'familia', `rosto-${quem}`).setScale(0.62);
                pessoa = this.add.container(px, yp - TILE - 30, [tela, rosto]).setDepth(2.5).setScale(0.8);
                this.tweens.add({ targets: pessoa, y: yp - TILE - 40, yoyo: true, repeat: -1, duration: 1000, ease: 'Sine.easeInOut' });
              }
            }
            this.placas.push({ img, indice: placaIdx++, ouvida: false, pessoa });
            break;
          }
          case 'M':
          case 'V': {
            const img = this.physics.add.image(cx, y + 14, this.tema.plataforma ?? 'pagina').setDepth(5) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            img.body.setAllowGravity(false);
            img.body.setImmovable(true);
            // quem carrega o Chico é a cena (carregarMontado), sem o atrito automático da física (que falhava)
            img.body.setFriction(0, 0);
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
              ultimoX: img.body.x,
              ultimoY: img.body.y,
            });
            break;
          }
          case 'A': {
            const def = this.def.animais?.[bichoIdx++];
            if (!def) break;
            // Os desenhos olham para a direita; o bicho espera o Chico olhando para a esquerda.
            // A preguiça fica pendurada no galho que está no bloco logo acima dela.
            const pendurada = def.id === 'preguica';
            // fóssil enterrado: primeiro aparece o monte de escavação
            const textura = def.fossil ? 'monte-escavacao' : TEXTURA_BICHO[def.id];
            const img = this.add
              .image(cx, pendurada ? y - TILE + 18 : y + TILE, textura)
              .setOrigin(0.5, pendurada ? 0 : 1)
              .setDepth(aguaEm(r, c) ? 10 : def.semFicha ? 1.7 : 8)
              .setFlipX(!def.fossil);
            // silhuetas dos grupos de dinossauros: grandes, como sombras do passado
            // páginas do Atlas: tamanho proporcional ao bicho (o Velociraptor é pequeno, como no dossiê)
            const escala =
              { teropode: 1.6, sauropode: 2.4, ornitopode: 1.4, argentinosaurus: 2.4, trex: 1.7, carnotaurus: 1.4 }[def.id as string] ?? 1;
            img.setScale(escala).setData('escala', escala);
            if (def.semFicha) img.setAlpha(0.85);
            if (!def.fossil) this.tweens.add({ targets: img, scaleY: escala * 0.95, yoyo: true, repeat: -1, duration: 600, ease: 'Sine.easeInOut' });
            if (def.pagina) {
              // página do Atlas Vivo: o dinossauro aparece como uma projeção de luz saindo do livro
              const luz = this.add.ellipse(cx, y + TILE - img.displayHeight / 2, img.displayWidth + 60, img.displayHeight + 40, 0xfff1a8, 0.35).setDepth(7.9);
              this.tweens.add({ targets: luz, alpha: 0.15, yoyo: true, repeat: -1, duration: 900 });
              this.add.image(cx, y + TILE + 4, 'atlas').setOrigin(0.5, 1).setScale(0.45).setDepth(8.1);
              img.setAlpha(0.9);
            }
            this.bichos.push({ img, def, ativado: false, escondido: !!def.fossil });
            break;
          }
          case 'B': {
            // Pedregulho 2x2: o "B" marca o bloco de baixo à esquerda.
            const img = this.physics.add.image(x + TILE, y + TILE, 'pedregulho').setOrigin(0.5, 1).setDepth(6) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            this.grupoPedregulhos.add(img);
            img.body.setSize(TILE * 2 - 8, TILE * 2 - 4);
            img.body.setGravityY(PLAYER.gravity);
            img.body.setDragX(2600);
            img.body.setMaxVelocityX(160);
            img.body.setMass(4);
            this.pedregulhos.push({ img, x0: img.x, y0: img.y });
            break;
          }
          case '&':
            // estação de pesquisa (os países estudam a Antártica juntos; o Brasil tem a Comandante Ferraz)
            this.add.image(cx + TILE, y + TILE, 'estacao').setOrigin(0.5, 1).setDepth(1.8);
            break;
          case ':':
            this.add.image(x, y + TILE - 14, this.tema.rastro ?? 'rastro').setOrigin(0).setDepth(1.6);
            break;
          case 'F': {
            const topo = !solido(r - 1, c) && at(r - 1, c) !== 'F';
            const f = this.grupoFofas.create(x, y, topo ? 'terra-fofa-topo' : 'terra-fofa').setOrigin(0).setDepth(1) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            f.refreshBody();
            this.fofas.set(`${c},${r}`, f);
            break;
          }
          case 'N': {
            const topo = !solido(r - 1, c) && !'FN'.includes(at(r - 1, c));
            const n = this.grupoNeves.create(x, y, topo ? 'neve-fofa-topo' : 'neve-fofa').setOrigin(0).setDepth(1) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            n.refreshBody();
            this.neves.set(`${c},${r}`, n);
            break;
          }
          case 'X': {
            // redemoinho do Vento Viravolta, apoiado no chão do bloco
            const img = this.grupoRedemoinhos.create(cx, y + TILE - 38, 'redemoinho') as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            img.setDepth(9).setScale(1.15);
            img.body.setSize(44, 48).setOffset(16, 26);
            // nos mundos de gelo, um tom mais escuro para não sumir no branco
            if (this.tema.ceu === 'ceu-artico' || this.tema.ceu === 'ceu-antartica') img.setTint(0x8ea3bf);
            img.body.setGravityY(PLAYER.gravity);
            img.body.setMaxVelocityY(PLAYER.maxFall);
            const folhas = this.add.particles(0, 0, this.tema.particulaVento ?? 'folha', {
              lifespan: 700,
              speed: { min: 30, max: 70 },
              angle: { min: 180, max: 360 },
              rotate: { min: 0, max: 360 },
              scale: { start: 1.2, end: 0.4 },
              alpha: { start: 1, end: 0 },
              frequency: 110,
              follow: img,
              followOffset: { x: 0, y: 10 },
            }).setDepth(8.9);
            this.redemoinhos.push({ img, dir: -1, vivo: true, folhas, x0: cx });
            break;
          }
          case 'l': {
            const tipos = ['lixo-garrafa', 'lixo-lata', 'lixo-rede'];
            const l = this.lixos.create(cx, y + TILE - 18, tipos[(c + r) % 3]).setDepth(4) as Phaser.Types.Physics.Arcade.ImageWithStaticBody;
            l.setAngle(((c * 37) % 40) - 20);
            l.refreshBody();
            this.totalLixo++;
            break;
          }
          case '*': {
            // Vaga-lume: pisca devagar e passeia um pouquinho; fica por cima da escuridão da noite.
            const v = this.add.image(cx, y + TILE / 2, 'vagalume').setDepth(31).setBlendMode(Phaser.BlendModes.ADD);
            const atraso = (c * 131 + r * 57) % 1200;
            this.tweens.add({ targets: v, alpha: { from: 1, to: 0.35 }, yoyo: true, repeat: -1, duration: 900, delay: atraso, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: v, x: cx + 10, y: v.y - 8, yoyo: true, repeat: -1, duration: 1700 + (atraso % 500), ease: 'Sine.easeInOut' });
            break;
          }
          case 'U':
            if (this.gatilhoChuva === null) this.gatilhoChuva = cx;
            break;
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
            const textura = this.def.selo ? `selo-${this.def.selo.id}` : this.def.portal ? 'portal' : 'atlas';
            this.objetivo = this.physics.add.staticImage(cx, y + TILE, textura).setOrigin(0.5, 1).setDepth(3);
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
    // Página que se move: compara com a velocidade e a posição anterior dela (subindo, ela vem de encontro ao Chico).
    const vPlat = lb.velocity?.y ?? 0;
    const topoAntes = 'prev' in lb && lb.prev ? lb.prev.y : lb.top;
    const folga = 12 + Math.abs(lb.top - topoAntes);
    return pb.velocity.y - vPlat >= -20 && pb.prev.y + pb.height <= Math.max(lb.top, topoAntes) + folga;
  }

  /** Quem está em pé numa página voando anda junto com ela (de lado e descendo). */
  private carregarMontado() {
    for (const p of this.plataformas) {
      const b = p.img.body;
      const dx = b.x - p.ultimoX;
      const dy = b.y - p.ultimoY;
      p.ultimoX = b.x;
      p.ultimoY = b.y;
      if (p !== this.montado) continue;
      const pb = this.player.body;
      const emCima =
        (this.player.estado === 'normal' || this.player.estado === 'bola') &&
        pb.right > b.left + 2 &&
        pb.left < b.right - 2 &&
        Math.abs(pb.bottom - (b.top - dy)) < 24 &&
        pb.velocity.y >= b.velocity.y - 60;
      if (!emCima) {
        this.montado = null;
        continue;
      }
      // anda junto de lado e fica encostado no topo da página (subindo ou descendo), com a mesma velocidade dela
      pb.position.x += dx;
      pb.position.y = b.y - pb.height;
      pb.velocity.y = b.velocity.y;
      this.player.apoiar();
    }
  }

  // ------------------------------------------------------------------ loop

  update(_t: number, deltaMs: number) {
    const dt = Math.min(deltaMs, 50) / 1000;
    const i = this.entrada.update();

    if (i.pausePressed && !this.terminou && !this.emFoco) this.pausar();
    if (this.pausado || this.emFoco) return;
    if (!this.terminou) this.tempo += deltaMs;

    this.moverPlataformas(dt);
    this.carregarMontado();

    // Escada sob o Chico?
    let escadaX: number | null = null;
    this.physics.overlap(this.player.sprite, this.escadas, (_p, e) => {
      escadaX = (e as Phaser.GameObjects.Image).x;
    });
    this.player.marcarEscada(escadaX);

    this.atualizarMare(deltaMs);

    // Água sob o centro do Chico
    const sup = this.aguaSuperficie(this.player.x, this.player.y);
    this.player.agua = sup === null ? null : { superficie: sup };
    if (sup !== null && this.def.aguaGelada && !this.def.submarino && this.player.estado !== 'caido') {
      // Água do mar do Ártico é gelada demais para nadar: a Mamãe July tira o Chico e ele volta ao checkpoint.
      this.morrer('gelada');
    } else if (sup !== null && this.aguaFunda(this.player.x, this.player.y) && !this.player.temPoderOnca && this.player.estado !== 'caido') {
      // Sem o Nado da Onça, a água funda ainda não é segura: volta para o checkpoint.
      this.morrer();
    }
    // Gelo sob os pés (qualquer um dos lados do corpo)
    const pb = this.player.body;
    this.player.noGelo = this.caractere(pb.left + 3, pb.bottom + 2) === 'I' || this.caractere(pb.right - 3, pb.bottom + 2) === 'I';
    // Teto baixo: deitado no tobogã, só levanta quando houver espaço em pé
    const bloqueia = (x: number, y: number) => {
      const ch = this.caractere(x, y);
      return ch in this.tema.solidos || ch === 'F' || ch === 'N';
    };
    const topoEmPe = pb.bottom - PLAYER.bodyHeight + 4;
    this.player.tetoBaixo = this.player.deslizando && (bloqueia(pb.left + 2, topoEmPe) || bloqueia(pb.right - 2, topoEmPe) || bloqueia(pb.center.x, topoEmPe));

    this.player.update(this.terminou ? this.semEntrada() : i, dt);
    this.cavar(this.terminou ? this.semEntrada() : i, dt);
    this.mergulharNaNeve();
    this.escuridao?.setPosition(this.player.x, this.player.y - 30);
    if (this.submarino) {
      const naAgua = !!this.player.agua && this.player.estado !== 'caido';
      this.submarino.setVisible(naAgua).setPosition(this.player.x, this.player.y - 6);
      if (naAgua) this.submarino.setFlipX(this.player.direcao < 0);
    }

    // Câmera antecipa a direção
    const alvo = this.player.direcao * 110 * Math.min(1, Math.abs(this.player.body.velocity.x) / 200);
    this.olharFrente = Phaser.Math.Linear(this.olharFrente, alvo, dt * 2.5);
    // Chico um pouco abaixo do centro: o chão fica acima da área dos controles de toque.
    this.cameras.main.setFollowOffset(-this.olharFrente, 70);

    // Parallax: as camadas de fundo acompanham a linha do chão da fase (onde o Chico começa),
    // para os morros e árvores aparecerem logo acima do chão em qualquer altura de tela.
    const sx = this.cameras.main.scrollX;
    const chaoNaTela = this.inicio.y + PLAYER.bodyHeight / 2 - this.cameras.main.scrollY;
    for (const f of this.fundo) {
      f.img.tilePositionX = sx * f.fator;
      f.img.y = chaoNaTela + f.afundar - f.img.height;
    }

    // Caiu no buraco
    if (this.player.y > LINHAS * TILE + 90 && this.player.estado !== 'caido') this.morrer();

    this.checarCheckpoints();
    this.checarPlacas(i.actionPressed);
    this.checarEscavacao(i.actionPressed);
    this.checarBichos();
    this.atualizarPoderPorTrecho();
    // o emu é só visual: usa o tempo real do quadro (não o limitado da física) para nunca ficar para trás
    this.guiarBichos(deltaMs / 1000);
    this.moverRedemoinhos();
    this.atualizarSons(dt);
    for (const p of this.pedregulhos) {
      // Pedregulho que caiu num buraco sem fundo volta para o lugar (a fase nunca fica impossível).
      if (p.img.y > this.alturaMundo + 100) {
        p.img.body.reset(p.x0, p.y0 - TILE);
      }
    }
    this.soltarPedrinhas(dt);
    this.atualizarVento(dt);
    if (this.gatilhoChuva !== null && !this.chovendo && this.player.x > this.gatilhoChuva) this.comecarChuva();
  }

  // ------------------------------------------------------------------ vento e chuva

  private atualizarVento(dt: number) {
    if (!this.ventos.length) return;
    this.relogioVento += dt * 1000;
    const ciclo = VENTO.rajadaMs + VENTO.calmaMs;
    const forte = this.relogioVento % ciclo < VENTO.rajadaMs;
    const perto = this.ventos.some((v) => Math.abs(v.area.centerX - this.player.x) < 900);
    if (forte && !this.rajadaForte && perto) AudioManager.rajada();
    if (forte !== this.rajadaForte) {
      this.rajadaForte = forte;
      if (this.brancura) this.tweens.add({ targets: this.brancura, fillAlpha: forte ? 0.35 : 0.08, duration: 700 });
      // folhas mostram a força do vento: muitas na rajada, poucas na calmaria
      for (const v of this.ventos) v.folhas.frequency = forte ? 110 : 600;
    }
    const zona = this.ventos.find((v) => v.area.contains(this.player.x, this.player.y));
    this.player.ventoX = zona ? zona.dir * VENTO.forca * (forte ? 1 : 0.15) : 0;
  }

  private comecarChuva() {
    this.chovendo = true;
    this.chuvaCaindo = true;
    const { width, height } = this.scale;
    const nublado = this.add.rectangle(0, 0, width, height, 0x2c3e55, 0).setOrigin(0).setScrollFactor(0).setDepth(-50);
    this.tweens.add({ targets: nublado, fillAlpha: 0.35, duration: 1200 });
    const gotas = this.add.particles(0, -30, 'gota', {
      x: { min: 0, max: width },
      lifespan: 900,
      speedY: { min: 900, max: 1200 },
      speedX: { min: -60, max: -20 },
      quantity: 3,
      frequency: 16,
      alpha: { start: 0.8, end: 0.4 },
    });
    gotas.setScrollFactor(0).setDepth(40);
    AudioManager.chuva(true);
    const f = this.def.chuva?.comeca;
    if (f) VoiceManager.falar(f.texto, f.quem);

    // A chuva passa e a Caatinga fica verde depressa (dossiê: a mudança da paisagem pode ser muito rápida).
    this.time.delayedCall(6500, () => {
      gotas.stop();
      this.chuvaCaindo = false;
      AudioManager.chuva(false);
      this.tweens.add({ targets: nublado, fillAlpha: 0, duration: 1500, onComplete: () => nublado.destroy() });
      this.verdejar();
    });
  }

  private verdejar() {
    if (this.def.mundo !== 'caatinga') {
      const f = this.def.chuva?.verde;
      if (f) this.time.delayedCall(800, () => VoiceManager.falar(f.texto, f.quem));
      return;
    }
    for (const t of this.toposTerra) {
      const capim = this.add.image(t.x, t.y, 'capim-verde').setOrigin(0).setDepth(1.5).setAlpha(0);
      // o verde se espalha a partir de onde o Chico está
      const atraso = Math.min(2500, Math.abs(t.x - this.player.x) * 0.6);
      this.tweens.add({ targets: capim, alpha: 1, duration: 600, delay: atraso });
    }
    for (const f of this.fundo) {
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 2000,
        onUpdate: (tw) => {
          const k = tw.getValue() ?? 0;
          const cor = Phaser.Display.Color.Interpolate.ColorWithColor(
            Phaser.Display.Color.ValueToColor(0xffffff),
            Phaser.Display.Color.ValueToColor(0xa8e08a),
            100,
            k * 100,
          );
          f.img.setTint(Phaser.Display.Color.GetColor(cor.r, cor.g, cor.b));
        },
      });
    }
    const f = this.def.chuva?.verde;
    if (f) this.time.delayedCall(800, () => VoiceManager.falar(f.texto, f.quem));
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
        // quem fala se mexe: um pulinho e um balanço
        if (perto.pessoa) {
          const p = perto.pessoa;
          this.tweens.add({ targets: p, angle: { from: -6, to: 6 }, yoyo: true, repeat: 3, duration: 180, onComplete: () => (p.angle = 0) });
          if (p instanceof Phaser.GameObjects.Image) {
            const y0 = p.getData('y0') as number;
            this.tweens.add({ targets: p, y: { from: y0, to: y0 - 14 }, yoyo: true, repeat: 1, duration: 200, ease: 'Quad.easeOut' });
          }
        }
      }
    } else {
      this.iconeAcao.setVisible(false);
    }
  }

  // ------------------------------------------------------------------ bichos

  /** O botão da pata aparece quando o Chico já tem o poder que o botão usa neste mundo. */
  get temPoder() {
    const p = this.player;
    if (p.poderBotao === 'bola') return p.temPoderBola;
    if (p.poderBotao === 'superpulo') return p.temPoderSuperPulo;
    if (p.poderBotao === 'mergulho') return p.temPoderMergulho;
    if (p.poderBotao === 'toboga') return p.temPoderToboga;
    if (p.poderBotao === 'giro') return p.temPoderGiro;
    return p.temPoderArrancada;
  }

  get cargaPoder() {
    return this.player.cargaPoder;
  }

  private atualizarPedregulhos() {
    for (const p of this.pedregulhos) p.img.body.pushable = this.player.temPoderForca;
  }

  /** Fósseis enterrados: perto do monte, o botão Ação escava (pincel e espátula) e revela o fóssil. */
  private checarEscavacao(acao: boolean) {
    for (const b of this.bichos) {
      if (!b.escondido || b.ativado) continue;
      const perto = Math.abs(this.player.x - b.img.x) < 130 && Math.abs(this.player.y - (b.img.y - 30)) < 120;
      if (!perto) continue;
      this.iconeAcao.setVisible(true).setPosition(b.img.x, b.img.y - 130 + Math.sin(this.time.now / 180) * 6);
      if (!b.avisado) {
        // primeira vez perto: explica sem precisar ler
        b.avisado = true;
        VoiceManager.falar('Um fóssil está escondido aqui! Aperte o botão da mão para escavar.', 'narrador');
      }
      if (acao) this.escavar(b);
      return;
    }
  }

  private escavar(b: Bicho) {
    b.ativado = true;
    this.iconeAcao.setVisible(false);
    for (let k = 0; k < 6; k++) {
      this.time.delayedCall(k * 220, () => {
        AudioManager.tocar('escavar');
        this.estilhacos.explode(6, b.img.x + Phaser.Math.Between(-40, 40), b.img.y - 20);
      });
    }
    this.tweens.add({ targets: b.img, x: b.img.x + 3, yoyo: true, repeat: 10, duration: 60 });
    this.time.delayedCall(1400, () => {
      b.img.setTexture(b.def.fossil!).setScale(0.3);
      this.tweens.add({ targets: b.img, scale: 1, duration: 500, ease: 'Back.easeOut' });
      VoiceManager.falar('Achamos um fóssil!', 'narrador');
      b.escondido = false;
      b.ativado = false;
      this.ativarBicho(b);
    });
  }

  /**
   * Momento do bicho: tudo para (física e relógio da fase, então a demonstração do bicho espera) e o HUD mostra
   * a figura dele grande no meio da tela enquanto ele fala. O HUD chama soltarFoco() quando a fala acaba.
   */
  private focarBicho(b: Bicho) {
    // sem o HUD para mostrar a figura e soltar depois, o jogo não para
    if (this.terminou || this.emFoco || this.events.listenerCount('foco-bicho') === 0) return;
    this.emFoco = true;
    this.physics.pause();
    this.time.paused = true;
    const cam = this.cameras.main;
    const chave = b.img.texture.key;
    this.events.emit('foco-bicho', {
      textura: this.textures.exists(`${chave}-hd`) ? `${chave}-hd` : chave,
      x: b.img.x - cam.scrollX,
      y: b.img.y - b.img.displayHeight / 2 - cam.scrollY,
    });
  }

  /** Fim do momento do bicho: o Chico pode seguir. */
  soltarFoco() {
    if (!this.emFoco) return;
    this.emFoco = false;
    this.time.paused = false;
    if (!this.pausado) this.physics.resume();
  }

  /** Fase final: cada trecho usa o poder de um mundo no botão da pata. */
  private atualizarPoderPorTrecho() {
    const lista = this.def.poderPorTrecho;
    if (!lista) return;
    const col = this.player.x / TILE;
    let idx = 0;
    this.inicioTrechos.forEach((c0, i) => {
      if (col >= c0) idx = i;
    });
    const poder = lista[Math.min(idx, lista.length - 1)];
    if (poder !== this.player.poderBotao) {
      this.player.trocarPoderBotao(poder);
      this.events.emit('poder', this.temPoder);
    }
  }

  private checarBichos() {
    for (const b of this.bichos) {
      if (b.ativado || b.escondido) continue;
      if (Math.abs(this.player.x - b.img.x) < 260 && Math.abs(this.player.y - b.img.y) < 240) this.ativarBicho(b);
    }
  }

  private ativarBicho(b: Bicho) {
    b.ativado = true;
    const { def, img } = b;
    // Página do Atlas: o animal fica registrado para a coleção.
    if (!def.semFicha && SaveManager.conquistar('animais', def.id)) this.novosBichos.push(def.id);
    VoiceManager.falar(def.fala, def.quem ?? 'bicho');
    if (def.curiosidade) VoiceManager.falar(def.curiosidade, def.quem ?? 'bicho', true);
    this.focarBicho(b);
    this.add.particles(img.x, img.y - 30, 'brilho', {
      lifespan: 700,
      speed: { min: 60, max: 160 },
      scale: { start: 1, end: 0 },
      tint: [0xfff1a8, 0xffd766],
      quantity: 16,
      emitting: false,
    }).setDepth(9).explode(16);

    if (def.demo.tipo === 'voar') {
      // Aves levantam voo batendo as asas.
      const { dx, dy } = def.demo;
      const x0 = img.x;
      const y0 = img.y;
      this.time.delayedCall(1200, () => {
        img.setFlipX(false);
        this.tweens.killTweensOf(img);
        this.tweens.add({ targets: img, scaleY: 0.6, yoyo: true, repeat: -1, duration: 110 });
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 2200,
          ease: 'Sine.easeInOut',
          onUpdate: (tw) => {
            const t = tw.getValue() ?? 0;
            img.setPosition(x0 + dx * TILE * t, y0 + dy * TILE * t - Math.sin(Math.PI * t) * 60);
          },
          onComplete: () => {
            this.tweens.killTweensOf(img);
            img.setScale(1);
          },
        });
      });
    } else if (def.demo.tipo === 'correr') {
      // O preá corre e some por baixo da vegetação.
      const { dx } = def.demo;
      this.time.delayedCall(1000, () => {
        img.setFlipX(false);
        this.tweens.killTweensOf(img);
        img.setScale(1);
        // o guepardo dispara e some rapidinho; os outros correm mais devagar
        const duracao = def.id === 'guepardo' ? 500 : 900;
        this.tweens.add({ targets: img, x: img.x + dx * TILE, duration: duracao, ease: 'Quad.easeIn' });
        this.tweens.add({
          targets: img,
          alpha: 0,
          delay: duracao * 0.75,
          duration: duracao * 0.35,
          onComplete: () => {
            if (def.daPoder) this.ganharPoder(def.daPoder, img);
          },
        });
      });
    } else if (def.demo.tipo === 'empurrar') {
      // O elefante empurra um tronco caído com a tromba e o corpo.
      const tronco = this.add.image(img.x + img.displayWidth * 0.55, img.y, 'pedregulho').setOrigin(0.5, 1).setScale(0.6).setDepth(7);
      this.time.delayedCall(1200, () => {
        img.setFlipX(false);
        tronco.setX(img.x + img.displayWidth * 0.55);
        this.tweens.add({ targets: [img, tronco], x: `+=${TILE * 2}`, duration: 1800, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: tronco, angle: 60, duration: 1800 });
        AudioManager.tocar('empurrar');
        this.time.delayedCall(1900, () => {
          if (def.daPoder) this.ganharPoder(def.daPoder, img);
        });
      });
    } else if (def.demo.tipo === 'nadar') {
      // Onça e boto atravessam a água, subindo e descendo de leve.
      // Quem começa na margem (a onça) afunda até a metade ao entrar no rio e sobe ao sair.
      const { dx } = def.demo;
      const x0 = img.x;
      const y0 = img.y;
      const comecaNaMargem = img.depth !== 10;
      this.time.delayedCall(1000, () => {
        img.setFlipX(dx < 0);
        this.tweens.killTweensOf(img);
        if (comecaNaMargem) img.setDepth(10);
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration: Math.abs(dx) * 320,
          onUpdate: (tw) => {
            const t = tw.getValue() ?? 0;
            const afunda = comecaNaMargem ? 30 * Math.min(1, t * 8, (1 - t) * 8) : 0;
            img.setPosition(x0 + dx * TILE * t, y0 + afunda + Math.sin(t * Math.PI * 6) * 6);
          },
          onComplete: () => {
            if (def.daPoder) this.ganharPoder(def.daPoder, img);
          },
        });
      });
    } else if (def.demo.tipo === 'ficar') {
      // A preguiça continua no galho, bem firme (fósseis ficam parados na rocha).
      if (!def.fossil) this.tweens.add({ targets: img, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 1800, ease: 'Sine.easeInOut' });
    } else if (def.demo.tipo === 'andar') {
      // Silhuetas de dinossauros: andam devagar, deixando o caminho das pegadas.
      const { dx } = def.demo;
      const x0 = img.x;
      const y0 = img.y;
      img.setFlipX(dx < 0);
      this.tweens.killTweensOf(img);
      img.setScale((img.getData('escala') as number) ?? 1);
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: Math.abs(dx) * 450,
        onUpdate: (tw) => {
          const t = tw.getValue() ?? 0;
          img.setPosition(x0 + dx * TILE * t, y0 - Math.abs(Math.sin(t * Math.abs(dx) * Math.PI)) * 4);
        },
      });
    } else if (def.demo.tipo === 'pular') {
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
          onComplete: () => {
            // o canguru ensina o super pulo depois de mostrar o salto
            if (def.daPoder) this.ganharPoder(def.daPoder, img);
          },
        }),
      );
    } else if (def.demo.tipo === 'cavar') {
      // O wombat cava a terra fofa bem na frente dele e entra na toca.
      const c = Math.floor(img.x / TILE) + 1;
      const r = Math.floor((img.y - 1) / TILE);
      this.time.delayedCall(1100, () => {
        img.setFlipX(false);
        this.tweens.killTweensOf(img);
        img.setScale(1);
        this.tweens.add({ targets: img, x: img.x + 4, yoyo: true, repeat: 7, duration: 90 });
        for (let k = 0; k < 6; k++) {
          this.time.delayedCall(k * 150, () => {
            this.estilhacos.explode(4, (c + 0.1) * TILE, (r + 0.8) * TILE);
            AudioManager.tocar('cavar');
          });
        }
        this.time.delayedCall(1000, () => {
          this.removerFofa(c, r);
          this.removerFofa(c, r - 1);
          this.tweens.add({ targets: img, x: img.x + TILE * 1.4, alpha: 0, duration: 900, ease: 'Sine.easeIn' });
          this.time.delayedCall(950, () => {
            if (def.daPoder) this.ganharPoder(def.daPoder, img);
          });
        });
      });
    } else if (def.demo.tipo === 'girar') {
      // O golfinho-rotador salta da água girando no ar e mergulha de novo.
      const x0 = img.x;
      const y0 = img.y;
      this.time.delayedCall(1100, () => {
        img.setFlipX(false);
        this.tweens.killTweensOf(img);
        img.setScale(1);
        AudioManager.tocar('giro');
        this.respingos.explode(12, x0, y0 - 20);
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 1400,
          onUpdate: (tw) => {
            const t = tw.getValue() ?? 0;
            img.setPosition(x0 + TILE * 4 * t, y0 - Math.sin(Math.PI * t) * 260);
            img.setAngle(t * 720);
          },
          onComplete: () => {
            img.setAngle(0);
            AudioManager.tocar('splash');
            this.respingos.explode(14, img.x, y0 - 20);
            if (def.daPoder) this.ganharPoder(def.daPoder, img);
          },
        });
      });
    } else if (def.demo.tipo === 'deslizar') {
      // O pinguim-de-adélia deita de barriga e desliza no gelo, depois levanta.
      const { dx } = def.demo;
      this.time.delayedCall(1100, () => {
        img.setFlipX(false);
        this.tweens.killTweensOf(img);
        img.setScale(1);
        this.tweens.add({ targets: img, angle: 75, duration: 250 });
        AudioManager.tocar('toboga');
        this.tweens.add({
          targets: img,
          x: img.x + dx * TILE,
          delay: 250,
          duration: 1300,
          ease: 'Sine.easeOut',
          onUpdate: () => {
            if (Math.random() < 0.3) this.flocos.explode(1, img.x - 30, img.y - 4);
          },
          onComplete: () => {
            this.tweens.add({ targets: img, angle: 0, duration: 250 });
            this.time.delayedCall(400, () => {
              if (def.daPoder) this.ganharPoder(def.daPoder, img);
            });
          },
        });
      });
    } else if (def.demo.tipo === 'mergulhar') {
      // A raposa-do-ártico escuta, salta bem alto e cai de cabeça na neve; some e depois aparece de novo.
      const x0 = img.x;
      const y0 = img.y;
      this.time.delayedCall(1300, () => {
        img.setFlipX(false);
        this.tweens.killTweensOf(img);
        img.setScale(1);
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 1000,
          onUpdate: (tw) => {
            const t = tw.getValue() ?? 0;
            img.setPosition(x0 + TILE * 2 * t, y0 - Math.sin(Math.PI * t) * 170 + t * 30);
            img.setAngle(t < 0.5 ? -20 : 20 + (t - 0.5) * 220);
          },
          onComplete: () => {
            this.flocos.explode(24, img.x, y0);
            AudioManager.tocar('neve');
            img.setVisible(false);
            this.time.delayedCall(900, () => {
              // volta no lugar de onde saltou (chão firme): a neve fofa da frente pode ser quebrada pelo Chico
              img.setAngle(0).setPosition(x0, y0).setVisible(true).setAlpha(0);
              this.tweens.add({ targets: img, alpha: 1, duration: 300 });
              if (def.daPoder) this.ganharPoder(def.daPoder, img);
            });
          },
        });
      });
    } else if (def.demo.tipo === 'guiar') {
      // O emu corre na frente do Chico, mostrando o caminho, até o fim do trecho.
      b.guia = { xFinal: img.x + def.demo.ate * TILE, tempo: 0 };
      this.time.delayedCall(900, () => {
        img.setFlipX(false);
        this.tweens.killTweensOf(img);
        img.setScale(1);
      });
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
              if (def.daPoder) this.ganharPoder(def.daPoder, img);
            });
          },
        });
      });
    }
  }

  private ganharPoder(poder: Poder, origem: Phaser.GameObjects.Image) {
    const faisca = this.add.image(origem.x, origem.y - 30, 'brilho').setScale(3).setDepth(20).setTint(0xffd766);
    this.tweens.add({
      targets: faisca,
      x: this.player.x,
      y: this.player.y,
      duration: 700,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        faisca.destroy();
        const novo = SaveManager.conquistar('poderes', poder);
        AudioManager.tocar('poder');
        this.cameras.main.flash(200, 255, 240, 170);
        if (poder === 'bola') {
          this.player.temPoderBola = true;
          this.events.emit('poder', this.temPoder);
          if (novo) VoiceManager.falar('Agora você também pode virar bola! Aperte o botão da pata.', 'narrador', true);
        } else if (poder === 'arrancada') {
          this.player.temPoderArrancada = true;
          this.events.emit('poder', this.temPoder);
          if (novo) VoiceManager.falar('Agora você corre como o guepardo! Aperte o botão da pata para dar uma arrancada.', 'narrador', true);
        } else if (poder === 'superpulo') {
          this.player.temPoderSuperPulo = true;
          this.events.emit('poder', this.temPoder);
          if (novo) VoiceManager.falar('Agora você pula como o canguru! Aperte o botão da pata para dar um super pulo.', 'narrador', true);
        } else if (poder === 'giro') {
          this.player.temPoderGiro = true;
          this.events.emit('poder', this.temPoder);
          if (novo) VoiceManager.falar('Agora você salta girando como o golfinho! Na água, aperte o botão da pata.', 'narrador', true);
        } else if (poder === 'toboga') {
          this.player.temPoderToboga = true;
          this.events.emit('poder', this.temPoder);
          if (novo) VoiceManager.falar('Agora você desliza de barriga como o pinguim! Aperte o botão da pata.', 'narrador', true);
        } else if (poder === 'mergulho') {
          this.player.temPoderMergulho = true;
          this.events.emit('poder', this.temPoder);
          if (novo) VoiceManager.falar('Agora você mergulha na neve como a raposa! Aperte o botão da pata para pular e cair de cabeça.', 'narrador', true);
        } else if (poder === 'cavar') {
          // Poder passivo: andar contra a terra fofa (ou apertar para baixo em cima dela) cava.
          this.player.temPoderCavar = true;
          if (novo) VoiceManager.falar('Agora você cava como o wombat! Ande contra a terra fofa para cavar.', 'narrador', true);
        } else if (poder === 'forca') {
          // Poder passivo: empurrar pedregulhos andando contra eles.
          this.player.temPoderForca = true;
          this.atualizarPedregulhos();
          if (novo) VoiceManager.falar('Agora você tem a força do elefante! Ande contra as pedras grandes para empurrar.', 'narrador', true);
        } else {
          // Poder passivo: não precisa de botão.
          this.player.temPoderOnca = true;
          if (novo) VoiceManager.falar('Agora você nada como a onça! Pode entrar na água funda e mergulhar.', 'narrador', true);
        }
      },
    });
  }

  // ------------------------------------------------------------------ cavar e guiar

  /** Com o poder do wombat, empurrar contra a terra fofa (ou apertar para baixo em cima dela) cava depois de um instante. */
  private cavar(i: { left: boolean; right: boolean; down: boolean }, dt: number) {
    const p = this.player;
    if (!p.temPoderCavar || p.estado !== 'normal' || !this.fofas.size) {
      this.cavando = null;
      return;
    }
    const b = p.body;
    const alvos: [number, number][] = [];
    const celula = (x: number, y: number): [number, number] => [Math.floor(x / TILE), Math.floor(y / TILE)];
    if (i.right !== i.left) {
      const xf = i.right ? b.right + 6 : b.left - 6;
      alvos.push(celula(xf, b.top + 10), celula(xf, b.bottom - 10));
    } else if (i.down && b.blocked.down) {
      alvos.push(celula(b.center.x, b.bottom + 6));
    }
    const existentes = alvos.filter(([c, r], k) => this.fofas.has(`${c},${r}`) && alvos.findIndex(([c2, r2]) => c2 === c && r2 === r) === k);
    if (!existentes.length) {
      this.cavando = null;
      return;
    }
    const id = existentes.map(([c, r]) => `${c},${r}`).join('|');
    if (this.cavando?.id !== id) this.cavando = { id, t: 0, som: 0 };
    this.cavando.t += dt * 1000;
    this.cavando.som -= dt * 1000;
    if (this.cavando.som <= 0) {
      this.cavando.som = 130;
      const [c, r] = existentes[0];
      this.estilhacos.explode(3, (c + 0.5) * TILE, (r + 0.5) * TILE);
      AudioManager.tocar('cavar');
    }
    if (this.cavando.t >= CAVAR.tempoMs) {
      for (const [c, r] of existentes) this.removerFofa(c, r);
      this.cavando = null;
    }
  }

  private removerFofa(c: number, r: number) {
    const f = this.fofas.get(`${c},${r}`);
    if (!f) return;
    this.fofas.delete(`${c},${r}`);
    this.estilhacos.explode(10, f.x + TILE / 2, f.y + TILE / 2);
    f.destroy();
    const linha = this.grade[r];
    if (linha) this.grade[r] = linha.slice(0, c) + '.' + linha.slice(c + 1);
  }

  /** Mergulho na neve: ao bater de cabeça na neve fofa, ela quebra e o mergulho continua; em outro chão, acaba. */
  private mergulharNaNeve() {
    const p = this.player;
    if (!p.mergulhando || !p.body.blocked.down) return;
    const b = p.body;
    const r = Math.floor((b.bottom + 4) / TILE);
    let quebrou = false;
    for (let c = Math.floor(b.left / TILE); c <= Math.floor((b.right - 1) / TILE); c++) {
      const n = this.neves.get(`${c},${r}`);
      if (!n) continue;
      this.neves.delete(`${c},${r}`);
      this.flocos.explode(14, n.x + TILE / 2, n.y + TILE / 3);
      n.destroy();
      const linha = this.grade[r];
      if (linha) this.grade[r] = linha.slice(0, c) + '.' + linha.slice(c + 1);
      quebrou = true;
    }
    if (quebrou) AudioManager.tocar('neve');
    else {
      p.terminarMergulho();
      this.flocos.explode(8, p.x, b.bottom);
    }
  }

  /** Topo do chão na coluna do ponto x, procurando a partir de um pouco acima de y. */
  // ------------------------------------------------------------------ redemoinhos do Vento Viravolta

  /** Andam para lá e para cá; viram na parede, na beirada, na água e nos espinhos. */
  private moverRedemoinhos() {
    const t = this.time.now;
    for (const r of this.redemoinhos) {
      if (!r.vivo) continue;
      const b = r.img.body;
      if (b.blocked.down) {
        const frente = r.img.x + r.dir * 26;
        const linhaPes = Math.floor((b.bottom + 4) / TILE);
        const linhaCorpo = Math.floor((b.bottom - 8) / TILE);
        const col = Math.floor(frente / TILE);
        const chao = this.grade[linhaPes]?.[col] ?? '.';
        const naFrente = this.grade[linhaCorpo]?.[col] ?? '.';
        const temChao = chao in this.tema.solidos || 'FN='.includes(chao);
        const longe = (r.img.x - r.x0) * r.dir > TILE * 3;
        if (!temChao || longe || naFrente === '^' || (b.blocked.left && r.dir < 0) || (b.blocked.right && r.dir > 0)) r.dir = -r.dir;
        b.setVelocityX(r.dir * 70);
      }
      // balanço do vento: troca de quadro e gira de leve
      r.img.setTexture(Math.floor(t / 180) % 2 ? 'redemoinho' : 'redemoinho-2');
      r.img.setFlipX(r.dir > 0);
    }
    // na primeira vez que um redemoinho aparece, o narrador explica
    if (!SaveManager.data.anunciados.includes('redemoinho')) {
      const perto = this.redemoinhos.find((r) => r.vivo && Math.abs(r.img.x - this.player.x) < 520);
      if (perto) {
        SaveManager.conquistar('anunciados', 'redemoinho');
        VoiceManager.falar('Um redemoinho do Vento Viravolta! Pule em cima dele para desmanchar!', 'narrador');
      }
    }
  }

  /** Pisou em cima (ou passou em bola, arrancada, tobogã, giro ou mergulho): desmancha. De lado: machuca. */
  private tocarRedemoinho(img: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    const r = this.redemoinhos.find((x) => x.img === img);
    const p = this.player;
    if (!r || !r.vivo || p.estado === 'caido' || this.terminou) return;
    const pb = p.sprite.body;
    const pisou = pb.velocity.y > 0 && pb.bottom <= img.body.top + 20;
    const forte = p.protegido || p.arrancando || p.deslizando || p.girando || p.mergulhando;
    if (pisou || forte) {
      this.desmancharRedemoinho(r);
      // quique no pisão, como nos jogos de plataforma
      if (pisou && !forte) pb.setVelocityY(-PLAYER.jumpVelocity * 0.8);
    } else if (this.time.now > this.semDanoAte) {
      this.morrer();
    }
  }

  private desmancharRedemoinho(r: Redemoinho) {
    r.vivo = false;
    r.img.body.enable = false;
    r.folhas.stop();
    AudioManager.tocar('desmanchar');
    this.add.particles(r.img.x, r.img.y, this.tema.particulaVento ?? 'folha', {
      lifespan: 800,
      speed: { min: 80, max: 220 },
      rotate: { min: 0, max: 360 },
      scale: { start: 1.1, end: 0.2 },
      alpha: { start: 1, end: 0 },
      emitting: false,
    }).setDepth(9).explode(18);
    this.tweens.add({ targets: r.img, scaleX: 1.6, scaleY: 0.2, alpha: 0, duration: 260, ease: 'Quad.easeOut', onComplete: () => r.img.setVisible(false) });
    // a página que o Viravolta tinha levado sai voando de volta
    const pagina = this.add.image(r.img.x, r.img.y, 'pagina').setScale(0.35).setDepth(9);
    this.tweens.add({ targets: pagina, y: pagina.y - 140, angle: 200, alpha: 0, duration: 1100, ease: 'Sine.easeOut', onComplete: () => pagina.destroy() });
  }

  private chaoEm(x: number, y: number): number | null {
    const c = Math.floor(x / TILE);
    for (let r = Math.max(0, Math.floor(y / TILE) - 3); r < LINHAS; r++) {
      const ch = this.grade[r]?.[c] ?? '.';
      if (ch in this.tema.solidos || ch === 'F' || ch === 'N' || ch === '=') return r * TILE;
    }
    return null;
  }

  /** O emu corre à frente do Chico (sem física: acompanha o chão e salta os buracos). */
  private guiarBichos(dt: number) {
    for (const b of this.bichos) {
      const g = b.guia;
      if (!g || !b.ativado) continue;
      g.tempo += dt;
      if (g.tempo < 1) continue;
      const img = b.img;
      const alvo = Math.min(g.xFinal, Math.max(img.x, this.player.x + TILE * 5));
      // corre um pouco mais rápido que o Chico e acelera se ficar para trás
      const passo = Math.min(alvo - img.x, Math.max(430, (alvo - img.x) * 2) * dt);
      img.x += passo;
      const chao = this.chaoEm(img.x, img.y);
      const correndo = passo > 1;
      // no chão, acompanha o terreno; sobre um buraco, mantém a altura (passa num passo largo)
      if (chao !== null) img.y = Phaser.Math.Linear(img.y, chao, Math.min(1, dt * 12));
      img.angle = correndo ? Math.sin(g.tempo * 18) * 4 : 0;
    }
  }

  // ------------------------------------------------------------------ água e chamados

  private caractere(x: number, y: number) {
    const r = Math.floor(y / TILE);
    const c = Math.floor(x / TILE);
    return this.grade[r]?.[c] ?? '.';
  }

  /** Y da superfície da água na coluna, se o ponto estiver dentro da água; senão null. */
  private aguaSuperficie(x: number, y: number): number | null {
    const c = Math.floor(x / TILE);
    const ch = this.caractere(x, y);
    const m = this.mare.get(c);
    if (m && ch === '%') {
      const s = this.superficieMare(m);
      return y >= s ? s : null;
    }
    if (!AGUA.has(ch)) return null;
    let r = Math.floor(y / TILE);
    while (r > 0 && AGUA.has(this.grade[r - 1]?.[c] ?? '.')) r--;
    const normal = r * TILE + 8;
    return m ? Math.min(normal, this.superficieMare(m)) : normal;
  }

  private superficieMare(m: ColunaMare) {
    return m.baixa - this.nivelMare * (m.baixa - m.alta);
  }

  /** A maré sobe e desce devagar (começa baixa). A água é desenhada da superfície até o fundo da maré. */
  private atualizarMare(deltaMs: number) {
    if (!this.mare.size) return;
    this.relogioMare += deltaMs;
    this.nivelMare = (1 - Math.cos((this.relogioMare / MARE.periodoMs) * Math.PI * 2)) / 2;
    for (const m of this.mare.values()) {
      const s = this.superficieMare(m);
      const alt = Math.max(0, m.fundo - s);
      m.topo.setVisible(alt > 1).setY(s - 8).setCrop(0, 0, TILE, Math.min(TILE, alt + 8));
      m.corpo.setVisible(alt > TILE - 8).setY(s + TILE - 8);
      m.corpo.height = Math.max(1, alt - TILE + 8);
    }
  }

  private recolherLixo(l: Phaser.Types.Physics.Arcade.ImageWithStaticBody) {
    if (!l.body.enable) return;
    l.body.enable = false;
    this.lixoPego++;
    AudioManager.tocar('lixo');
    this.tweens.add({ targets: l, x: this.player.x, y: this.player.y - 40, scale: 0.3, alpha: 0, duration: 400, onComplete: () => l.destroy() });
    this.events.emit('lixo', { pegos: this.lixoPego, total: this.totalLixo });
    if (this.lixoPego === this.totalLixo) VoiceManager.falar('Você recolheu todo o lixo! Obrigada por cuidar da praia, filho!', 'july');
  }

  contarLixo() {
    return { pegos: this.lixoPego, total: this.totalLixo };
  }

  private aguaFunda(x: number, y: number) {
    return this.caractere(x, y) === 'w';
  }

  /** Chamados de bicho: ondas saem do ponto e um som toca quando o Chico está por perto. */
  private atualizarSons(dt: number) {
    for (const f of this.fontesSom) {
      f.t -= dt;
      if (f.t > 0) continue;
      f.t = 2.4;
      const perto = Math.abs(f.x - this.player.x) < 900 && Math.abs(f.y - this.player.y) < 700;
      if (!perto) continue;
      // Debaixo d'água, o chamado vira os sinais que o ornitorrinco sente: ondas azuis e um som suave.
      const sinal = AGUA.has(this.caractere(f.x, f.y));
      if (sinal && this.def.submarino) {
        // debaixo do gelo, bolhas subindo marcam o caminho
        for (let k = 0; k < 6; k++) {
          const b = this.add.image(f.x + Phaser.Math.Between(-14, 14), f.y, 'bolha').setDepth(12).setScale(1.4);
          this.tweens.add({ targets: b, y: f.y - 150, alpha: 0, delay: k * 160, duration: 1500, onComplete: () => b.destroy() });
        }
        AudioManager.tocar('bolhas');
        continue;
      }
      const baleia = this.def.chamado === 'baleia';
      for (let k = 0; k < 3; k++) {
        const onda = this.add.image(f.x, f.y, 'onda').setDepth(12).setScale(0.2).setTint(sinal || baleia ? 0x7fe8ff : 0xffd766);
        this.tweens.add({ targets: onda, scale: sinal ? 1.1 : baleia ? 2.2 : 1.6, alpha: 0, delay: k * 250, duration: 1200, onComplete: () => onda.destroy() });
      }
      AudioManager.tocar(baleia ? 'baleia' : sinal ? 'sinal' : 'canto');
    }
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

  private morrer(motivo?: 'gelada') {
    if (this.player.estado === 'caido' || this.terminou) return;
    this.montado = null;
    if (motivo === 'gelada') {
      AudioManager.tocar('splash');
      this.respingos.explode(14, this.player.x, this.aguaSuperficie(this.player.x, this.player.y) ?? this.player.y);
    }
    const trecho = `${this.def.id}:${this.checkpointAtual}`;
    const tentativas = SaveManager.registrarTentativa(trecho);
    this.player.cair(() => {
      this.player.renascer(this.respawn.x, this.respawn.y);
      this.semDanoAte = this.time.now + 1200;
      this.cameras.main.flash(150, 255, 255, 255);
      if (motivo === 'gelada' && this.resgates++ < 2) {
        const falas = ['Opa! Essa água é gelada demais! A mamãe tirou você.', 'Achei você! Vamos tentar de novo, pelo gelo.'];
        VoiceManager.falar(falas[(this.resgates - 1) % falas.length], 'july');
      }
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
    if (this.def.selo) {
      SaveManager.conquistar('selos', this.def.selo.id);
      VoiceManager.falar(this.def.selo.fala.texto, this.def.selo.fala.quem);
    } else if (this.def.portal) {
      AudioManager.tocar('portal');
      VoiceManager.falar(this.def.portal.texto, this.def.portal.quem);
      // o Chico entra no Portal do Tempo girando e sumindo
      this.tweens.add({ targets: this.player.visual, alpha: 0, angle: 360, delay: 500, duration: 900, ease: 'Sine.easeIn' });
    } else {
      VoiceManager.falar('Você achou o Atlas! Muito bem, Chico!', 'narrador');
    }

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
      const fim = {
        faseId: this.def.id,
        proximaId: proximaFase(this.def.id)?.id,
        selo: this.def.selo ? `selo-${this.def.selo.id}` : undefined,
        final: this.def.final,
        ...this.contarPegadasFase(),
        tempoMs: this.tempo,
      };
      // minijogo da fase (cestos do Araripe, esqueleto do Buriolestes) antes da tela de fim
      const depois = this.def.minijogo === 'cestos' ? 'Cestos' : this.def.minijogo === 'esqueleto' ? 'Esqueleto' : 'Fim';
      if (this.novosBichos.length) {
        // bicho novo: a figurinha entra no Atlas e vem a adivinha (nas fases com minijogo, só a figurinha)
        this.scene.stop('Hud');
        this.scene.launch('Revelacao', { novos: this.novosBichos, adivinhas: this.def.minijogo ? 0 : 2, depois, fim });
      } else if (depois !== 'Fim') {
        this.scene.stop('Hud');
        this.scene.launch(depois, { fim });
      } else this.scene.launch('Fim', fim);
      this.scene.pause();
    });
  }

  pausar() {
    if (this.pausado || this.terminou) return;
    this.pausado = true;
    this.physics.pause();
    if (this.chuvaCaindo) AudioManager.chuva(false);
    this.scene.launch('Pausa', { faseId: this.def.id });
    this.scene.pause();
  }

  retomar() {
    this.pausado = false;
    this.physics.resume();
    if (this.chuvaCaindo) AudioManager.chuva(true);
  }
}
