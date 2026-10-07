// Arte da escalada com as tias: uma pedra para cada mundo, agarras coloridas, capacete, mosquetão,
// o botão de olhar de novo e o ícone da pedra no mapa. Tudo desenhado por código.
import Phaser from 'phaser';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';
import type { MundoId } from '../data/mundos';

/** Tamanho da textura das pedras; o topo plano (onde o Chico chega) fica em PEDRA_TOPO. */
export const PEDRA_LARGURA = 640;
export const PEDRA_ALTURA = 500;
export const PEDRA_TOPO = 26;

/** Meia largura da pedra na altura y (0 = topo, PEDRA_ALTURA = base): usada também para espalhar as agarras. */
export function meiaLarguraPedra(y: number) {
  const t = Phaser.Math.Clamp((y - PEDRA_TOPO) / (PEDRA_ALTURA - PEDRA_TOPO), 0, 1);
  return 95 + (300 - 95) * Math.pow(t, 0.7);
}

interface EstiloPedra {
  claro: string;
  escuro: string;
  /** Detalhes do mundo desenhados por cima. */
  extra?: (c: Ctx, r: () => number, contorno: () => void) => void;
  /** Topo arredondado (domo de granito) em vez de plano. */
  domo?: boolean;
}

const faixas = (cores: string[], passo: number) => (c: Ctx, r: () => number, contorno: () => void) => {
  c.save();
  contorno();
  c.clip();
  for (let y = PEDRA_TOPO, i = 0; y < PEDRA_ALTURA; y += passo + r() * passo * 0.6, i++) {
    c.fillStyle = cores[i % cores.length];
    c.globalAlpha = 0.55;
    c.beginPath();
    c.moveTo(0, y);
    for (let x = 0; x <= PEDRA_LARGURA; x += 40) c.lineTo(x, y + Math.sin(x / 70 + i) * 4);
    c.lineTo(PEDRA_LARGURA, y + passo * 0.5);
    for (let x = PEDRA_LARGURA; x >= 0; x -= 40) c.lineTo(x, y + passo * 0.5 + Math.sin(x / 60 + i) * 3);
    c.closePath();
    c.fill();
  }
  c.restore();
};

const neve = (c: Ctx, r: () => number, contorno: () => void) => {
  // capa de neve no topo e montinhos nas saliências
  c.save();
  contorno();
  c.clip();
  c.fillStyle = '#f4f8fc';
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(PEDRA_LARGURA, 0);
  for (let x = PEDRA_LARGURA; x >= 0; x -= 30) c.lineTo(x, PEDRA_TOPO + 26 + Math.sin(x / 23) * 9 + r() * 6);
  c.closePath();
  c.fill();
  for (let k = 0; k < 7; k++) {
    const y = PEDRA_TOPO + 90 + r() * 330;
    const x = PEDRA_LARGURA / 2 + (r() - 0.5) * meiaLarguraPedra(y) * 1.4;
    c.beginPath();
    c.ellipse(x, y, 26 + r() * 22, 7, 0, Math.PI, 0);
    c.fill();
  }
  c.restore();
};

