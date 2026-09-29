// Arte do Mundo 4 — Austrália, desenhada por código.
// Dois ambientes: o interior seco (Outback: terra vermelha, espinifex, arenito) e a mata úmida de eucaliptos
// do leste (rios do ornitorrinco, coalas, vaga-lumes — o dossiê pede vaga-lumes na vegetação úmida, não no deserto).
import Phaser from 'phaser';
import { TILE } from '../config';
import { tex, rrect, rng, OUTLINE, type Ctx } from './Textures';

const A = {
  ceuTopo: '#3f8fd6',
  ceuBase: '#f5c98a',
  terra: '#b5532c',
  terraEscura: '#8e3d1f',
  terraClara: '#cf6a3c',
  capimSeco: '#c9a452',
  capimSecoEscuro: '#a3843a',
  arenito: '#c46a3a',
  arenitoEscuro: '#a4532a',
  arenitoClaro: '#d98552',
  longe: '#c77a4e',
  longeEscuro: '#a85c36',
  perto: '#9c8a4a',
  pertoEscuro: '#6f6536',
  troncoEucalipto: '#e8e2d4',
  cascaEucalipto: '#c9bca0',
  folhaEucalipto: '#7f9c83',
  folhaEucaliptoEscura: '#5f7d66',
  fofa: '#9a6a42',
  fofaEscura: '#6e4a2c',
  fofaClara: '#b98a5c',
};

export function gerarAustralia(scene: Phaser.Scene) {
  gerarChao(scene);
  gerarFundo(scene);
  gerarNoite(scene);
  gerarBichos(scene);
}

