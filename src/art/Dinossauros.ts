// Arte do Mundo 8 — O Brasil dos Dinossauros, desenhada por código.
// Dossiê: em Sousa (PB) foram encontradas principalmente pegadas e trilhas; no Araripe (CE), o crânio do Irritator
// e pterossauros (que NÃO eram dinossauros); no Rio Grande do Sul, dinossauros muito antigos (Staurikosaurus,
// Buriolestes). Sempre "fósseis encontrados onde hoje fica...". Velociraptor com penas e menor que nos filmes.
import Phaser from 'phaser';
import { TILE } from '../config';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';

type Pt = [number, number];

export function gerarDinossauros(scene: Phaser.Scene) {
  gerarChao(scene);
  gerarFundo(scene);
  gerarObjetos(scene);
  gerarDinos(scene);
  gerarEsqueleto(scene);
}

/** Contorno liso e fechado passando perto dos pontos (bom para bichos de desenho). */
function liso(c: Ctx, pts: Pt[]) {
  const n = pts.length;
  const meio = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  c.beginPath();
  const m0 = meio(pts[n - 1], pts[0]);
  c.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const m = meio(p, pts[(i + 1) % n]);
    c.quadraticCurveTo(p[0], p[1], m[0], m[1]);
  }
  c.closePath();
}

function olho(c: Ctx, x: number, y: number, r = 2.6) {
  c.fillStyle = '#1d140e';
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#fff';
  c.beginPath();
  c.arc(x + r * 0.35, y - r * 0.35, r * 0.38, 0, Math.PI * 2);
  c.fill();
}