const ESTILOS: Record<MundoId, EstiloPedra> = {
  caatinga: {
    claro: '#c4b49c',
    escuro: '#8a7a66',
    extra: (c, r) => {
      // liquens laranja e amarelos no granito do lajedo
      for (let k = 0; k < 26; k++) {
        const y = PEDRA_TOPO + 30 + r() * 420;
        const x = PEDRA_LARGURA / 2 + (r() - 0.5) * meiaLarguraPedra(y) * 1.6;
        c.fillStyle = r() < 0.5 ? 'rgba(217,150,50,0.55)' : 'rgba(230,200,80,0.5)';
        c.beginPath();
        c.ellipse(x, y, 6 + r() * 10, 4 + r() * 6, r() * 3, 0, Math.PI * 2);
        c.fill();
      }
    },
  },
  amazonia: {
    claro: '#86917f',
    escuro: '#545e4f',
    extra: (c, r, contorno) => {
      c.save();
      contorno();
      c.clip();
      // musgo
      for (let k = 0; k < 30; k++) {
        const y = PEDRA_TOPO + r() * 460;
        const x = PEDRA_LARGURA / 2 + (r() - 0.5) * meiaLarguraPedra(y) * 1.8;
        c.fillStyle = r() < 0.5 ? 'rgba(80,140,60,0.7)' : 'rgba(110,165,70,0.6)';
        c.beginPath();
        c.ellipse(x, y, 10 + r() * 22, 6 + r() * 10, r() * 3, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
      // raízes descendo do topo
      c.lineCap = 'round';
      for (let k = 0; k < 5; k++) {
        const x0 = PEDRA_LARGURA / 2 + (k - 2) * 38 + r() * 10;
        c.strokeStyle = OUTLINE;
        c.lineWidth = 7;
        const desenhar = () => {
          c.beginPath();
          c.moveTo(x0, PEDRA_TOPO);
          c.bezierCurveTo(x0 + 30 * (r() - 0.5), 120, x0 + 60 * (r() - 0.5), 200, x0 + 40 * (r() - 0.5), 150 + r() * 180);
          c.stroke();
        };
        desenhar();
        c.strokeStyle = '#7a5530';
        c.lineWidth = 4;
        c.stroke();
      }
    },
  },
  savana: {
    claro: '#d4b285',
    escuro: '#a07d55',
    extra: (c, r, contorno) => {
      // pedras redondas empilhadas: linhas de divisão curvas
      c.save();
      contorno();
      c.clip();
      c.strokeStyle = 'rgba(90,60,30,0.55)';
      c.lineWidth = 4;
      for (let k = 0; k < 6; k++) {
        const y = PEDRA_TOPO + 70 + k * 72 + r() * 20;
        c.beginPath();
        c.arc(PEDRA_LARGURA / 2 + (r() - 0.5) * 200, y + 160, 170 + r() * 40, Math.PI * 1.15, Math.PI * 1.85);
        c.stroke();
      }
      c.restore();
    },
  },
  australia: { claro: '#d2703f', escuro: '#8e3f22', extra: faixas(['#b9552f', '#e08a55', '#a84a28'], 34) },
  artico: { claro: '#929fad', escuro: '#5c6876', extra: neve },
  antartica: { claro: '#5d6670', escuro: '#30363d', extra: neve },
  praia: {
    claro: '#c9c0b4',
    escuro: '#8f877d',
    domo: true,
    extra: (c, r, contorno) => {
      // escorridos verticais do granito à beira-mar
      c.save();
      contorno();
      c.clip();
      for (let k = 0; k < 14; k++) {
        const x = 120 + r() * 400;
        c.strokeStyle = 'rgba(70,65,60,0.25)';
        c.lineWidth = 6 + r() * 8;
        c.beginPath();
        c.moveTo(x, PEDRA_TOPO + r() * 120);
        c.lineTo(x + (r() - 0.5) * 30, PEDRA_ALTURA);
        c.stroke();
      }
      c.restore();
    },
  },
  dinossauros: {
    claro: '#dcc39a',
    escuro: '#b08a5c',
    extra: (c, r, contorno) => {
      faixas(['#c9a574', '#e6d3ad', '#b99263', '#d8bb8c'], 30)(c, r, contorno);
      // conchas fósseis nas camadas
      for (let k = 0; k < 4; k++) {
        const y = PEDRA_TOPO + 120 + r() * 300;
        const x = PEDRA_LARGURA / 2 + (r() - 0.5) * meiaLarguraPedra(y);
        c.strokeStyle = 'rgba(90,60,30,0.7)';
        c.lineWidth = 2.5;
        c.beginPath();
        for (let a = 0; a < Math.PI * 5; a += 0.2) {
          const rr = 2 + a * 1.6;
          c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        c.stroke();
      }
    },
  },
};

export function gerarEscalada(scene: Phaser.Scene) {
  (Object.keys(ESTILOS) as MundoId[]).forEach((mundo, i) => desenharPedra(scene, mundo, ESTILOS[mundo], 101 + i * 17));

  // Agarras: pedrinhas coloridas aparafusadas na rocha. As 6 cores ficam numa textura só (quadros 0 a 5):
  // desenhar muitas agarras de texturas diferentes no mesmo lote cortava algumas ao meio.
  const cores = ['#e5402f', '#f2b93b', '#3d8fe0', '#4fb75b', '#9b5fd6', '#f07ab0'];
  tex(scene, 'agarras', 64 * cores.length, 54, (ctx) => {
    cores.forEach((cor, i) => {
      const c = ctx;
      c.save();
      c.translate(i * 64, 0);
      const r = rng(7 + i * 13);
      c.beginPath();
      const n = 9;
      for (let k = 0; k <= n; k++) {
        const a = (k / n) * Math.PI * 2;
        const rr = 1 + (r() - 0.5) * 0.25;
        const x = 32 + Math.cos(a) * 25 * rr;
        const y = 28 + Math.sin(a) * 20 * rr;
        if (k === 0) c.moveTo(x, y);
        else c.quadraticCurveTo(32 + Math.cos(a - 0.35) * 30 * rr, 28 + Math.sin(a - 0.35) * 24 * rr, x, y);
      }
      c.closePath();
      c.fillStyle = cor;
      c.fill();
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3.5;
      c.lineJoin = 'round';
      c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.4)';
      c.beginPath();
      c.ellipse(24, 20, 9, 5, -0.4, 0, Math.PI * 2);
      c.fill();
      // parafuso
      c.fillStyle = '#d9dde2';
      c.beginPath();
      c.arc(32, 29, 4.5, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = OUTLINE;
      c.lineWidth = 1.5;
      c.stroke();
      c.restore();
    });
  });
  const agarras = scene.textures.get('agarras');
  cores.forEach((_, i) => {
    if (!agarras.has(String(i))) agarras.add(String(i), 0, i * 64, 0, 64, 54);
  });

  // Brilho redondo (agarra piscando, dica)
  tex(scene, 'aura', 128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.65)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 128, 128);
  });

  // Capacete de escalada (vai por cima dos cachos do Chico)
  tex(scene, 'capacete', 96, 56, (c) => {
    c.beginPath();
    c.moveTo(6, 46);
    c.bezierCurveTo(6, 6, 90, 6, 90, 46);
    c.closePath();
    c.fillStyle = '#f2b93b';
    c.fill();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    c.lineJoin = 'round';
    c.stroke();
    rrect(c, 2, 42, 92, 10, 5);
    c.fillStyle = '#e08a2a';
    c.fill();
    c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.45)';
    c.beginPath();
    c.ellipse(34, 22, 14, 7, -0.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = OUTLINE;
    for (const x of [40, 56]) {
      c.beginPath();
      c.ellipse(x, 18, 4, 2.5, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Mosquetão (branco: a cena pinta com a cor de cada pedra)
  tex(scene, 'mosquetao', 96, 150, (c) => {
    const forma = () => {
      c.beginPath();
      c.moveTo(30, 20);
      c.bezierCurveTo(30, 2, 74, 2, 74, 24);
      c.lineTo(80, 118);
      c.bezierCurveTo(82, 150, 18, 150, 18, 118);
      c.closePath();
    };
    c.lineJoin = 'round';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 22;
    forma();
    c.stroke();
    c.strokeStyle = '#ffffff';
    c.lineWidth = 13;
    forma();
    c.stroke();
    // trava (gatilho)
    c.strokeStyle = OUTLINE;
    c.lineWidth = 10;
    c.beginPath();
    c.moveTo(30, 30);
    c.lineTo(22, 100);
    c.stroke();
    c.strokeStyle = '#c9ced4';
    c.lineWidth = 5;
    c.stroke();
  });

  // Ancoragem no topo da pedra (onde as cordas passam)
  tex(scene, 'ancora', 30, 30, (c) => {
    c.beginPath();
    c.arc(15, 15, 10, 0, Math.PI * 2);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 7;
    c.stroke();
    c.strokeStyle = '#c9ced4';
    c.lineWidth = 3.5;
    c.stroke();
  });

  // Botão "olhar de novo": olho num círculo, no mesmo estilo do botão de som
  tex(scene, 'btn-olhar', 100, 100, (c) => {
    c.beginPath();
    c.arc(50, 50, 44, 0, Math.PI * 2);
    c.fillStyle = '#5bb0e8';
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 6;
    c.stroke();
    c.beginPath();
    c.moveTo(18, 50);
    c.quadraticCurveTo(50, 18, 82, 50);
    c.quadraticCurveTo(50, 82, 18, 50);
    c.closePath();
    c.fillStyle = '#fff';
    c.fill();
    c.beginPath();
    c.arc(50, 50, 12, 0, Math.PI * 2);
    c.fillStyle = '#1d2b3a';
    c.fill();
    c.beginPath();
    c.arc(45, 45, 4, 0, Math.PI * 2);
    c.fillStyle = '#fff';
    c.fill();
  });

  // Ícone da pedra no mapa
  tex(scene, 'icone-pedra', 84, 74, (c) => {
    c.beginPath();
    c.moveTo(6, 70);
    c.lineTo(18, 30);
    c.quadraticCurveTo(30, 6, 46, 8);
    c.quadraticCurveTo(66, 10, 72, 34);
    c.lineTo(80, 70);
    c.closePath();
    c.fillStyle = '#a99a86';
    c.fill();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    c.lineJoin = 'round';
    c.stroke();
    ['#e5402f', '#f2b93b', '#3d8fe0', '#4fb75b'].forEach((cor, k) => {
      c.fillStyle = cor;
      c.beginPath();
      c.arc([30, 52, 38, 60][k], [56, 46, 34, 24][k], 5, 0, Math.PI * 2);
      c.fill();
    });
    c.strokeStyle = '#f08a3a';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(46, 8);
    c.quadraticCurveTo(40, 40, 46, 70);
    c.stroke();
  });
}

function desenharPedra(scene: Phaser.Scene, mundo: MundoId, estilo: EstiloPedra, semente: number) {
  tex(scene, `paredao-${mundo}`, PEDRA_LARGURA, PEDRA_ALTURA, (c) => {
    const r = rng(semente);
    const cx = PEDRA_LARGURA / 2;
    // contorno irregular: base larga, topo estreito (plano, ou arredondado no domo da praia)
    const pontos: [number, number][] = [];
    const lados = 18;
    for (let k = 0; k <= lados; k++) {
      const y = PEDRA_ALTURA - (k / lados) * (PEDRA_ALTURA - PEDRA_TOPO);
      pontos.push([cx - meiaLarguraPedra(y) - (k > 0 && k < lados ? r() * 14 : 0), y]);
    }
    const topo: [number, number][] = [];
    if (estilo.domo) {
      for (let k = 1; k < 8; k++) {
        const a = Math.PI - (k / 8) * Math.PI;
        topo.push([cx + Math.cos(a) * 95, PEDRA_TOPO + 10 - Math.sin(a) * 18]);
      }
    }
    const direita: [number, number][] = [];
    for (let k = lados; k >= 0; k--) {
      const y = PEDRA_ALTURA - (k / lados) * (PEDRA_ALTURA - PEDRA_TOPO);
      direita.push([cx + meiaLarguraPedra(y) + (k > 0 && k < lados ? r() * 14 : 0), y]);
    }
    const todos = [...pontos, ...topo, ...direita];
    const contorno = () => {
      c.beginPath();
      todos.forEach(([x, y], i) => (i === 0 ? c.moveTo(x, y) : c.lineTo(x, y)));
      c.closePath();
    };
    const g = c.createLinearGradient(0, 0, PEDRA_LARGURA, PEDRA_ALTURA);
    g.addColorStop(0, estilo.claro);
    g.addColorStop(1, estilo.escuro);
    c.fillStyle = g;
    contorno();
    c.fill();
    estilo.extra?.(c, r, contorno);
    // rachaduras e saliências
    c.save();
    contorno();
    c.clip();
    c.lineCap = 'round';
    for (let k = 0; k < 9; k++) {
      const y = PEDRA_TOPO + 60 + r() * 400;
      const x = cx + (r() - 0.5) * meiaLarguraPedra(y) * 1.6;
      c.strokeStyle = 'rgba(40,28,20,0.45)';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + (r() - 0.5) * 40, y + 20 + r() * 30);
      c.lineTo(x + (r() - 0.5) * 50, y + 50 + r() * 40);
      c.stroke();
    }
    for (let k = 0; k < 8; k++) {
      const y = PEDRA_TOPO + 50 + r() * 420;
      const x = cx + (r() - 0.5) * meiaLarguraPedra(y) * 1.5;
      c.strokeStyle = 'rgba(255,255,255,0.28)';
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(x - 25, y);
      c.lineTo(x + 25, y - 2);
      c.stroke();
    }
    // sombra do lado direito (luz vindo da esquerda)
    const s = c.createLinearGradient(cx, 0, PEDRA_LARGURA, 0);
    s.addColorStop(0, 'rgba(0,0,0,0)');
    s.addColorStop(1, 'rgba(0,0,0,0.22)');
    c.fillStyle = s;
    c.fillRect(0, 0, PEDRA_LARGURA, PEDRA_ALTURA);
    c.restore();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 5;
    c.lineJoin = 'round';
    contorno();
    c.stroke();
  });
}
