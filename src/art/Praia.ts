// Arte do Mundo 7 — Oceano e Praia do Brasil, desenhada por código.
// Dossiê (ambiente): praia, estuário e raízes do mangue expostas na maré baixa. Manguezal não é "lama suja":
// é um ambiente muito rico, abrigo para muitos filhotes.
import Phaser from 'phaser';
import { TILE } from '../config';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';

export function gerarPraia(scene: Phaser.Scene) {
  gerarChao(scene);
  gerarFundo(scene);
  gerarObjetos(scene);
  gerarBichos(scene);
}

function gerarChao(scene: Phaser.Scene) {
  const areia = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = '#f0d9a4';
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 201 : 203);
      for (let i = 0; i < 18; i++) {
        c.fillStyle = r() > 0.5 ? '#e2c88c' : '#f8e6ba';
        c.beginPath();
        c.arc(r() * w, r() * h, 1.2 + r() * 1.8, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = '#f8e6ba';
        c.fillRect(0, 0, w, 8);
        c.strokeStyle = '#b89a5a';
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
        // conchinhas
        c.fillStyle = '#f4b8a8';
        c.beginPath();
        c.arc(18, 12, 3, Math.PI, 0);
        c.fill();
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(46, 14, 2.5, Math.PI, 0);
        c.fill();
      }
    });
  areia('areia', false);
  areia('areia-topo', true);

  const pedra = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = '#7e7466';
      c.fillRect(0, 0, w, h);
      c.fillStyle = '#6a6154';
      c.beginPath();
      c.ellipse(20, 40, 16, 10, 0.3, 0, Math.PI * 2);
      c.ellipse(48, 18, 12, 8, -0.2, 0, Math.PI * 2);
      c.fill();
      if (topo) {
        // alga verde no topo da pedra de praia
        c.fillStyle = '#5a9a4a';
        c.fillRect(0, 0, w, 7);
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  pedra('pedra-praia', false);
  pedra('pedra-praia-topo', true);

  // Píer de tábuas (plataforma atravessável por baixo)
  tex(scene, 'pier', TILE, 26, (c, w) => {
    c.fillStyle = '#b07a44';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 0, 4, w, 12, 3);
    c.fill();
    c.stroke();
    c.strokeStyle = '#8a5a30';
    c.lineWidth = 2;
    for (const x of [16, 32, 48]) {
      c.beginPath();
      c.moveTo(x, 5);
      c.lineTo(x, 15);
      c.stroke();
    }
    c.fillStyle = '#8a5a30';
    c.fillRect(6, 16, 6, 10);
    c.fillRect(w - 12, 16, 6, 10);
  });

  // Ouriços-do-mar nas pedras (perigo: espinhos)
  tex(scene, 'ouricos', TILE, 48, (c, w, h) => {
    for (const [x, rr] of [
      [18, 11],
      [44, 13],
    ]) {
      c.strokeStyle = '#2a1e3a';
      c.lineWidth = 2;
      for (let k = 0; k < 16; k++) {
        const a = Math.PI + (k / 15) * Math.PI;
        c.beginPath();
        c.moveTo(x, h - 4);
        c.lineTo(x + Math.cos(a) * (rr + 10), h - 4 + Math.sin(a) * (rr + 10));
        c.stroke();
      }
      c.fillStyle = '#3a2a4a';
      c.beginPath();
      c.arc(x, h - 4, rr, Math.PI, 0);
      c.fill();
    }
    void w;
  });

  // Manguezal: lama rica, marrom-escura e brilhante, com tocas de caranguejo
  const lama = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = '#5a4230';
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 211 : 213);
      c.fillStyle = 'rgba(255,255,255,0.12)';
      for (let i = 0; i < 6; i++) {
        c.beginPath();
        c.ellipse(r() * w, r() * h, 6, 2, 0, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = '#6e5238';
        c.fillRect(0, 0, w, 8);
        c.fillStyle = '#2e2218';
        c.beginPath();
        c.ellipse(40, 12, 7, 4, 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  lama('lama-mangue', false);
  lama('lama-mangue-topo', true);

  // Bloco de raízes do mangue (sólido)
  tex(scene, 'raiz-mangue', TILE, TILE, (c, w, h) => {
    c.fillStyle = '#6b4a30';
    c.fillRect(0, 0, w, h);
    c.strokeStyle = '#8a6440';
    c.lineWidth = 6;
    c.lineCap = 'round';
    for (const [x0, x1] of [
      [4, 30],
      [60, 26],
      [20, 56],
    ]) {
      c.beginPath();
      c.moveTo(x0, 0);
      c.quadraticCurveTo((x0 + x1) / 2, h * 0.3, x1, h);
      c.stroke();
    }
  });

  // Galho do mangue (plataforma)
  tex(scene, 'galho-mangue', TILE, 26, (c, w) => {
    c.fillStyle = '#7a5434';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 0, 6, w, 13, 6);
    c.fill();
    c.stroke();
    c.fillStyle = '#4f8a3a';
    for (const x of [14, 42]) {
      c.beginPath();
      c.ellipse(x, 4, 9, 4, 0.3, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Ostras presas nas raízes (perigo: cascas cortantes)
  tex(scene, 'ostras', TILE, 48, (c, w, h) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    for (const [x, y, a] of [
      [14, h - 10, -0.4],
      [32, h - 16, 0.2],
      [50, h - 9, 0.5],
    ]) {
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.fillStyle = '#c9c0b0';
      c.beginPath();
      c.moveTo(-12, 6);
      c.lineTo(-8, -8);
      c.lineTo(0, -12);
      c.lineTo(8, -8);
      c.lineTo(12, 6);
      c.closePath();
      c.fill();
      c.stroke();
      c.strokeStyle = '#8a8070';
      c.beginPath();
      c.moveTo(-6, 2);
      c.lineTo(0, -8);
      c.lineTo(6, 2);
      c.stroke();
      c.strokeStyle = OUTLINE;
      c.restore();
    }
    void w;
  });
}

function coqueiro(c: Ctx, x: number, base: number, alt: number, tronco: string, folha: string) {
  c.strokeStyle = tronco;
  c.lineWidth = alt * 0.07;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x, base);
  c.quadraticCurveTo(x + alt * 0.25, base - alt * 0.5, x + alt * 0.12, base - alt);
  c.stroke();
  c.strokeStyle = folha;
  c.lineWidth = alt * 0.05;
  const tx = x + alt * 0.12;
  const ty = base - alt;
  for (let k = 0; k < 7; k++) {
    const a = -Math.PI + (k / 6) * Math.PI;
    c.beginPath();
    c.moveTo(tx, ty);
    c.quadraticCurveTo(tx + Math.cos(a) * alt * 0.3, ty - alt * 0.12, tx + Math.cos(a) * alt * 0.45, ty + Math.abs(Math.sin(a)) * alt * 0.08 + alt * 0.1);
    c.stroke();
  }
}

function gerarFundo(scene: Phaser.Scene) {
  tex(scene, 'ceu-praia', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#4fa8e8');
    g.addColorStop(1, '#bfe6f7');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Mar azul até o horizonte, com um morro verde e um barquinho
  tex(scene, 'praia-longe', 1024, 320, (c, w, h) => {
    c.fillStyle = '#2f8fcf';
    c.fillRect(0, h - 110, w, 110);
    c.fillStyle = '#4aa8e0';
    for (let y = h - 100; y < h; y += 18) c.fillRect(0, y, w, 3);
    c.fillStyle = '#4f9a4a';
    c.beginPath();
    c.moveTo(640, h - 110);
    c.quadraticCurveTo(700, h - 230, 760, h - 190);
    c.quadraticCurveTo(820, h - 150, 900, h - 110);
    c.closePath();
    c.fill();
    // barquinho (jangada com vela)
    c.fillStyle = '#8a5a30';
    c.fillRect(220, h - 96, 40, 6);
    c.fillStyle = '#f4f0e0';
    c.beginPath();
    c.moveTo(238, h - 96);
    c.lineTo(238, h - 146);
    c.lineTo(262, h - 100);
    c.closePath();
    c.fill();
  });

  // Coqueiros na beira da praia
  tex(scene, 'praia-perto', 1024, 300, (c, w, h) => {
    const r = rng(221);
    c.fillStyle = '#f0d9a4';
    c.fillRect(0, h - 30, w, 30);
    for (let i = 0; i < 4; i++) coqueiro(c, 90 + i * 240 + r() * 50, h - 26, 190 + r() * 40, '#8a6a44', '#3f8a3a');
  });

  // Manguezal ao fundo: copas verdes e água do estuário
  tex(scene, 'mangue-longe', 1024, 320, (c, w, h) => {
    c.fillStyle = '#5f8f9a';
    c.fillRect(0, h - 70, w, 70);
    const r = rng(223);
    c.fillStyle = '#3f7a4a';
    for (let i = 0; i < 14; i++) {
      c.beginPath();
      c.ellipse(i * 78 + r() * 30, h - 90, 60, 34 + r() * 16, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Árvores de mangue com raízes em arco (raízes-escora)
  tex(scene, 'mangue-perto', 1024, 300, (c, w, h) => {
    const r = rng(227);
    for (let i = 0; i < 5; i++) {
      const x = 90 + i * 205 + r() * 30;
      c.strokeStyle = '#5a4230';
      c.lineWidth = 5;
      for (let k = -2; k <= 2; k++) {
        c.beginPath();
        c.moveTo(x, h - 120);
        c.quadraticCurveTo(x + k * 22, h - 70, x + k * 34, h - 10);
        c.stroke();
      }
      c.lineWidth = 10;
      c.beginPath();
      c.moveTo(x, h - 120);
      c.lineTo(x, h - 190);
      c.stroke();
      c.fillStyle = '#2f6a3a';
      c.beginPath();
      c.ellipse(x, h - 205, 80, 46, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = 'rgba(95,143,154,0.6)';
    c.fillRect(0, h - 14, w, 14);
  });
}

function gerarObjetos(scene: Phaser.Scene) {
  // Jangada do Vovô Marcos (plataforma que se move)
  tex(scene, 'jangada', 140, 34, (c, w, h) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      c.fillStyle = i % 2 ? '#b07a44' : '#c48c52';
      rrect(c, 4 + i * 22, 6, 22, h - 12, 8);
      c.fill();
      c.stroke();
    }
    c.strokeStyle = '#6b4a2a';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(4, h / 2);
    c.lineTo(w - 4, h / 2);
    c.stroke();
  });

  // Rastro de tartaruga-marinha na areia (as nadadeiras deixam marcas dos dois lados)
  tex(scene, 'rastro-tartaruga', TILE, 16, (c) => {
    c.fillStyle = 'rgba(150,120,70,0.5)';
    c.fillRect(0, 6, 64, 4);
    for (let x = 4; x < 64; x += 12) {
      c.fillRect(x, 1, 5, 4);
      c.fillRect(x + 6, 11, 5, 4);
    }
  });

  // Lixo trazido pelo mar
  tex(scene, 'lixo-garrafa', 30, 40, (c) => {
    c.fillStyle = 'rgba(120,200,160,0.85)';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    rrect(c, 6, 12, 18, 26, 6);
    c.fill();
    c.stroke();
    c.fillStyle = '#3a8a5a';
    c.fillRect(11, 3, 8, 10);
    c.strokeRect(11, 3, 8, 10);
  });
  tex(scene, 'lixo-lata', 30, 36, (c) => {
    c.fillStyle = '#d9434b';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    rrect(c, 5, 4, 20, 28, 4);
    c.fill();
    c.stroke();
    c.fillStyle = '#c9ced6';
    c.fillRect(6, 5, 18, 5);
  });
  tex(scene, 'lixo-rede', 40, 30, (c) => {
    c.strokeStyle = '#2f7d7a';
    c.lineWidth = 2;
    for (let k = 0; k < 5; k++) {
      c.beginPath();
      c.moveTo(4 + k * 8, 4);
      c.lineTo(10 + k * 6, 26);
      c.moveTo(4, 6 + k * 5);
      c.lineTo(36, 4 + k * 5);
      c.stroke();
    }
  });

  // Selo da Praia: sol, mar e um coqueiro
  tex(scene, 'selo-praia', 130, 130, (c) => {
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
    c.save();
    c.beginPath();
    c.arc(65, 65, 36, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#7fc6f0';
    c.fillRect(20, 20, 90, 90);
    c.fillStyle = '#ffd766';
    c.beginPath();
    c.arc(82, 52, 10, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2f8fcf';
    c.fillRect(20, 72, 90, 14);
    c.fillStyle = '#f0d9a4';
    c.fillRect(20, 86, 90, 30);
    coqueiro(c, 44, 92, 52, '#8a6a44', '#3f8a3a');
    c.restore();
    c.lineWidth = 3;
    c.beginPath();
    c.arc(65, 65, 36, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = '#f2b93b';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      c.beginPath();
      c.arc(65 + Math.cos(a) * 52, 65 + Math.sin(a) * 52, 5, 0, Math.PI * 2);
      c.fill();
    }
  });
}

function gerarBichos(scene: Phaser.Scene) {
  const texBicho = (key: string, w: number, h: number, draw: (c: Ctx, w: number, h: number) => void) => {
    tex(scene, key, w, h, draw);
    tex(scene, `${key}-hd`, w * 3, h * 3, (c) => {
      c.scale(3, 3);
      draw(c, w, h);
    });
  };
  const olho = (c: Ctx, x: number, y: number, r = 2.4) => {
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(x + r * 0.35, y - r * 0.35, r * 0.35, 0, Math.PI * 2);
    c.fill();
  };

  // Tartaruga-de-pente (Eretmochelys imbricata): casco com placas sobrepostas âmbar e marrom, bico pontudo.
  texBicho('tartaruga', 120, 60, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#c9a060';
    // nadadeiras
    for (const [x, y, a] of [
      [30, 44, 0.6],
      [86, 46, -0.5],
    ]) {
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.beginPath();
      c.ellipse(0, 0, 18, 7, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.restore();
    }
    c.beginPath();
    c.arc(100, 32, 12, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#3a2a1a';
    c.beginPath();
    c.moveTo(110, 30);
    c.lineTo(118, 34);
    c.lineTo(109, 37);
    c.closePath();
    c.fill();
    olho(c, 102, 28, 2.2);
    // casco
    c.fillStyle = '#9a5a2a';
    c.beginPath();
    c.ellipse(58, 32, 40, 22, 0, Math.PI, 0);
    c.lineTo(98, 38);
    c.lineTo(18, 38);
    c.closePath();
    c.fill();
    c.stroke();
    // placas âmbar
    c.fillStyle = '#e0a040';
    for (const [x, y] of [
      [40, 22],
      [58, 16],
      [76, 22],
      [48, 32],
      [68, 32],
    ]) {
      c.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        c.lineTo(x + Math.cos(a) * 7, y + Math.sin(a) * 6);
      }
      c.closePath();
      c.fill();
    }
  });

  // Peixe-boi-marinho (Trichechus manatus): corpo cinza arredondado, sem nadadeira dorsal, cauda larga como pá.
  texBicho('peixe-boi', 180, 70, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#8a8c90';
    c.beginPath();
    c.ellipse(20, 38, 20, 16, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(92, 38, 70, 26, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(152, 36, 24, 18, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#9a9ca0';
    c.beginPath();
    c.ellipse(170, 40, 10, 9, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#7a7c80';
    c.beginPath();
    c.ellipse(118, 58, 12, 6, 0.4, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    olho(c, 156, 30, 2);
  });

  // Golfinho-rotador (Stenella longirostris): corpo curvo, bico comprido e fino, nadadeira das costas curvada
  // para trás, cauda com duas pontas na horizontal; dorso escuro, faixa cinza-clara no lado e barriga branca.
  texBicho('golfinho', 150, 60, (c) => {
    const corpo = () => {
      c.beginPath();
      c.moveTo(147, 36);
      c.quadraticCurveTo(138, 32, 129, 31); // bico
      c.quadraticCurveTo(125, 21, 110, 19); // testa (melão)
      c.quadraticCurveTo(96, 16, 86, 17);
      c.quadraticCurveTo(80, 9, 72, 3); // frente da nadadeira das costas
      c.quadraticCurveTo(72, 12, 64, 20); // trás da nadadeira, curvada
      c.quadraticCurveTo(40, 23, 22, 30);
      c.lineTo(4, 20); // cauda
      c.quadraticCurveTo(10, 31, 12, 33);
      c.quadraticCurveTo(10, 36, 4, 46);
      c.lineTo(22, 36);
      c.quadraticCurveTo(60, 51, 100, 45); // barriga
      c.quadraticCurveTo(122, 42, 132, 39);
      c.quadraticCurveTo(140, 38, 147, 36);
      c.closePath();
    };
    c.lineJoin = 'round';
    c.fillStyle = '#4f5f73';
    corpo();
    c.fill();
    c.save();
    corpo();
    c.clip();
    c.fillStyle = '#8e9db0';
    c.beginPath();
    c.ellipse(78, 38, 58, 7, 0.04, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#eef2f4';
    c.beginPath();
    c.ellipse(90, 48, 46, 6, -0.05, 0, Math.PI * 2);
    c.fill();
    c.restore();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    corpo();
    c.stroke();
    // nadadeira do peito
    c.fillStyle = '#4f5f73';
    c.beginPath();
    c.moveTo(104, 41);
    c.quadraticCurveTo(98, 50, 90, 55);
    c.quadraticCurveTo(92, 47, 95, 41);
    c.closePath();
    c.fill();
    c.stroke();
    // boca e olho
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(145, 36.5);
    c.quadraticCurveTo(136, 37, 128, 35);
    c.stroke();
    olho(c, 122, 29, 2);
  });

  // Caranguejo-uçá (Ucides cordatus): casco azulado-marrom, patas peludas alaranjadas, garras fortes.
  texBicho('caranguejo', 90, 56, (c) => {
    c.strokeStyle = '#b8683a';
    c.lineWidth = 4;
    c.lineCap = 'round';
    for (const d of [-1, 1]) {
      for (let k = 0; k < 3; k++) {
        c.beginPath();
        c.moveTo(45 + d * 16, 34 + k * 4);
        c.lineTo(45 + d * 34, 38 + k * 6);
        c.lineTo(45 + d * 40, 52);
        c.stroke();
      }
    }
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#4a6a8a';
    c.beginPath();
    c.ellipse(45, 30, 24, 16, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#c47a4a';
    for (const d of [-1, 1]) {
      c.beginPath();
      c.ellipse(45 + d * 28, 18, 9, 7, d * 0.4, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    for (const x of [38, 52]) {
      c.strokeStyle = OUTLINE;
      c.beginPath();
      c.moveTo(x, 18);
      c.lineTo(x, 9);
      c.stroke();
      olho(c, x, 8, 2.8);
    }
  });

  // Cavalo-marinho-de-focinho-longo (Hippocampus reidi): em pé, cabeça dobrada para a frente, focinho em tubo,
  // barriga para a frente, anéis no corpo, nadadeira nas costas e cauda enrolada que segura.
  texBicho('cavalo-marinho', 56, 96, (c) => {
    c.lineJoin = 'round';
    c.lineCap = 'round';
    // cauda enrolada para a frente
    c.strokeStyle = OUTLINE;
    c.lineWidth = 11;
    const cauda = () => {
      c.beginPath();
      c.moveTo(22, 62);
      c.quadraticCurveTo(14, 78, 22, 88);
      c.quadraticCurveTo(32, 94, 36, 86);
      c.quadraticCurveTo(38, 79, 30, 79);
    };
    cauda();
    c.stroke();
    c.strokeStyle = '#f2b43a';
    c.lineWidth = 6;
    cauda();
    c.stroke();
    // nadadeira das costas (transparente)
    c.fillStyle = 'rgba(255, 236, 180, 0.9)';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(12, 38);
    c.quadraticCurveTo(0, 44, 8, 54);
    c.lineTo(13, 52);
    c.closePath();
    c.fill();
    c.stroke();
    // corpo e cabeça
    const corpo = () => {
      c.beginPath();
      c.moveTo(16, 10); // nuca
      c.quadraticCurveTo(8, 22, 12, 34); // costas
      c.quadraticCurveTo(14, 52, 20, 64);
      c.lineTo(28, 64);
      c.quadraticCurveTo(42, 52, 38, 38); // barriga para a frente
      c.quadraticCurveTo(35, 28, 30, 24); // peito
      c.lineTo(32, 20); // queixo
      c.quadraticCurveTo(32, 8, 22, 6); // alto da cabeça
      c.closePath();
    };
    c.fillStyle = '#f2b43a';
    corpo();
    c.fill();
    c.lineWidth = 3;
    corpo();
    c.stroke();
    // coroinha
    c.fillStyle = '#f2b43a';
    c.beginPath();
    c.moveTo(16, 8);
    c.lineTo(18, 1);
    c.lineTo(22, 6);
    c.closePath();
    c.fill();
    c.stroke();
    // focinho em tubo, com a boquinha na ponta
    c.beginPath();
    c.moveTo(29, 13);
    c.lineTo(49, 17);
    c.lineTo(50, 23);
    c.lineTo(31, 21);
    c.closePath();
    c.fill();
    c.stroke();
    // anéis
    c.strokeStyle = '#c9781f';
    c.lineWidth = 2;
    for (let k = 0; k < 6; k++) {
      const y = 30 + k * 6;
      c.beginPath();
      c.moveTo(14 + k * 0.6, y);
      c.quadraticCurveTo(26, y + 3, 36 - k * 0.8, y - 1);
      c.stroke();
    }
    olho(c, 24, 13, 2.4);
  });
}
