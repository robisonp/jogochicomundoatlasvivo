// Arte da Cozinha da Vovó Lili: ingredientes, tigelas, panela, cestas, pratos prontos e o botão da tela de início.
// Tudo desenhado por código, no mesmo traço do resto do jogo.
import Phaser from 'phaser';
import { tex, rrect, OUTLINE, type Ctx } from './Textures';

export function gerarCozinha(scene: Phaser.Scene) {
  gerarIngredientes(scene);
  gerarUtensilios(scene);
  gerarPratos(scene);
}

const contorno = (c: Ctx, cor: string, esp = 3) => {
  c.fillStyle = cor;
  c.fill();
  c.strokeStyle = OUTLINE;
  c.lineWidth = esp;
  c.lineJoin = 'round';
  c.stroke();
};

const folha = (c: Ctx, x: number, y: number, rx: number, ry: number, a: number, cor = '#4f9a3a') => {
  c.save();
  c.translate(x, y);
  c.rotate(a);
  c.beginPath();
  c.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  contorno(c, cor, 2.5);
  c.restore();
};

const brilho = (c: Ctx, x: number, y: number, rx: number, ry: number) => {
  c.fillStyle = 'rgba(255,255,255,0.45)';
  c.beginPath();
  c.ellipse(x, y, rx, ry, -0.5, 0, Math.PI * 2);
  c.fill();
};

