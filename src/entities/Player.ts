// Chico: corpo físico simples (hitbox menor que o desenho) + visual recortado em partes animadas por código.
import type { PoderBotao } from '../data/mundos';
import Phaser from 'phaser';
import { PLAYER, BOLA, VENTO, AGUA, ARRANCADA, SUPERPULO, GELO, MERGULHO, TOBOGA, GIRO } from '../config';
import type { Intent } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';

/**
 * Montagem do Chico a partir da folha "chico" (public/chico, recortada da arte da família).
 * A folha foi reduzida a 0,56 da arte original e o jogo desenha a 0,5 disso (~125 px de altura).
 * Posições em pixels do jogo, relativas aos pés; cada peça tem a própria escala para as proporções da arte.
 */
const C = {
  cabecaY: -70,
  cabecaEscala: 0.5,
  olhosX: 9.2,
  olhosY: -23.4,
  camisaY: -73.4,
  camisaEscala: 0.37,
  bermudaY: -20.7,
  bermudaEscala: 0.33,
  bracoX: 12.3,
  bracoY: -70,
  bracoEscala: 0.36,
  pernaX: 3.6,
  pernaY: -34.4,
  pernaEscala: 0.33,
};

type Estado = 'normal' | 'escalando' | 'caido' | 'festa' | 'bola';

export class Player {
  readonly sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  readonly visual: Phaser.GameObjects.Container;
  estado: Estado = 'normal';
  direcao: 1 | -1 = 1;
  /** Poder "Virar bola" liberado (tatu-bola). */
  temPoderBola = false;
  /** Velocidade horizontal que o vento soma ao Chico neste frame (definida pela cena). */
  ventoX = 0;
  /** Poder passivo "Nado da Onça": pode mergulhar e entrar na água funda. */
  temPoderOnca = false;
  /** Arrancada do guepardo (botão da pata na Savana). */
  temPoderArrancada = false;
  /** Força do elefante (passiva): empurrar pedregulhos. A cena usa este valor. */
  temPoderForca = false;
  /** Super pulo do canguru (botão da pata na Austrália). */
  temPoderSuperPulo = false;
  /** Cavar do wombat (passivo): a cena cava a terra fofa quando o Chico empurra contra ela. */
  temPoderCavar = false;
  /** Mergulho na neve da raposa-do-ártico (botão da pata no Ártico). */
  temPoderMergulho = false;
  /** Chão de gelo sob os pés neste frame (definido pela cena). */
  noGelo = false;
  /** Qual poder o botão da pata usa na fase atual (vem do tema do mundo). */
  poderBotao: PoderBotao = 'bola';
  /** Salto giratório do golfinho-rotador (botão da pata na Praia; só na água). */
  temPoderGiro = false;
  /** No ar depois do salto giratório. */
  girando = false;
  private giroAngulo = 0;
  /** Tobogã do pinguim (botão da pata na Antártica). */
  temPoderToboga = false;
  /** Deslizando de barriga: corpo baixinho. */
  deslizando = false;
  private deslizeTempo = 0;
  /** Tem teto baixo em cima (definido pela cena): deitado, não dá para levantar. */
  tetoBaixo = false;
  /** Caindo de cabeça (mergulho na neve). Quem encerra é a cena, que sabe se quebrou neve fofa embaixo. */
  mergulhando = false;
  /** Saltou para mergulhar: vira mergulho no alto do salto. */
  private mergulhoArmado = false;
  /** Super pulo no ar: não é cortado ao soltar o pulo e corre um pouco mais rápido. */
  private emSuperPulo = false;
  private bufferPoder = 0;
  private arrancadaTempo = 0;
  /** Arrancada em andamento (separado do tempo, que pode chegar a zero antes de encerrar). */
  private emArrancada = false;
  private recarga = 0;
  /** Água em que o Chico está neste frame (definida pela cena): y da superfície, ou null fora da água. */
  agua: { superficie: number } | null = null;
  private nadando = false;
  /** Avisa a cena quando o Chico entra na água (respingo). */
  aoEntrarNaAgua?: () => void;

