// Arte do Mundo 3 — Savana (Quênia e Tanzânia), desenhada por código.
// Dossiê (ambiente): savana não é ausência de árvores; campos, acácias espaçadas e kopjes (afloramentos rochosos).
import Phaser from 'phaser';
import { TILE } from '../config';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';

const S = {
  ceuTopo: '#8cc8ec',
  ceuBase: '#fbe3b0',
  longe: '#c9a878',
  longeEscuro: '#b08c5e',
  perto: '#a7a24c',
  pertoEscuro: '#7f7a34',
  terra: '#a8643a',
  terraEscura: '#84492a',
  terraClara: '#c47d4f',
  capim: '#d8c35a',
  capimEscuro: '#b19a3a',
  copa: '#6f8f3a',
  copaEscura: '#56722c',
  tronco: '#6b4a2e',
};

export function gerarSavana(scene: Phaser.Scene) {
  gerarChao(scene);
  gerarFundo(scene);
  gerarBichos(scene);
}

function gerarChao(scene: Phaser.Scene) {
  const terra = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = S.terra;
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 71 : 73);
      for (let i = 0; i < 6; i++) {
        c.fillStyle = r() > 0.5 ? S.terraEscura : S.terraClara;
        c.beginPath();
        c.ellipse(r() * w, (topo ? 20 : 0) + r() * (h - 20), 3 + r() * 5, 2 + r() * 3, 0, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = S.capim;
        c.fillRect(0, 0, w, 14);
        c.fillStyle = S.capimEscuro;
        c.fillRect(0, 12, w, 4);
        // capim alto da savana
        c.strokeStyle = S.capim;
        c.lineWidth = 2;
        for (let x = 2; x < w; x += 5) {
          c.beginPath();
          c.moveTo(x, 6);
          c.lineTo(x + (x % 3) - 1, -2 - (x % 7));
          c.stroke();
        }
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  terra('terra-savana', false);
  terra('terra-savana-topo', true);

  // Copa achatada de acácia (plataforma atravessável por baixo)
  tex(scene, 'copa-acacia', TILE, 26, (c, w) => {
    c.fillStyle = S.copa;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 0, 4, w, 18, 9);
    c.fill();
    c.stroke();
    c.fillStyle = S.copaEscura;
    c.fillRect(4, 15, w - 8, 5);
    c.fillStyle = 'rgba(255,255,255,0.25)';
    for (const x of [10, 30, 48]) {
      c.beginPath();
      c.ellipse(x, 9, 6, 2.5, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Arbusto de espinhos (acácia baixa) — perigo
  tex(scene, 'espinho-acacia', TILE, 48, (c, w, h) => {
    c.strokeStyle = S.tronco;
    c.lineWidth = 4;
    c.lineCap = 'round';
    for (const [x, a] of [
      [20, -0.5],
      [32, 0],
      [44, 0.5],
    ]) {
      c.beginPath();
      c.moveTo(32, h);
      c.lineTo(x + Math.sin(a) * 10, h - 34);
      c.stroke();
    }
    c.fillStyle = S.copa;
    c.beginPath();
    c.ellipse(w / 2, 14, 26, 11, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.stroke();
    // espinhos brancos longos, bem visíveis
    c.strokeStyle = '#fffbe8';
    c.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const x = 10 + i * 5.5;
      c.beginPath();
      c.moveTo(x, 18 + (i % 2) * 6);
      c.lineTo(x + (i % 2 ? 6 : -6), 30 + (i % 3) * 5);
      c.stroke();
    }
  });

  // Pedregulho redondo (2x2 blocos): o Chico empurra com a força do elefante
  tex(scene, 'pedregulho', TILE * 2, TILE * 2, (c, w, h) => {
    c.fillStyle = '#a89886';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(12, h - 4);
    c.bezierCurveTo(-4, h * 0.4, 30, 6, w / 2, 6);
    c.bezierCurveTo(w - 20, 6, w + 4, h * 0.45, w - 10, h - 4);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.28)';
    c.beginPath();
    c.ellipse(w * 0.38, h * 0.3, 20, 9, -0.4, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#7d6e5e';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(w * 0.6, h * 0.45);
    c.lineTo(w * 0.72, h * 0.62);
    c.lineTo(w * 0.66, h * 0.8);
    c.stroke();
  });

  // Rastros de casco no chão (decoração que "mostra o caminho")
  tex(scene, 'rastro', TILE, 16, (c) => {
    c.fillStyle = 'rgba(70,40,20,0.55)';
    for (const [x, y] of [
      [10, 8],
      [30, 5],
      [50, 9],
    ]) {
      c.beginPath();
      c.ellipse(x - 3, y, 3, 4.5, 0, 0, Math.PI * 2);
      c.ellipse(x + 3, y, 3, 4.5, 0, 0, Math.PI * 2);
      c.fill();
    }
  });
}

function acacia(c: Ctx, x: number, base: number, alt: number, cor: string) {
  c.strokeStyle = cor;
  c.lineWidth = alt * 0.07;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x, base);
  c.lineTo(x, base - alt * 0.55);
  c.lineTo(x - alt * 0.3, base - alt * 0.85);
  c.moveTo(x, base - alt * 0.55);
  c.lineTo(x + alt * 0.28, base - alt * 0.88);
  c.stroke();
  c.fillStyle = cor;
  c.beginPath();
  c.ellipse(x, base - alt * 0.9, alt * 0.55, alt * 0.12, 0, 0, Math.PI * 2);
  c.fill();
}

function gerarFundo(scene: Phaser.Scene) {
  tex(scene, 'ceu-savana', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, S.ceuTopo);
    g.addColorStop(1, S.ceuBase);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Horizonte plano com kopjes e acácias distantes
  tex(scene, 'savana-longe', 1024, 320, (c, w, h) => {
    const r = rng(81);
    c.fillStyle = S.longe;
    c.fillRect(0, h - 90, w, 90);
    for (let i = 0; i < 4; i++) {
      const x = 80 + i * 250 + r() * 60;
      c.fillStyle = S.longeEscuro;
      c.beginPath();
      c.ellipse(x, h - 90, 50 + r() * 40, 30 + r() * 25, 0, Math.PI, 0);
      c.fill();
    }
    for (let i = 0; i < 7; i++) acacia(c, 40 + i * 150 + r() * 40, h - 88, 60 + r() * 30, S.longeEscuro);
  });

  // Capim alto e acácias próximas
  tex(scene, 'savana-perto', 1024, 280, (c, w, h) => {
    const r = rng(83);
    c.fillStyle = S.perto;
    c.fillRect(0, h - 50, w, 50);
    for (let i = 0; i < 4; i++) acacia(c, 120 + i * 260 + r() * 60, h - 40, 170 + r() * 50, S.pertoEscuro);
    c.strokeStyle = S.perto;
    c.lineWidth = 3;
    for (let x = 0; x < w; x += 7) {
      c.beginPath();
      c.moveTo(x, h - 40);
      c.lineTo(x + 3, h - 60 - r() * 25);
      c.stroke();
    }
  });

  // Selo da Savana: sol se pondo atrás de uma acácia
  tex(scene, 'selo-savana', 130, 130, (c) => {
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
    c.fillStyle = '#f7c77a';
    c.beginPath();
    c.arc(65, 65, 36, 0, Math.PI * 2);
    c.fill();
    c.lineWidth = 3;
    c.stroke();
    c.save();
    c.beginPath();
    c.arc(65, 65, 34, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#e8743b';
    c.beginPath();
    c.arc(65, 74, 16, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = S.capimEscuro;
    c.fillRect(30, 82, 70, 20);
    acacia(c, 54, 86, 44, '#4a3526');
    c.restore();
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

  // Guepardo (Acinonyx jubatus): esguio, pintas cheias (não rosetas), "lágrimas" pretas no rosto.
  texBicho('guepardo', 130, 70, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#e8b85a';
    // cauda longa com anéis
    c.beginPath();
    c.moveTo(20, 30);
    c.quadraticCurveTo(4, 40, 6, 60);
    c.lineWidth = 6;
    c.strokeStyle = '#e8b85a';
    c.stroke();
    c.lineWidth = 3;
    c.strokeStyle = OUTLINE;
    // pernas longas
    for (const x of [30, 42, 86, 98]) {
      rrect(c, x, 40, 9, 28, 4);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(64, 34, 44, 15, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#f7e6c2';
    c.beginPath();
    c.ellipse(66, 44, 28, 5, 0, 0, Math.PI);
    c.fill();
    // cabeça pequena
    c.fillStyle = '#e8b85a';
    c.beginPath();
    c.arc(110, 24, 13, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    for (const x of [103, 115]) {
      c.beginPath();
      c.arc(x, 12, 4, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(114, 21, 2.3, 0, Math.PI * 2);
    c.fill();
    // "lágrimas" pretas
    c.strokeStyle = '#1d140e';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(115, 23);
    c.quadraticCurveTo(118, 30, 121, 33);
    c.stroke();
    c.beginPath();
    c.ellipse(122, 28, 2.5, 2, 0, 0, Math.PI * 2);
    c.fill();
    // pintas cheias
    const r = rng(91);
    c.fillStyle = '#2a1c14';
    for (let i = 0; i < 26; i++) {
      c.beginPath();
      c.arc(26 + r() * 76, 22 + r() * 22, 1.8, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Elefante-africano-da-savana (Loxodonta africana): orelhas enormes, tromba, presas.
  texBicho('elefante', 200, 160, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    c.fillStyle = '#9a9aa2';
    for (const x of [40, 70, 118, 146]) {
      rrect(c, x, 100, 26, 56, 8);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(96, 80, 78, 48, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // cauda
    c.beginPath();
    c.moveTo(20, 70);
    c.lineTo(10, 104);
    c.stroke();
    // cabeça
    c.beginPath();
    c.ellipse(160, 56, 30, 34, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // orelha grande (formato da África, como no elefante africano)
    c.fillStyle = '#8a8a93';
    c.beginPath();
    c.moveTo(140, 24);
    c.bezierCurveTo(100, 20, 102, 90, 132, 100);
    c.bezierCurveTo(150, 94, 150, 50, 140, 24);
    c.fill();
    c.stroke();
    // tromba
    c.fillStyle = '#9a9aa2';
    c.beginPath();
    c.moveTo(178, 60);
    c.quadraticCurveTo(196, 100, 184, 146);
    c.lineTo(172, 146);
    c.quadraticCurveTo(180, 104, 166, 76);
    c.closePath();
    c.fill();
    c.stroke();
    // presa
    c.fillStyle = '#f4efe2';
    c.beginPath();
    c.moveTo(168, 82);
    c.quadraticCurveTo(186, 100, 196, 92);
    c.lineTo(192, 86);
    c.quadraticCurveTo(182, 90, 172, 76);
    c.closePath();
    c.fill();
    c.lineWidth = 2.5;
    c.stroke();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(166, 44, 3.5, 0, Math.PI * 2);
    c.fill();
  });

  // Girafa-masai (Giraffa tippelskirchi): manchas irregulares recortadas, pescoço longo, ossicones.
  texBicho('girafa', 110, 250, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#f0d49a';
    for (const x of [22, 36, 68, 82]) {
      rrect(c, x, 170, 10, 78, 4);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(52, 158, 42, 26, -0.15, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // pescoço longo
    c.beginPath();
    c.moveTo(70, 146);
    c.lineTo(86, 40);
    c.lineTo(100, 42);
    c.lineTo(90, 150);
    c.closePath();
    c.fill();
    c.stroke();
    // cabeça e ossicones
    c.beginPath();
    c.ellipse(96, 30, 13, 9, 0.5, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    for (const x of [86, 94]) {
      c.beginPath();
      c.moveTo(x, 22);
      c.lineTo(x - 2, 10);
      c.stroke();
      c.fillStyle = '#5a3a24';
      c.beginPath();
      c.arc(x - 2, 9, 3, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(98, 27, 2.2, 0, Math.PI * 2);
    c.fill();
    // manchas recortadas (estilo masai)
    const r = rng(97);
    c.fillStyle = '#8a5230';
    for (let i = 0; i < 22; i++) {
      const x = i < 12 ? 20 + r() * 64 : 78 + r() * 14;
      const y = i < 12 ? 142 + r() * 30 : 50 + (i - 12) * 9;
      c.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        const rr = 3 + r() * 3;
        c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      c.closePath();
      c.fill();
    }
  });

  // Zebra-da-planície (Equus quagga): listras largas, crina em pé.
  texBicho('zebra', 130, 100, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#f6f4ee';
    for (const x of [28, 42, 84, 98]) {
      rrect(c, x, 58, 10, 38, 4);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(64, 50, 44, 20, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // pescoço e cabeça
    c.beginPath();
    c.moveTo(94, 42);
    c.lineTo(110, 12);
    c.lineTo(126, 26);
    c.lineTo(108, 56);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#2a2a2a';
    c.beginPath();
    c.ellipse(124, 30, 6, 7, 0, 0, Math.PI * 2);
    c.fill();
    // listras
    c.strokeStyle = '#1d1d1d';
    c.lineWidth = 4;
    for (let x = 30; x < 100; x += 10) {
      c.beginPath();
      c.moveTo(x, 34);
      c.quadraticCurveTo(x + 4, 50, x - 2, 68);
      c.stroke();
    }
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.moveTo(98 + i * 4, 40 - i * 7);
      c.lineTo(110 + i * 4, 48 - i * 7);
      c.stroke();
    }
    // crina em pé
    c.fillStyle = '#1d1d1d';
    c.beginPath();
    c.moveTo(96, 36);
    c.lineTo(108, 8);
    c.lineTo(112, 12);
    c.lineTo(100, 40);
    c.closePath();
    c.fill();
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(115, 22, 2.5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(115, 22, 1.5, 0, Math.PI * 2);
    c.fill();
  });

  // Avestruz (Struthio camelus): corpo preto e branco (macho), pescoço e pernas longas e rosadas.
  texBicho('avestruz', 90, 170, (c) => {
    c.strokeStyle = '#d98f7a';
    c.lineWidth = 6;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(38, 96);
    c.lineTo(34, 166);
    c.moveTo(50, 96);
    c.lineTo(56, 166);
    c.stroke();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#2a2622';
    c.beginPath();
    c.ellipse(44, 84, 34, 22, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#f4efe6';
    c.beginPath();
    c.ellipse(18, 78, 12, 9, -0.4, 0, Math.PI * 2);
    c.fill();
    // pescoço longo
    c.strokeStyle = '#d9a8a0';
    c.lineWidth = 8;
    c.beginPath();
    c.moveTo(66, 72);
    c.quadraticCurveTo(76, 40, 70, 14);
    c.stroke();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#d9a8a0';
    c.beginPath();
    c.ellipse(74, 12, 9, 7, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#e8c09a';
    c.beginPath();
    c.moveTo(81, 10);
    c.lineTo(90, 13);
    c.lineTo(81, 16);
    c.closePath();
    c.fill();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(76, 10, 2.2, 0, Math.PI * 2);
    c.fill();
  });
}