/** Pegada de três dedos (terópode), apontando para a direita. */
function pegadaTres(c: Ctx, x: number, y: number, t: number, cor: string) {
  c.fillStyle = cor;
  c.beginPath();
  c.ellipse(x, y, t * 0.45, t * 0.38, 0, 0, Math.PI * 2);
  c.fill();
  for (const a of [-0.6, 0, 0.6]) {
    c.save();
    c.translate(x, y);
    c.rotate(a);
    c.beginPath();
    c.ellipse(t * 0.7, 0, t * 0.45, t * 0.14, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

// ---------------------------------------------------------------------------------------------- chão

function gerarChao(scene: Phaser.Scene) {
  // Lajedo de Sousa: rocha sedimentar cinza-avermelhada em camadas finas, com pegadas no topo.
  const sousa = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = '#a88a78';
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#9a7c6a';
      for (let y = 10; y < h; y += 14) c.fillRect(0, y, w, 4);
      const r = rng(topo ? 801 : 803);
      c.fillStyle = 'rgba(255,255,255,0.12)';
      for (let i = 0; i < 6; i++) c.fillRect(r() * w, r() * h, 6, 2);
      if (topo) {
        c.fillStyle = '#bba08c';
        c.fillRect(0, 0, w, 9);
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  sousa('rocha-sousa', false);
  sousa('rocha-sousa-topo', true);

  // Rastro no chão (:) — pegadas de dinossauro de três dedos, vistas meio de lado
  tex(scene, 'pegada-dino', TILE, 16, (c) => {
    c.save();
    c.scale(1, 0.62);
    pegadaTres(c, 14, 12, 12, 'rgba(60,30,20,0.8)');
    pegadaTres(c, 44, 13, 12, 'rgba(60,30,20,0.8)');
    c.restore();
  });

  // Passarela de madeira com corrimão (plataforma)
  tex(scene, 'passarela', TILE, 40, (c, w) => {
    c.strokeStyle = '#6b4a2a';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(0, 6);
    c.lineTo(w, 6);
    c.stroke();
    for (const x of [8, w - 8]) {
      c.beginPath();
      c.moveTo(x, 4);
      c.lineTo(x, 22);
      c.stroke();
    }
    c.fillStyle = '#b8864e';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 0, 20, w, 12, 3);
    c.fill();
    c.stroke();
    c.fillStyle = '#6b4a2a';
    c.fillRect(10, 32, 6, 8);
    c.fillRect(w - 16, 32, 6, 8);
  });

  // Tempo antigo: terra escura com samambaias no topo
  const antiga = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = '#6a4a34';
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 811 : 813);
      c.fillStyle = '#5a3c28';
      for (let i = 0; i < 8; i++) {
        c.beginPath();
        c.arc(r() * w, r() * h, 2 + r() * 3, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = '#4f7a34';
        c.fillRect(0, 0, w, 9);
        c.strokeStyle = '#3e6a2a';
        c.lineWidth = 2;
        for (const x of [10, 34, 54]) {
          c.beginPath();
          c.moveTo(x, 8);
          c.quadraticCurveTo(x + 6, -2, x + 12, 2);
          c.stroke();
        }
        c.strokeStyle = OUTLINE;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  antiga('terra-antiga', false);
  antiga('terra-antiga-topo', true);

  const rochaAntiga = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = '#7a7266';
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#6a6256';
      c.beginPath();
      c.ellipse(22, 42, 15, 9, 0.3, 0, Math.PI * 2);
      c.ellipse(48, 20, 11, 7, -0.2, 0, Math.PI * 2);
      c.fill();
      if (topo) {
        c.fillStyle = '#5f8a3e';
        c.fillRect(0, 0, w, 7);
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
      void h;
    });
  rochaAntiga('rocha-antiga', false);
  rochaAntiga('rocha-antiga-topo', true);

  // Galho de conífera (plataforma)
  tex(scene, 'galho-conifera', TILE, 26, (c, w) => {
    c.fillStyle = '#6a4a2e';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 0, 8, w, 12, 6);
    c.fill();
    c.stroke();
    c.strokeStyle = '#2f6a3a';
    c.lineWidth = 3;
    for (let x = 4; x < w; x += 8) {
      c.beginPath();
      c.moveTo(x, 8);
      c.lineTo(x + 5, 1);
      c.stroke();
    }
  });

  // Plantas espinhentas do tempo antigo (perigo)
  tex(scene, 'espinhos-antigos', TILE, 48, (c, w, h) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    for (const [x, alt] of [
      [16, 34],
      [44, 40],
    ] as const) {
      for (let k = 0; k < 7; k++) {
        const a = -Math.PI / 2 + (k - 3) * 0.32;
        c.fillStyle = k % 2 ? '#3f7a3a' : '#4f8a44';
        c.beginPath();
        c.moveTo(x - 3, h);
        c.lineTo(x + Math.cos(a) * alt, h + Math.sin(a) * alt);
        c.lineTo(x + 3, h);
        c.closePath();
        c.fill();
        c.stroke();
      }
    }
    void w;
  });

  // Araripe: rocha calcária bege em camadas
  const calcario = (key: string, topo: boolean, base: string, faixa: string) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = base;
      c.fillRect(0, 0, w, h);
      c.fillStyle = faixa;
      for (let y = 6; y < h; y += 12) c.fillRect(0, y, w, 3);
      // pedrinhas arredondadas na rocha
      const r = rng(topo ? 831 : 833);
      c.fillStyle = 'rgba(120,100,70,0.25)';
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.ellipse(8 + r() * (w - 16), 14 + r() * (h - 24), 7, 4, 0, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = '#8a9a4a';
        c.fillRect(0, 0, w, 7);
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  calcario('calcario', false, '#e2d2a8', '#cdbb8e');
  calcario('calcario-topo', true, '#e2d2a8', '#cdbb8e');
  calcario('calcario-escuro', false, '#b8a88a', '#a39374');
  calcario('calcario-escuro-topo', true, '#b8a88a', '#a39374');
}

// ---------------------------------------------------------------------------------------------- fundos

function conifera(c: Ctx, x: number, base: number, alt: number, cor: string) {
  c.fillStyle = cor;
  c.fillRect(x - alt * 0.025, base - alt, alt * 0.05, alt);
  // copa em "guarda-chuva" (como as araucárias)
  for (let k = 0; k < 3; k++) {
    const y = base - alt + k * alt * 0.09;
    const larg = alt * (0.18 + k * 0.07);
    c.beginPath();
    c.ellipse(x, y, larg, alt * 0.05, 0, Math.PI, 0);
    c.fill();
  }
}

function samambaia(c: Ctx, x: number, base: number, alt: number, cor: string) {
  c.strokeStyle = cor;
  c.lineWidth = Math.max(2, alt * 0.05);
  c.lineCap = 'round';
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k - 2) * 0.45;
    const ex = x + Math.cos(a) * alt;
    const ey = base + Math.sin(a) * alt;
    c.beginPath();
    c.moveTo(x, base);
    c.quadraticCurveTo(x + Math.cos(a) * alt * 0.6, base + Math.sin(a) * alt * 0.9, ex, ey + alt * 0.15);
    c.stroke();
  }
}