  private partes: {
    camisa: Phaser.GameObjects.Image;
    bermuda: Phaser.GameObjects.Image;
    cabeca: Phaser.GameObjects.Container;
    piscar: Phaser.GameObjects.Image;
    bracoFrente: Phaser.GameObjects.Image;
    bracoTras: Phaser.GameObjects.Image;
    pernaFrente: Phaser.GameObjects.Image;
    pernaTras: Phaser.GameObjects.Image;
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

    // Montagem do boneco com as peças da arte do Chico (folha "chico"); coordenadas relativas aos pés,
    // olhando para a direita. Braços giram no ombro e pernas no quadril, por baixo da bermuda.
    const peca = (x: number, y: number, quadro: string, escala: number, ox = 0.5, oy = 0.5) =>
      scene.add.image(x, y, 'chico', quadro).setOrigin(ox, oy).setScale(escala);
    const pernaTras = peca(-C.pernaX, C.pernaY, 'perna', C.pernaEscala, 0.45, 0.06).setTint(0xd8d8d8);
    // O braço de trás é o mesmo desenho espelhado. Espelhar vira a figura pelo meio, então o ombro (a 30% da
    // largura no desenho original) passa a ficar a 70%: o eixo de giro vai junto, senão o braço "solta" do ombro
    // quando gira muito (na comemoração do fim da fase). A posição compensa a diferença (mesma pose parada).
    const larguraBraco = scene.textures.getFrame('chico', 'braco').realWidth * C.bracoEscala;
    const bracoTras = peca(-C.bracoX + 0.4 * larguraBraco, C.bracoY, 'braco', C.bracoEscala, 0.7, 0.06).setFlipX(true).setTint(0xd0d0d0);
    const pernaFrente = peca(C.pernaX, C.pernaY, 'perna', C.pernaEscala, 0.45, 0.06);
    const bermuda = peca(0, C.bermudaY, 'bermuda', C.bermudaEscala, 0.5, 1);
    const camisa = peca(0, C.camisaY, 'camisa', C.camisaEscala, 0.5, 0);
    const cabecaImg = peca(0, 0, 'cabeca', C.cabecaEscala, 0.5, 1);
    // pálpebras por cima dos olhos da arte (aparecem só na piscada)
    const piscar = scene.add.image(C.olhosX, C.olhosY, 'chico-piscar').setScale(0.5).setVisible(false);
    const cabeca = scene.add.container(0, C.cabecaY, [cabecaImg, piscar]);
    const bracoFrente = peca(C.bracoX, C.bracoY, 'braco', C.bracoEscala, 0.3, 0.06);
    this.visual = scene.add.container(x, y, [pernaTras, bracoTras, pernaFrente, bermuda, camisa, cabeca, bracoFrente]);
    this.visual.setDepth(10);
    this.partes = { camisa, bermuda, cabeca, piscar, bracoFrente, bracoTras, pernaFrente, pernaTras };

    this.poeira = scene.add.particles(0, 0, 'poeira', {
      lifespan: 380,
      speedX: { min: -90, max: 90 },
      speedY: { min: -120, max: -30 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.8, end: 0 },
      emitting: false,
    });
    this.poeira.setDepth(9);

    // Chico enrolado: bola de carapaça com os cachos dele aparecendo por cima (a cabeça não gira).
    this.bolaImg = scene.add.image(0, 0, 'chico-bola');
    const cabecaBola = scene.add.image(0, -18, 'chico', 'cabeca').setOrigin(0.5, 1).setScale(0.26);
    this.bolaVisual = scene.add.container(x, y, [cabecaBola, this.bolaImg]).setDepth(10).setVisible(false);
  }

  /** 0 a 1: quanto o poder do botão está pronto (a arrancada precisa recarregar). */
  get cargaPoder() {
    if (this.poderBotao === 'arrancada') return 1 - this.recarga / ARRANCADA.recargaMs;
    // o super pulo só sai do chão: no ar o botão fica meio apagado
    if (this.poderBotao === 'superpulo' || this.poderBotao === 'toboga') return this.coyote > 0 || this.estado !== 'normal' ? 1 : 0.5;
    // o salto do golfinho sai da água: fora dela o botão fica meio apagado
    if (this.poderBotao === 'giro') return this.nadando ? 1 : 0.5;
    return 1;
  }

  get noChaoAgora() {
    return this.noChao;
  }

  get arrancando() {
    return this.arrancadaTempo > 0;
  }

  /** Poeirinha em um ponto (usada ao empurrar pedregulhos). */
  soltarPoeira(x: number, y: number) {
    this.poeira.explode(3, x, y);
  }

