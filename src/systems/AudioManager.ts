// Efeitos sonoros e música gerados por síntese (Web Audio). Nenhum arquivo de áudio necessário.
import { SaveManager } from '../core/SaveManager';
import type { TemaMusica } from '../data/mundos';

export type Sfx =
  | 'pulo'
  | 'aterrissar'
  | 'pegada'
  | 'checkpoint'
  | 'ai'
  | 'vitoria'
  | 'botao'
  | 'escalar'
  | 'bola'
  | 'desbola'
  | 'poder'
  | 'pedra'
  | 'splash'
  | 'bracada'
  | 'canto'
  | 'arrancada'
  | 'empurrar'
  | 'superpulo'
  | 'cavar'
  | 'sinal'
  | 'mergulho'
  | 'neve'
  | 'toboga'
  | 'baleia'
  | 'bolhas'
  | 'giro'
  | 'lixo'
  | 'escavar'
  | 'portal'
  | 'encaixe'
  | 'certo'
  | 'quase';

class AudioManagerImpl {
  private ctx?: AudioContext;
  private sfxGain?: GainNode;
  private musicGain?: GainNode;
  private musicTimer?: number;
  private nextBeatTime = 0;
  private beat = 0;
  private noiseBuf?: AudioBuffer;
  private querMusica = false;
  private tema: TemaMusica = 'baiao';
  private chuvaFonte?: AudioBufferSourceNode;
  private chuvaGain?: GainNode;

