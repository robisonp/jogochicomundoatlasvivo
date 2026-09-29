// Arte do Mundo 5 — Ártico, desenhada por código.
// Dossiê (ambiente): tundra baixa, neve e gelo, mar com placas de gelo; no verão, o sol da meia-noite.
// Sem pinguins: eles não vivem no Ártico.
import Phaser from 'phaser';
import { TILE } from '../config';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';

const K = {
  neve: '#f4f8fc',
  neveSombra: '#d6e4f0',
  neveFunda: '#b9cde0',
  gelo: '#bfe6f5',
  geloClaro: '#e6f7fd',
  geloEscuro: '#86c3de',
  rocha: '#7d8794',
  rochaEscura: '#5f6875',
  tundra: '#8a9a5b',
  tundraEscura: '#6b7a42',
};

export function gerarArtico(scene: Phaser.Scene) {
  gerarChao(scene);
  gerarFundo(scene);
  gerarBichos(scene);
}

function gerarChao(scene: Phaser.Scene) {
  // Chão de neve firme (neve compactada sobre a terra congelada)
  const neve = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, K.neveSombra);
      g.addColorStop(1, K.neveFunda);
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 151 : 153);
      c.fillStyle = 'rgba(255,255,255,0.5)';
      for (let i = 0; i < 6; i++) {
        c.beginPath();
        c.ellipse(r() * w, (topo ? 18 : 0) + r() * (h - 18), 5 + r() * 6, 2 + r() * 2, 0, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = K.neve;
        c.beginPath();
        c.moveTo(0, 16);
        for (let x = 0; x <= w; x += 16) c.quadraticCurveTo(x + 8, 22, x + 16, 16);
        c.lineTo(w, 0);
        c.lineTo(0, 0);
        c.closePath();
        c.fill();
        c.strokeStyle = '#7f98b0';
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  neve('neve', false);
  neve('neve-topo', true);

  // Rocha escura com neve em cima
  const rocha = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = K.rocha;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = K.rochaEscura;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(6, 20);
      c.lineTo(26, 30);
      c.lineTo(22, 52);
      c.moveTo(40, 10);
      c.lineTo(50, 34);
      c.lineTo(60, 40);
      c.stroke();
      if (topo) {
        c.fillStyle = K.neve;
        c.beginPath();
        c.moveTo(0, 12);
        c.quadraticCurveTo(16, 20, 32, 12);
        c.quadraticCurveTo(48, 4, 64, 14);
        c.lineTo(w, 0);
        c.lineTo(0, 0);
        c.closePath();
        c.fill();
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  rocha('rocha-artica', false);
  rocha('rocha-artica-topo', true);

  // Gelo liso (escorrega): azul claro com brilhos em diagonal
  const gelo = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, K.geloClaro);
      g.addColorStop(1, K.gelo);
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(255,255,255,0.85)';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(10, 40);
      c.lineTo(26, 24);
      c.moveTo(34, 54);
      c.lineTo(56, 32);
      c.stroke();
      c.strokeStyle = K.geloEscuro;
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(44, 8);
      c.lineTo(52, 18);
      c.stroke();
      if (topo) {
        c.fillStyle = '#ffffff';
        c.fillRect(0, 0, w, 5);
        c.strokeStyle = K.geloEscuro;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  gelo('gelo', false);
  gelo('gelo-topo', true);

  // Neve fofa: montinho macio e pontilhado — o mergulho da raposa quebra
  const fofa = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = '#ffffff';
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 157 : 159);
      c.fillStyle = '#e3edf6';
      for (let i = 0; i < 10; i++) {
        c.beginPath();
        c.arc(r() * w, r() * h, 3 + r() * 5, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = '#bcd4ea';
      for (let i = 0; i < 12; i++) {
        c.beginPath();
        c.arc(r() * w, r() * h, 1.2, 0, Math.PI * 2);
        c.fill();
      }
      // borda pontilhada: "dá para quebrar"
      c.strokeStyle = 'rgba(120,160,200,0.7)';
      c.setLineDash([5, 5]);
      c.lineWidth = 2;
      c.strokeRect(3, 3, w - 6, h - 6);
      c.setLineDash([]);
      if (topo) {
        c.fillStyle = '#ffffff';
        for (let x = 6; x < w; x += 14) {
          c.beginPath();
          c.arc(x, 4, 7, Math.PI, 0);
          c.fill();
        }
      }
    });
  fofa('neve-fofa', false);
  fofa('neve-fofa-topo', true);

  // Borda de gelo (atravessável por baixo)
  tex(scene, 'laje-gelo', TILE, 26, (c, w) => {
    c.fillStyle = K.gelo;
    c.strokeStyle = K.geloEscuro;
    c.lineWidth = 3;
    rrect(c, 0, 4, w, 16, 7);
    c.fill();
    c.stroke();
    c.fillStyle = '#ffffff';
    c.fillRect(4, 6, w - 8, 4);
    // pingentes de gelo embaixo
    c.fillStyle = K.geloClaro;
    for (const x of [12, 30, 50]) {
      c.beginPath();
      c.moveTo(x - 4, 19);
      c.lineTo(x, 26);
      c.lineTo(x + 4, 19);
      c.closePath();
      c.fill();
    }
  });

  // Placa de gelo boiando (plataforma que se move)
  tex(scene, 'placa-gelo', 140, 34, (c, w, h) => {
    c.fillStyle = '#ffffff';
    c.strokeStyle = K.geloEscuro;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(6, 8);
    c.lineTo(40, 3);
    c.lineTo(96, 5);
    c.lineTo(134, 9);
    c.lineTo(130, h - 6);
    c.lineTo(8, h - 5);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = K.gelo;
    c.fillRect(12, h - 14, w - 26, 7);
  });

  // Gelo quebrado pontudo (perigo)
  tex(scene, 'gelo-pontudo', TILE, 48, (c, w, h) => {
    c.strokeStyle = K.geloEscuro;
    c.lineWidth = 2.5;
    for (const [x, alt, larg] of [
      [14, 30, 11],
      [30, 42, 12],
      [47, 34, 11],
    ]) {
      const g = c.createLinearGradient(x, h - alt, x, h);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(1, K.gelo);
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(x - larg, h);
      c.lineTo(x, h - alt);
      c.lineTo(x + larg, h);
      c.closePath();
      c.fill();
      c.stroke();
    }
    void w;
  });

  // Pegadas de urso-polar na neve (patas largas)
  tex(scene, 'rastro-urso', TILE, 16, (c) => {
    c.fillStyle = 'rgba(110,140,170,0.55)';
    for (const [x, y] of [
      [16, 9],
      [46, 6],
    ]) {
      c.beginPath();
      c.ellipse(x, y + 2, 7, 5, 0, 0, Math.PI * 2);
      c.fill();
      for (let k = -2; k <= 2; k++) {
        c.beginPath();
        c.arc(x + k * 3.2, y - 4, 1.8, 0, Math.PI * 2);
        c.fill();
      }
    }
  });

  // Fundo de caverna de gelo (atrás dos túneis e da neve fofa que quebra)
  tex(scene, 'caverna-gelo', TILE, TILE, (c, w, h) => {
    c.fillStyle = '#5b7fa0';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#6d92b3';
    c.beginPath();
    c.moveTo(0, 20);
    c.lineTo(22, 8);
    c.lineTo(40, 26);
    c.lineTo(64, 12);
    c.lineTo(64, 40);
    c.lineTo(30, 52);
    c.lineTo(0, 44);
    c.closePath();
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.25)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(10, 30);
    c.lineTo(20, 22);
    c.moveTo(44, 44);
    c.lineTo(56, 34);
    c.stroke();
  });

  tex(scene, 'floco', 10, 10, (c) => {
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(5, 5, 4, 0, Math.PI * 2);
    c.fill();
  });
}