  private encerrarArrancada() {
    if (!this.emArrancada) return;
    this.emArrancada = false;
    this.arrancadaTempo = 0;
    this.recarga = ARRANCADA.recargaMs;
    const b = this.sprite.body;
    if (this.estado === 'normal' && !this.nadando) b.setGravityY(PLAYER.gravity);
  }

  /** A fase final troca o poder do botão da pata a cada trecho. */
  trocarPoderBotao(p: PoderBotao) {
    if (p === this.poderBotao) return;
    this.encerrarArrancada();
    this.poderBotao = p;
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
    if (this.emSuperPulo && ((this.noChao && b.velocity.y >= 0) || this.estado !== 'normal' || this.agua)) this.emSuperPulo = false;
    if ((this.mergulhando || this.mergulhoArmado) && (this.estado !== 'normal' || this.agua)) this.terminarMergulho(false);

    // --- Poder "Virar bola": apertar de novo renova o tempo
    if (i.powerPressed && this.poderBotao === 'bola' && this.temPoderBola) {
      if (this.estado === 'bola') this.bolaTempo = BOLA.duracaoMs;
      else if (this.estado === 'normal') this.entrarBola();
    }
    if (this.estado === 'bola') {
      this.bolaTempo -= ms;
      if (this.bolaTempo <= 0) this.sairBola();
    }
    const enrolado = this.estado === 'bola';

    // --- Água: boiar, braçada, mergulho (com o poder da onça) e sair pulando
    // subindo no salto do golfinho, a água que ele acabou de deixar não segura o Chico
    const saltandoGiro = this.girando && b.velocity.y < 0;
    const naAgua = this.agua !== null && this.estado !== 'escalando' && !saltandoGiro;
    if (this.girando && ((this.noChao && b.velocity.y >= 0) || (naAgua && b.velocity.y >= 0) || this.estado !== 'normal')) {
      this.girando = false;
    }
    if (naAgua !== this.nadando) {
      this.nadando = naAgua;
      b.setGravityY(naAgua ? PLAYER.gravity * AGUA.fatorGravidade : this.estado === 'escalando' ? 0 : PLAYER.gravity);
      // O limite do motor vale para subir e descer: na água ele fica alto para não cortar o pulo de saída;
      // o afundar devagar é limitado no cálculo do nado (Clamp com AGUA.maxQueda).
      b.setMaxVelocityY(naAgua ? PLAYER.jumpVelocity : PLAYER.maxFall);
      if (naAgua) {
        b.setVelocityY(Math.min(b.velocity.y, 200));
        this.aoEntrarNaAgua?.();
      }
    }
    if (naAgua && this.agua) {
      const sup = this.agua.superficie;
      const mergulhando = i.down && this.temPoderOnca;
      let vy = b.velocity.y * (1 - Math.min(1, 2.5 * dt));
      if (mergulhando) vy += AGUA.mergulho * dt;
      else if (b.top > sup - 26) vy -= AGUA.empuxo * dt; // boia até a cabeça sair da água
      if (i.up && !mergulhando) vy -= AGUA.empuxo * 0.5 * dt;
      if (this.buffer > 0) {
        this.buffer = 0;
        // na superfície, o pulo tira o Chico da água; mais fundo, é uma braçada para cima
        vy = b.top < sup + 14 ? -PLAYER.jumpVelocity * AGUA.saltoSaida : -AGUA.bracada;
        AudioManager.tocar('bracada');
      }
      if (i.powerPressed && this.poderBotao === 'giro' && this.temPoderGiro && this.estado === 'normal') {
        // salto do golfinho: sai da água bem alto, girando
        this.girando = true;
        this.giroAngulo = 0;
        this.nadando = false;
        b.setGravityY(PLAYER.gravity);
        b.setMaxVelocityY(Math.max(PLAYER.maxFall, GIRO.velocidade));
        b.setVelocityY(-GIRO.velocidade);
        AudioManager.tocar('giro');
      } else {
        b.setVelocityY(Phaser.Math.Clamp(vy, -PLAYER.jumpVelocity, AGUA.maxQueda));
      }
      this.noChao = false;
      this.coyote = 0;
    }

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

    // --- Arrancada do guepardo: reta, rápida, sem cair; depois recarrega
    this.recarga = Math.max(0, this.recarga - ms);
    if (
      i.powerPressed &&
      this.poderBotao === 'arrancada' &&
      this.temPoderArrancada &&
      this.recarga <= 0 &&
      this.arrancadaTempo <= 0 &&
      this.estado === 'normal' &&
      !naAgua
    ) {
      this.arrancadaTempo = ARRANCADA.duracaoMs;
      this.emArrancada = true;
      b.setGravityY(0);
      b.setVelocityY(0);
      this.squash = 0.75;
      AudioManager.tocar('arrancada');
    }
    if (this.arrancadaTempo > 0) {
      this.arrancadaTempo -= ms;
      const bateu = (this.direcao > 0 && b.blocked.right) || (this.direcao < 0 && b.blocked.left);
      if (this.arrancadaTempo <= 0 || bateu || naAgua || this.estado !== 'normal') this.encerrarArrancada();
      else {
        b.setVelocityX(this.direcao * PLAYER.maxRun * ARRANCADA.fatorVelocidade);
        b.setVelocityY(0);
        if (Math.floor(this.tempoAnim * 30) % 2 === 0) this.poeira.emitParticleAt(this.x - this.direcao * 20, this.pes - 20);
        // pular durante a arrancada vira um pulo longo (a velocidade continua e cai aos poucos)
        if (this.buffer > 0) {
          this.encerrarArrancada();
          b.setVelocityY(-PLAYER.jumpVelocity);
          this.buffer = 0;
          AudioManager.tocar('pulo');
        }
        this.animar(dt);
        return;
      }
    }

    // --- Tobogã do pinguim: deita de barriga e desliza rápido; embaixo de teto baixo continua deitado
    if (
      i.powerPressed &&
      this.poderBotao === 'toboga' &&
      this.temPoderToboga &&
      this.estado === 'normal' &&
      !naAgua &&
      this.noChao &&
      !this.deslizando
    ) {
      this.comecarDeslize();
    }
    if (this.deslizando) {
      this.deslizeTempo -= ms;
      // dá para virar no meio do deslize
      if (i.left && this.direcao > 0) this.direcao = -1;
      else if (i.right && this.direcao < 0) this.direcao = 1;
      // no comecinho, a "batida" é da parede na altura da cabeça (em pé); deitado, o Chico já cabe no túnel
      const comecando = this.deslizeTempo > TOBOGA.duracaoMs - 150;
      const bateu = !comecando && ((this.direcao > 0 && b.blocked.right) || (this.direcao < 0 && b.blocked.left));
      const pulou = this.buffer > 0 && !this.tetoBaixo;
      if (this.estado !== 'normal' || naAgua || ((this.deslizeTempo <= 0 || bateu || pulou) && !this.tetoBaixo)) {
        this.terminarDeslize();
      } else {
        b.setVelocityX(this.direcao * PLAYER.maxRun * TOBOGA.fatorVelocidade * (bateu ? 0 : 1));
        if (Math.floor(this.tempoAnim * 20) % 2 === 0) this.poeira.emitParticleAt(this.x - this.direcao * 30, this.pes - 4);
        this.animar(dt);
        return;
      }
    }

    // --- Corrida horizontal com aceleração suave
    const alvo = (i.right ? 1 : 0) - (i.left ? 1 : 0);
    if (alvo !== 0) this.direcao = alvo as 1 | -1;
    const vx = b.velocity.x;
    // no gelo, acelera e freia bem menos: o Chico escorrega
    const gelo = this.noChao && this.noGelo;
    const acel = this.noChao
      ? alvo !== 0
        ? PLAYER.groundAccel * (gelo ? GELO.fatorAcel : 1)
        : PLAYER.groundDecel * (gelo ? GELO.fatorFreio : 1)
      : alvo !== 0
        ? PLAYER.airAccel
        : PLAYER.airDecel;
    // Virar de direção é mais rápido que acelerar (resposta imediata).
    const virando = alvo !== 0 && Math.sign(vx) === -alvo;
    const a = virando ? acel * 1.8 : acel;
    let nvx = vx;
    // O vento desloca o ponto de equilíbrio: contra ele o Chico anda devagar; parado, é empurrado.
    const vento = this.estado === 'escalando' ? 0 : this.ventoX * (enrolado ? VENTO.fatorBola : 1);
    const fator = enrolado ? BOLA.fatorVelocidade : naAgua ? AGUA.fatorVelocidade : this.emSuperPulo ? SUPERPULO.fatorVelocidade : 1;
    const meta = alvo * PLAYER.maxRun * fator + vento;
    if (nvx < meta) nvx = Math.min(meta, nvx + a * dt);
    else if (nvx > meta) nvx = Math.max(meta, nvx - a * dt);
    b.setVelocityX(nvx);

    // --- Pulo: coyote time + jump buffer + altura variável
    // Enrolado em bola não pula (o tatu-bola fechado não salta).
    if (!enrolado && !naAgua && this.buffer > 0 && this.coyote > 0) {
      b.setVelocityY(-PLAYER.jumpVelocity);
      this.buffer = 0;
      this.coyote = 0;
      this.noChao = false;
      this.squash = 0.8;
      AudioManager.tocar('pulo');
      this.poeira.explode(5, this.x, this.pes);
    }
    // --- Super pulo do canguru: sai do chão (com a mesma folga do pulo) e não é cortado ao soltar
    this.bufferPoder = i.powerPressed ? SUPERPULO.bufferMs : Math.max(0, this.bufferPoder - ms);
    if (
      this.bufferPoder > 0 &&
      this.poderBotao === 'superpulo' &&
      this.temPoderSuperPulo &&
      this.estado === 'normal' &&
      !naAgua &&
      this.coyote > 0
    ) {
      this.bufferPoder = 0;
      this.buffer = 0;
      this.coyote = 0;
      this.noChao = false;
      this.emSuperPulo = true;
      b.setVelocityY(-SUPERPULO.velocidade);
      this.squash = 0.65;
      AudioManager.tocar('superpulo');
      this.poeira.explode(10, this.x, this.pes);
    }
    // --- Mergulho da raposa: do chão, salta e cai de cabeça no alto do salto; no ar, mergulha na hora
    if (
      i.powerPressed &&
      this.poderBotao === 'mergulho' &&
      this.temPoderMergulho &&
      this.estado === 'normal' &&
      !naAgua &&
      !this.mergulhando &&
      !this.mergulhoArmado
    ) {
      if (this.coyote > 0) {
        b.setVelocityY(-PLAYER.jumpVelocity * MERGULHO.salto);
        this.mergulhoArmado = true;
        this.coyote = 0;
        this.buffer = 0;
        this.noChao = false;
        this.squash = 0.75;
        AudioManager.tocar('pulo');
      } else {
        this.comecarMergulho();
      }
    }
    if (this.mergulhoArmado && b.velocity.y >= 0) this.comecarMergulho();
    if (this.mergulhando) {
      b.setVelocity(alvo * MERGULHO.velocidadeX, MERGULHO.queda);
    }
    if (!naAgua && !this.emSuperPulo && !this.girando && !this.mergulhoArmado && !this.mergulhando && !i.jumpHeld && b.velocity.y < 0 && !this.noChao) {
      b.setVelocityY(b.velocity.y * PLAYER.jumpCutFactor);
    }

    this.animar(dt);
  }