  /** Precisa ser chamado dentro de um gesto do usuário (toque/tecla). */
  desbloquear(): void {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain.connect(this.ctx.destination);
      this.musicGain.connect(this.ctx.destination);
      this.noiseBuf = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.aplicarVolumes();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.querMusica) this.tocarMusica();
  }

  aplicarVolumes(): void {
    const s = SaveManager.data.settings;
    if (this.sfxGain) this.sfxGain.gain.value = s.volumeEfeitos * 0.5;
    if (this.musicGain) this.musicGain.gain.value = s.volumeMusica * 0.22;
  }

  private tom(
    freq: number,
    dur: number,
    opts: { tipo?: OscillatorType; ate?: number; vol?: number; atraso?: number; destino?: AudioNode } = {},
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const t0 = ctx.currentTime + (opts.atraso ?? 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opts.tipo ?? 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.ate) osc.frequency.exponentialRampToValueAtTime(opts.ate, t0 + dur);
    const v = opts.vol ?? 0.3;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(opts.destino ?? this.sfxGain!);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private ruido(dur: number, filtro: number, vol: number, quando?: number, destino?: AudioNode): void {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuf) return;
    const t0 = quando ?? ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = filtro > 3000 ? 'highpass' : 'lowpass';
    f.frequency.value = filtro;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(destino ?? this.sfxGain!);
    src.start(t0, Math.random() * 0.5);
    src.stop(t0 + dur + 0.02);
  }

  tocar(sfx: Sfx): void {
    if (!this.ctx) return;
    switch (sfx) {
      case 'pulo':
        this.tom(330, 0.16, { tipo: 'square', ate: 660, vol: 0.18 });
        break;
      case 'aterrissar':
        this.ruido(0.08, 600, 0.25);
        break;
      case 'pegada':
        this.tom(880, 0.09, { tipo: 'triangle', vol: 0.35 });
        this.tom(1320, 0.14, { tipo: 'triangle', vol: 0.35, atraso: 0.07 });
        break;
      case 'checkpoint':
        [523, 659, 784, 1047].forEach((f, i) => this.tom(f, 0.2, { tipo: 'triangle', vol: 0.3, atraso: i * 0.08 }));
        break;
      case 'ai':
        this.tom(520, 0.3, { tipo: 'sine', ate: 200, vol: 0.3 });
        break;
      case 'vitoria':
        [523, 659, 784, 659, 784, 1047].forEach((f, i) =>
          this.tom(f, 0.22, { tipo: 'square', vol: 0.16, atraso: i * 0.12 }),
        );
        break;
      case 'botao':
        this.tom(660, 0.06, { tipo: 'sine', vol: 0.25 });
        break;
      case 'escalar':
        this.ruido(0.05, 2000, 0.08);
        break;
      case 'bola':
        this.tom(520, 0.12, { tipo: 'triangle', ate: 180, vol: 0.35 });
        this.ruido(0.06, 900, 0.2);
        break;
      case 'desbola':
        this.tom(200, 0.12, { tipo: 'triangle', ate: 520, vol: 0.3 });
        break;
      case 'poder':
        [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tom(f, 0.25, { tipo: 'triangle', vol: 0.28, atraso: i * 0.07 }));
        break;
      case 'splash':
        this.ruido(0.35, 1200, 0.4);
        this.tom(260, 0.2, { tipo: 'sine', ate: 90, vol: 0.2 });
        break;
      case 'bracada':
        this.ruido(0.12, 900, 0.18);
        break;
      case 'arrancada':
        this.ruido(0.3, 2500, 0.25);
        this.tom(300, 0.25, { tipo: 'sawtooth', ate: 900, vol: 0.12 });
        break;
      case 'empurrar':
        this.ruido(0.18, 300, 0.25);
        break;
      case 'superpulo':
        // mola: sobe bem mais que o pulo normal
        this.tom(220, 0.3, { tipo: 'triangle', ate: 990, vol: 0.28 });
        this.tom(440, 0.22, { tipo: 'square', ate: 1320, vol: 0.08, atraso: 0.05 });
        break;
      case 'cavar':
        this.ruido(0.07, 700, 0.22);
        break;
      case 'mergulho':
        // assobio descendo: a raposa cai de cabeça
        this.tom(900, 0.28, { tipo: 'sine', ate: 300, vol: 0.2 });
        break;
      case 'toboga':
        // barriga deslizando na neve: chiado longo
        this.ruido(0.6, 2200, 0.22);
        this.tom(420, 0.4, { tipo: 'triangle', ate: 260, vol: 0.12 });
        break;
      case 'baleia':
        // canto da jubarte (estilizado): tons graves que sobem e descem devagar
        this.tom(160, 1.1, { tipo: 'sine', ate: 320, vol: 0.28 });
        this.tom(330, 0.9, { tipo: 'sine', ate: 140, vol: 0.22, atraso: 1.0 });
        break;
      case 'giro':
        this.ruido(0.3, 1200, 0.3);
        [523, 659, 784, 1047].forEach((f, k) => this.tom(f, 0.1, { tipo: 'triangle', vol: 0.2, atraso: k * 0.06 }));
        break;
      case 'escavar':
        // pincel e espátula limpando a rocha
        this.ruido(0.12, 3000, 0.18);
        if (this.ctx) this.ruido(0.1, 1800, 0.14, this.ctx.currentTime + 0.16);
        break;
      case 'portal':
        // Portal do Tempo: brilho que sobe e desce
        [392, 523, 659, 784, 1047, 784, 1047, 1319].forEach((f, k) => this.tom(f, 0.18, { tipo: 'sine', vol: 0.14, atraso: k * 0.07 }));
        this.tom(110, 1.2, { tipo: 'triangle', ate: 220, vol: 0.2 });
        break;
      case 'encaixe':
        // osso encaixando no lugar
        this.tom(220, 0.08, { tipo: 'square', ate: 160, vol: 0.18 });
        this.tom(880, 0.12, { tipo: 'triangle', vol: 0.15, atraso: 0.07 });
        break;
      case 'certo':
        [659, 784, 1047].forEach((f, k) => this.tom(f, 0.14, { tipo: 'triangle', vol: 0.2, atraso: k * 0.09 }));
        break;
      case 'quase':
        // sem som de "erro" feio: duas notas suaves descendo
        this.tom(523, 0.16, { tipo: 'sine', vol: 0.16 });
        this.tom(440, 0.22, { tipo: 'sine', vol: 0.14, atraso: 0.16 });
        break;
      case 'lixo':
        this.tom(660, 0.08, { tipo: 'square', vol: 0.15 });
        this.tom(990, 0.12, { tipo: 'square', vol: 0.15, atraso: 0.08 });
        break;
      case 'bolhas':
        [900, 1200, 1000, 1400].forEach((f, k) => this.tom(f, 0.06, { tipo: 'sine', ate: f * 1.6, vol: 0.1, atraso: k * 0.12 }));
        break;
      case 'neve':
        // neve fofa quebrando: ruído macio e abafado
        this.ruido(0.18, 1600, 0.3);
        this.ruido(0.1, 500, 0.2);
        break;
      case 'sinal':
        // sinais debaixo d'água (estilizado): bipes suaves e agudos
        this.tom(1760, 0.08, { tipo: 'sine', vol: 0.12 });
        this.tom(2093, 0.1, { tipo: 'sine', vol: 0.1, atraso: 0.12 });
        break;
      case 'canto':
        // chamado de ave (estilizado): duas notas agudas e ásperas
        this.tom(1400, 0.12, { tipo: 'sawtooth', ate: 900, vol: 0.12 });
        this.tom(1500, 0.14, { tipo: 'sawtooth', ate: 950, vol: 0.12, atraso: 0.18 });
        break;
      case 'pedra':
        this.ruido(0.07, 1500, 0.22);
        this.tom(900, 0.05, { tipo: 'square', ate: 400, vol: 0.08 });
        break;
    }
  }

  // ---------- Ambiente: chuva (ruído filtrado em laço) e rajadas de vento

  chuva(ligada: boolean): void {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuf) return;
    if (ligada && !this.chuvaFonte) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 2500;
      f.Q.value = 0.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 1.5);
      src.connect(f).connect(g).connect(this.sfxGain!);
      src.start();
      this.chuvaFonte = src;
      this.chuvaGain = g;
    } else if (!ligada && this.chuvaFonte && this.chuvaGain) {
      const src = this.chuvaFonte;
      this.chuvaGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
      src.stop(ctx.currentTime + 2.1);
      this.chuvaFonte = undefined;
      this.chuvaGain = undefined;
    }
  }

  rajada(): void {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuf) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(1400, t + 0.6);
    f.frequency.exponentialRampToValueAtTime(400, t + 1.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    src.connect(f).connect(g).connect(this.sfxGain!);
    src.start(t, Math.random() * 0.3);
    src.stop(t + 1.9);
  }

  // ---------- Música: baião simples (zabumba + triângulo + melodia na escala nordestina) ----------

  tocarMusica(tema?: TemaMusica): void {
    if (tema && tema !== this.tema) {
      this.pararMusica();
      this.tema = tema;
    }
    this.querMusica = true;
    if (!this.ctx || this.musicTimer !== undefined) return;
    this.nextBeatTime = this.ctx.currentTime + 0.1;
    this.beat = 0;
    this.musicTimer = window.setInterval(() => this.agendar(), 50);
  }

  pararMusica(): void {
    this.querMusica = false;
    if (this.musicTimer !== undefined) window.clearInterval(this.musicTimer);
    this.musicTimer = undefined;
  }

  private agendar(): void {
    if (this.tema === 'mata') return this.agendarMata();
    if (this.tema === 'savana') return this.agendarSavana();
    if (this.tema === 'outback') return this.agendarOutback();
    if (this.tema === 'artico') return this.agendarArtico();
    if (this.tema === 'antartica') return this.agendarAntartica();
    if (this.tema === 'praia') return this.agendarPraia();
    if (this.tema === 'dinos') return this.agendarDinos();
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 104 / 4; // semicolcheia a 104 bpm
    // Escala nordestina (mixolídio com 4ª aumentada) em Ré.
    const escala = [293.66, 329.63, 369.99, 415.3, 440, 493.88, 523.25, 587.33];
    const melodia = [0, -1, 2, -1, 4, -1, 2, 1, 0, -1, -1, -1, 4, 5, 7, -1, 6, -1, 4, -1, 5, 4, 2, -1, 3, -1, 2, 1, 0, -1, -1, -1];
    const baixo = [146.83, 146.83, 196, 220];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 16;
      const compasso = Math.floor(this.beat / 16);
      const dest = this.musicGain!;
      // zabumba: batida no 1 e no "e" do 2 (célula do baião)
      if (b === 0 || b === 6 || b === 8) this.bumbo(t, dest);
      // triângulo: todas as semicolcheias, aberto no contratempo
      this.ruido(b % 4 === 2 ? 0.12 : 0.03, 7000, b % 4 === 2 ? 0.12 : 0.05, t, dest);
      // baixo
      if (b === 0 || b === 8) this.tomEm(t, baixo[compasso % 4], 0.3, 'triangle', 0.5, dest);
      // melodia (sanfona simplificada) a cada colcheia
      if (b % 2 === 0) {
        const idx = melodia[(this.beat / 2) % melodia.length];
        if (idx >= 0) this.tomEm(t, escala[idx], passo * 1.8, 'sawtooth', 0.09, dest);
      }
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  // Mata: marimba suave em pentatônica, chocalho e grave leve (sem clichês "tribais").
  private agendarMata(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 92 / 4;
    const escala = [392, 440, 493.88, 587.33, 659.25, 783.99, 880];
    const melodia = [0, -1, 2, -1, 3, -1, 2, -1, 4, -1, 3, 2, 1, -1, -1, -1, 2, -1, 3, -1, 5, -1, 4, -1, 3, -1, 2, 3, 2, -1, -1, -1];
    const baixo = [98, 98, 130.81, 110];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 16;
      const compasso = Math.floor(this.beat / 16);
      const dest = this.musicGain!;
      // chocalho nas colcheias
      if (b % 2 === 0) this.ruido(0.05, 6000, b % 4 === 2 ? 0.07 : 0.04, t, dest);
      // grave leve
      if (b === 0 || b === 10) this.tomEm(t, baixo[compasso % 4], 0.5, 'sine', 0.45, dest);
      // marimba: nota curta, ataque rápido
      if (b % 2 === 0) {
        const idx = melodia[(this.beat / 2) % melodia.length];
        if (idx >= 0) {
          this.tomEm(t, escala[idx], 0.28, 'triangle', 0.16, dest);
          this.tomEm(t, escala[idx] * 2, 0.12, 'sine', 0.05, dest);
        }
      }
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  // Savana: espaço aberto e movimento — arpejos claros em maior, batida leve e constante.
  private agendarSavana(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 112 / 4;
    const acordes = [
      [261.63, 329.63, 392, 523.25],
      [220, 261.63, 329.63, 440],
      [174.61, 220, 261.63, 349.23],
      [196, 246.94, 293.66, 392],
    ];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 16;
      const acorde = acordes[Math.floor(this.beat / 16) % 4];
      const dest = this.musicGain!;
      if (b % 4 === 0) this.bumbo(t, dest);
      if (b % 4 === 2) this.ruido(0.06, 5000, 0.06, t, dest);
      if (b === 0 || b === 8) this.tomEm(t, acorde[0] / 2, 0.45, 'triangle', 0.4, dest);
      // arpejo dedilhado
      if (b % 2 === 0) this.tomEm(t, acorde[(b / 2) % 4], 0.22, 'triangle', 0.13, dest);
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  // Austrália: ritmo de saltos (compasso composto, "pula-pula"), baixo dedilhado e melodia em pentatônica.
  // Sem imitar instrumentos tradicionais aborígenes (evita clichê).
  private agendarOutback(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 100 / 3; // colcheia em 6/8 (semínima pontuada a 100)
    const escala = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25];
    const melodia = [0, -1, 2, 3, -1, 2, 4, -1, 3, 2, -1, 1, 0, -1, 2, 4, -1, 5, 6, -1, 5, 4, 3, 2];
    const baixo = [146.83, 146.83, 196, 220];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 6;
      const compasso = Math.floor(this.beat / 6);
      const dest = this.musicGain!;
      if (b === 0 || b === 3) this.bumbo(t, dest);
      // bloco de madeira (estalo curto) nos tempos fracos
      if (b === 2 || b === 5) this.tomEm(t, 1320, 0.04, 'sine', 0.08, dest);
      if (b === 0) this.tomEm(t, baixo[compasso % 4], 0.5, 'triangle', 0.4, dest);
      if (b === 3) this.tomEm(t, baixo[compasso % 4] * 1.5, 0.3, 'triangle', 0.3, dest);
      const idx = melodia[this.beat % melodia.length];
      if (idx >= 0) this.tomEm(t, escala[idx], passo * 1.6, 'triangle', 0.14, dest);
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  // Ártico: calma e luminosa — sininhos (seno com cauda longa) em pentatônica, grave bem suave, sem bateria.
  private agendarArtico(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 84 / 2; // colcheia a 84 bpm
    const escala = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
    const melodia = [2, -1, 4, -1, 3, 2, -1, -1, 1, -1, 2, 4, 5, -1, -1, -1, 4, -1, 3, -1, 2, 1, -1, 0, 1, -1, 2, -1, -1, -1, -1, -1];
    const baixo = [130.81, 110, 87.31, 98];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 8;
      const compasso = Math.floor(this.beat / 8);
      const dest = this.musicGain!;
      if (b === 0) this.tomEm(t, baixo[compasso % 4], 1.6, 'sine', 0.35, dest);
      const idx = melodia[this.beat % melodia.length];
      if (idx >= 0) {
        this.tomEm(t, escala[idx], 0.9, 'sine', 0.13, dest);
        this.tomEm(t, escala[idx] * 3, 0.3, 'sine', 0.025, dest);
      }
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  // Antártica: vasta e tranquila — acordes longos e graves, sininhos espaçados e um "vento" de ruído bem baixo.
  private agendarAntartica(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 72 / 2;
    const acordes = [
      [220, 261.63, 329.63],
      [196, 246.94, 293.66],
      [174.61, 220, 261.63],
      [196, 246.94, 329.63],
    ];
    const sinos = [659.25, 783.99, 880, 987.77, 1174.66];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 8;
      const acorde = acordes[Math.floor(this.beat / 8) % 4];
      const dest = this.musicGain!;
      if (b === 0) for (const f of acorde) this.tomEm(t, f / 2, 2.6, 'sine', 0.16, dest);
      if (b === 0 || b === 4) this.ruido(1.2, 500, 0.03, t, dest);
      if (b === 2 || b === 5 || b === 7) this.tomEm(t, sinos[(this.beat * 3) % sinos.length], 1.1, 'sine', 0.1, dest);
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  // Praia: balanço alegre de beira-mar — violão dedilhado (triângulo), ganzá nas semicolcheias e marcação no grave.
  private agendarPraia(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 96 / 4;
    const acordes = [
      [293.66, 369.99, 440, 554.37],
      [246.94, 293.66, 369.99, 440],
      [196, 246.94, 293.66, 392],
      [220, 277.18, 329.63, 440],
    ];
    const melodia = [4, -1, 5, 4, 2, -1, 0, -1, 2, 4, -1, 7, 5, -1, 4, -1];
    const escala = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 16;
      const acorde = acordes[Math.floor(this.beat / 16) % 4];
      const dest = this.musicGain!;
      this.ruido(b % 2 === 0 ? 0.04 : 0.02, 6500, b % 4 === 2 ? 0.08 : 0.04, t, dest);
      if (b === 0 || b === 10) this.tomEm(t, acorde[0] / 2, 0.4, 'triangle', 0.4, dest);
      if (b % 4 === 2) this.tomEm(t, acorde[1 + ((b / 4) | 0) % 3], 0.2, 'triangle', 0.1, dest);
      if (b % 2 === 0) {
        const idx = melodia[(this.beat / 2) % melodia.length];
        if (idx >= 0 && Math.floor(this.beat / 32) % 2 === 1) this.tomEm(t, escala[idx], 0.25, 'sine', 0.12, dest);
      }
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  // Dinossauros: passos graves e lentos (como passos de gigante), marimba de descoberta e um coro suave.
  private agendarDinos(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const passo = 60 / 88 / 4;
    const escala = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440, 523.25];
    const melodia = [0, -1, 2, -1, 4, -1, 7, -1, 6, -1, 4, -1, 5, -1, -1, -1, 4, -1, 2, -1, 4, -1, 8, -1, 7, -1, 6, 4, 2, -1, -1, -1];
    const baixo = [110, 87.31, 98, 82.41];
    while (this.nextBeatTime < ctx.currentTime + 0.2) {
      const t = this.nextBeatTime;
      const b = this.beat % 16;
      const compasso = Math.floor(this.beat / 16);
      const dest = this.musicGain!;
      if (b === 0 || b === 8) this.bumbo(t, dest);
      if (b === 0) this.tomEm(t, baixo[compasso % 4], 1.2, 'triangle', 0.35, dest);
      if (b % 4 === 2) this.ruido(0.03, 4000, 0.05, t, dest);
      if (b % 2 === 0) {
        const idx = melodia[(this.beat / 2) % melodia.length];
        if (idx >= 0) this.tomEm(t, escala[idx], 0.35, 'sine', 0.13, dest);
      }
      if (b === 0 && compasso % 2 === 1) this.tomEm(t, baixo[compasso % 4] * 4, passo * 14, 'sine', 0.05, dest);
      this.nextBeatTime += passo;
      this.beat++;
    }
  }

  private tomEm(t: number, f: number, dur: number, tipo: OscillatorType, vol: number, dest: AudioNode): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = 1800;
    osc.type = tipo;
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(filtro).connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private bumbo(t: number, dest: AudioNode): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + 0.25);
  }
}

export const AudioManager = new AudioManagerImpl();