function gerarFundo(scene: Phaser.Scene) {
  // Céu do sol da meia-noite: azul lá em cima, dourado perto do horizonte
  tex(scene, 'ceu-artico', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#6fa8dc');
    g.addColorStop(0.6, '#cfe3f2');
    g.addColorStop(1, '#ffd9a0');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Montanhas com neve e uma geleira
  tex(scene, 'artico-longe', 1024, 320, (c, w, h) => {
    const r = rng(161);
    for (const [cor, alt, seed] of [
      ['#b8c8da', 150, 0],
      ['#9fb3c9', 100, 1],
    ] as const) {
      c.fillStyle = cor;
      c.beginPath();
      c.moveTo(0, h);
      let x = 0;
      while (x <= w) {
        const pico = alt + r() * 70 - seed * 10;
        c.lineTo(x + 50, h - pico);
        c.lineTo(x + 110, h - alt * 0.45);
        x += 110;
      }
      c.lineTo(w, h);
      c.closePath();
      c.fill();
    }
    // neve nos picos
    c.fillStyle = '#f4f8fc';
    const r2 = rng(163);
    for (let x = 50; x < w; x += 110) {
      const pico = 150 + r2() * 70;
      c.beginPath();
      c.moveTo(x - 18, h - pico + 36);
      c.lineTo(x, h - pico + 4);
      c.lineTo(x + 20, h - pico + 38);
      c.closePath();
      c.fill();
    }
    c.fillStyle = '#e8f1f8';
    c.fillRect(0, h - 40, w, 40);
  });

  // Tundra: arbustos baixos, capim e montinhos de neve
  tex(scene, 'artico-perto', 1024, 240, (c, w, h) => {
    const r = rng(167);
    c.fillStyle = K.tundra;
    c.fillRect(0, h - 40, w, 40);
    for (let i = 0; i < 26; i++) {
      c.fillStyle = r() > 0.5 ? K.tundraEscura : '#a0873c';
      c.beginPath();
      c.ellipse(r() * w, h - 40, 10 + r() * 16, 7 + r() * 8, 0, Math.PI, 0);
      c.fill();
    }
    c.fillStyle = '#f4f8fc';
    for (let i = 0; i < 9; i++) {
      c.beginPath();
      c.ellipse(40 + i * 115 + r() * 30, h - 36, 40 + r() * 20, 14, 0, Math.PI, 0);
      c.fill();
    }
  });

  // Selo do Ártico: o sol da meia-noite sobre o gelo
  tex(scene, 'selo-artico', 130, 130, (c) => {
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
    const ceu = c.createLinearGradient(0, 30, 0, 100);
    ceu.addColorStop(0, '#8fbfe6');
    ceu.addColorStop(1, '#ffd9a0');
    c.fillStyle = ceu;
    c.fillRect(20, 20, 90, 90);
    c.fillStyle = '#ffb347';
    c.beginPath();
    c.arc(65, 78, 12, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#f4f8fc';
    c.fillRect(20, 80, 90, 30);
    c.fillStyle = K.gelo;
    c.beginPath();
    c.moveTo(30, 90);
    c.lineTo(52, 86);
    c.lineTo(58, 94);
    c.lineTo(34, 96);
    c.closePath();
    c.fill();
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

  // Urso-polar (Ursus maritimus): grande, pelagem creme, patas largas, cabeça comprida e pequena.
  texBicho('urso-polar', 170, 100, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3.5;
    c.fillStyle = '#f3ede0';
    for (const x of [30, 54, 104, 128]) {
      rrect(c, x, 62, 22, 34, 9);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(82, 54, 62, 32, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // pescoço comprido e cabeça
    c.beginPath();
    c.moveTo(128, 40);
    c.quadraticCurveTo(146, 34, 152, 44);
    c.lineTo(166, 50);
    c.quadraticCurveTo(168, 60, 156, 62);
    c.lineTo(132, 64);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(140, 36, 5, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.ellipse(166, 53, 3.5, 3, 0, 0, Math.PI * 2);
    c.fill();
    olho(c, 152, 45, 2.3);
    c.fillStyle = '#e2dac8';
    c.beginPath();
    c.ellipse(80, 72, 40, 8, 0, 0, Math.PI);
    c.fill();
  });

  // Raposa-do-ártico (Vulpes lagopus): pelagem branca de inverno, focinho curto, orelhas pequenas, cauda fofa.
  texBicho('raposa-artica', 110, 64, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#fbfbf8';
    // cauda fofa
    c.beginPath();
    c.ellipse(18, 30, 18, 11, -0.5, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    for (const x of [34, 44, 70, 80]) {
      rrect(c, x, 40, 8, 22, 4);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(58, 36, 30, 14, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(90, 26, 12, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.moveTo(96, 24);
    c.lineTo(108, 29);
    c.lineTo(96, 33);
    c.closePath();
    c.fill();
    c.stroke();
    for (const x of [84, 94]) {
      c.beginPath();
      c.moveTo(x - 5, 17);
      c.lineTo(x, 7);
      c.lineTo(x + 5, 17);
      c.closePath();
      c.fill();
      c.stroke();
    }
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(107, 29, 2.2, 0, Math.PI * 2);
    c.fill();
    olho(c, 94, 23, 2.2);
  });

  // Rena / caribu (Rangifer tarandus): galhadas grandes, pescoço claro, casco largo.
  texBicho('rena', 140, 140, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#8a6a4e';
    for (const x of [32, 46, 90, 104]) {
      rrect(c, x, 88, 10, 48, 4);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(70, 82, 46, 22, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#e8e0cf';
    c.beginPath();
    c.moveTo(104, 70);
    c.lineTo(116, 42);
    c.lineTo(128, 48);
    c.lineTo(118, 84);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#8a6a4e';
    c.beginPath();
    c.ellipse(126, 46, 12, 9, 0.3, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // galhadas
    c.strokeStyle = '#c9b089';
    c.lineWidth = 4;
    c.lineCap = 'round';
    for (const d of [-1, 1]) {
      const bx = 120 + d * 4;
      c.beginPath();
      c.moveTo(bx, 38);
      c.quadraticCurveTo(bx - 20, 14, bx - 6 + d * 8, 4);
      c.moveTo(bx - 10, 22);
      c.lineTo(bx - 22, 16);
      c.moveTo(bx - 6, 12);
      c.lineTo(bx + 6, 6);
      c.stroke();
    }
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(136, 50, 3, 0, Math.PI * 2);
    c.fill();
    olho(c, 126, 42, 2.2);
  });

  // Foca-anelada (Pusa hispida): corpo cinza com anéis claros, cabeça redonda.
  texBicho('foca', 120, 52, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#7a8591';
    c.beginPath();
    c.moveTo(4, 30);
    c.lineTo(20, 22);
    c.lineTo(20, 40);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(58, 32, 42, 16, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(100, 26, 14, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // anéis claros
    c.strokeStyle = '#c8d0d8';
    c.lineWidth = 2;
    const r = rng(171);
    for (let i = 0; i < 10; i++) {
      c.beginPath();
      c.ellipse(26 + r() * 60, 24 + r() * 14, 4, 3, 0, 0, Math.PI * 2);
      c.stroke();
    }
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(112, 29, 2.5, 0, Math.PI * 2);
    c.fill();
    olho(c, 104, 22, 3);
  });

  // Coruja-das-neves (Bubo scandiacus): branca com pintinhas escuras, olhos amarelos.
  texBicho('coruja-das-neves', 76, 86, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#fbfbf8';
    c.beginPath();
    c.ellipse(38, 56, 28, 28, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.arc(38, 26, 20, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    const r = rng(173);
    c.fillStyle = '#4a4038';
    for (let i = 0; i < 16; i++) {
      c.beginPath();
      c.ellipse(16 + r() * 44, 44 + r() * 30, 2.5, 1.5, 0, 0, Math.PI * 2);
      c.fill();
    }
    for (const x of [30, 46]) {
      c.fillStyle = '#f2c230';
      c.beginPath();
      c.arc(x, 24, 5.5, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#1d140e';
      c.beginPath();
      c.arc(x, 24, 3, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#3a3230';
    c.beginPath();
    c.moveTo(35, 31);
    c.lineTo(41, 31);
    c.lineTo(38, 37);
    c.closePath();
    c.fill();
    // pés peludos
    c.fillStyle = '#fbfbf8';
    for (const x of [28, 48]) {
      c.beginPath();
      c.ellipse(x, 83, 7, 4, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
  });
}
