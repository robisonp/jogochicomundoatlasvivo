// Toda a arte do protótipo é desenhada por código (Canvas 2D) no boot.
// Vantagem: consistência, zero arquivos de imagem e fácil de ajustar cores/proporções.
import Phaser from 'phaser';
import { TILE } from '../config';
import { CHICO_VISUAL as V, CAATINGA as C } from '../data/visual';

type Ctx = CanvasRenderingContext2D;

function tex(scene: Phaser.Scene, key: string, w: number, h: number, draw: (c: Ctx, w: number, h: number) => void) {
  if (scene.textures.exists(key)) return;
  const t = scene.textures.createCanvas(key, w, h);
  if (!t) return;
  const c = t.getContext();
  draw(c, w, h);
  t.refresh();
}

function rrect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

// Gerador pseudoaleatório determinístico (arte igual a cada carregamento).
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const OUTLINE = '#2a1c14';

export function gerarTexturas(scene: Phaser.Scene): void {
  tex(scene, 'px', 4, 4, (c) => {
    c.fillStyle = '#fff';
    c.fillRect(0, 0, 4, 4);
  });

  gerarChico(scene);
  gerarCenario(scene);
  gerarObjetos(scene);
  gerarBichos(scene);
  gerarUI(scene);
}

// ------------------------------------------------------------------ Chico (recortado em partes)