function gerarChao(scene: Phaser.Scene) {
  const terra = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = A.terra;
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 111 : 113);
      for (let i = 0; i < 7; i++) {
        c.fillStyle = r() > 0.5 ? A.terraEscura : A.terraClara;
        c.beginPath();
        c.ellipse(r() * w, (topo ? 16 : 0) + r() * (h - 16), 3 + r() * 4, 2 + r() * 2, 0, 0, Math.PI * 2);
        c.fill();
      }
      if (topo) {
        // chão vermelho com tufos de capim seco espaçados
        c.fillStyle = A.terraClara;
        c.fillRect(0, 0, w, 10);
        c.strokeStyle = A.capimSeco;
        c.lineWidth = 2;
        for (const x0 of [8, 38]) {
          for (let k = -2; k <= 2; k++) {
            c.beginPath();
            c.moveTo(x0 + 6, 6);
            c.lineTo(x0 + 6 + k * 4, -4 + Math.abs(k) * 3);
            c.stroke();
          }
        }
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 1);
        c.lineTo(w, 1);
        c.stroke();
      }
    });
  terra('terra-outback', false);
  terra('terra-outback-topo', true);

  // Arenito vermelho em camadas (morros do interior)
  const arenito = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = A.arenito;
      c.fillRect(0, 0, w, h);
      c.fillStyle = A.arenitoEscuro;
      for (const y of [18, 40, 58]) c.fillRect(0, y, w, 4);
      c.fillStyle = A.arenitoClaro;
      for (const y of [10, 30, 50]) c.fillRect(0, y, w, 3);
      c.strokeStyle = 'rgba(42,28,20,0.35)';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(20, 18);
      c.lineTo(24, 40);
      c.moveTo(48, 40);
      c.lineTo(44, 60);
      c.stroke();
      if (topo) {
        c.fillStyle = A.arenitoClaro;
        c.fillRect(0, 0, w, 8);
        c.strokeStyle = OUTLINE;
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(0, 1.5);
        c.lineTo(w, 1.5);
        c.stroke();
      }
    });
  arenito('arenito', false);
  arenito('arenito-topo', true);

  // Terra fofa: mais clara, esfarelando, com pedrinhas — o Chico cava com o poder do wombat
  const fofa = (key: string, topo: boolean) =>
    tex(scene, key, TILE, TILE, (c, w, h) => {
      c.fillStyle = A.fofa;
      c.fillRect(0, 0, w, h);
      const r = rng(topo ? 117 : 119);
      for (let i = 0; i < 26; i++) {
        c.fillStyle = r() > 0.45 ? A.fofaClara : A.fofaEscura;
        c.beginPath();
        c.arc(r() * w, r() * h, 1.5 + r() * 3, 0, Math.PI * 2);
        c.fill();
      }
      // rachaduras que mostram que ela se desmancha
      c.strokeStyle = A.fofaEscura;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(8, 20);
      c.lineTo(20, 28);
      c.lineTo(18, 40);
      c.moveTo(44, 10);
      c.lineTo(50, 26);
      c.lineTo(58, 30);
      c.moveTo(34, 46);
      c.lineTo(40, 58);
      c.stroke();
      // borda pontilhada: "dá para cavar aqui"
      c.strokeStyle = 'rgba(255,240,210,0.55)';
      c.setLineDash([5, 5]);
      c.lineWidth = 2;
      c.strokeRect(3, 3, w - 6, h - 6);
      c.setLineDash([]);
      if (topo) {
        c.fillStyle = A.fofaClara;
        for (let x = 4; x < w; x += 12) {
          c.beginPath();
          c.arc(x, 3, 4, Math.PI, 0);
          c.fill();
        }
      }
    });
  fofa('terra-fofa', false);
  fofa('terra-fofa-topo', true);

  // Fundo de toca (atrás dos túneis): terra escura com raizinhas
  tex(scene, 'fundo-toca', TILE, TILE, (c, w, h) => {
    c.fillStyle = '#3e2a1a';
    c.fillRect(0, 0, w, h);
    const r = rng(127);
    c.fillStyle = '#4e3522';
    for (let i = 0; i < 8; i++) {
      c.beginPath();
      c.arc(r() * w, r() * h, 2 + r() * 4, 0, Math.PI * 2);
      c.fill();
    }
    c.strokeStyle = '#5a4028';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(10, 0);
    c.quadraticCurveTo(16, 14, 8, 26);
    c.moveTo(46, 0);
    c.quadraticCurveTo(40, 10, 48, 18);
    c.stroke();
  });

  // Galho de eucalipto (plataforma atravessável por baixo)
  tex(scene, 'galho-eucalipto', TILE, 26, (c, w) => {
    c.fillStyle = A.troncoEucalipto;
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    rrect(c, 0, 6, w, 14, 7);
    c.fill();
    c.stroke();
    c.fillStyle = A.cascaEucalipto;
    for (const x of [10, 34, 52]) {
      c.beginPath();
      c.ellipse(x, 13, 5, 3, 0, 0, Math.PI * 2);
      c.fill();
    }
    // folhas compridas penduradas
    c.fillStyle = A.folhaEucalipto;
    for (const [x, a] of [
      [16, 0.5],
      [44, -0.4],
    ]) {
      c.save();
      c.translate(x, 20);
      c.rotate(a);
      c.beginPath();
      c.ellipse(0, 4, 3, 7, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  });

  // Tronco de eucalipto que se escala (casca clara que solta em placas)
  tex(scene, 'tronco-eucalipto', TILE, TILE, (c, _w, h) => {
    c.fillStyle = A.troncoEucalipto;
    c.fillRect(18, 0, 28, h);
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(18, 0);
    c.lineTo(18, h);
    c.moveTo(46, 0);
    c.lineTo(46, h);
    c.stroke();
    c.fillStyle = A.cascaEucalipto;
    c.beginPath();
    c.ellipse(28, 16, 6, 10, 0.2, 0, Math.PI * 2);
    c.ellipse(38, 46, 5, 9, -0.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#d8cfb8';
    c.fillRect(22, 28, 6, 3);
    c.fillRect(34, 8, 7, 3);
  });

  // Capim-espinifex: touceira de folhas duras e pontudas, comum no interior seco (perigo)
  tex(scene, 'espinifex', TILE, 48, (c, w, h) => {
    c.lineCap = 'round';
    for (let i = 0; i < 17; i++) {
      const a = -Math.PI + (i / 16) * Math.PI;
      const comp = 26 + (i % 3) * 6;
      c.strokeStyle = i % 2 ? '#c2b85a' : '#9c9440';
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(w / 2, h - 2);
      c.lineTo(w / 2 + Math.cos(a) * comp, h - 2 + Math.sin(a) * comp);
      c.stroke();
    }
    // pontas claras bem visíveis
    c.fillStyle = '#fffbe0';
    for (let i = 1; i < 16; i += 2) {
      const a = -Math.PI + (i / 16) * Math.PI;
      const comp = 26 + (i % 3) * 6;
      c.beginPath();
      c.arc(w / 2 + Math.cos(a) * comp, h - 2 + Math.sin(a) * comp, 2.5, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Arbusto espinhento da mata (perigo)
  tex(scene, 'arbusto-espinhos', TILE, 48, (c, w, h) => {
    c.fillStyle = '#4f6e52';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(w / 2, h - 18, 26, 17, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#6a8c6a';
    c.beginPath();
    c.ellipse(w / 2 - 6, h - 24, 12, 7, 0, 0, Math.PI * 2);
    c.fill();
    // espinhos claros para fora
    c.strokeStyle = '#fffbe8';
    c.lineWidth = 2.5;
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI * 0.95 + (i / 11) * Math.PI * 0.9;
      const x = w / 2 + Math.cos(a) * 24;
      const y = h - 18 + Math.sin(a) * 15;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9);
      c.stroke();
    }
  });
}

function eucalipto(c: Ctx, x: number, base: number, alt: number, tronco: string, copa: string) {
  c.strokeStyle = tronco;
  c.lineCap = 'round';
  c.lineWidth = alt * 0.06;
  c.beginPath();
  c.moveTo(x, base);
  c.quadraticCurveTo(x - alt * 0.05, base - alt * 0.5, x + alt * 0.04, base - alt * 0.8);
  c.moveTo(x, base - alt * 0.55);
  c.lineTo(x + alt * 0.22, base - alt * 0.78);
  c.stroke();
  // copa rala, em tufos (eucaliptos deixam passar bastante luz)
  c.fillStyle = copa;
  for (const [dx, dy, r] of [
    [0, 0.85, 0.16],
    [-0.14, 0.76, 0.12],
    [0.2, 0.8, 0.13],
    [0.08, 0.95, 0.11],
  ]) {
    c.beginPath();
    c.ellipse(x + dx * alt, base - dy * alt, r * alt, r * alt * 0.7, 0, 0, Math.PI * 2);
    c.fill();
  }
}

function gerarFundo(scene: Phaser.Scene) {
  tex(scene, 'ceu-outback', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, A.ceuTopo);
    g.addColorStop(1, A.ceuBase);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Planície vermelha com morros de arenito de topo chato e um grande monolito
  tex(scene, 'outback-longe', 1024, 320, (c, w, h) => {
    const r = rng(121);
    c.fillStyle = A.longe;
    c.fillRect(0, h - 80, w, 80);
    c.fillStyle = A.longeEscuro;
    // monolito arredondado
    c.beginPath();
    c.moveTo(560, h - 80);
    c.bezierCurveTo(566, h - 160, 600, h - 172, 700, h - 170);
    c.bezierCurveTo(790, h - 168, 810, h - 150, 820, h - 80);
    c.closePath();
    c.fill();
    // morros de topo chato
    for (const [x, lw, lh] of [
      [60, 180, 60],
      [300, 120, 45],
      [900, 150, 55],
    ]) {
      c.beginPath();
      c.moveTo(x, h - 80);
      c.lineTo(x + 20, h - 80 - lh);
      c.lineTo(x + lw - 20, h - 80 - lh);
      c.lineTo(x + lw, h - 80);
      c.closePath();
      c.fill();
    }
    c.fillStyle = A.longe;
    for (let i = 0; i < 18; i++) {
      c.beginPath();
      c.ellipse(r() * w, h - 80 + r() * 10, 10 + r() * 16, 5, 0, Math.PI, 0);
      c.fill();
    }
  });

  // Arbustos secos e alguns eucaliptos esparsos
  tex(scene, 'outback-perto', 1024, 280, (c, w, h) => {
    const r = rng(123);
    c.fillStyle = A.perto;
    c.fillRect(0, h - 44, w, 44);
    for (let i = 0; i < 3; i++) eucalipto(c, 150 + i * 340 + r() * 60, h - 40, 170 + r() * 50, '#d9d0bc', A.pertoEscuro);
    c.fillStyle = A.pertoEscuro;
    for (let i = 0; i < 22; i++) {
      c.beginPath();
      c.ellipse(r() * w, h - 44, 14 + r() * 18, 10 + r() * 8, 0, Math.PI, 0);
      c.fill();
    }
  });

  tex(scene, 'ceu-eucaliptal', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#8fc3e6');
    g.addColorStop(1, '#e6f0e6');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  // Serras azuladas cobertas de eucaliptos
  tex(scene, 'eucaliptal-longe', 1024, 320, (c, w, h) => {
    for (const [cor, base, amp, seed] of [
      ['#9fb6cc', 150, 50, 131],
      ['#86a0b8', 100, 40, 133],
    ] as const) {
      const r = rng(seed);
      c.fillStyle = cor;
      c.beginPath();
      c.moveTo(0, h);
      for (let x = 0; x <= w; x += 32) c.lineTo(x, h - base - Math.sin((x / w) * Math.PI * 4) * amp - r() * 12);
      c.lineTo(w, h);
      c.closePath();
      c.fill();
    }
  });

  // Troncos claros e altos, samambaias embaixo
  tex(scene, 'eucaliptal-perto', 1024, 340, (c, w, h) => {
    const r = rng(137);
    // árvores inteiras dentro da textura (sem cortar a copa nem a emenda da repetição)
    for (let i = 0; i < 5; i++) eucalipto(c, 100 + i * 190 + r() * 40, h - 30, 200 + r() * 50, '#e3dccb', '#6f8f78');
    c.fillStyle = '#5f8a5a';
    c.fillRect(0, h - 36, w, 36);
    c.fillStyle = '#4d7649';
    for (let i = 0; i < 20; i++) {
      const x = r() * w;
      for (let k = -2; k <= 2; k++) {
        c.beginPath();
        c.ellipse(x + k * 9, h - 40 - Math.abs(k) * -4, 5, 16, k * 0.35, 0, Math.PI * 2);
        c.fill();
      }
    }
  });

  // Selo da Austrália: Cruzeiro do Sul (também visto no céu do Brasil) sobre o monolito vermelho
  tex(scene, 'selo-australia', 130, 130, (c) => {
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
    c.fillStyle = '#1d2e5c';
    c.fillRect(20, 20, 90, 90);
    c.fillStyle = '#c4582e';
    c.beginPath();
    c.moveTo(34, 104);
    c.bezierCurveTo(38, 80, 50, 76, 70, 77);
    c.bezierCurveTo(88, 78, 94, 84, 98, 104);
    c.closePath();
    c.fill();
    c.fillStyle = '#fff6c8';
    for (const [x, y, rr] of [
      [66, 36, 4],
      [66, 64, 4.5],
      [54, 50, 3.5],
      [78, 47, 3.5],
      [72, 56, 2],
    ]) {
      c.beginPath();
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
        const raio = k % 2 === 0 ? rr : rr * 0.45;
        c.lineTo(x + Math.cos(a) * raio, y + Math.sin(a) * raio);
      }
      c.closePath();
      c.fill();
    }
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

function gerarNoite(scene: Phaser.Scene) {
  tex(scene, 'ceu-noite', 16, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0b1433');
    g.addColorStop(1, '#2b3b72');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

  tex(scene, 'estrelas', 1024, 360, (c, w, h) => {
    const r = rng(141);
    for (let i = 0; i < 90; i++) {
      c.fillStyle = `rgba(255,255,235,${0.4 + r() * 0.6})`;
      c.beginPath();
      c.arc(r() * w, r() * h, 0.8 + r() * 1.6, 0, Math.PI * 2);
      c.fill();
    }
  });

  tex(scene, 'lua', 110, 110, (c) => {
    const g = c.createRadialGradient(55, 55, 30, 55, 55, 55);
    g.addColorStop(0, 'rgba(255,250,220,0.5)');
    g.addColorStop(1, 'rgba(255,250,220,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 110, 110);
    c.fillStyle = '#fbf6dc';
    c.beginPath();
    c.arc(55, 55, 30, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(200,195,170,0.6)';
    for (const [x, y, rr] of [
      [46, 48, 6],
      [62, 62, 5],
      [60, 44, 3],
    ]) {
      c.beginPath();
      c.arc(x, y, rr, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Vaga-lume: pontinho verde-amarelado com brilho (besouro bioluminescente)
  tex(scene, 'vagalume', 48, 48, (c) => {
    const g = c.createRadialGradient(24, 24, 0, 24, 24, 24);
    g.addColorStop(0, 'rgba(250,255,190,1)');
    g.addColorStop(0.18, 'rgba(220,250,120,0.95)');
    g.addColorStop(0.45, 'rgba(190,240,90,0.35)');
    g.addColorStop(1, 'rgba(190,240,90,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 48, 48);
  });

  // Escuridão da noite com um "buraco" de luz no meio (fica centrada no Chico).
  // Pequena e ampliada na cena: o degradê suave aguenta bem a ampliação.
  tex(scene, 'escuridao', 256, 256, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(6,10,28,0)');
    g.addColorStop(0.1, 'rgba(6,10,28,0)');
    g.addColorStop(0.22, 'rgba(6,10,28,0.72)');
    g.addColorStop(1, 'rgba(6,10,28,0.8)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
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

  // Canguru-vermelho (Osphranter rufus): em pé, patas traseiras enormes, cauda grossa de apoio.
  texBicho('canguru', 110, 150, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#c0643a';
    // cauda grossa encostando no chão
    c.beginPath();
    c.moveTo(44, 100);
    c.quadraticCurveTo(20, 128, 4, 146);
    c.lineTo(12, 148);
    c.quadraticCurveTo(34, 136, 58, 116);
    c.closePath();
    c.fill();
    c.stroke();
    // pé traseiro comprido
    rrect(c, 40, 138, 46, 10, 5);
    c.fill();
    c.stroke();
    // coxa forte
    c.beginPath();
    c.ellipse(56, 116, 22, 26, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // corpo inclinado
    c.beginPath();
    c.ellipse(66, 80, 20, 36, -0.3, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#ecd2b4';
    c.beginPath();
    c.ellipse(74, 86, 9, 24, -0.3, 0, Math.PI * 2);
    c.fill();
    // bracinhos
    c.fillStyle = '#c0643a';
    rrect(c, 78, 70, 16, 7, 3.5);
    c.fill();
    c.stroke();
    // cabeça, focinho e orelhas compridas
    c.beginPath();
    c.ellipse(82, 36, 15, 12, 0.1, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.moveTo(90, 30);
    c.quadraticCurveTo(106, 34, 106, 42);
    c.quadraticCurveTo(100, 48, 88, 46);
    c.closePath();
    c.fill();
    c.stroke();
    for (const [x, a] of [
      [74, -0.35],
      [84, 0.05],
    ]) {
      c.save();
      c.translate(x, 22);
      c.rotate(a);
      c.beginPath();
      c.ellipse(0, -8, 5, 12, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.restore();
    }
    // faixa clara no focinho (marca do canguru-vermelho)
    c.fillStyle = '#f4ead8';
    c.beginPath();
    c.ellipse(96, 44, 7, 2.5, 0.1, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#1d140e';
    c.beginPath();
    c.ellipse(105, 40, 2.5, 2, 0, 0, Math.PI * 2);
    c.fill();
    olho(c, 88, 33);
  });

  // Wombat-comum (Vombatus ursinus): corpo robusto e baixo, patas curtas e fortes, focinho largo.
  texBicho('wombat', 110, 70, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#8c7b6a';
    for (const x of [22, 36, 64, 78]) {
      rrect(c, x, 48, 14, 20, 5);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(52, 40, 44, 24, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // garras claras nas patas
    c.strokeStyle = '#efe6d6';
    c.lineWidth = 2;
    for (const x of [66, 80]) {
      for (let k = 0; k < 3; k++) {
        c.beginPath();
        c.moveTo(x + 3 + k * 4, 67);
        c.lineTo(x + 5 + k * 4, 70);
        c.stroke();
      }
    }
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#8c7b6a';
    c.beginPath();
    c.arc(92, 38, 17, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    for (const x of [84, 98]) {
      c.beginPath();
      c.arc(x, 22, 5, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    // focinho largo e escuro
    c.fillStyle = '#3a3230';
    rrect(c, 98, 36, 11, 10, 4);
    c.fill();
    olho(c, 94, 33, 2.2);
  });

  // Emu (Dromaius novaehollandiae): penas desgrenhadas, pescoço azulado, pernas compridas.
  texBicho('emu', 100, 180, (c) => {
    c.strokeStyle = '#7d7a72';
    c.lineWidth = 5;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(40, 104);
    c.lineTo(36, 172);
    c.lineTo(46, 176);
    c.moveTo(50, 104);
    c.lineTo(60, 172);
    c.lineTo(70, 176);
    c.stroke();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#7a6450';
    c.beginPath();
    c.ellipse(44, 88, 36, 26, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // penas desgrenhadas
    c.strokeStyle = '#5a4838';
    c.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const x = 16 + i * 5;
      c.beginPath();
      c.moveTo(x, 90);
      c.lineTo(x - 3, 112);
      c.stroke();
    }
    // pescoço
    c.strokeStyle = '#6e7f9a';
    c.lineWidth = 9;
    c.beginPath();
    c.moveTo(66, 74);
    c.quadraticCurveTo(80, 50, 76, 22);
    c.stroke();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#4a4038';
    c.beginPath();
    c.ellipse(80, 18, 11, 8, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#2d2a26';
    c.beginPath();
    c.moveTo(89, 16);
    c.lineTo(99, 20);
    c.lineTo(89, 23);
    c.closePath();
    c.fill();
    olho(c, 83, 16, 2.2);
  });

  // Ornitorrinco (Ornithorhynchus anatinus): bico macio parecido com o de pato, cauda achatada, patas palmadas.
  texBicho('ornitorrinco', 120, 50, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#5b3e2a';
    c.beginPath();
    c.ellipse(16, 30, 16, 9, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#6b4a32';
    for (const x of [34, 72]) {
      c.beginPath();
      c.ellipse(x, 42, 9, 5, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    c.beginPath();
    c.ellipse(56, 28, 38, 15, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#8a6a4e';
    c.beginPath();
    c.ellipse(58, 36, 24, 5, 0, 0, Math.PI);
    c.fill();
    // bico
    c.fillStyle = '#4a4a50';
    c.beginPath();
    c.moveTo(88, 22);
    c.quadraticCurveTo(118, 18, 118, 29);
    c.quadraticCurveTo(116, 38, 88, 34);
    c.closePath();
    c.fill();
    c.stroke();
    olho(c, 84, 22, 2);
  });

  // Coala (Phascolarctos cinereus): sentado, orelhas redondas peludas, nariz grande e escuro.
  texBicho('coala', 90, 96, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.fillStyle = '#9a9ca3';
    c.beginPath();
    c.ellipse(46, 70, 28, 24, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#e9e9ec';
    c.beginPath();
    c.ellipse(46, 76, 14, 14, 0, 0, Math.PI * 2);
    c.fill();
    // braços segurando
    c.fillStyle = '#9a9ca3';
    for (const x of [26, 62]) {
      rrect(c, x, 70, 12, 22, 6);
      c.fill();
      c.stroke();
    }
    // orelhas peludas
    for (const x of [20, 72]) {
      c.fillStyle = '#9a9ca3';
      c.beginPath();
      c.arc(x, 22, 15, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.fillStyle = '#eeeef0';
      c.beginPath();
      c.arc(x, 23, 9, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#9a9ca3';
    c.beginPath();
    c.ellipse(46, 38, 26, 22, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    // nariz grande
    c.fillStyle = '#2a2a2e';
    c.beginPath();
    c.ellipse(46, 44, 8, 11, 0, 0, Math.PI * 2);
    c.fill();
    olho(c, 34, 36, 2.4);
    olho(c, 58, 36, 2.4);
  });
}