  private comecarMergulho() {
    this.mergulhoArmado = false;
    this.mergulhando = true;
    this.sprite.body.setVelocityY(MERGULHO.queda);
    AudioManager.tocar('mergulho');
  }

  /** Fim do mergulho (a cena chama ao bater em chão que não é neve fofa). */
  terminarMergulho(comEfeito = true) {
    if (!this.mergulhando && !this.mergulhoArmado) return;
    this.mergulhando = false;
    this.mergulhoArmado = false;
    if (comEfeito) {
      this.squash = 1.3;
      this.poeira.explode(8, this.x, this.pes);
      AudioManager.tocar('aterrissar');
    }
  }

  private comecarDeslize() {
    const b = this.sprite.body;
    this.deslizando = true;
    this.deslizeTempo = TOBOGA.duracaoMs;
    // corpo baixinho, com os pés no mesmo lugar
    b.setSize(PLAYER.bodyWidth, TOBOGA.altura);
    this.sprite.y += (PLAYER.bodyHeight - TOBOGA.altura) / 2;
    this.squash = 1.2;
    AudioManager.tocar('toboga');
  }

  terminarDeslize() {
    if (!this.deslizando) return;
    this.deslizando = false;
    const b = this.sprite.body;
    b.setSize(PLAYER.bodyWidth, PLAYER.bodyHeight);
    this.sprite.y -= (PLAYER.bodyHeight - TOBOGA.altura) / 2;
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
      p.piscar.setVisible(true);
      if (this.proximaPiscada < -0.12) {
        p.piscar.setVisible(false);
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

    if (this.girando && this.estado === 'normal') {
      // gira em volta do meio do corpo (o desenho tem os pés na origem)
      this.giroAngulo += dt * Math.PI * 2 * GIRO.voltasPorSegundo;
      const rot = this.direcao * this.giroAngulo;
      bracoF = -2.9;
      bracoT = -2.9;
      pernaF = 0.1;
      pernaT = -0.1;
      inclinacao = rot;
      v.x = this.sprite.x - 45 * Math.sin(rot);
      v.y = b.center.y + 45 * Math.cos(rot);
    } else if (this.deslizando && this.estado === 'normal') {
      // deitado de barriga, cabeça para a frente, braços esticados (como o pinguim)
      bracoF = -3.1;
      bracoT = -3.1;
      pernaF = 0.15;
      pernaT = -0.15;
      inclinacao = this.direcao * 1.5;
      v.y = b.bottom - 18;
      v.x = this.sprite.x - this.direcao * 40;
    } else if (this.mergulhando && this.estado === 'normal') {
      // de cabeça para baixo, braços esticados à frente (como a raposa)
      bracoF = -3.0;
      bracoT = -3.0;
      pernaF = 0.2;
      pernaT = -0.2;
      inclinacao = this.direcao * 2.7;
      // girado de cabeça para baixo em volta do alto do corpo: a cabeça fica embaixo, dentro da caixa de colisão
      v.y = b.top + 8;
    } else if (this.estado === 'festa') {
      // "Êêê!": os dois braços abertos para cima, balançando (o da frente não passa na frente do rosto)
      bracoF = -1.85 + Math.sin(t * 14) * 0.25;
      bracoT = 1.85 - Math.sin(t * 14) * 0.25;
      // pulinhos de alegria: o corpo inteiro sobe junto (sem separar a cabeça da camisa)
      v.y = b.bottom - Math.abs(Math.sin(t * 7)) * 18;
    } else if (this.estado === 'caido') {
      bracoF = -2.2;
      bracoT = -2.2;
      pernaF = 0.4;
      pernaT = -0.4;
    } else if (this.nadando) {
      // nado: braços em círculo, pernas batendo
      const s = Math.sin(t * 7);
      bracoF = -2.2 + s * 0.9;
      bracoT = -2.2 - s * 0.9;
      pernaF = Math.sin(t * 12) * 0.5;
      pernaT = -Math.sin(t * 12) * 0.5;
      inclinacao = Math.abs(b.velocity.x) > 40 ? 0.25 : 0;
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
    p.camisa.y = C.camisaY + quique * 0.6;
    p.bermuda.y = C.bermudaY + quique * 0.4;
    p.bracoFrente.y = C.bracoY + quique * 0.6;
    p.bracoTras.y = C.bracoY + quique * 0.6;
    p.cabeca.y = C.cabecaY + quique;
    v.rotation = inclinacao;
  }

  // ---------------------------------------------------------------- eventos

  cair(onDone: () => void) {
    if (this.estado === 'caido') return;
    this.sairBola(false);
    this.arrancadaTempo = 0;
    this.emArrancada = false;
    this.emSuperPulo = false;
    this.mergulhando = false;
    this.mergulhoArmado = false;
    this.terminarDeslize();
    this.girando = false;
    this.recarga = 0;
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
    b.setMaxVelocityY(PLAYER.maxFall);
    // volta "fora d'água": se renascer dentro da água, o próximo quadro liga o nado com a gravidade certa
    this.nadando = false;
    this.girando = false;
    this.estado = 'normal';
    this.visual.setAlpha(1);
    this.visual.setPosition(x, b.bottom);
    this.scene.tweens.add({ targets: this.visual, scaleY: { from: 0.6, to: 1 }, duration: 220, ease: 'Back.easeOut' });
  }

  comemorar() {
    // Se tocou o objetivo no meio de uma arrancada, volta a gravidade para comemorar no chão.
    this.encerrarArrancada();
    this.terminarDeslize();
    this.estado = 'festa';
    const b = this.sprite.body;
    b.setVelocityX(0);
  }
}
