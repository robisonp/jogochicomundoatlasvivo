// Toda a arte do protótipo é desenhada por código (Canvas 2D) no boot.
// Vantagem: consistência, zero arquivos de imagem e fácil de ajustar cores/proporções.
import Phaser from 'phaser';
import { TILE } from '../config';
import { CHICO_VISUAL as V, CAATINGA as C } from '../data/visual';
import { gerarAmazonia } from './Amazonia';
import { gerarSavana } from './Savana';
import { gerarAustralia } from './Australia';
import { gerarArtico } from './Artico';
import { gerarAntartica } from './Antartica';
import { gerarPraia } from './Praia';
import { gerarDinossauros } from './Dinossauros';
import { gerarFamilia } from './Familia';
import { gerarMapa } from './Mapa';

export type Ctx = CanvasRenderingContext2D;

export function tex(scene: Phaser.Scene, key: string, w: number, h: number, draw: (c: Ctx, w: number, h: number) => void) {
  if (scene.textures.exists(key)) return;
  const t = scene.textures.createCanvas(key, w, h);
  if (!t) return;
  const c = t.getContext();
  draw(c, w, h);
  t.refresh();
}

export function rrect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

// Gerador pseudoaleatório determinístico (arte igual a cada carregamento).
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const OUTLINE = '#2a1c14';

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
  gerarAtlas(scene);
  gerarAmazonia(scene);
  gerarSavana(scene);
  gerarAustralia(scene);
  gerarArtico(scene);
  gerarAntartica(scene);
  gerarPraia(scene);
  gerarDinossauros(scene);
  gerarFamilia(scene);
  gerarMapa(scene);
}

// ------------------------------------------------------------------ Chico
// O Chico vem da arte da família (folha "chico" em public/chico, carregada no Boot). Aqui fica só a pálpebra
// da piscada, desenhada por cima dos olhos da arte (em 2x, o jogo mostra a 0,5).