function gerarFundo(scene: Phaser.Scene) {
  tex(scene, 'ceu-antigo', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#5fa6c8');
    g.addColorStop(0.7, '#d8e6c0');
    g.addColorStop(1, '#f4d8a0');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Tempo antigo, longe: morros azulados, um lago e coníferas
  tex(scene, 'antigo-longe', 1024, 320, (c, w, h) => {
    c.fillStyle = '#8aa6a8';
    c.beginPath();
    c.moveTo(0, h);
    for (let x = 0; x <= w; x += 64) c.lineTo(x, h - 150 - Math.sin(x / 150) * 50 - Math.sin(x / 57) * 18);
    c.lineTo(w, h);
    c.closePath();
    c.fill();
    c.fillStyle = '#7ab0c8';
    c.fillRect(0, h - 60, w, 24);
    for (let x = 30; x < w; x += 90) conifera(c, x, h - 36, 150 + (x % 3) * 20, '#4f6e58');
    c.fillStyle = '#5f8a5a';
    c.fillRect(0, h - 36, w, 36);
  });

  // Tempo antigo, perto: samambaias grandes, cicadáceas e cavalinhas
  tex(scene, 'antigo-perto', 1024, 300, (c, w, h) => {
    for (let x = 20; x < w; x += 110) samambaia(c, x, h, 90 + (x % 4) * 14, '#3f7a3a');
    for (let x = 75; x < w; x += 160) {
      // cicadácea: tronco grosso e folhas em leque
      c.fillStyle = '#6a5034';
      c.fillRect(x - 9, h - 70, 18, 70);
      samambaia(c, x, h - 66, 60, '#4f8a3a');
    }
    c.strokeStyle = '#6a8a3a';
    c.lineWidth = 4;
    for (let x = 50; x < w; x += 70) {
      c.beginPath();
      c.moveTo(x, h);
      c.lineTo(x + 4, h - 60 - (x % 5) * 6);
      c.stroke();
    }
  });

  // Chapada do Araripe: platô comprido de topo reto, paredão claro de rocha e encosta com a Caatinga embaixo
  tex(scene, 'chapada-longe', 1024, 320, (c, w, h) => {
    const topo = h - 190;
    // encosta
    c.fillStyle = '#9aa888';
    c.beginPath();
    c.moveTo(0, h);
    c.lineTo(0, topo + 70);
    for (let x = 0; x <= w; x += 32) c.lineTo(x, topo + 64 + Math.sin(x / 90) * 8);
    c.lineTo(w, h);
    c.closePath();
    c.fill();
    // paredão (camadas de rocha)
    c.fillStyle = '#c9b48e';
    c.fillRect(0, topo + 8, w, 58);
    c.fillStyle = '#b8a27c';
    c.fillRect(0, topo + 26, w, 6);
    c.fillRect(0, topo + 44, w, 4);
    // topo reto com mata
    c.fillStyle = '#7f9a6a';
    c.fillRect(0, topo, w, 12);
    const r = rng(821);
    for (let x = 0; x < w; x += 18) {
      c.beginPath();
      c.arc(x, topo + 2, 8 + r() * 6, Math.PI, 0);
      c.fill();
    }
    // arbustos da Caatinga na encosta
    c.fillStyle = '#86977a';
    for (let x = 10; x < w; x += 46) {
      c.beginPath();
      c.arc(x + r() * 20, h - 40 - r() * 30, 10 + r() * 8, 0, Math.PI * 2);
      c.fill();
    }
  });
}

// ---------------------------------------------------------------------------------------------- objetos

function gerarObjetos(scene: Phaser.Scene) {
  // Portal do Tempo: um anel de luz com espirais
  tex(scene, 'portal', 150, 190, (c, w, h) => {
    const cx = w / 2;
    const cy = h / 2 + 4;
    const g = c.createRadialGradient(cx, cy, 10, cx, cy, 80);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.45, 'rgba(160,120,255,0.8)');
    g.addColorStop(1, 'rgba(90,160,255,0)');
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(cx, cy, 70, 90, 0, 0, Math.PI * 2);
    c.fill();
    c.lineWidth = 4;
    for (let k = 0; k < 3; k++) {
      c.strokeStyle = ['#ffd766', '#9fd8ff', '#e0b0ff'][k];
      c.beginPath();
      for (let t = 0; t < 1; t += 0.02) {
        const a = t * Math.PI * 3 + (k * Math.PI * 2) / 3;
        const r = 10 + t * 50;
        const x = cx + Math.cos(a) * r * 0.8;
        const y = cy + Math.sin(a) * r;
        if (t === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
    c.strokeStyle = OUTLINE;
    c.lineWidth = 6;
    c.beginPath();
    c.ellipse(cx, cy, 60, 82, 0, 0, Math.PI * 2);
    c.stroke();
    c.strokeStyle = '#f2b93b';
    c.lineWidth = 4;
    c.stroke();
  });

  // Monte de escavação: terra com estacas, cordinha em grade e um pincel
  tex(scene, 'monte-escavacao', 140, 86, (c, w, h) => {
    c.fillStyle = '#b89a6a';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(6, h - 2);
    c.quadraticCurveTo(w / 2, 10, w - 6, h - 2);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#a4865a';
    for (const [x, y] of [
      [48, 60],
      [80, 50],
      [96, 68],
    ]) {
      c.beginPath();
      c.arc(x, y, 5, 0, Math.PI * 2);
      c.fill();
    }
    // estacas e cordinha
    c.strokeStyle = '#6b4a2a';
    c.lineWidth = 4;
    for (const x of [14, w - 14]) {
      c.beginPath();
      c.moveTo(x, h - 2);
      c.lineTo(x, h - 42);
      c.stroke();
    }
    c.strokeStyle = '#e04a3a';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(14, h - 38);
    c.lineTo(w - 14, h - 38);
    c.stroke();
    // ponta de osso aparecendo
    c.fillStyle = '#f2e6c8';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    c.beginPath();
    c.ellipse(70, 38, 12, 5, -0.3, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // pincel
    c.fillStyle = '#c47a3a';
    c.fillRect(w - 44, h - 26, 22, 6);
    c.fillStyle = '#f2d27a';
    c.fillRect(w - 24, h - 28, 10, 10);
  });

  // Pedra do fóssil (calcário do Araripe)
  const laje = (c: Ctx, w: number, h: number) => {
    c.fillStyle = '#e8dab6';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 3, 3, w - 6, h - 6, 14);
    c.fill();
    c.stroke();
    c.fillStyle = '#d8c89e';
    rrect(c, 10, 10, w - 20, h - 20, 10);
    c.fill();
  };

  // Crânio do Irritator (espinossaurídeo): focinho comprido e estreito, dentes retos, crista no alto
  tex(scene, 'fossil-irritator', 170, 96, (c, w, h) => {
    laje(c, w, h);
    c.fillStyle = '#f7efd8';
    c.strokeStyle = '#5a4a36';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(20, 58);
    c.quadraticCurveTo(28, 26, 64, 28);
    c.lineTo(78, 20); // crista
    c.lineTo(88, 32);
    c.quadraticCurveTo(130, 36, 156, 48);
    c.lineTo(156, 56);
    c.quadraticCurveTo(110, 60, 70, 70);
    c.quadraticCurveTo(38, 74, 20, 58);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#6a5a44';
    c.beginPath();
    c.ellipse(52, 44, 9, 7, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(34, 56, 6, 5, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(120, 44, 6, 2.5, -0.1, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff';
    for (let x = 80; x < 154; x += 9) {
      c.beginPath();
      c.moveTo(x, 58 - (x - 80) * 0.03);
      c.lineTo(x + 3, 66 - (x - 80) * 0.03);
      c.lineTo(x + 6, 57 - (x - 80) * 0.03);
      c.fill();
    }
  });

  // Pterossauro do Araripe na pedra: cabeça com crista alta e ossos da asa
  tex(scene, 'fossil-pterossauro', 170, 96, (c, w, h) => {
    laje(c, w, h);
    c.strokeStyle = '#f7efd8';
    c.lineCap = 'round';
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(70, 60);
    c.lineTo(40, 40);
    c.lineTo(22, 70);
    c.stroke();
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(70, 60);
    c.lineTo(100, 62);
    c.stroke();
    c.fillStyle = '#f7efd8';
    c.strokeStyle = '#5a4a36';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(100, 58);
    c.lineTo(112, 22); // crista alta
    c.lineTo(126, 50);
    c.lineTo(156, 60);
    c.lineTo(104, 68);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#6a5a44';
    c.beginPath();
    c.arc(112, 56, 4, 0, Math.PI * 2);
    c.fill();
  });

  // Figurinha das pegadas de Sousa: laje com uma trilha (também em alta resolução, para o Atlas)
  const pegadasSousa = (c: Ctx, w: number, h: number) => {
    c.fillStyle = '#b8987f';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 3, 8, w - 6, h - 14, 12);
    c.fill();
    c.stroke();
    c.fillStyle = '#a4846c';
    for (let y = 22; y < h - 8; y += 12) c.fillRect(8, y, w - 16, 3);
    pegadaTres(c, 30, 52, 11, '#6a4636');
    pegadaTres(c, 72, 34, 11, '#6a4636');
    pegadaTres(c, 114, 52, 11, '#6a4636');
  };
  tex(scene, 'pegadas-sousa', 150, 80, pegadasSousa);
  tex(scene, 'pegadas-sousa-hd', 450, 240, (c) => {
    c.scale(3, 3);
    pegadasSousa(c, 150, 80);
  });

  // Selo dos Dinossauros: pegada de três dedos no lajedo
  tex(scene, 'selo-dinossauros', 130, 130, (c) => {
    const g = c.createRadialGradient(65, 65, 20, 65, 65, 65);
    g.addColorStop(0, 'rgba(255,230,170,0.9)');
    g.addColorStop(1, 'rgba(255,230,170,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 130, 130);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    c.fillStyle = '#f2b93b';
    c.beginPath();
    c.arc(65, 65, 46, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#b8987f';
    c.beginPath();
    c.arc(65, 65, 36, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.save();
    c.translate(65, 65);
    c.rotate(-Math.PI / 2);
    pegadaTres(c, -8, 0, 14, '#5a3a2a');
    c.restore();
    c.fillStyle = '#f2b93b';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      c.beginPath();
      c.arc(65 + Math.cos(a) * 52, 65 + Math.sin(a) * 52, 5, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Cestos do minijogo "é dinossauro / não é dinossauro"
  const cesto = (key: string, cor: string, marca: 'pegada' | 'x') =>
    tex(scene, key, 220, 170, (c, w, h) => {
      c.fillStyle = cor;
      c.strokeStyle = OUTLINE;
      c.lineWidth = 5;
      c.beginPath();
      c.moveTo(14, 40);
      c.lineTo(w - 14, 40);
      c.lineTo(w - 34, h - 6);
      c.lineTo(34, h - 6);
      c.closePath();
      c.fill();
      c.stroke();
      c.strokeStyle = 'rgba(0,0,0,0.18)';
      c.lineWidth = 4;
      for (let x = 40; x < w - 30; x += 24) {
        c.beginPath();
        c.moveTo(x, 44);
        c.lineTo(x + (x < w / 2 ? 6 : -6), h - 10);
        c.stroke();
      }
      c.fillStyle = '#fff8e8';
      c.strokeStyle = OUTLINE;
      c.lineWidth = 4;
      c.beginPath();
      c.arc(w / 2, 100, 38, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      if (marca === 'pegada') {
        c.save();
        c.translate(w / 2, 100);
        c.rotate(-Math.PI / 2);
        pegadaTres(c, -8, 0, 16, '#3f8a3a');
        c.restore();
      } else {
        c.strokeStyle = '#d9533f';
        c.lineWidth = 10;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(w / 2 - 18, 82);
        c.lineTo(w / 2 + 18, 118);
        c.moveTo(w / 2 + 18, 82);
        c.lineTo(w / 2 - 18, 118);
        c.stroke();
      }
    });
  cesto('cesto-dino', '#8fd07a', 'pegada');
  cesto('cesto-nao', '#f0a890', 'x');
}

// ---------------------------------------------------------------------------------------------- dinossauros

function gerarDinos(scene: Phaser.Scene) {
  const texBicho = (key: string, w: number, h: number, draw: (c: Ctx, w: number, h: number) => void) => {
    tex(scene, key, w, h, draw);
    tex(scene, `${key}-hd`, w * 3, h * 3, (c) => {
      c.scale(3, 3);
      draw(c, w, h);
    });
  };
  const pinta = (c: Ctx, cor: string, contorno = true) => {
    c.fillStyle = cor;
    c.fill();
    if (contorno) {
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3;
      c.lineJoin = 'round';
      c.stroke();
    }
  };
  /** Perna de bípede: coxa, canela e pé (a coxa começa em x,y). */
  const perna = (c: Ctx, x: number, y: number, alt: number, cor: string) => {
    c.beginPath();
    c.ellipse(x, y + alt * 0.2, alt * 0.22, alt * 0.32, 0.2, 0, Math.PI * 2);
    pinta(c, cor);
    c.strokeStyle = OUTLINE;
    c.lineWidth = alt * 0.16 + 3;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(x + alt * 0.05, y + alt * 0.4);
    c.lineTo(x - alt * 0.08, y + alt * 0.72);
    c.lineTo(x + alt * 0.04, y + alt * 0.96);
    c.stroke();
    c.strokeStyle = cor;
    c.lineWidth = alt * 0.16;
    c.stroke();
    c.fillStyle = cor;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(x + alt * 0.12, y + alt, alt * 0.18, alt * 0.06, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  };
  const braco = (c: Ctx, x: number, y: number, comp: number, cor: string, esp = 5) => {
    c.lineCap = 'round';
    c.strokeStyle = OUTLINE;
    c.lineWidth = esp + 3;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + comp * 0.4, y + comp * 0.6);
    c.lineTo(x + comp * 0.8, y + comp * 0.55);
    c.stroke();
    c.strokeStyle = cor;
    c.lineWidth = esp;
    c.stroke();
  };

  // Irritator (espinossaurídeo, reconstrução): focinho comprido e estreito, crista na cabeça, anda em duas pernas
  texBicho('irritator', 200, 110, (c) => {
    const cor = '#6f8a5a';
    perna(c, 86, 58, 44, '#5a7248');
    liso(c, [
      [4, 52], [40, 40], [80, 34], [118, 36], [134, 26], [150, 22], [196, 30], [194, 38], [150, 40],
      [132, 50], [118, 66], [90, 72], [60, 64], [30, 60],
    ]);
    pinta(c, cor);
    c.fillStyle = '#c8b87a';
    c.beginPath();
    c.ellipse(100, 62, 26, 8, -0.1, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#b8563f';
    c.beginPath();
    c.moveTo(142, 24);
    c.lineTo(150, 12);
    c.lineTo(160, 24);
    c.closePath();
    pinta(c, '#b8563f');
    perna(c, 96, 60, 44, cor);
    braco(c, 124, 52, 22, cor);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(194, 34);
    c.lineTo(156, 36);
    c.stroke();
    olho(c, 150, 28, 2.6);
  });

  // Pterossauro (inspirado no Tupandactylus): crista enorme, asas de pele, voando
  texBicho('pterossauro', 190, 120, (c) => {
    c.fillStyle = '#c47a5a';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.lineJoin = 'round';
    // asa de trás
    c.beginPath();
    c.moveTo(92, 62);
    c.lineTo(40, 30);
    c.lineTo(4, 50);
    c.quadraticCurveTo(50, 60, 88, 76);
    c.closePath();
    pinta(c, '#b86a4a');
    // corpo
    liso(c, [
      [70, 64], [96, 56], [118, 58], [122, 70], [100, 80], [76, 78],
    ]);
    pinta(c, '#8a5a44');
    // asa da frente
    c.beginPath();
    c.moveTo(100, 64);
    c.lineTo(150, 22);
    c.lineTo(186, 40);
    c.quadraticCurveTo(140, 58, 104, 78);
    c.closePath();
    pinta(c, '#c47a5a');
    // cabeça com crista alta
    c.beginPath();
    c.moveTo(118, 58);
    c.lineTo(126, 6);
    c.quadraticCurveTo(150, 20, 144, 50);
    c.lineTo(170, 62);
    c.lineTo(126, 70);
    c.closePath();
    pinta(c, '#e0a040');
    olho(c, 132, 58, 2.4);
  });

  // Staurikosaurus: pequeno e ágil, carnívoro, um dos dinossauros mais antigos conhecidos
  texBicho('staurikosaurus', 150, 90, (c) => {
    const cor = '#b8783a';
    perna(c, 64, 42, 40, '#9a6230');
    liso(c, [
      [2, 36], [30, 32], [60, 26], [90, 30], [104, 20], [120, 14], [146, 22], [142, 30], [118, 32],
      [106, 42], [90, 54], [64, 54], [40, 44],
    ]);
    pinta(c, cor);
    c.fillStyle = '#e8c48a';
    c.beginPath();
    c.ellipse(78, 48, 18, 5, 0, 0, Math.PI * 2);
    c.fill();
    perna(c, 72, 44, 40, cor);
    braco(c, 98, 40, 16, cor, 4);
    olho(c, 124, 20, 2.4);
  });

  // Buriolestes: pequeno, pescoço comprido, cabeça pequena, anda em duas pernas
  texBicho('buriolestes', 140, 90, (c) => {
    const cor = '#8a9a4a';
    perna(c, 60, 44, 40, '#707e3a');
    liso(c, [
      [2, 40], [28, 36], [56, 30], [84, 32], [98, 20], [108, 8], [134, 10], [134, 18], [114, 20],
      [104, 36], [92, 52], [64, 56], [38, 48],
    ]);
    pinta(c, cor);
    c.fillStyle = '#d8d48a';
    c.beginPath();
    c.ellipse(72, 50, 16, 5, 0, 0, Math.PI * 2);
    c.fill();
    perna(c, 68, 46, 40, cor);
    braco(c, 92, 42, 16, cor, 4);
    olho(c, 118, 12, 2.2);
  });

  // Carnotaurus: dois chifres acima dos olhos, braços muito pequenos, cabeça curta
  texBicho('carnotaurus', 210, 120, (c) => {
    const cor = '#b8563f';
    perna(c, 90, 58, 58, '#9a4432');
    liso(c, [
      [4, 50], [40, 42], [86, 34], [128, 36], [150, 26], [184, 22], [204, 34], [198, 46], [170, 50],
      [150, 60], [128, 76], [96, 82], [60, 70], [30, 58],
    ]);
    pinta(c, cor);
    c.fillStyle = '#e0a07a';
    c.beginPath();
    c.ellipse(110, 72, 28, 8, -0.1, 0, Math.PI * 2);
    c.fill();
    // chifres
    for (const x of [164, 176]) {
      c.beginPath();
      c.moveTo(x - 6, 26);
      c.lineTo(x - 2, 8);
      c.lineTo(x + 6, 24);
      c.closePath();
      pinta(c, '#6a3a2a');
    }
    perna(c, 100, 60, 58, cor);
    braco(c, 140, 62, 9, cor, 4);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(202, 40);
    c.lineTo(176, 44);
    c.stroke();
    olho(c, 176, 32, 2.8);
  });

  // Argentinosaurus: saurópode enorme, pescoço e cauda compridos, quatro patas grossas
  texBicho('argentinosaurus', 270, 170, (c) => {
    const cor = '#7a8a9a';
    const pata = (x: number, y: number, larg: number, alt: number, pc: string) => {
      rrect(c, x, y, larg, alt, 8);
      pinta(c, pc);
    };
    pata(96, 100, 22, 64, '#66768a');
    pata(170, 96, 22, 68, '#66768a');
    liso(c, [
      [2, 100], [40, 90], [80, 70], [130, 60], [180, 62], [204, 50], [222, 24], [244, 10], [266, 16],
      [262, 26], [240, 26], [224, 50], [212, 80], [190, 110], [140, 118], [96, 112], [60, 104], [28, 104],
    ]);
    pinta(c, cor);
    c.fillStyle = '#b8c4ce';
    c.beginPath();
    c.ellipse(150, 108, 44, 8, 0, 0, Math.PI * 2);
    c.fill();
    pata(110, 102, 24, 64, cor);
    pata(184, 98, 24, 68, cor);
    olho(c, 252, 16, 2.2);
  });

  // Velociraptor: COM PENAS e bem menor que nos filmes; garra curvada no pé
  texBicho('velociraptor', 140, 84, (c) => {
    const cor = '#9a6a3a';
    perna(c, 58, 40, 38, '#7a5230');
    // penas da cauda
    c.fillStyle = '#6a4a2a';
    c.beginPath();
    c.moveTo(4, 30);
    c.lineTo(20, 22);
    c.lineTo(34, 30);
    c.lineTo(20, 40);
    c.closePath();
    pinta(c, '#6a4a2a');
    liso(c, [
      [8, 32], [34, 28], [60, 24], [84, 28], [96, 20], [110, 14], [136, 22], [132, 30], [112, 30],
      [100, 40], [86, 52], [60, 52], [36, 42],
    ]);
    pinta(c, cor);
    // penas no corpo e "asinha" no braço
    c.fillStyle = '#b8864e';
    for (let x = 40; x < 90; x += 10) {
      c.beginPath();
      c.ellipse(x, 30, 6, 3, 0.4, 0, Math.PI * 2);
      c.fill();
    }
    perna(c, 66, 42, 38, cor);
    // braço com penas longas (dossiê: evidência de penas nos braços)
    braco(c, 94, 38, 16, cor, 4);
    for (let k = 0; k < 4; k++) {
      c.save();
      c.translate(92 + k * 3, 42 + k * 2);
      c.rotate(1.9 + k * 0.12);
      c.beginPath();
      c.ellipse(9, 0, 10, 3, 0, 0, Math.PI * 2);
      pinta(c, k % 2 ? '#6a4a2a' : '#7a5632');
      c.restore();
    }
    // garra do pé
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(76, 78, 5, Math.PI, Math.PI * 1.8);
    c.stroke();
    olho(c, 118, 20, 2.4);
  });

  // Tyrannosaurus rex: cabeça grande, dentes robustos, braços curtos
  texBicho('trex', 230, 140, (c) => {
    const cor = '#6a7a4a';
    perna(c, 94, 66, 66, '#56643a');
    liso(c, [
      [4, 60], [44, 50], [96, 40], [140, 42], [156, 30], [190, 22], [226, 32], [224, 52], [196, 58],
      [172, 62], [150, 78], [126, 94], [96, 96], [60, 80], [30, 68],
    ]);
    pinta(c, cor);
    c.fillStyle = '#c8c08a';
    c.beginPath();
    c.ellipse(116, 86, 30, 9, -0.1, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff';
    for (let x = 184; x < 222; x += 8) {
      c.beginPath();
      c.moveTo(x, 50);
      c.lineTo(x + 3, 57);
      c.lineTo(x + 6, 50);
      c.fill();
    }
    c.strokeStyle = OUTLINE;
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(224, 48);
    c.lineTo(180, 50);
    c.stroke();
    perna(c, 104, 68, 66, cor);
    braco(c, 150, 70, 12, cor, 4);
    olho(c, 196, 32, 3);
  });

  // Silhuetas dos grupos que deixaram pegadas em Sousa (ninguém sabe a espécie exata)
  const silhueta = '#3a3a52';
  texBicho('teropode', 200, 120, (c) => {
    perna(c, 90, 60, 58, silhueta);
    liso(c, [
      [4, 52], [44, 44], [90, 36], [132, 38], [150, 26], [186, 20], [198, 32], [170, 42], [150, 56], [126, 76],
      [96, 80], [60, 68], [30, 58],
    ]);
    pinta(c, silhueta, false);
    perna(c, 100, 62, 58, silhueta);
    braco(c, 140, 58, 16, silhueta, 4);
  });
  texBicho('sauropode', 270, 170, (c) => {
    const pata = (x: number, y: number) => {
      rrect(c, x, y, 24, 66, 8);
      c.fillStyle = silhueta;
      c.fill();
    };
    pata(96, 100);
    pata(170, 96);
    liso(c, [
      [2, 100], [40, 90], [80, 70], [130, 60], [180, 62], [204, 50], [222, 24], [244, 10], [266, 16],
      [262, 26], [240, 26], [224, 50], [212, 80], [190, 110], [140, 118], [96, 112], [60, 104], [28, 104],
    ]);
    pinta(c, silhueta, false);
    pata(110, 102);
    pata(184, 98);
  });
  texBicho('ornitopode', 180, 110, (c) => {
    perna(c, 80, 54, 52, silhueta);
    liso(c, [
      [4, 50], [40, 40], [80, 32], [118, 36], [134, 26], [160, 22], [178, 34], [168, 42], [146, 44],
      [128, 58], [104, 72], [74, 72], [40, 60],
    ]);
    pinta(c, silhueta, false);
    perna(c, 90, 56, 52, silhueta);
    braco(c, 120, 54, 22, silhueta, 5);
  });

  // Réptil marinho (para o minijogo): nadava na época dos dinossauros, mas não era dinossauro
  texBicho('reptil-marinho', 180, 90, (c) => {
    const cor = '#4f7a9a';
    for (const [x, y, a] of [
      [70, 58, 0.7],
      [120, 58, 0.6],
    ] as const) {
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.beginPath();
      c.ellipse(0, 12, 8, 20, 0, 0, Math.PI * 2);
      pinta(c, '#3f6a88');
      c.restore();
    }
    liso(c, [
      [4, 50], [40, 42], [90, 36], [130, 40], [150, 30], [160, 16], [178, 14], [176, 24], [160, 30],
      [146, 50], [110, 62], [60, 62], [30, 58],
    ]);
    pinta(c, cor);
    olho(c, 170, 18, 2.2);
  });
}

// ---------------------------------------------------------------------------------------------- esqueleto

/** Peças do esqueleto do Buriolestes (dossiê: crânio; coluna e costelas; braços; bacia; pernas e cauda). */
export interface PecaEsqueleto {
  id: string;
  nome: string;
  /** Caixa da peça dentro do quadro do esqueleto (520 x 250), olhando para a direita. */
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ESQUELETO_LARGURA = 520;
export const ESQUELETO_ALTURA = 250;

export const PECAS_ESQUELETO: PecaEsqueleto[] = [
  { id: 'cranio', nome: 'o crânio', x: 420, y: 22, w: 96, h: 64 },
  { id: 'coluna', nome: 'a coluna e as costelas', x: 196, y: 40, w: 250, h: 124 },
  { id: 'bracos', nome: 'os braços', x: 330, y: 112, w: 64, h: 76 },
  { id: 'bacia', nome: 'a bacia', x: 168, y: 78, w: 84, h: 80 },
  { id: 'pernas', nome: 'as pernas e a cauda', x: 4, y: 88, w: 270, h: 160 },
];

const OSSO = '#f4ead0';
const OSSO_LINHA = '#5a4a36';

function desenharPeca(c: Ctx, id: string) {
  c.lineJoin = 'round';
  c.lineCap = 'round';
  const osso = (pts: Pt[], esp: number) => {
    c.strokeStyle = OSSO_LINHA;
    c.lineWidth = esp + 4;
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.stroke();
    c.strokeStyle = OSSO;
    c.lineWidth = esp;
    c.stroke();
  };
  const vertebras = (pts: Pt[], r: number) => {
    for (const [x, y] of pts) {
      c.fillStyle = OSSO;
      c.strokeStyle = OSSO_LINHA;
      c.lineWidth = 2;
      c.beginPath();
      c.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
  };
  if (id === 'cranio') {
    c.fillStyle = OSSO;
    c.strokeStyle = OSSO_LINHA;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(428, 52);
    c.quadraticCurveTo(436, 26, 466, 28);
    c.quadraticCurveTo(500, 34, 512, 52);
    c.lineTo(500, 62);
    c.quadraticCurveTo(470, 80, 440, 72);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#6a5a44';
    c.beginPath();
    c.ellipse(458, 44, 9, 8, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(440, 56, 5, 6, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(492, 46, 5, 3, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff';
    for (let x = 470; x < 504; x += 7) {
      c.beginPath();
      c.moveTo(x, 62);
      c.lineTo(x + 2.5, 68);
      c.lineTo(x + 5, 61);
      c.fill();
    }
  } else if (id === 'coluna') {
    // pescoço comprido subindo até a cabeça e as costas até o quadril
    const pts: Pt[] = [];
    for (let k = 0; k <= 14; k++) {
      const t = k / 14;
      pts.push([210 + t * 222, 96 - Math.sin(t * Math.PI * 0.55) * 20 - (t > 0.65 ? (t - 0.65) * 110 : 0)]);
    }
    for (let k = 0; k < 7; k++) {
      const x = 256 + k * 18;
      const y = 92 - Math.sin(((x - 210) / 222) * Math.PI * 0.55) * 20;
      osso(
        [
          [x, y],
          [x - 6, y + 34 - Math.abs(k - 3) * 4],
          [x + 2, y + 58 - Math.abs(k - 3) * 7],
        ],
        4,
      );
    }
    vertebras(pts, 8);
  } else if (id === 'bracos') {
    osso(
      [
        [342, 120],
        [360, 150],
        [384, 158],
      ],
      6,
    );
    osso(
      [
        [384, 158],
        [388, 176],
      ],
      3,
    );
    osso(
      [
        [384, 158],
        [378, 178],
      ],
      3,
    );
  } else if (id === 'bacia') {
    c.fillStyle = OSSO;
    c.strokeStyle = OSSO_LINHA;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(176, 92);
    c.quadraticCurveTo(210, 80, 244, 94);
    c.lineTo(236, 112);
    c.lineTo(224, 150);
    c.lineTo(212, 150);
    c.lineTo(206, 116);
    c.lineTo(190, 146);
    c.lineTo(180, 142);
    c.lineTo(188, 110);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#6a5a44';
    c.beginPath();
    c.arc(212, 104, 6, 0, Math.PI * 2);
    c.fill();
  } else if (id === 'pernas') {
    // cauda comprida para trás
    const cauda: Pt[] = [];
    for (let k = 0; k <= 16; k++) {
      const t = k / 16;
      cauda.push([176 - t * 164, 104 + t * 28 - Math.sin(t * Math.PI) * 8]);
    }
    vertebras(cauda, 7 - (0 as number));
    // duas pernas
    for (const dx of [0, 26]) {
      osso(
        [
          [212 + dx, 110],
          [226 + dx, 160],
          [206 + dx, 206],
          [224 + dx, 236],
        ],
        9,
      );
      osso(
        [
          [224 + dx, 236],
          [248 + dx, 240],
        ],
        4,
      );
    }
  }
}

function gerarEsqueleto(scene: Phaser.Scene) {
  for (const p of PECAS_ESQUELETO) {
    tex(scene, `osso-${p.id}`, p.w, p.h, (c) => {
      c.translate(-p.x, -p.y);
      desenharPeca(c, p.id);
    });
  }
  // Contorno do esqueleto: onde cada peça se encaixa (sombra apagada)
  tex(scene, 'esqueleto-contorno', ESQUELETO_LARGURA, ESQUELETO_ALTURA, (c) => {
    c.globalAlpha = 0.28;
    for (const p of PECAS_ESQUELETO) desenharPeca(c, p.id);
    c.globalAlpha = 1;
  });
}
