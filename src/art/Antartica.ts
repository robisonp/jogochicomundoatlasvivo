// Arte do Mundo 6 — Antártica e Oceano Austral, desenhada por código.
// Dossiê (ambiente): geleiras, mar com gelo flutuante, montanhas e rochas costeiras.
// Cuidados: sem ursos-polares, sem iglus, sem povos nativos (não há população humana nativa na Antártida).
import Phaser from 'phaser';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';

export function gerarAntartica(scene: Phaser.Scene) {
  gerarCenario(scene);
  gerarBichos(scene);
}

function gerarCenario(scene: Phaser.Scene) {
  tex(scene, 'ceu-antartica', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#7fb3de');
    g.addColorStop(0.7, '#d7e8f4');
    g.addColorStop(1, '#eef5fa');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Geleiras e icebergs tabulares (de topo reto) no mar
  tex(scene, 'antartica-longe', 1024, 320, (c, w, h) => {
    const r = rng(181);
    c.fillStyle = '#c9d9e8';
    c.beginPath();
    c.moveTo(0, h);
    let x = 0;
    while (x <= w) {
      c.lineTo(x + 60, h - 150 - r() * 60);
      c.lineTo(x + 130, h - 90);
      x += 130;
    }
    c.lineTo(w, h);
    c.closePath();
    c.fill();
    c.fillStyle = '#7fa6c4';
    c.fillRect(0, h - 60, w, 60);
    for (const [ix, lw, lh] of [
      [80, 160, 40],
      [420, 120, 30],
      [760, 190, 46],
    ]) {
      c.fillStyle = '#f4f8fc';
      c.fillRect(ix, h - 60 - lh, lw, lh);
      c.fillStyle = '#b9d3e6';
      c.fillRect(ix, h - 60 - 8, lw, 8);
    }
  });

  // Costa: neve, rochas escuras e montinhos de gelo (quase sem plantas)
  tex(scene, 'antartica-perto', 1024, 220, (c, w, h) => {
    const r = rng(183);
    c.fillStyle = '#e8f0f7';
    c.fillRect(0, h - 40, w, 40);
    for (let i = 0; i < 8; i++) {
      const x = 40 + i * 125 + r() * 40;
      c.fillStyle = '#5f6875';
      c.beginPath();
      c.moveTo(x - 50, h - 38);
      c.lineTo(x - 20, h - 90 - r() * 40);
      c.lineTo(x + 30, h - 70 - r() * 30);
      c.lineTo(x + 55, h - 38);
      c.closePath();
      c.fill();
      c.fillStyle = '#f4f8fc';
      c.beginPath();
      c.ellipse(x - 5, h - 40, 48, 12, 0, Math.PI, 0);
      c.fill();
    }
  });

  // Rastros de pinguim: pezinhos e a marca da barriga deslizando
  tex(scene, 'rastro-pinguim', 64, 16, (c) => {
    c.fillStyle = 'rgba(110,140,170,0.5)';
    for (const x of [8, 22]) {
      c.beginPath();
      c.moveTo(x, 12);
      c.lineTo(x - 4, 4);
      c.moveTo(x, 12);
      c.lineTo(x + 4, 4);
      c.lineWidth = 2;
      c.strokeStyle = 'rgba(110,140,170,0.6)';
      c.stroke();
    }
    rrect(c, 32, 6, 30, 7, 3.5);
    c.fill();
  });

  // Estação de pesquisa (módulos coloridos sobre pilares, como as estações de verdade)
  tex(scene, 'estacao', 200, 150, (c, w, h) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#6b7380';
    for (const x of [24, 90, 156]) {
      c.fillRect(x, h - 40, 10, 40);
      c.strokeRect(x, h - 40, 10, 40);
    }
    for (const [x, y, lw, cor] of [
      [8, 60, 110, '#e8743b'],
      [104, 44, 88, '#5cc26a'],
    ] as const) {
      c.fillStyle = cor;
      rrect(c, x, y, lw, 50, 8);
      c.fill();
      c.stroke();
      c.fillStyle = '#bfe3f2';
      for (let k = 0; k < Math.floor(lw / 28); k++) {
        rrect(c, x + 10 + k * 28, y + 14, 16, 14, 3);
        c.fill();
        c.stroke();
      }
    }
    // antena e bandeira sem país (branca, da ciência)
    c.beginPath();
    c.moveTo(170, 44);
    c.lineTo(170, 6);
    c.stroke();
    c.fillStyle = '#ffffff';
    c.fillRect(170, 6, 22, 14);
    c.strokeRect(170, 6, 22, 14);
    c.fillStyle = '#f4f8fc';
    c.fillRect(0, h - 8, w, 8);
    c.fillStyle = '#ffffff';
    rrect(c, 8, 56, 110, 8, 4);
    c.fill();
  });

  // Submarino do Vovô Marcos: casco amarelo com uma cúpula transparente (o Chico aparece dentro)
  tex(scene, 'submarino', 150, 130, (c, w, h) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    // cúpula
    c.fillStyle = 'rgba(190,230,250,0.28)';
    c.beginPath();
    c.arc(w / 2, 66, 58, Math.PI, 0);
    c.lineTo(w / 2 + 58, 92);
    c.lineTo(w / 2 - 58, 92);
    c.closePath();
    c.fill();
    c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.8)';
    c.lineWidth = 4;
    c.beginPath();
    c.arc(w / 2, 66, 46, Math.PI * 1.15, Math.PI * 1.45);
    c.stroke();
    // casco
    c.strokeStyle = OUTLINE;
    c.fillStyle = '#f2c230';
    rrect(c, 6, 88, w - 12, 34, 16);
    c.fill();
    c.stroke();
    c.fillStyle = '#e0a020';
    for (const x of [30, 60, 90, 120]) {
      c.beginPath();
      c.arc(x, 105, 5, 0, Math.PI * 2);
      c.fill();
    }
    // hélice
    c.fillStyle = '#8a8a8a';
    c.beginPath();
    c.ellipse(4, 105, 5, 14, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    void h;
  });

  // Selo da Antártica: pinguim-de-adélia no gelo
  tex(scene, 'selo-antartica', 130, 130, (c) => {
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
    c.fillStyle = '#9cc8e8';
    c.fillRect(20, 20, 90, 90);
    c.fillStyle = '#f4f8fc';
    c.fillRect(20, 84, 90, 30);
    pinguim(c, 65, 88, 0.55);
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

/** Pinguim-de-adélia de pé, pés em (x, base). */
function pinguim(c: Ctx, x: number, base: number, s: number) {
  c.save();
  c.translate(x, base);
  c.scale(s, s);
  c.strokeStyle = OUTLINE;
  c.lineWidth = 3;
  c.fillStyle = '#f2a23b';
  for (const dx of [-12, 8]) {
    c.beginPath();
    c.ellipse(dx, -3, 9, 4, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }
  // corpo preto nas costas, barriga branca
  c.fillStyle = '#1f2330';
  c.beginPath();
  c.ellipse(0, -40, 26, 38, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = '#fbfbf8';
  c.beginPath();
  c.ellipse(6, -34, 17, 28, 0, 0, Math.PI * 2);
  c.fill();
  // cabeça preta com o anel branco em volta do olho (marca do adélia)
  c.fillStyle = '#1f2330';
  c.beginPath();
  c.arc(4, -80, 18, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.arc(10, -83, 6, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#1d140e';
  c.beginPath();
  c.arc(11, -83, 3, 0, Math.PI * 2);
  c.fill();
  // bico curto
  c.fillStyle = '#2a2a2a';
  c.beginPath();
  c.moveTo(20, -80);
  c.lineTo(30, -77);
  c.lineTo(20, -74);
  c.closePath();
  c.fill();
  // asa-nadadeira
  c.fillStyle = '#1f2330';
  c.beginPath();
  c.ellipse(-20, -42, 7, 22, 0.25, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.restore();
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

  // Pinguim-de-adélia (Pygoscelis adeliae)
  texBicho('pinguim', 70, 110, (c, w, h) => pinguim(c, w / 2 - 4, h - 4, 1));

  // Foca-de-weddell (Leptonychotes weddellii): corpo comprido cinza-escuro com manchas claras, cabeça pequena, "sorriso".
  texBicho('foca-de-weddell', 170, 60, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#5a6472';
    c.beginPath();
    c.moveTo(6, 36);
    c.lineTo(24, 26);
    c.lineTo(24, 46);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(82, 36, 62, 20, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(146, 30, 15, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    const r = rng(191);
    c.fillStyle = '#9aa6b3';
    for (let i = 0; i < 14; i++) {
      c.beginPath();
      c.ellipse(34 + r() * 96, 24 + r() * 20, 5, 3, r(), 0, Math.PI * 2);
      c.fill();
    }
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    c.beginPath();
    c.arc(152, 34, 6, 0.1 * Math.PI, 0.8 * Math.PI);
    c.stroke();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(160, 31, 2.5, 0, Math.PI * 2);
    c.fill();
    olho(c, 150, 25, 3);
  });

  // Orca (Orcinus orca): preta e branca, mancha branca atrás do olho, nadadeira dorsal alta.
  texBicho('orca', 210, 100, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#1f2330';
    // nadadeira dorsal
    c.beginPath();
    c.moveTo(92, 38);
    c.lineTo(104, 4);
    c.lineTo(118, 40);
    c.closePath();
    c.fill();
    c.stroke();
    // cauda
    c.beginPath();
    c.moveTo(20, 58);
    c.lineTo(2, 40);
    c.lineTo(8, 60);
    c.lineTo(2, 80);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(108, 60, 92, 26, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#fbfbf8';
    c.beginPath();
    c.ellipse(130, 74, 60, 10, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(170, 50, 12, 6, -0.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#c9ced6';
    c.beginPath();
    c.ellipse(80, 50, 16, 6, 0, 0, Math.PI * 2);
    c.fill();
    olho(c, 160, 56, 2.4);
  });

  // Baleia-jubarte (Megaptera novaeangliae): enorme, nadadeiras peitorais muito longas e claras, calombos na cabeça.
  texBicho('jubarte', 290, 110, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#3f4a5a';
    c.beginPath();
    c.moveTo(30, 58);
    c.lineTo(4, 32);
    c.lineTo(14, 58);
    c.lineTo(4, 86);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(150, 58, 126, 30, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // barriga com sulcos
    c.fillStyle = '#d9dee6';
    c.beginPath();
    c.ellipse(190, 76, 80, 10, 0, 0, Math.PI);
    c.fill();
    c.strokeStyle = '#9aa6b3';
    c.lineWidth = 1.5;
    for (let x = 130; x < 260; x += 10) {
      c.beginPath();
      c.moveTo(x, 72);
      c.lineTo(x + 6, 84);
      c.stroke();
    }
    // nadadeira peitoral longa e clara
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#e8ecf2';
    c.beginPath();
    c.moveTo(190, 70);
    c.quadraticCurveTo(150, 104, 110, 106);
    c.quadraticCurveTo(150, 92, 176, 66);
    c.closePath();
    c.fill();
    c.stroke();
    // calombos na cabeça
    c.fillStyle = '#56627a';
    for (const x of [240, 252, 262]) {
      c.beginPath();
      c.arc(x, 40, 3, 0, Math.PI * 2);
      c.fill();
    }
    olho(c, 246, 60, 2.6);
  });

  // Albatroz-errante (Diomedea exulans): corpo branco, asas enormes e compridas com pontas escuras (planando).
  texBicho('albatroz', 240, 80, (c, w) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    // asas abertas
    c.fillStyle = '#fbfbf8';
    c.beginPath();
    c.moveTo(w / 2 - 10, 40);
    c.quadraticCurveTo(60, 18, 4, 30);
    c.quadraticCurveTo(60, 40, w / 2 - 10, 52);
    c.moveTo(w / 2 + 10, 40);
    c.quadraticCurveTo(w - 60, 18, w - 4, 30);
    c.quadraticCurveTo(w - 60, 40, w / 2 + 10, 52);
    c.fill();
    c.stroke();
    c.fillStyle = '#2a2a2a';
    c.beginPath();
    c.moveTo(4, 30);
    c.quadraticCurveTo(24, 26, 40, 30);
    c.quadraticCurveTo(24, 35, 4, 30);
    c.moveTo(w - 4, 30);
    c.quadraticCurveTo(w - 24, 26, w - 40, 30);
    c.quadraticCurveTo(w - 24, 35, w - 4, 30);
    c.fill();
    // corpo e cabeça
    c.fillStyle = '#fbfbf8';
    c.beginPath();
    c.ellipse(w / 2, 48, 30, 12, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(w / 2 + 32, 44, 10, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // bico rosado
    c.fillStyle = '#f0b8a0';
    c.beginPath();
    c.moveTo(w / 2 + 40, 42);
    c.lineTo(w / 2 + 58, 46);
    c.lineTo(w / 2 + 40, 50);
    c.closePath();
    c.fill();
    c.stroke();
    olho(c, w / 2 + 34, 41, 2);
  });
}
