// Arte do Mundo 2 — Amazônia, desenhada por código como o resto do jogo.
import Phaser from 'phaser';
import { TILE } from '../config';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';

const M = {
  ceuTopo: '#9fd6c8',
  ceuBase: '#e6f4d8',
  longe: '#7fb59a',
  longeEscuro: '#6aa187',
  perto: '#3f7d52',
  pertoEscuro: '#2f6440',
  terra: '#6b4a2e',
  terraEscura: '#4e341f',
  folhas: '#8a6a3a',
  musgo: '#4f9a35',
  musgoClaro: '#6fbf4a',
  madeira: '#8a5a32',
  madeiraEscura: '#6b4424',
  aguaRasa: 'rgba(96, 170, 190, 0.62)',
  aguaFunda: 'rgba(22, 70, 120, 0.82)',
};

export function gerarAmazonia(scene: Phaser.Scene) {
  gerarChaoEAgua(scene);
  gerarFundo(scene);
  gerarBichosAmazonia(scene);
}

function gerarChaoEAgua(scene: Phaser.Scene) {
  const terra = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = M.terra;
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 41 : 43);
      // folhas caídas e raizinhas
      for (let i = 0; i < 8; i++) {
        c.fillStyle = r() > 0.5 ? M.terraEscura : M.folhas;
        c.beginPath();
        c.ellipse(r() * w, (topo ? 18 : 0) + r() * (h - 18), 4 + r() * 4, 2 + r() * 2, r() * 3, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        c.fillStyle = M.musgo;
        c.fillRect(0, 0, w, 14);
        c.fillStyle = M.musgoClaro;
        for (let x = 0; x < w; x += 8) {
          c.beginPath();
          c.ellipse(x + 4, 4, 6, 5, 0, 0, Math.PI * 2);
          c.fill();
        }
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  terra('terra-mata', false);
  terra('terra-mata-topo', true);

  // Tronco: bloco sólido de madeira (anéis no topo)
  const tronco = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = M.madeira;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = M.madeiraEscura;
      c.lineWidth = 3;
      for (const x of [12, 30, 50]) {
        c.beginPath();
        c.moveTo(x, topo ? 14 : 0);
        c.bezierCurveTo(x + 4, h * 0.4, x - 4, h * 0.7, x + 2, h);
        c.stroke();
      }
      if (topo) {
        c.fillStyle = '#c9985e';
        c.fillRect(0, 0, w, 12);
        c.strokeStyle = '#a0703e';
        c.lineWidth = 2;
        c.beginPath();
        c.ellipse(w / 2, 6, 20, 3, 0, 0, Math.PI * 2);
        c.stroke();
        c.strokeStyle = OUTLINE;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  tronco('tronco', false);
  tronco('tronco-topo', true);

  // Galho (plataforma atravessável por baixo)
  tex(scene, 'galho', TILE, 26, (c, w) => {
    c.fillStyle = M.madeira;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 0, 5, w, 16, 8);
    c.fill();
    c.stroke();
    c.fillStyle = M.musgoClaro;
    for (const x of [10, 34, 52]) {
      c.beginPath();
      c.ellipse(x, 6, 7, 4, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Cipó (escalável)
  tex(scene, 'cipo', TILE, TILE, (c, _w, h) => {
    c.strokeStyle = '#5a7a2a';
    c.lineWidth = 7;
    c.beginPath();
    c.moveTo(32, 0);
    c.bezierCurveTo(22, h * 0.33, 42, h * 0.66, 32, h);
    c.stroke();
    c.fillStyle = M.musgoClaro;
    for (const [x, y, a] of [
      [24, 14, -0.6],
      [40, 42, 0.6],
    ]) {
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.beginPath();
      c.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  });

  // Palmeira espinhenta (perigo; muitas palmeiras amazônicas têm espinhos no tronco)
  tex(scene, 'espinheiro', TILE, 48, (c, w, h) => {
    c.fillStyle = '#6b5a3a';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 20, 6, 24, h - 6, 8);
    c.fill();
    c.stroke();
    c.strokeStyle = '#1e140c';
    c.lineWidth = 2.5;
    for (let y = 12; y < h - 2; y += 7) {
      for (const [x0, dx] of [
        [20, -12],
        [44, 12],
      ]) {
        c.beginPath();
        c.moveTo(x0, y);
        c.lineTo(x0 + dx, y - 5);
        c.stroke();
      }
    }
    c.fillStyle = M.musgo;
    c.beginPath();
    c.ellipse(w / 2, 6, 18, 6, 0, 0, Math.PI * 2);
    c.fill();
  });

  // Água: rasa (clara) e funda (escura), com ondinhas na superfície. Fica na frente do Chico (ele "entra" nela).
  const agua = (key: string, cor: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = cor;
      c.fillRect(0, topo ? 8 : 0, w, h - (topo ? 8 : 0));
      if (topo) {
        c.fillStyle = 'rgba(255,255,255,0.85)';
        for (let x = 0; x < w; x += 16) {
          c.beginPath();
          c.ellipse(x + 8, 9, 8, 3, 0, Math.PI, 0);
          c.fill();
        }
      }
      c.fillStyle = 'rgba(255,255,255,0.18)';
      c.fillRect(6, topo ? 22 : 14, 18, 3);
      c.fillRect(36, topo ? 40 : 38, 14, 3);
    });
  agua('agua-rasa', M.aguaRasa, false);
  agua('agua-rasa-topo', M.aguaRasa, true);
  agua('agua-funda', M.aguaFunda, false);
  agua('agua-funda-topo', M.aguaFunda, true);

  // Onda de som (anel), usada para mostrar de onde vem um chamado
  tex(scene, 'onda', 96, 96, (c) => {
    c.strokeStyle = 'rgba(255,255,255,0.95)';
    c.lineWidth = 6;
    c.beginPath();
    c.arc(48, 48, 42, 0, Math.PI * 2);
    c.stroke();
  });

  tex(scene, 'bolha', 14, 14, (c) => {
    c.strokeStyle = 'rgba(255,255,255,0.9)';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(7, 7, 5, 0, Math.PI * 2);
    c.stroke();
  });
}

function gerarFundo(scene: Phaser.Scene) {
  tex(scene, 'ceu-mata', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, M.ceuTopo);
    g.addColorStop(1, M.ceuBase);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Copas distantes (tileável)
  tex(scene, 'floresta-longe', 1024, 320, (c, w, h) => {
    const r = rng(51);
    c.fillStyle = M.longe;
    c.fillRect(0, h - 120, w, 120);
    for (let x = -40; x < w + 40; x += 46) {
      const rr = 40 + r() * 36;
      c.fillStyle = r() > 0.5 ? M.longe : M.longeEscuro;
      c.beginPath();
      c.arc(x, h - 120 - r() * 70, rr, 0, Math.PI * 2);
      c.fill();
    }
    // bordas repetem nos dois lados para não aparecer emenda
    c.fillStyle = M.longe;
    c.fillRect(0, h - 60, w, 60);
  });

  // Troncos altos e copas próximas (tileável)
  tex(scene, 'floresta-perto', 1024, 300, (c, w, h) => {
    const r = rng(57);
    for (let i = 0; i < 9; i++) {
      const x = 40 + i * 115 + r() * 30;
      c.fillStyle = M.pertoEscuro;
      c.fillRect(x - 9, 40, 18, h - 40);
      c.fillStyle = r() > 0.5 ? M.perto : M.pertoEscuro;
      c.beginPath();
      c.arc(x, 60, 50 + r() * 20, 0, Math.PI * 2);
      c.arc(x - 40, 80, 40, 0, Math.PI * 2);
      c.arc(x + 40, 80, 40, 0, Math.PI * 2);
      c.fill();
      // cipós pendurados
      c.strokeStyle = M.pertoEscuro;
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(x + 30, 90);
      c.quadraticCurveTo(x + 40, 160, x + 28, 220);
      c.stroke();
    }
    c.fillStyle = M.perto;
    c.fillRect(0, h - 30, w, 30);
  });

  // Selo da Amazônia: medalha com árvore e rio
  tex(scene, 'selo-amazonia', 130, 130, (c) => {
    const g = c.createRadialGradient(65, 65, 20, 65, 65, 65);
    g.addColorStop(0, 'rgba(200,255,200,0.9)');
    g.addColorStop(1, 'rgba(200,255,200,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 130, 130);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    c.fillStyle = '#f2b93b';
    c.beginPath();
    c.arc(65, 65, 46, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#bfe3c0';
    c.beginPath();
    c.arc(65, 65, 36, 0, Math.PI * 2);
    c.fill();
    c.lineWidth = 3;
    c.stroke();
    c.save();
    c.beginPath();
    c.arc(65, 65, 34, 0, Math.PI * 2);
    c.clip();
    // rio
    c.fillStyle = '#5bb0e8';
    c.beginPath();
    c.moveTo(30, 100);
    c.quadraticCurveTo(70, 80, 60, 70);
    c.quadraticCurveTo(52, 62, 100, 58);
    c.lineTo(100, 70);
    c.quadraticCurveTo(66, 72, 76, 84);
    c.quadraticCurveTo(86, 96, 50, 104);
    c.closePath();
    c.fill();
    // árvore
    c.fillStyle = '#6b4424';
    c.fillRect(46, 50, 7, 30);
    c.fillStyle = '#3f8a45';
    for (const [x, y, rr] of [
      [50, 42, 14],
      [40, 50, 10],
      [60, 50, 10],
    ]) {
      c.beginPath();
      c.arc(x, y, rr, 0, Math.PI * 2);
      c.fill();
    }
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

function gerarBichosAmazonia(scene: Phaser.Scene) {
  const texBicho = (key: string, w: number, h: number, draw: (c: Ctx, w: number, h: number) => void) => {
    tex(scene, key, w, h, draw);
    tex(scene, `${key}-hd`, w * 3, h * 3, (c) => {
      c.scale(3, 3);
      draw(c, w, h);
    });
  };

  // Onça-pintada (Panthera onca): amarela com rosetas pretas, barriga clara.
  texBicho('onca', 132, 70, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#e0a13a';
    // cauda
    c.beginPath();
    c.moveTo(14, 30);
    c.quadraticCurveTo(0, 36, 6, 56);
    c.lineWidth = 7;
    c.strokeStyle = '#e0a13a';
    c.stroke();
    c.lineWidth = 3;
    c.strokeStyle = OUTLINE;
    // patas
    for (const x of [28, 42, 84, 98]) {
      rrect(c, x, 44, 12, 22, 5);
      c.fill();
      c.stroke();
    }
    // corpo
    c.beginPath();
    c.ellipse(62, 36, 48, 20, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#f6e6c4';
    c.beginPath();
    c.ellipse(64, 48, 32, 7, 0, 0, Math.PI);
    c.fill();
    // cabeça
    c.fillStyle = '#e0a13a';
    c.beginPath();
    c.arc(110, 26, 18, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    for (const x of [100, 118]) {
      c.beginPath();
      c.arc(x, 10, 6, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    c.fillStyle = '#f6e6c4';
    c.beginPath();
    c.ellipse(118, 32, 9, 7, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(113, 22, 2.6, 0, Math.PI * 2);
    c.arc(123, 22, 2.6, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(125, 30, 3, 2, 0, 0, Math.PI * 2);
    c.fill();
    // rosetas
    const r = rng(61);
    c.strokeStyle = '#2a1c14';
    c.lineWidth = 2.5;
    for (let i = 0; i < 14; i++) {
      const x = 26 + r() * 70;
      const y = 22 + r() * 22;
      c.beginPath();
      c.arc(x, y, 3.5, 0, Math.PI * 1.6);
      c.stroke();
    }
  });

  // Arara-vermelha-grande (Ara chloropterus): vermelha, asas com verde e azul, cauda longa, rosto claro.
  texBicho('arara', 60, 96, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    // cauda longa
    c.fillStyle = '#d9342b';
    c.beginPath();
    c.moveTo(24, 56);
    c.lineTo(20, 94);
    c.lineTo(32, 94);
    c.lineTo(34, 56);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#2f6fcf';
    c.fillRect(22, 80, 9, 12);
    // corpo
    c.fillStyle = '#d9342b';
    c.beginPath();
    c.ellipse(30, 40, 15, 22, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // asa: verde e azul
    c.fillStyle = '#3f9e4b';
    c.beginPath();
    c.ellipse(24, 44, 9, 16, 0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#2f6fcf';
    c.beginPath();
    c.ellipse(22, 54, 7, 8, 0.2, 0, Math.PI * 2);
    c.fill();
    // cabeça com rosto claro e bico forte
    c.fillStyle = '#d9342b';
    c.beginPath();
    c.arc(36, 16, 12, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#f4efe6';
    c.beginPath();
    c.ellipse(40, 17, 6, 5, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(40, 15, 2.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#e8e2d2';
    c.beginPath();
    c.moveTo(45, 14);
    c.quadraticCurveTo(58, 16, 50, 28);
    c.lineTo(45, 22);
    c.closePath();
    c.fill();
    c.stroke();
  });

  // Preguiça (Bradypus variegatus), pendurada: pelo marrom, "máscara" escura nos olhos, garras no galho.
  texBicho('preguica', 84, 96, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#8a7258';
    // braços erguidos segurando o galho (topo da imagem)
    for (const x of [22, 60]) {
      rrect(c, x - 6, 0, 12, 46, 6);
      c.fill();
      c.stroke();
      c.strokeStyle = '#e8dcc2';
      c.lineWidth = 2;
      for (const dx of [-4, 0, 4]) {
        c.beginPath();
        c.moveTo(x + dx, 2);
        c.lineTo(x + dx, -2);
        c.stroke();
      }
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3;
    }
    // corpo
    c.beginPath();
    c.ellipse(42, 62, 26, 28, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // rosto claro com máscara
    c.fillStyle = '#e6d8bc';
    c.beginPath();
    c.ellipse(42, 48, 15, 12, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#3b2a1e';
    for (const x of [35, 49]) {
      c.beginPath();
      c.ellipse(x, 47, 6, 3, x < 42 ? 0.3 : -0.3, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#fff';
    c.fillRect(35, 46, 1.6, 1.6);
    c.fillRect(49, 46, 1.6, 1.6);
    c.strokeStyle = '#3b2a1e';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(42, 53, 4, 0.2 * Math.PI, 0.8 * Math.PI);
    c.stroke();
  });

  // Boto-cor-de-rosa (Inia geoffrensis): rosado-acinzentado, focinho longo, sem barbatana alta.
  texBicho('boto', 124, 56, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#e9a4b0';
    // cauda
    c.beginPath();
    c.moveTo(14, 28);
    c.lineTo(0, 16);
    c.lineTo(4, 30);
    c.lineTo(0, 44);
    c.closePath();
    c.fill();
    c.stroke();
    // corpo
    c.beginPath();
    c.ellipse(52, 30, 42, 17, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // "lombada" baixa no lugar da barbatana alta
    c.beginPath();
    c.ellipse(48, 14, 14, 4, 0, Math.PI, 0);
    c.fill();
    c.stroke();
    // cabeça com melão arredondado e focinho longo
    c.beginPath();
    c.arc(88, 26, 13, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    rrect(c, 96, 26, 26, 8, 4);
    c.fill();
    c.stroke();
    c.fillStyle = '#c7cdd6';
    c.beginPath();
    c.ellipse(50, 22, 26, 6, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.arc(92, 28, 2, 0, Math.PI * 2);
    c.fill();
    // nadadeira
    c.fillStyle = '#e9a4b0';
    c.beginPath();
    c.ellipse(64, 42, 10, 5, 0.6, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  });

  // Perereca-leiteira (Trachycephalus resinifictrix): faixas marrons e claras, discos nos dedos.
  texBicho('perereca', 50, 42, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.fillStyle = '#d9d2c2';
    // pernas com discos adesivos
    for (const [x, y] of [
      [8, 34],
      [42, 34],
      [12, 22],
      [38, 22],
    ]) {
      c.beginPath();
      c.arc(x, y, 3.5, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(25, 26, 16, 12, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // faixas marrons
    c.fillStyle = '#7a5334';
    c.beginPath();
    c.ellipse(25, 24, 12, 4, 0, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.ellipse(25, 32, 9, 3, 0, 0, Math.PI * 2);
    c.fill();
    // olhos dourados com cruz preta
    for (const x of [17, 33]) {
      c.fillStyle = '#d9a93b';
      c.beginPath();
      c.arc(x, 13, 5.5, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.strokeStyle = '#1d140e';
      c.lineWidth = 1.8;
      c.beginPath();
      c.moveTo(x - 4, 13);
      c.lineTo(x + 4, 13);
      c.moveTo(x, 9);
      c.lineTo(x, 17);
      c.stroke();
      c.strokeStyle = OUTLINE;
      c.lineWidth = 2.5;
    }
  });
}