function gerarChico(scene: Phaser.Scene) {
  tex(scene, 'chico-piscar', 48, 28, (c) => {
    for (const x of [13.8, 34.2]) {
      c.fillStyle = V.pele;
      c.beginPath();
      c.ellipse(x, 14, 9, 10.5, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(x - 7, 14);
      c.quadraticCurveTo(x, 20, x + 7, 14);
      c.stroke();
    }
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
  // Cada bicho também ganha uma versão "-hd" (3x) para aparecer grande no Atlas sem pixelar.
  const texBicho = (key: string, w: number, h: number, draw: (c: Ctx, w: number, h: number) => void) => {
    tex(scene, key, w, h, draw);
    tex(scene, `${key}-hd`, w * 3, h * 3, (c) => {
      c.scale(3, 3);
      draw(c, w, h);
    });
  };

  // Mocó (Kerodon rupestris): roedor cinza-amarronzado, sem cauda aparente, olhos grandes.
  texBicho('moco', 76, 52, (c) => {
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
  texBicho('tatu', 84, 50, (c) => {
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
  texBicho('asa-branca', 64, 48, (c) => {
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
  texBicho('carcara', 64, 76, (c) => {
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
  texBicho('prea', 52, 34, (c) => {
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

// ------------------------------------------------------------------ Atlas

// Contornos aproximados (longitude, latitude). Simplificados, mas com a forma real do continente.
export const AMERICA_DO_SUL: [number, number][] = [
  [-77, 8.5], [-72, 12], [-63, 10.7], [-60, 8.5], [-57, 6], [-52, 5], [-50, 1.5], [-48, -1], [-44, -2.5],
  [-39, -3], [-35, -5.5], [-34.8, -7.5], [-35.5, -9.5], [-38.5, -13], [-39, -17.5], [-40.5, -21], [-43, -23],
  [-48, -25.5], [-48.5, -28.5], [-51, -31.5], [-53.4, -33.7], [-56, -34.9], [-58, -34.5], [-57, -38],
  [-62, -39], [-65, -41], [-65, -45], [-67.5, -47], [-69, -51], [-68.5, -52.5], [-70, -55], [-74, -52.5],
  [-75, -47], [-73.5, -42], [-73.5, -37], [-71.5, -30], [-70.3, -18.5], [-76, -14], [-79.5, -7], [-81, -4.5],
  [-80, -1], [-79, 1.5], [-77.5, 4], [-77.5, 7.5],
];
const BRASIL: [number, number][] = [
  [-60, 5], [-51.5, 4.3], [-50, 1.5], [-48, -1], [-44, -2.5], [-39, -3], [-35, -5.5], [-34.8, -7.5],
  [-35.5, -9.5], [-38.5, -13], [-39, -17.5], [-40.5, -21], [-43, -23], [-48, -25.5], [-48.5, -28.5],
  [-51, -31.5], [-53.4, -33.7], [-57.6, -30.2], [-54.6, -25.6], [-58, -22.5], [-57.8, -19.9], [-60, -16.3],
  [-65.3, -10], [-70.5, -11], [-73.8, -7.4], [-70, -4.2], [-69.4, 1], [-66.8, 1.2], [-63.5, 2.2],
];
const AMAZONIA: [number, number][] = [
  [-79, 1], [-75, 4], [-70, 5], [-64, 6.5], [-60, 5], [-52, 4], [-50, 1], [-48, -1], [-50, -5], [-52, -10],
  [-56, -13], [-62, -15], [-68, -16], [-72, -13], [-76, -10], [-78, -6], [-80, -3],
];
export const AFRICA: [number, number][] = [
  [-6, 35.8], [-9.8, 29], [-17, 21], [-17.5, 14.7], [-15, 11], [-13, 8.5], [-11, 6.9], [-7.5, 4.4], [-3, 5],
  [2, 6.3], [6, 4.3], [9.5, 3.9], [9.3, 1], [9, -1], [11.8, -4.5], [13, -9], [12, -15], [11.8, -17.5],
  [14.5, -22.8], [16, -28.6], [18.4, -34.2], [20, -34.8], [25.6, -34], [30, -31], [32.8, -26], [35.5, -23.8],
  [35, -19], [40.7, -15], [40.5, -10.5], [39.3, -6.8], [39.7, -4], [41.5, -1.5], [44, 1.5], [49, 7.5],
  [51.2, 11.8], [43.3, 11.5], [39.5, 15.5], [37.3, 21], [35.6, 23.9], [32.5, 29.9], [31, 31.5], [25, 31.8],
  [20, 30.8], [15.5, 31.5], [10.5, 34], [11, 37], [8, 36.9], [3, 36.8], [-2, 35.1],
];
// Quênia e Tanzânia juntos (aproximado)
const QUENIA_TANZANIA: [number, number][] = [
  [34, 4.6], [41.9, 3.9], [41, -1.7], [39.3, -4.7], [38.8, -6.5], [39.5, -8], [40.4, -10.4], [35, -11.5],
  [33, -9.6], [30.5, -8], [29.5, -5], [30.5, -1], [33.9, -1], [34, 1],
];
export const AUSTRALIA: [number, number][] = [
  [113.5, -22], [114, -26.5], [115, -30], [115, -33.5], [117.5, -35], [121, -33.8], [124, -33], [126, -32.3],
  [129, -31.6], [132, -32], [134, -32.8], [135.8, -34.8], [137.5, -33.5], [138, -35.6], [140, -37.5],
  [143.5, -38.8], [146.3, -39], [148, -37.8], [150, -37.5], [150.3, -35.5], [151.3, -33.5], [153, -31.5],
  [153.6, -28.2], [153, -25.5], [151, -23.5], [149.5, -22.3], [146.3, -19], [145.3, -15], [143.5, -14],
  [142.5, -10.7], [141.5, -13], [141.6, -16.5], [140.5, -17.6], [139, -17], [136, -15.5], [135.5, -14.5],
  [136.8, -12.2], [133, -11.3], [131, -12], [130, -13], [129.5, -15], [127.5, -14], [126, -14.3], [124, -16.3],
  [122.2, -17.8], [121, -19.5], [118, -20.4], [116, -20.8], [114, -21.8],
];
export const TASMANIA: [number, number][] = [
  [144.6, -40.7], [148.3, -40.9], [148.3, -42.2], [147, -43.6], [145.9, -43.5], [145.2, -42.2],
];
// Leste e sudeste (rios do ornitorrinco, matas dos coalas e dos wombats), aproximado
const AUSTRALIA_LESTE: [number, number][] = [
  [145.3, -15], [146.3, -19], [149.5, -22.3], [151, -23.5], [153, -25.5], [153.6, -28.2], [153, -31.5],
  [151.3, -33.5], [150.3, -35.5], [150, -37.5], [148, -37.8], [146.3, -39], [143.5, -38.8], [140, -37.5],
  [138, -35.6], [139.5, -34], [142, -33], [146, -30], [148, -26], [146.5, -22], [144.5, -18],
];
// Ártico visto de cima (projeção polar simplificada), recortado em 55° N
export const GROENLANDIA: [number, number][] = [
  [-73, 78], [-60, 82], [-30, 83.5], [-18, 81], [-20, 72], [-25, 68], [-40, 65], [-44, 60], [-50, 64], [-54, 70],
  [-68, 76.5],
];
const AMERICA_NORTE: [number, number][] = [
  [-168, 66], [-162, 70], [-150, 71], [-140, 70], [-128, 70], [-115, 68.5], [-100, 68], [-95, 72], [-85, 70],
  [-80, 73], [-75, 72], [-70, 67], [-64, 60], [-60, 55], [-80, 55], [-100, 55], [-120, 55], [-140, 55],
  [-160, 55], [-165, 60],
];
export const ARQUIPELAGO_CANADA: [number, number][] = [
  [-122, 75], [-100, 78], [-85, 80.5], [-72, 78], [-85, 74], [-100, 73], [-115, 72],
];
const EURASIA: [number, number][] = [
  [8, 55], [5, 62], [14, 68], [25, 71], [40, 68], [44, 68], [60, 69.5], [70, 73], [80, 73], [100, 77.5],
  [115, 74], [130, 72], [140, 72.5], [160, 70], [170, 69.5], [180, 66], [180, 55], [160, 55], [130, 55],
  [100, 55], [70, 55], [40, 55],
];
export const SVALBARD: [number, number][] = [[11, 79], [18, 80.3], [27, 80], [22, 77], [15, 77]];
export const ISLANDIA: [number, number][] = [[-24, 65.5], [-18, 66.5], [-13.5, 65], [-18, 63.4], [-22, 63.8]];
const NORDESTE: [number, number][] = [
  [-46, -1], [-44, -2.5], [-39, -3], [-35, -5.5], [-34.8, -7.5], [-35.5, -9.5], [-38.5, -13], [-39.5, -18],
  [-41, -15.5], [-44, -14.5], [-46, -11], [-48.5, -6], [-47.5, -3],
];

function gerarAtlas(scene: Phaser.Scene) {
  // Mapinha: América do Sul, Brasil e a região do bicho em destaque.
  const proj = (lon: number, lat: number): [number, number] => [(lon + 83) * 3.3, (14 - lat) * 3.3];
  const poligono = (c: Ctx, pts: [number, number][]) => {
    c.beginPath();
    pts.forEach(([lon, lat], i) => {
      const [x, y] = proj(lon, lat);
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    });
    c.closePath();
  };
  for (const regiao of ['nordeste', 'amazonia', 'brasil', 'america-do-sul', 'litoral-brasil', 'rio-grande-do-sul', 'argentina'] as const) {
    tex(scene, `mapa-${regiao}`, 170, 240, (c) => {
      c.lineJoin = 'round';
      c.strokeStyle = '#6b5a3a';
      c.lineWidth = 2;
      c.fillStyle = regiao === 'america-do-sul' ? '#f2a93b' : '#e9dcb8';
      poligono(c, AMERICA_DO_SUL);
      c.fill();
      c.stroke();
      c.fillStyle = regiao === 'america-do-sul' ? '#e08e2b' : regiao === 'brasil' ? '#f2a93b' : '#d8c79b';
      poligono(c, BRASIL);
      c.fill();
      c.stroke();
      if (regiao === 'nordeste' || regiao === 'amazonia') {
        c.fillStyle = regiao === 'amazonia' ? '#5cc26a' : '#f2a93b';
        poligono(c, regiao === 'amazonia' ? AMAZONIA : NORDESTE);
        c.fill();
        c.stroke();
      }
      // fósseis: um alfinete onde foram encontrados (Rio Grande do Sul; Patagônia argentina)
      const alfinete = regiao === 'rio-grande-do-sul' ? [-53.5, -29.7] : regiao === 'argentina' ? [-68.5, -40] : null;
      if (alfinete) {
        const [x, y] = proj(alfinete[0], alfinete[1]);
        c.fillStyle = '#e04a3a';
        c.strokeStyle = '#fff';
        c.lineWidth = 3;
        c.beginPath();
        c.arc(x, y, 8, 0, Math.PI * 2);
        c.fill();
        c.stroke();
      }
      if (regiao === 'litoral-brasil') {
        // faixa grossa ao longo da costa atlântica do Brasil (do Amapá ao Rio Grande do Sul)
        c.save();
        c.lineCap = 'round';
        c.strokeStyle = '#2f8fd8';
        c.lineWidth = 7;
        c.beginPath();
        BRASIL.slice(1, 17).forEach(([lon, lat], i) => {
          const [x, y] = proj(lon, lat);
          if (i === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        });
        c.stroke();
        c.restore();
      }
    });
  }

  // Mapinha da África: continente inteiro ou Quênia/Tanzânia em destaque.
  const projA = (lon: number, lat: number): [number, number] => [(lon + 19) * 3.0, (38 - lat) * 3.0];
  const poligonoA = (c: Ctx, pts: [number, number][]) => {
    c.beginPath();
    pts.forEach(([lon, lat], i) => {
      const [x, y] = projA(lon, lat);
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    });
    c.closePath();
  };
  for (const regiao of ['africa', 'africa-leste'] as const) {
    tex(scene, `mapa-${regiao}`, 220, 228, (c) => {
      c.lineJoin = 'round';
      c.strokeStyle = '#6b5a3a';
      c.lineWidth = 2;
      c.fillStyle = regiao === 'africa' ? '#f2a93b' : '#e9dcb8';
      poligonoA(c, AFRICA);
      c.fill();
      c.stroke();
      if (regiao === 'africa-leste') {
        c.fillStyle = '#f2a93b';
        poligonoA(c, QUENIA_TANZANIA);
        c.fill();
        c.stroke();
      }
    });
  }

  // Mapinha da Austrália: país inteiro ou o leste (com a Tasmânia) em destaque.
  const projO = (lon: number, lat: number): [number, number] => [(lon - 111) * 4.9, (-9 - lat) * 4.9];
  const poligonoO = (c: Ctx, pts: [number, number][]) => {
    c.beginPath();
    pts.forEach(([lon, lat], i) => {
      const [x, y] = projO(lon, lat);
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    });
    c.closePath();
  };
  for (const regiao of ['australia', 'australia-leste'] as const) {
    tex(scene, `mapa-${regiao}`, 220, 180, (c) => {
      c.lineJoin = 'round';
      c.strokeStyle = '#6b5a3a';
      c.lineWidth = 2;
      c.fillStyle = regiao === 'australia' ? '#f2a93b' : '#e9dcb8';
      for (const p of [AUSTRALIA, TASMANIA]) {
        poligonoO(c, p);
        c.fill();
        c.stroke();
      }
      if (regiao === 'australia-leste') {
        c.fillStyle = '#f2a93b';
        for (const p of [AUSTRALIA_LESTE, TASMANIA]) {
          poligonoO(c, p);
          c.fill();
          c.stroke();
        }
      }
    });
  }

  // Mapinha do Ártico: o "topo do mundo" visto de cima, com o Círculo Polar Ártico em destaque.
  const projP = (lon: number, lat: number): [number, number] => {
    const raio = (90 - lat) * 3.1;
    const a = ((lon - 90) * Math.PI) / 180;
    return [110 + raio * Math.cos(a), 110 + raio * Math.sin(a)];
  };
  const poligonoP = (c: Ctx, pts: [number, number][]) => {
    c.beginPath();
    pts.forEach(([lon, lat], i) => {
      const [x, y] = projP(lon, lat);
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    });
    c.closePath();
  };
  tex(scene, 'mapa-artico', 220, 220, (c) => {
    c.save();
    c.beginPath();
    c.arc(110, 110, 35 * 3.1, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#9fcbe6';
    c.fillRect(0, 0, 220, 220);
    c.lineJoin = 'round';
    c.strokeStyle = '#6b5a3a';
    c.lineWidth = 2;
    const terras = [AMERICA_NORTE, EURASIA, ARQUIPELAGO_CANADA, GROENLANDIA, SVALBARD, ISLANDIA];
    c.fillStyle = '#e9dcb8';
    for (const p of terras) {
      poligonoP(c, p);
      c.fill();
      c.stroke();
    }
    // terras dentro do Círculo Polar Ártico em destaque (onde vivem os bichos deste mundo)
    c.save();
    c.beginPath();
    c.arc(110, 110, 23.5 * 3.1, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#f2a93b';
    for (const p of terras) {
      poligonoP(c, p);
      c.fill();
      c.stroke();
    }
    c.restore();
    // gelo do mar no meio
    c.fillStyle = 'rgba(255,255,255,0.85)';
    c.beginPath();
    c.arc(110, 110, 10 * 3.1, 0, Math.PI * 2);
    c.fill();
    c.setLineDash([6, 5]);
    c.strokeStyle = '#e08e2b';
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(110, 110, 23.5 * 3.1, 0, Math.PI * 2);
    c.stroke();
    c.setLineDash([]);
    c.restore();
    c.strokeStyle = '#6b5a3a';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(110, 110, 35 * 3.1, 0, Math.PI * 2);
    c.stroke();
  });

  // Livro aberto (duas páginas)
  tex(scene, 'livro', 1120, 620, (c, w, h) => {
    c.fillStyle = '#7b3f8c';
    rrect(c, 0, 0, w, h, 26);
    c.fill();
    c.fillStyle = '#5e2c6c';
    rrect(c, 10, 10, w - 20, h - 20, 20);
    c.fill();
    for (const x0 of [24, w / 2 + 4]) {
      const g = c.createLinearGradient(x0, 0, x0 + w / 2 - 28, 0);
      const esquerda = x0 === 24;
      g.addColorStop(0, esquerda ? '#f6ecd0' : '#e8dcb8');
      g.addColorStop(0.08, '#fff8e6');
      g.addColorStop(0.92, '#fff8e6');
      g.addColorStop(1, esquerda ? '#e8dcb8' : '#f6ecd0');
      c.fillStyle = g;
      rrect(c, x0, 22, w / 2 - 28, h - 44, 14);
      c.fill();
    }
    c.fillStyle = 'rgba(0,0,0,0.12)';
    c.fillRect(w / 2 - 6, 22, 12, h - 44);
  });

  const carta = (key: string, borda: string, espessura: number) =>
    tex(scene, key, 160, 140, (c, w, h) => {
      c.fillStyle = 'rgba(0,0,0,0.12)';
      rrect(c, 4, 6, w - 8, h - 8, 16);
      c.fill();
      c.fillStyle = '#fffdf5';
      c.strokeStyle = borda;
      c.lineWidth = espessura;
      rrect(c, 4, 2, w - 8, h - 8, 16);
      c.fill();
      c.stroke();
    });
  carta('carta', '#d8c79b', 3);
  carta('carta-on', '#f2a93b', 7);

  const icone = (key: string, cor: string, desenho: (c: Ctx) => void) =>
    tex(scene, key, 100, 100, (c) => {
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.beginPath();
      c.arc(50, 53, 44, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = cor;
      c.strokeStyle = '#fff';
      c.lineWidth = 5;
      c.beginPath();
      c.arc(50, 49, 44, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.fillStyle = '#fff';
      c.strokeStyle = '#fff';
      desenho(c);
    });

  icone('ic-mapa', '#5bb0e8', (c) => {
    c.lineWidth = 4;
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(26, 34);
    c.lineTo(40, 28);
    c.lineTo(58, 34);
    c.lineTo(74, 28);
    c.lineTo(74, 66);
    c.lineTo(58, 72);
    c.lineTo(40, 66);
    c.lineTo(26, 72);
    c.closePath();
    c.stroke();
    c.beginPath();
    c.moveTo(40, 28);
    c.lineTo(40, 66);
    c.moveTo(58, 34);
    c.lineTo(58, 72);
    c.stroke();
    c.fillStyle = '#e8553f';
    c.beginPath();
    c.arc(50, 44, 7, Math.PI, 0);
    c.lineTo(50, 58);
    c.closePath();
    c.fill();
  });
  icone('ic-comida', '#5cc26a', (c) => {
    c.beginPath();
    c.ellipse(44, 46, 20, 11, -0.7, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#5cc26a';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(30, 60);
    c.lineTo(58, 32);
    c.stroke();
    c.fillStyle = '#e8553f';
    for (const [x, y] of [
      [62, 60],
      [72, 54],
      [70, 66],
    ]) {
      c.beginPath();
      c.arc(x, y, 7, 0, Math.PI * 2);
      c.fill();
    }
  });
  icone('ic-regua', '#f2a93b', (c) => {
    c.save();
    c.translate(50, 49);
    c.rotate(-0.6);
    rrect(c, -32, -11, 64, 22, 4);
    c.fill();
    c.strokeStyle = '#f2a93b';
    c.lineWidth = 3;
    for (let i = -24; i <= 24; i += 8) {
      c.beginPath();
      c.moveTo(i, -11);
      c.lineTo(i, i % 16 === 0 ? 2 : -3);
      c.stroke();
    }
    c.restore();
  });
  icone('ic-estrela', '#c77dff', (c) => {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? 28 : 12;
      const x = 50 + Math.cos(a) * r;
      const y = 50 + Math.sin(a) * r;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.closePath();
    c.fill();
  });
  icone('ic-som', '#e8553f', (c) => desenharAltoFalante(c, 52, 49, 20, '#fff'));

  // Botão do Atlas (livro) para a tela de título
  tex(scene, 'btn-voltar', 84, 84, (c) => {
    c.fillStyle = 'rgba(0,0,0,0.25)';
    c.beginPath();
    c.arc(42, 45, 38, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#5bb0e8';
    c.strokeStyle = '#fff';
    c.lineWidth = 5;
    c.beginPath();
    c.arc(42, 42, 36, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#fff';
    c.beginPath();
    c.moveTo(24, 42);
    c.lineTo(46, 24);
    c.lineTo(46, 34);
    c.lineTo(62, 34);
    c.lineTo(62, 50);
    c.lineTo(46, 50);
    c.lineTo(46, 60);
    c.closePath();
    c.fill();
  });
}