function gerarChico(scene: Phaser.Scene) {
  tex(scene, 'chico-cabeca', 64, 64, (c) => {
    // orelha
    c.fillStyle = V.pele;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(16, 36, 7, 9, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // rosto
    c.beginPath();
    c.ellipse(34, 34, 25, 25, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // bochecha
    c.fillStyle = 'rgba(230,110,90,0.35)';
    c.beginPath();
    c.ellipse(46, 44, 6, 4, 0, 0, Math.PI * 2);
    c.fill();
    // cabelo (cachos na nuca e franja)
    c.fillStyle = V.cabelo;
    for (const [x, y, r] of [
      [14, 22, 9],
      [22, 14, 10],
      [34, 11, 10],
      [46, 13, 9],
      [12, 32, 7],
      [55, 20, 7],
    ]) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
    // boca (sorriso)
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(47, 45, 6, 0.15 * Math.PI, 0.75 * Math.PI);
    c.stroke();
  });

  tex(scene, 'chico-olhos', 24, 14, (c) => {
    c.fillStyle = '#fff';
    c.beginPath();
    c.ellipse(6, 7, 5, 6.5, 0, 0, Math.PI * 2);
    c.ellipse(18, 7, 5, 6.5, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = V.olhos;
    c.beginPath();
    c.arc(7.5, 8, 3.2, 0, Math.PI * 2);
    c.arc(19.5, 8, 3.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff';
    c.fillRect(8, 5.5, 1.6, 1.6);
    c.fillRect(20, 5.5, 1.6, 1.6);
  });

  tex(scene, 'chico-olhos-fechados', 24, 14, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(2, 8);
    c.quadraticCurveTo(6, 11, 10, 8);
    c.moveTo(14, 8);
    c.quadraticCurveTo(18, 11, 22, 8);
    c.stroke();
  });

  tex(scene, 'chico-chapeu', 76, 34, (c) => {
    c.fillStyle = V.chapeu;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    // aba
    c.beginPath();
    c.ellipse(38, 26, 35, 6, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // copa
    c.beginPath();
    c.moveTo(14, 26);
    c.bezierCurveTo(14, 2, 62, 2, 62, 26);
    c.closePath();
    c.fill();
    c.stroke();
    // faixa
    c.fillStyle = V.chapeuFaixa;
    c.fillRect(15, 17, 46, 6);
  });

  tex(scene, 'chico-corpo', 40, 40, (c) => {
    c.fillStyle = V.camisa;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 4, 2, 32, 30, 10);
    c.fill();
    c.stroke();
    c.fillStyle = V.camisaSombra;
    c.fillRect(6, 22, 28, 8);
    // bermuda
    c.fillStyle = V.bermuda;
    rrect(c, 5, 26, 30, 12, 4);
    c.fill();
    c.stroke();
    // alça da mochila
    c.strokeStyle = V.mochila;
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(12, 3);
    c.lineTo(20, 27);
    c.stroke();
  });

  tex(scene, 'chico-mochila', 24, 32, (c) => {
    c.fillStyle = V.mochila;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 2, 2, 20, 28, 7);
    c.fill();
    c.stroke();
    c.fillStyle = 'rgba(0,0,0,0.18)';
    rrect(c, 5, 16, 14, 10, 3);
    c.fill();
  });

  tex(scene, 'chico-braco', 16, 34, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = V.camisa;
    rrect(c, 2, 1, 12, 13, 5);
    c.fill();
    c.stroke();
    c.fillStyle = V.pele;
    rrect(c, 3, 12, 10, 16, 5);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(8, 28, 5, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  });

  tex(scene, 'chico-perna', 18, 34, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = V.pele;
    rrect(c, 4, 1, 10, 24, 4);
    c.fill();
    c.stroke();
    c.fillStyle = V.sapato;
    rrect(c, 2, 23, 16, 9, 4);
    c.fill();
    c.stroke();
  });
}

// ------------------------------------------------------------------ Cenário (Caatinga)

function gerarCenario(scene: Phaser.Scene) {
  // Chão: bloco de terra interno
  tex(scene, 'terra', TILE, TILE, (c, w, h) => {
    c.fillStyle = C.terra;
    c.fillRect(0, 0, w, h);
    const r = rng(7);
    for (let i = 0; i < 7; i++) {
      c.fillStyle = r() > 0.5 ? C.terraEscura : C.terraClara;
      c.beginPath();
      c.ellipse(r() * w, r() * h, 3 + r() * 5, 2 + r() * 3, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Chão com topo de capim seco
  tex(scene, 'terra-topo', TILE, TILE, (c, w, h) => {
    c.fillStyle = C.terra;
    c.fillRect(0, 0, w, h);
    const r = rng(11);
    for (let i = 0; i < 5; i++) {
      c.fillStyle = r() > 0.5 ? C.terraEscura : C.terraClara;
      c.beginPath();
      c.ellipse(r() * w, 24 + r() * (h - 24), 3 + r() * 5, 2 + r() * 3, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = C.capim;
    c.fillRect(0, 0, w, 14);
    c.fillStyle = C.capimEscuro;
    c.fillRect(0, 12, w, 4);
    // tufos
    c.fillStyle = C.capim;
    for (let x = 2; x < w; x += 9) {
      c.beginPath();
      c.moveTo(x, 4);
      c.lineTo(x + 3, -2);
      c.lineTo(x + 6, 4);
      c.fill();
    }
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 1);
    c.lineTo(w, 1);
    c.stroke();
  });

  // Rocha do lajedo: bloco interno e bloco com topo arredondado
  const rocha = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = C.pedra;
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 31 : 37);
      // rachaduras e manchas de líquen (lajedos são cheios delas)
      c.strokeStyle = C.pedraEscura;
      c.lineWidth = 2;
      for (let i = 0; i < 2; i++) {
        const x = 8 + r() * (w - 16);
        const y = (topo ? 22 : 6) + r() * (h - 30);
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + 6 + r() * 8, y + 5 + r() * 6);
        c.lineTo(x + 4 + r() * 10, y + 12 + r() * 6);
        c.stroke();
      }
      for (let i = 0; i < 3; i++) {
        c.fillStyle = r() > 0.5 ? 'rgba(210,190,120,0.45)' : 'rgba(255,255,255,0.18)';
        c.beginPath();
        c.ellipse(r() * w, (topo ? 20 : 0) + r() * (h - 20), 4 + r() * 6, 3 + r() * 3, 0, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = 'rgba(255,255,255,0.35)';
        c.fillRect(0, 3, w, 5);
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  rocha('rocha', false);
  rocha('rocha-topo', true);

  // Laje de pedra (plataforma atravessável por baixo)
  tex(scene, 'laje', TILE, 26, (c, w) => {
    c.fillStyle = C.pedra;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 1, 2, w - 2, 22, 7);
    c.fill();
    c.stroke();
    c.fillStyle = C.pedraEscura;
    c.fillRect(6, 16, w - 12, 5);
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(8, 6, w - 30, 3);
  });

  // Céu (gradiente)
  tex(scene, 'ceu', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, C.ceuTopo);
    g.addColorStop(1, C.ceuBase);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  tex(scene, 'sol', 180, 180, (c) => {
    const g = c.createRadialGradient(90, 90, 20, 90, 90, 90);
    g.addColorStop(0, 'rgba(255,245,200,1)');
    g.addColorStop(0.35, 'rgba(255,220,130,0.9)');
    g.addColorStop(1, 'rgba(255,220,130,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 180, 180);
  });

  tex(scene, 'nuvem', 220, 90, (c) => {
    c.fillStyle = 'rgba(255,255,255,0.9)';
    for (const [x, y, r] of [
      [50, 58, 30],
      [95, 42, 40],
      [145, 52, 34],
      [180, 62, 24],
    ]) {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }
    c.fillRect(40, 60, 150, 26);
  });

  // Serra ao fundo (tileável na horizontal)
  tex(scene, 'serra', 1024, 320, (c, w, h) => {
    const camada = (cor: string, base: number, amp: number, seed: number) => {
      const r = rng(seed);
      const picos = 6;
      const pts: number[] = [];
      for (let i = 0; i <= picos; i++) pts.push(base - amp * (0.4 + r() * 0.6));
      pts[picos] = pts[0];
      c.fillStyle = cor;
      c.beginPath();
      c.moveTo(0, h);
      for (let i = 0; i <= picos; i++) {
        const x = (i / picos) * w;
        const px = ((i - 0.5) / picos) * w;
        if (i === 0) c.lineTo(x, pts[i]);
        else c.quadraticCurveTo(px, pts[i - 1] - amp * 0.35, x, pts[i]);
      }
      c.lineTo(w, h);
      c.fill();
    };
    camada(C.serraLonge, 260, 190, 3);
    camada(C.serraPerto, 300, 110, 5);
  });

  // Faixa de mandacarus e arbustos secos (plano intermediário, tileável)
  tex(scene, 'mata-fundo', 1024, 260, (c, w, h) => {
    const r = rng(21);
    c.fillStyle = C.mandacaruFundo;
    c.fillRect(0, h - 40, w, 40);
    for (let i = 0; i < 14; i++) {
      const x = 30 + i * 72 + r() * 30;
      if (r() > 0.55) desenharMandacaru(c, x, h - 30, 70 + r() * 90, C.mandacaruFundo);
      else desenharArbustoSeco(c, x, h - 30, 30 + r() * 30, C.mandacaruFundo, r);
    }
  });
}

function desenharMandacaru(c: Ctx, x: number, base: number, alt: number, cor: string) {
  c.fillStyle = cor;
  const lw = alt * 0.16;
  rrect(c, x - lw / 2, base - alt, lw, alt, lw / 2);
  c.fill();
  // braços
  const braco = (dir: number, y: number, hb: number) => {
    const bx = x + dir * lw * 1.4;
    rrect(c, Math.min(x, bx), y, Math.abs(bx - x) + lw * 0.3, lw * 0.7, lw * 0.35);
    c.fill();
    rrect(c, bx - lw * 0.35, y - hb, lw * 0.7, hb + lw * 0.6, lw * 0.35);
    c.fill();
  };
  braco(-1, base - alt * 0.55, alt * 0.3);
  braco(1, base - alt * 0.4, alt * 0.35);
}

function desenharArbustoSeco(c: Ctx, x: number, base: number, alt: number, cor: string, r: () => number) {
  c.strokeStyle = cor;
  c.lineWidth = 3;
  c.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 1.6;
    c.beginPath();
    c.moveTo(x, base);
    c.lineTo(x + Math.cos(a) * alt, base + Math.sin(a) * alt);
    c.stroke();
  }
}

// ------------------------------------------------------------------ Objetos de fase

function gerarObjetos(scene: Phaser.Scene) {
  // Xique-xique: cacto baixo com espinhos (perigo)
  tex(scene, 'espinhos', TILE, 48, (c, _w, h) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    const gomo = (x: number, alt: number) => {
      c.fillStyle = C.cacto;
      rrect(c, x - 9, h - alt, 18, alt, 9);
      c.fill();
      c.stroke();
      c.strokeStyle = C.cactoEscuro;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(x, h - alt + 6);
      c.lineTo(x, h - 2);
      c.stroke();
      // espinhos brancos bem visíveis
      c.strokeStyle = '#fffbe8';
      c.lineWidth = 2;
      for (let y = h - alt + 6; y < h - 4; y += 7) {
        c.beginPath();
        c.moveTo(x - 9, y);
        c.lineTo(x - 16, y - 4);
        c.moveTo(x + 9, y);
        c.lineTo(x + 16, y - 4);
        c.stroke();
      }
      c.beginPath();
      c.moveTo(x, h - alt);
      c.lineTo(x, h - alt - 7);
      c.stroke();
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3;
    };
    gomo(16, 34);
    gomo(46, 44);
    gomo(31, 26);
  });

  // Pegada (colecionável)
  tex(scene, 'pegada', 48, 48, (c) => {
    const g = c.createRadialGradient(24, 24, 4, 24, 24, 24);
    g.addColorStop(0, 'rgba(255,240,170,0.9)');
    g.addColorStop(1, 'rgba(255,240,170,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 48, 48);
    c.fillStyle = '#f2a93b';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(24, 30, 9, 8, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    for (const [x, y] of [
      [13, 18],
      [20, 12],
      [28, 12],
      [35, 18],
    ]) {
      c.beginPath();
      c.ellipse(x, y, 3.8, 4.8, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
  });

  // Marco de checkpoint (apagado / aceso)
  const marco = (key: string, aceso: boolean) =>
    tex(scene, key, 64, 128, (c) => {
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3;
      // mastro
      c.fillStyle = '#8b5a2b';
      c.fillRect(29, 18, 6, 90);
      c.strokeRect(29, 18, 6, 90);
      // bandeira
      c.fillStyle = aceso ? '#ffcf3f' : '#c9c1b3';
      c.beginPath();
      c.moveTo(35, 20);
      c.lineTo(62, 32);
      c.lineTo(35, 46);
      c.closePath();
      c.fill();
      c.stroke();
      if (aceso) {
        c.fillStyle = '#e8553f';
        c.beginPath();
        c.arc(44, 33, 4, 0, Math.PI * 2);
        c.fill();
      }
      // pedra com pegada
      c.fillStyle = C.pedra;
      rrect(c, 8, 96, 48, 30, 10);
      c.fill();
      c.stroke();
      c.fillStyle = aceso ? '#f2a93b' : C.pedraEscura;
      c.beginPath();
      c.ellipse(32, 114, 6, 5, 0, 0, Math.PI * 2);
      c.fill();
      for (const x of [24, 29, 35, 40]) {
        c.beginPath();
        c.arc(x, 105, 2.4, 0, Math.PI * 2);
        c.fill();
      }
    });
  marco('checkpoint', false);
  marco('checkpoint-on', true);

  // Página flutuante do Atlas (plataforma móvel)
  tex(scene, 'pagina', 140, 34, (c, w) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#fff4d6';
    c.beginPath();
    c.moveTo(4, 8);
    c.quadraticCurveTo(w / 2, 0, w - 4, 8);
    c.lineTo(w - 4, 28);
    c.quadraticCurveTo(w / 2, 20, 4, 28);
    c.closePath();
    c.fill();
    c.stroke();
    c.strokeStyle = '#d8c79b';
    c.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.moveTo(18, 13 + i * 5);
      c.quadraticCurveTo(w / 2, 7 + i * 5, w - 18, 13 + i * 5);
      c.stroke();
    }
  });

  // Escada de corda (construída pelo Vovô Marcos) — escalável
  tex(scene, 'escada', TILE, TILE, (c, w, h) => {
    c.strokeStyle = '#8b6a3e';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(14, 0);
    c.lineTo(14, h);
    c.moveTo(w - 14, 0);
    c.lineTo(w - 14, h);
    c.stroke();
    c.strokeStyle = '#6b4a24';
    c.lineWidth = 7;
    for (const y of [14, 46]) {
      c.beginPath();
      c.moveTo(12, y);
      c.lineTo(w - 12, y);
      c.stroke();
    }
  });

  // O Atlas Vivo (objetivo da fase)
  tex(scene, 'atlas', 140, 120, (c) => {
    const g = c.createRadialGradient(70, 60, 10, 70, 60, 70);
    g.addColorStop(0, 'rgba(255,240,160,0.95)');
    g.addColorStop(1, 'rgba(255,240,160,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 140, 120);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    // capa
    c.fillStyle = '#7b3f8c';
    rrect(c, 22, 30, 96, 70, 8);
    c.fill();
    c.stroke();
    // páginas abertas
    c.fillStyle = '#fff4d6';
    c.beginPath();
    c.moveTo(70, 36);
    c.quadraticCurveTo(48, 28, 28, 36);
    c.lineTo(28, 92);
    c.quadraticCurveTo(48, 84, 70, 92);
    c.quadraticCurveTo(92, 84, 112, 92);
    c.lineTo(112, 36);
    c.quadraticCurveTo(92, 28, 70, 36);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.moveTo(70, 36);
    c.lineTo(70, 92);
    c.stroke();
    // símbolo (globo com pegada)
    c.fillStyle = '#5bb0e8';
    c.beginPath();
    c.arc(50, 62, 12, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#5cc26a';
    c.beginPath();
    c.ellipse(47, 59, 5, 4, 0.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#f2a93b';
    c.beginPath();
    c.ellipse(91, 66, 6, 5, 0, 0, Math.PI * 2);
    c.fill();
    for (const [x, y] of [
      [84, 57],
      [89, 54],
      [94, 54],
      [99, 57],
    ]) {
      c.beginPath();
      c.arc(x, y, 2.3, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Placa de som (toca uma dica falada)
  tex(scene, 'placa', 72, 110, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#8b5a2b';
    c.fillRect(32, 50, 8, 58);
    c.strokeRect(32, 50, 8, 58);
    c.fillStyle = '#e9c98a';
    rrect(c, 4, 6, 64, 50, 10);
    c.fill();
    c.stroke();
    desenharAltoFalante(c, 36, 31, 14, OUTLINE);
  });

  tex(scene, 'buraco', 18, 250, (c, w, h) => {
    // Tamanho fora de potência de 2 (sem repetição de textura) + margem transparente: sem linha na borda.
    const g = c.createLinearGradient(0, 24, 0, h);
    g.addColorStop(0, 'rgba(60,30,15,0)');
    g.addColorStop(0.15, 'rgba(60,30,15,0.35)');
    g.addColorStop(0.45, 'rgba(45,22,12,0.85)');
    g.addColorStop(1, 'rgba(30,15,8,1)');
    c.fillStyle = g;
    c.fillRect(0, 24, w, h - 24);
  });

  // Capim verde que cobre o topo do chão depois da chuva
  tex(scene, 'capim-verde', TILE, 22, (c, w) => {
    c.fillStyle = '#6fbf4a';
    c.fillRect(0, 0, w, 14);
    c.fillStyle = '#4f9a35';
    c.fillRect(0, 12, w, 5);
    for (let x = 1; x < w; x += 7) {
      c.fillStyle = x % 2 ? '#6fbf4a' : '#85d15c';
      c.beginPath();
      c.moveTo(x, 6);
      c.lineTo(x + 3, -3);
      c.lineTo(x + 6, 6);
      c.fill();
    }
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 1);
    c.lineTo(w, 1);
    c.stroke();
  });

  tex(scene, 'gota', 4, 22, (c) => {
    c.fillStyle = 'rgba(210,235,255,0.85)';
    c.fillRect(1, 0, 2, 22);
  });

  tex(scene, 'folha', 18, 12, (c) => {
    c.fillStyle = '#b7a24a';
    c.strokeStyle = '#7a6a2a';
    c.lineWidth = 1.5;
    c.beginPath();
    c.ellipse(9, 6, 8, 4, 0.3, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  });

  // Selo do Sertão: medalha dourada com mandacaru e sol
  tex(scene, 'selo-sertao', 130, 130, (c) => {
    const g = c.createRadialGradient(65, 65, 20, 65, 65, 65);
    g.addColorStop(0, 'rgba(255,240,160,0.9)');
    g.addColorStop(1, 'rgba(255,240,160,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 130, 130);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    c.fillStyle = '#f2b93b';
    c.beginPath();
    c.arc(65, 65, 46, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#e0955a';
    c.beginPath();
    c.arc(65, 65, 36, 0, Math.PI * 2);
    c.fill();
    c.lineWidth = 3;
    c.stroke();
    c.fillStyle = '#ffe28a';
    c.beginPath();
    c.arc(80, 52, 9, 0, Math.PI * 2);
    c.fill();
    c.save();
    c.beginPath();
    c.arc(65, 65, 34, 0, Math.PI * 2);
    c.clip();
    desenharMandacaru(c, 60, 104, 62, '#3f8a45');
    c.restore();
    // raios da medalha
    c.fillStyle = '#f2b93b';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      c.beginPath();
      c.arc(65 + Math.cos(a) * 52, 65 + Math.sin(a) * 52, 5, 0, Math.PI * 2);
      c.fill();
    }
  });

  tex(scene, 'pedrinha', 22, 20, (c) => {
    c.fillStyle = C.pedra;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(4, 8);
    c.lineTo(10, 2);
    c.lineTo(18, 4);
    c.lineTo(20, 13);
    c.lineTo(12, 18);
    c.lineTo(3, 15);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.4)';
    c.fillRect(8, 6, 5, 3);
  });

  tex(scene, 'brilho', 16, 16, (c) => {
    const g = c.createRadialGradient(8, 8, 0, 8, 8, 8);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 16, 16);
  });

  tex(scene, 'poeira', 12, 12, (c) => {
    c.fillStyle = 'rgba(235,205,160,0.9)';
    c.beginPath();
    c.arc(6, 6, 6, 0, Math.PI * 2);
    c.fill();
  });
}

// ------------------------------------------------------------------ Bichos da Caatinga

function gerarBichos(scene: Phaser.Scene) {
  // Mocó (Kerodon rupestris): roedor cinza-amarronzado, sem cauda aparente, olhos grandes.
  tex(scene, 'moco', 76, 52, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    // patas
    c.fillStyle = '#6e5a48';
    for (const x of [18, 30, 46, 56]) {
      rrect(c, x, 36, 9, 13, 4);
      c.fill();
      c.stroke();
    }
    // corpo
    c.fillStyle = '#8e7a66';
    c.beginPath();
    c.ellipse(34, 30, 26, 16, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // barriga clara
    c.fillStyle = '#d8c7a8';
    c.beginPath();
    c.ellipse(40, 38, 14, 6, 0, 0, Math.PI);
    c.fill();
    // cabeça
    c.fillStyle = '#8e7a66';
    c.beginPath();
    c.ellipse(58, 24, 14, 12, 0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // orelha
    c.beginPath();
    c.ellipse(52, 12, 5, 6, -0.3, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // olho grande e focinho
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(61, 21, 4, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff';
    c.fillRect(62, 18.5, 1.6, 1.6);
    c.fillStyle = '#e6a39a';
    c.beginPath();
    c.arc(71, 27, 3, 0, Math.PI * 2);
    c.fill();
  });

  // Tatu-bola (Tolypeutes tricinctus) andando: carapaça amarelada com três faixas móveis.
  tex(scene, 'tatu', 84, 50, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#8a6a44';
    for (const x of [22, 34, 50, 60]) {
      rrect(c, x, 36, 8, 12, 3);
      c.fill();
      c.stroke();
    }
    // carapaça
    c.fillStyle = '#c9a466';
    c.beginPath();
    c.moveTo(12, 40);
    c.bezierCurveTo(12, 6, 68, 6, 68, 40);
    c.closePath();
    c.fill();
    c.stroke();
    // três faixas móveis
    c.strokeStyle = '#8a6a44';
    c.lineWidth = 3;
    for (const x of [34, 40, 46]) {
      c.beginPath();
      c.moveTo(x, 12);
      c.lineTo(x, 40);
      c.stroke();
    }
    // placas (pontinhos)
    c.fillStyle = 'rgba(138,106,68,0.6)';
    for (let i = 0; i < 14; i++) {
      const x = 18 + (i % 7) * 7;
      const y = 22 + Math.floor(i / 7) * 9;
      if (x > 32 && x < 48) continue;
      c.beginPath();
      c.arc(x, y, 2, 0, Math.PI * 2);
      c.fill();
    }
    // cabeça com escudo
    c.strokeStyle = OUTLINE;
    c.fillStyle = '#b89058';
    c.beginPath();
    c.moveTo(66, 26);
    c.lineTo(82, 36);
    c.lineTo(66, 42);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(71, 32, 2.2, 0, Math.PI * 2);
    c.fill();
    // cauda curtinha
    c.fillStyle = '#b89058';
    c.beginPath();
    c.moveTo(14, 34);
    c.lineTo(4, 40);
    c.lineTo(14, 40);
    c.closePath();
    c.fill();
    c.stroke();
  });

  // Tatu-bola fechado: a cabeça e a cauda se encaixam, formando uma bola.
  const bola = (key: string, tam: number, chapeu: boolean) =>
    tex(scene, key, tam, tam, (c, w) => {
      const cx = w / 2;
      const r = w / 2 - 3;
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3;
      c.fillStyle = '#c9a466';
      c.beginPath();
      c.arc(cx, cx, r, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.strokeStyle = '#8a6a44';
      c.lineWidth = 3;
      for (const dx of [-r * 0.28, 0, r * 0.28]) {
        c.beginPath();
        c.moveTo(cx + dx, cx - Math.sqrt(r * r - dx * dx) + 3);
        c.lineTo(cx + dx, cx + Math.sqrt(r * r - dx * dx) - 3);
        c.stroke();
      }
      // escudo da cabeça e da cauda encaixados
      c.strokeStyle = OUTLINE;
      c.fillStyle = '#b89058';
      c.beginPath();
      c.moveTo(cx - r * 0.35, cx + r * 0.55);
      c.lineTo(cx, cx + r * 0.95);
      c.lineTo(cx + r * 0.35, cx + r * 0.55);
      c.closePath();
      c.fill();
      c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.3)';
      c.beginPath();
      c.ellipse(cx - r * 0.4, cx - r * 0.45, r * 0.25, r * 0.12, -0.6, 0, Math.PI * 2);
      c.fill();
      if (chapeu) {
        // faixa com a cor da camisa do Chico: dá para saber que é ele dentro da bola
        c.strokeStyle = V.camisa;
        c.lineWidth = 5;
        c.beginPath();
        c.arc(cx, cx, r - 5, Math.PI * 1.1, Math.PI * 1.9);
        c.stroke();
      }
    });
  bola('tatu-bola', 44, false);
  bola('chico-bola', 64, true);

  // Asa-branca (Patagioenas picazuro): pombo grande cinza-amarronzado, cabeça acinzentada, faixa branca na asa.
  tex(scene, 'asa-branca', 64, 48, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    // cauda
    c.fillStyle = '#5b4e4a';
    c.beginPath();
    c.moveTo(8, 22);
    c.lineTo(0, 30);
    c.lineTo(14, 32);
    c.closePath();
    c.fill();
    c.stroke();
    // corpo
    c.fillStyle = '#8f7b74';
    c.beginPath();
    c.ellipse(28, 28, 20, 13, -0.1, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // asa com a faixa branca
    c.fillStyle = '#7a6760';
    c.beginPath();
    c.ellipse(24, 24, 14, 8, -0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = '#ffffff';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(14, 22);
    c.lineTo(32, 18);
    c.stroke();
    // cabeça
    c.strokeStyle = OUTLINE;
    c.fillStyle = '#9a9aa6';
    c.beginPath();
    c.arc(47, 16, 9, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(50, 14, 2.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#3a2e2a';
    c.beginPath();
    c.moveTo(55, 16);
    c.lineTo(62, 18);
    c.lineTo(55, 20);
    c.closePath();
    c.fill();
    // pés
    c.strokeStyle = '#c0504d';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(26, 40);
    c.lineTo(26, 46);
    c.moveTo(33, 40);
    c.lineTo(33, 46);
    c.stroke();
  });

  // Carcará (Caracara plancus): boné escuro, rosto claro com pele alaranjada, corpo escuro, pernas amarelas.
  tex(scene, 'carcara', 64, 76, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    // pernas
    c.strokeStyle = '#e8b730';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(26, 58);
    c.lineTo(26, 74);
    c.moveTo(36, 58);
    c.lineTo(36, 74);
    c.stroke();
    // corpo escuro
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#3d3029';
    c.beginPath();
    c.ellipse(30, 44, 16, 20, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // peito claro listrado
    c.fillStyle = '#e8dcc2';
    c.beginPath();
    c.ellipse(36, 36, 9, 11, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#8a7a66';
    c.lineWidth = 1.5;
    for (let y = 30; y < 46; y += 4) {
      c.beginPath();
      c.moveTo(29, y);
      c.lineTo(43, y);
      c.stroke();
    }
    // cabeça clara com boné escuro
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#efe6d2';
    c.beginPath();
    c.arc(38, 18, 11, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#2a211c';
    c.beginPath();
    c.arc(38, 16, 11, Math.PI * 1.05, Math.PI * 1.95);
    c.lineTo(30, 12);
    c.closePath();
    c.fill();
    // pele alaranjada do rosto e bico
    c.fillStyle = '#e8743b';
    c.beginPath();
    c.ellipse(46, 20, 5, 4, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#b9c7d6';
    c.beginPath();
    c.moveTo(49, 18);
    c.quadraticCurveTo(60, 20, 53, 27);
    c.lineTo(49, 23);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(41, 17, 2.2, 0, Math.PI * 2);
    c.fill();
  });

  // Preá (Galea spixii): roedor pequeno, pelo cinza-amarronzado, quase sem cauda.
  tex(scene, 'prea', 52, 34, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#6e5a48';
    for (const x of [12, 34]) {
      rrect(c, x, 24, 7, 9, 3);
      c.fill();
      c.stroke();
    }
    c.fillStyle = '#9a8468';
    c.beginPath();
    c.ellipse(22, 20, 17, 11, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(39, 16, 10, 9, 0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(35, 7, 4, 4, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(42, 14, 2.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#e6a39a';
    c.beginPath();
    c.arc(48, 18, 2, 0, Math.PI * 2);
    c.fill();
  });
}

export function desenharAltoFalante(c: Ctx, cx: number, cy: number, s: number, cor: string) {
  c.fillStyle = cor;
  c.strokeStyle = cor;
  c.lineWidth = s * 0.18;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(cx - s, cy - s * 0.35);
  c.lineTo(cx - s * 0.5, cy - s * 0.35);
  c.lineTo(cx, cy - s * 0.85);
  c.lineTo(cx, cy + s * 0.85);
  c.lineTo(cx - s * 0.5, cy + s * 0.35);
  c.lineTo(cx - s, cy + s * 0.35);
  c.closePath();
  c.fill();
  for (const r of [0.45, 0.85]) {
    c.beginPath();
    c.arc(cx + s * 0.1, cy, s * r, -0.9, 0.9);
    c.stroke();
  }
}

// ------------------------------------------------------------------ Interface

function gerarUI(scene: Phaser.Scene) {
  const botao = (key: string, raio: number, desenho: (c: Ctx, cx: number, cy: number, r: number) => void) =>
    tex(scene, key, raio * 2 + 8, raio * 2 + 8, (c) => {
      const cx = raio + 4;
      const cy = raio + 4;
      c.fillStyle = 'rgba(20,30,45,0.35)';
      c.beginPath();
      c.arc(cx, cy + 3, raio, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.28)';
      c.strokeStyle = 'rgba(255,255,255,0.85)';
      c.lineWidth = 4;
      c.beginPath();
      c.arc(cx, cy, raio - 2, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      desenho(c, cx, cy, raio);
    });

  // Pular: seta para cima em arco
  botao('btn-pular', 80, (c, cx, cy, r) => {
    c.strokeStyle = '#fff';
    c.fillStyle = '#fff';
    c.lineWidth = 10;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(cx, cy + r * 0.45);
    c.lineTo(cx, cy - r * 0.2);
    c.stroke();
    c.beginPath();
    c.moveTo(cx - r * 0.38, cy - r * 0.05);
    c.lineTo(cx, cy - r * 0.5);
    c.lineTo(cx + r * 0.38, cy - r * 0.05);
    c.stroke();
  });

  // Ação: mão aberta
  botao('btn-acao', 60, (c, cx, cy, r) => {
    c.fillStyle = '#fff';
    const s = r / 60;
    rrect(c, cx - 18 * s, cy - 6 * s, 36 * s, 32 * s, 12 * s);
    c.fill();
    for (let i = 0; i < 4; i++) {
      rrect(c, cx - 18 * s + i * 9.5 * s, cy - 30 * s + Math.abs(i - 1.5) * 4 * s, 7.5 * s, 30 * s, 4 * s);
      c.fill();
    }
    c.save();
    c.translate(cx - 18 * s, cy + 6 * s);
    c.rotate(-0.7);
    rrect(c, -4 * s, -18 * s, 8 * s, 22 * s, 4 * s);
    c.fill();
    c.restore();
  });

  // Poder do Bicho: pata
  botao('btn-poder', 60, (c, cx, cy, r) => {
    c.fillStyle = '#ffd766';
    const s = r / 60;
    c.beginPath();
    c.ellipse(cx, cy + 10 * s, 16 * s, 14 * s, 0, 0, Math.PI * 2);
    c.fill();
    for (const [dx, dy] of [
      [-20, -8],
      [-8, -20],
      [8, -20],
      [20, -8],
    ]) {
      c.beginPath();
      c.ellipse(cx + dx * s, cy + dy * s, 6.5 * s, 8 * s, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Direcional (base + seta usada 4x)
  tex(scene, 'dpad-base', 280, 280, (c) => {
    const cx = 140;
    const cy = 140;
    c.fillStyle = 'rgba(20,30,45,0.3)';
    c.beginPath();
    c.arc(cx, cy + 4, 130, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.14)';
    c.strokeStyle = 'rgba(255,255,255,0.75)';
    c.lineWidth = 4;
    c.beginPath();
    c.arc(cx, cy, 128, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.26)';
    rrect(c, cx - 36, cy - 110, 72, 220, 16);
    c.fill();
    rrect(c, cx - 110, cy - 36, 220, 72, 16);
    c.fill();
  });

  tex(scene, 'dpad-seta', 60, 60, (c) => {
    c.fillStyle = '#fff';
    c.beginPath();
    c.moveTo(52, 30);
    c.lineTo(14, 8);
    c.lineTo(14, 52);
    c.closePath();
    c.fill();
  });

  tex(scene, 'btn-pausa', 84, 84, (c) => {
    c.fillStyle = 'rgba(20,30,45,0.4)';
    c.beginPath();
    c.arc(42, 44, 38, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.3)';
    c.strokeStyle = 'rgba(255,255,255,0.9)';
    c.lineWidth = 4;
    c.beginPath();
    c.arc(42, 42, 36, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#fff';
    rrect(c, 28, 26, 10, 32, 3);
    c.fill();
    rrect(c, 46, 26, 10, 32, 3);
    c.fill();
  });

  tex(scene, 'btn-som', 84, 84, (c) => {
    c.fillStyle = 'rgba(20,30,45,0.4)';
    c.beginPath();
    c.arc(42, 44, 38, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.3)';
    c.strokeStyle = 'rgba(255,255,255,0.9)';
    c.lineWidth = 4;
    c.beginPath();
    c.arc(42, 42, 36, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    desenharAltoFalante(c, 44, 42, 18, '#fff');
  });

  // Botões grandes de menu
  const grande = (key: string, cor: string, desenho: (c: Ctx) => void) =>
    tex(scene, key, 220, 220, (c) => {
      c.fillStyle = 'rgba(0,0,0,0.25)';
      c.beginPath();
      c.arc(110, 118, 100, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = cor;
      c.strokeStyle = '#fff';
      c.lineWidth = 8;
      c.beginPath();
      c.arc(110, 110, 100, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      desenho(c);
    });

  grande('btn-jogar', '#5cc26a', (c) => {
    c.fillStyle = '#fff';
    c.beginPath();
    c.moveTo(85, 60);
    c.lineTo(160, 110);
    c.lineTo(85, 160);
    c.closePath();
    c.fill();
  });

  grande('btn-casa', '#5bb0e8', (c) => {
    c.fillStyle = '#fff';
    c.beginPath();
    c.moveTo(110, 50);
    c.lineTo(170, 105);
    c.lineTo(50, 105);
    c.closePath();
    c.fill();
    c.fillRect(70, 100, 80, 65);
    c.fillStyle = '#5bb0e8';
    c.fillRect(98, 125, 24, 40);
  });

  grande('btn-denovo', '#f2a93b', (c) => {
    c.strokeStyle = '#fff';
    c.lineWidth = 16;
    c.lineCap = 'round';
    c.beginPath();
    c.arc(110, 115, 50, -0.3 * Math.PI, 1.35 * Math.PI);
    c.stroke();
    c.fillStyle = '#fff';
    c.beginPath();
    c.moveTo(150, 45);
    c.lineTo(165, 95);
    c.lineTo(118, 80);
    c.closePath();
    c.fill();
  });

  tex(scene, 'engrenagem', 64, 64, (c) => {
    c.fillStyle = 'rgba(255,255,255,0.55)';
    c.save();
    c.translate(32, 32);
    for (let i = 0; i < 8; i++) {
      c.rotate(Math.PI / 4);
      c.fillRect(-5, -28, 10, 12);
    }
    c.restore();
    c.beginPath();
    c.arc(32, 32, 19, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(29,43,58,1)';
    c.beginPath();
    c.arc(32, 32, 8, 0, Math.PI * 2);
    c.fill();
  });
}