function gerarIngredientes(scene: Phaser.Scene) {
  const ing = (key: string, draw: (c: Ctx) => void) => tex(scene, `ing-${key}`, 100, 100, draw);

  ing('morango', (c) => {
    c.beginPath();
    c.moveTo(50, 92);
    c.bezierCurveTo(14, 70, 14, 30, 50, 30);
    c.bezierCurveTo(86, 30, 86, 70, 50, 92);
    contorno(c, '#e0333a');
    c.fillStyle = '#ffe08a';
    for (const [x, y] of [[38, 46], [56, 44], [46, 58], [62, 58], [40, 70], [54, 74], [66, 48]]) {
      c.beginPath();
      c.ellipse(x, y, 2, 3, 0, 0, Math.PI * 2);
      c.fill();
    }
    for (const a of [-0.9, -0.3, 0.3, 0.9]) folha(c, 50 + Math.sin(a) * 12, 28, 10, 5, a);
  });

  ing('maca', (c) => {
    c.beginPath();
    c.moveTo(50, 32);
    c.bezierCurveTo(78, 18, 96, 46, 82, 74);
    c.bezierCurveTo(72, 94, 58, 92, 50, 88);
    c.bezierCurveTo(42, 92, 28, 94, 18, 74);
    c.bezierCurveTo(4, 46, 22, 18, 50, 32);
    contorno(c, '#d62f2f');
    brilho(c, 34, 46, 7, 12);
    c.strokeStyle = '#6b4a2a';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(50, 32);
    c.quadraticCurveTo(52, 18, 58, 12);
    c.stroke();
    folha(c, 66, 20, 11, 5, -0.4);
  });

  ing('banana', (c) => {
    c.beginPath();
    c.moveTo(16, 30);
    c.quadraticCurveTo(26, 86, 86, 74);
    c.quadraticCurveTo(90, 70, 84, 66);
    c.quadraticCurveTo(38, 70, 26, 26);
    c.closePath();
    contorno(c, '#f5d23a');
    c.fillStyle = '#5a4022';
    c.fillRect(14, 22, 12, 9);
    c.strokeStyle = 'rgba(160,120,20,0.5)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(24, 40);
    c.quadraticCurveTo(36, 72, 80, 70);
    c.stroke();
  });

  ing('abacaxi', (c) => {
    for (const [x, a] of [[42, -0.5], [50, 0], [58, 0.5], [46, -0.2], [54, 0.2]]) {
      c.save();
      c.translate(x, 30);
      c.rotate(a);
      c.beginPath();
      c.moveTo(-5, 4);
      c.lineTo(0, -26);
      c.lineTo(5, 4);
      c.closePath();
      contorno(c, '#3f8a3a', 2);
      c.restore();
    }
    c.beginPath();
    c.ellipse(50, 64, 24, 30, 0, 0, Math.PI * 2);
    contorno(c, '#f2b631');
    c.save();
    c.beginPath();
    c.ellipse(50, 64, 24, 30, 0, 0, Math.PI * 2);
    c.clip();
    c.strokeStyle = 'rgba(150,90,20,0.6)';
    c.lineWidth = 2;
    for (let k = -60; k < 60; k += 11) {
      c.beginPath();
      c.moveTo(26 + k, 34);
      c.lineTo(86 + k, 94);
      c.moveTo(74 - k, 34);
      c.lineTo(14 - k, 94);
      c.stroke();
    }
    c.restore();
  });

  ing('uva', (c) => {
    c.strokeStyle = '#6b4a2a';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(50, 22);
    c.lineTo(54, 10);
    c.stroke();
    folha(c, 64, 16, 11, 6, -0.3);
    for (const [x, y] of [[38, 30], [52, 28], [66, 32], [32, 44], [46, 44], [60, 46], [40, 58], [54, 60], [48, 74]]) {
      c.beginPath();
      c.arc(x, y + 6, 9, 0, Math.PI * 2);
      contorno(c, '#8fcf4a', 2.5);
      brilho(c, x - 3, y + 3, 2, 3);
    }
  });

  ing('kiwi', (c) => {
    c.beginPath();
    c.arc(50, 52, 36, 0, Math.PI * 2);
    contorno(c, '#8a6a3a');
    c.fillStyle = '#7fc23a';
    c.beginPath();
    c.arc(50, 52, 29, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#f2f0c8';
    c.beginPath();
    c.arc(50, 52, 10, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = OUTLINE;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      c.beginPath();
      c.ellipse(50 + Math.cos(a) * 16, 52 + Math.sin(a) * 16, 2, 3.5, a, 0, Math.PI * 2);
      c.fill();
    }
  });

  ing('tomate', (c) => {
    c.beginPath();
    c.ellipse(50, 56, 36, 32, 0, 0, Math.PI * 2);
    contorno(c, '#e5402f');
    brilho(c, 34, 44, 8, 6);
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
      folha(c, 50 + Math.cos(a) * 9, 26 + Math.sin(a) * 5, 9, 3.5, a, '#3f8a3a');
    }
  });

  ing('batata', (c) => {
    c.beginPath();
    c.ellipse(50, 54, 38, 30, 0.2, 0, Math.PI * 2);
    contorno(c, '#c9955a');
    c.fillStyle = '#9a6a3a';
    for (const [x, y] of [[36, 46], [62, 50], [48, 66], [70, 64]]) {
      c.beginPath();
      c.arc(x, y, 2.5, 0, Math.PI * 2);
      c.fill();
    }
  });

  ing('cebola', (c) => {
    c.beginPath();
    c.moveTo(50, 18);
    c.bezierCurveTo(56, 32, 86, 40, 82, 66);
    c.bezierCurveTo(78, 88, 22, 88, 18, 66);
    c.bezierCurveTo(14, 40, 44, 32, 50, 18);
    contorno(c, '#b0587a');
    c.strokeStyle = 'rgba(255,255,255,0.4)';
    c.lineWidth = 2;
    for (const dx of [-12, 0, 12]) {
      c.beginPath();
      c.moveTo(50 + dx * 0.3, 30);
      c.quadraticCurveTo(50 + dx * 2.2, 60, 50 + dx, 84);
      c.stroke();
    }
  });

  ing('cenoura', (c) => {
    for (const a of [-0.5, 0, 0.5]) folha(c, 26 + a * 8, 22 + Math.abs(a) * 4, 12, 4, -2.2 + a);
    c.beginPath();
    c.moveTo(22, 30);
    c.quadraticCurveTo(36, 22, 42, 34);
    c.lineTo(88, 84);
    c.quadraticCurveTo(84, 90, 78, 86);
    c.lineTo(20, 46);
    c.quadraticCurveTo(14, 38, 22, 30);
    contorno(c, '#f08a2a');
    c.strokeStyle = 'rgba(150,70,10,0.5)';
    c.lineWidth = 2;
    for (const t of [0.3, 0.5, 0.7]) {
      const x = 30 + t * 50;
      const y = 38 + t * 44;
      c.beginPath();
      c.moveTo(x - 4, y + 4);
      c.lineTo(x + 3, y - 3);
      c.stroke();
    }
  });

  ing('vagem', (c) => {
    c.beginPath();
    c.moveTo(12, 70);
    c.quadraticCurveTo(50, 30, 90, 26);
    c.quadraticCurveTo(92, 34, 86, 36);
    c.quadraticCurveTo(52, 46, 18, 80);
    c.quadraticCurveTo(10, 78, 12, 70);
    contorno(c, '#5cae3e');
    c.fillStyle = 'rgba(255,255,255,0.35)';
    for (const t of [0.25, 0.45, 0.65]) {
      c.beginPath();
      c.ellipse(20 + t * 70, 66 - t * 38, 5, 3, -0.6, 0, Math.PI * 2);
      c.fill();
    }
  });

  ing('milho', (c) => {
    c.beginPath();
    c.ellipse(52, 50, 16, 40, 0.5, 0, Math.PI * 2);
    contorno(c, '#f5cf3a');
    c.save();
    c.beginPath();
    c.ellipse(52, 50, 16, 40, 0.5, 0, Math.PI * 2);
    c.clip();
    c.fillStyle = '#e0b020';
    for (let i = -6; i < 7; i++) for (let j = -2; j < 3; j++) {
      c.beginPath();
      c.arc(52 + j * 7 + i * 3.5, 50 + i * 6.5 - j * 2, 2, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
    folha(c, 38, 72, 22, 7, -1.1, '#7cb84a');
    folha(c, 30, 66, 22, 7, -0.6, '#6aa83a');
  });

  ing('melancia', (c) => {
    c.beginPath();
    c.ellipse(50, 52, 44, 34, 0, 0, Math.PI * 2);
    contorno(c, '#3f8a3a');
    c.save();
    c.beginPath();
    c.ellipse(50, 52, 44, 34, 0, 0, Math.PI * 2);
    c.clip();
    c.strokeStyle = '#2a6a2a';
    c.lineWidth = 6;
    for (let x = 10; x < 100; x += 16) {
      c.beginPath();
      c.moveTo(x, 14);
      c.quadraticCurveTo(x + 10, 52, x, 90);
      c.stroke();
    }
    c.restore();
    brilho(c, 30, 36, 10, 5);
  });

  ing('abobora', (c) => {
    for (const [x, rx] of [[30, 20], [70, 20], [50, 22]]) {
      c.beginPath();
      c.ellipse(x, 58, rx, 30, 0, 0, Math.PI * 2);
      contorno(c, '#f09a2a');
    }
    c.fillStyle = '#6b4a2a';
    c.fillRect(46, 18, 9, 14);
    folha(c, 64, 24, 11, 5, -0.4);
  });

  ing('jabuticaba', (c) => {
    for (const [x, y] of [[36, 46], [60, 40], [48, 64], [70, 64]]) {
      c.beginPath();
      c.arc(x, y, 14, 0, Math.PI * 2);
      contorno(c, '#3a2244');
      brilho(c, x - 5, y - 5, 3, 4);
    }
  });

  ing('ovo', (c) => {
    c.beginPath();
    c.moveTo(50, 12);
    c.bezierCurveTo(78, 12, 86, 62, 80, 74);
    c.bezierCurveTo(72, 92, 28, 92, 20, 74);
    c.bezierCurveTo(14, 62, 22, 12, 50, 12);
    contorno(c, '#fbf3e0');
    brilho(c, 38, 34, 6, 10);
  });
}

function gerarUtensilios(scene: Phaser.Scene) {
  // Tigela branca com faixa azul (a marca de cor ou forma vai na frente, desenhada na cena)
  tex(scene, 'tigela', 220, 120, (c) => {
    c.beginPath();
    c.moveTo(8, 22);
    c.lineTo(212, 22);
    c.quadraticCurveTo(206, 112, 110, 114);
    c.quadraticCurveTo(14, 112, 8, 22);
    c.closePath();
    contorno(c, '#f4f4f0', 4);
    c.fillStyle = '#e2e8ee';
    c.beginPath();
    c.ellipse(110, 22, 102, 12, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = '#5b8fd0';
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(20, 44);
    c.quadraticCurveTo(110, 56, 200, 44);
    c.stroke();
  });

  // Panela com alças (sopa)
  tex(scene, 'panela', 240, 140, (c) => {
    for (const x of [6, 210]) {
      rrect(c, x, 40, 24, 14, 6);
      contorno(c, '#6b6b6b');
    }
    rrect(c, 26, 26, 188, 108, 18);
    contorno(c, '#9aa4ae', 4);
    c.fillStyle = '#7e8892';
    c.fillRect(30, 26, 180, 14);
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(44, 54, 12, 60);
  });

  // Cesta de palha (feira): a pequena é a mesma, menor na cena
  tex(scene, 'cesta', 240, 150, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 9;
    c.beginPath();
    c.arc(120, 70, 80, Math.PI * 1.05, Math.PI * 1.95);
    c.stroke();
    c.strokeStyle = '#b8864e';
    c.lineWidth = 5;
    c.stroke();
    c.beginPath();
    c.moveTo(14, 56);
    c.lineTo(226, 56);
    c.lineTo(204, 146);
    c.lineTo(36, 146);
    c.closePath();
    contorno(c, '#d4a464', 4);
    c.strokeStyle = 'rgba(120,80,30,0.55)';
    c.lineWidth = 3;
    for (let y = 72; y < 146; y += 16) {
      c.beginPath();
      c.moveTo(18 + (y - 56) * 0.2, y);
      c.lineTo(222 - (y - 56) * 0.2, y);
      c.stroke();
    }
    for (let x = 40; x < 210; x += 22) {
      c.beginPath();
      c.moveTo(x, 58);
      c.lineTo(x + (x < 120 ? 4 : -4), 144);
      c.stroke();
    }
  });

  // Marcas das formas (sopa): bolinha (redondo) e palito (comprido)
  tex(scene, 'marca-redondo', 70, 70, (c) => {
    c.beginPath();
    c.arc(35, 35, 26, 0, Math.PI * 2);
    contorno(c, '#fff6dc', 4);
    c.beginPath();
    c.arc(35, 35, 14, 0, Math.PI * 2);
    contorno(c, '#e5402f', 3);
  });
  tex(scene, 'marca-comprido', 70, 70, (c) => {
    c.beginPath();
    c.arc(35, 35, 26, 0, Math.PI * 2);
    contorno(c, '#fff6dc', 4);
    rrect(c, 12, 29, 46, 12, 6);
    contorno(c, '#f08a2a', 3);
  });

  // Cadeado de receita fechada
  tex(scene, 'cadeado', 60, 70, (c) => {
    c.strokeStyle = OUTLINE;
    c.lineWidth = 8;
    c.beginPath();
    c.arc(30, 28, 15, Math.PI, 0);
    c.stroke();
    c.strokeStyle = '#c9c9c9';
    c.lineWidth = 4;
    c.stroke();
    rrect(c, 8, 28, 44, 36, 8);
    contorno(c, '#f2b93b', 3);
    c.fillStyle = OUTLINE;
    c.beginPath();
    c.arc(30, 44, 5, 0, Math.PI * 2);
    c.fill();
  });

  // Botão da cozinha na tela de início: panela com vapor
  tex(scene, 'btn-cozinha', 130, 130, (c) => {
    c.beginPath();
    c.arc(65, 65, 58, 0, Math.PI * 2);
    contorno(c, '#f08a3a', 6);
    c.strokeStyle = '#fff';
    c.lineWidth = 6;
    c.beginPath();
    c.arc(65, 65, 52, 0, Math.PI * 2);
    c.stroke();
    c.lineCap = 'round';
    c.lineWidth = 5;
    for (const x of [50, 65, 80]) {
      c.beginPath();
      c.moveTo(x, 50);
      c.quadraticCurveTo(x - 6, 42, x, 34);
      c.quadraticCurveTo(x + 6, 26, x, 20);
      c.stroke();
    }
    c.fillStyle = '#fff';
    rrect(c, 32, 60, 66, 40, 10);
    c.fill();
    c.fillRect(24, 58, 82, 8);
    c.fillRect(22, 70, 12, 8);
    c.fillRect(96, 70, 12, 8);
  });
}

function gerarPratos(scene: Phaser.Scene) {
  const ingrediente = (c: Ctx, key: string, x: number, y: number, s: number) => {
    const t = scene.textures.get(`ing-${key}`).getSourceImage() as HTMLCanvasElement;
    c.drawImage(t, x - 50 * s, y - 50 * s, 100 * s, 100 * s);
  };
  // Salada de frutas na tigela
  tex(scene, 'prato-salada', 260, 180, (c) => {
    ingrediente(c, 'banana', 70, 62, 0.8);
    ingrediente(c, 'morango', 120, 50, 0.8);
    ingrediente(c, 'uva', 170, 56, 0.8);
    ingrediente(c, 'kiwi', 100, 74, 0.7);
    ingrediente(c, 'maca', 150, 74, 0.7);
    const t = scene.textures.get('tigela').getSourceImage() as HTMLCanvasElement;
    c.drawImage(t, 20, 64, 220, 110);
  });
  // Sopa de legumes na panela, com vapor
  tex(scene, 'prato-sopa', 260, 190, (c) => {
    c.strokeStyle = 'rgba(255,255,255,0.9)';
    c.lineWidth = 6;
    c.lineCap = 'round';
    for (const x of [90, 130, 170]) {
      c.beginPath();
      c.moveTo(x, 50);
      c.quadraticCurveTo(x - 10, 34, x, 20);
      c.quadraticCurveTo(x + 10, 6, x, 0);
      c.stroke();
    }
    c.fillStyle = '#f2b04a';
    c.beginPath();
    c.ellipse(130, 66, 92, 14, 0, 0, Math.PI * 2);
    c.fill();
    ingrediente(c, 'cenoura', 100, 62, 0.45);
    ingrediente(c, 'tomate', 150, 62, 0.4);
    ingrediente(c, 'vagem', 180, 64, 0.4);
    const t = scene.textures.get('panela').getSourceImage() as HTMLCanvasElement;
    c.drawImage(t, 10, 50, 240, 140);
  });
  // Cesta cheia da feira
  tex(scene, 'prato-feira', 260, 190, (c) => {
    ingrediente(c, 'melancia', 90, 70, 0.9);
    ingrediente(c, 'abacaxi', 160, 48, 0.9);
    ingrediente(c, 'abobora', 200, 80, 0.7);
    const t = scene.textures.get('cesta').getSourceImage() as HTMLCanvasElement;
    c.drawImage(t, 10, 40, 240, 150);
  });
  // Bolo de cenoura com cobertura de chocolate
  tex(scene, 'prato-bolo', 260, 180, (c) => {
    c.beginPath();
    c.ellipse(130, 150, 120, 22, 0, 0, Math.PI * 2);
    contorno(c, '#f4f4f0');
    rrect(c, 40, 60, 180, 88, 16);
    contorno(c, '#f0a03a');
    c.beginPath();
    c.moveTo(40, 82);
    c.quadraticCurveTo(40, 54, 70, 54);
    c.lineTo(190, 54);
    c.quadraticCurveTo(220, 54, 220, 82);
    for (let x = 210; x > 40; x -= 20) c.quadraticCurveTo(x - 5, 96, x - 10, 82);
    c.closePath();
    contorno(c, '#5a3220');
    c.fillStyle = '#ffd766';
    for (const x of [80, 120, 160, 190]) {
      c.beginPath();
      c.arc(x, 64, 3, 0, Math.PI * 2);
      c.fill();
    }
  });
}
