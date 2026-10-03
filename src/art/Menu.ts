// Arte do menu de entrada: o letreiro "CHICO e o Atlas Vivo" e o botão COMEÇAR.
import Phaser from 'phaser';
import { tex, rrect, OUTLINE, type Ctx } from './Textures';

const FONTE = '900 {t}px system-ui, "Arial Black", sans-serif';
const fonte = (t: number) => FONTE.replace('{t}', String(t));

export function gerarMenu(scene: Phaser.Scene) {
  // Letreiro: CHICO em letras coloridas e tortinhas, com a faixa roxa do Atlas embaixo
  tex(scene, 'logo', 820, 300, (c, w) => {
    const letras = [
      ['C', '#f2a93b', -0.12],
      ['H', '#5cc26a', 0.06],
      ['I', '#5bb0e8', -0.05],
      ['C', '#e5584a', 0.08],
      ['O', '#ffd23f', -0.06],
    ] as const;
    c.font = fonte(150);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const larguras = letras.map(([l]) => c.measureText(l).width + 6);
    const total = larguras.reduce((a, b) => a + b, 0);
    let x = (w - total) / 2;
    letras.forEach(([l, cor, giro], i) => {
      const cx = x + larguras[i] / 2;
      x += larguras[i];
      c.save();
      c.translate(cx, 104 + (i % 2 ? 6 : -6));
      c.rotate(giro);
      c.lineJoin = 'round';
      // sombra, contorno escuro grosso, contorno branco e a cor
      c.fillStyle = 'rgba(29,43,58,0.35)';
      c.fillText(l, 6, 10);
      c.strokeStyle = OUTLINE;
      c.lineWidth = 26;
      c.strokeText(l, 0, 0);
      c.strokeStyle = '#fff';
      c.lineWidth = 12;
      c.strokeText(l, 0, 0);
      c.fillStyle = cor;
      c.fillText(l, 0, 0);
      // brilho em cima da letra
      c.save();
      c.beginPath();
      c.rect(-60, -80, 120, 50);
      c.clip();
      c.fillStyle = 'rgba(255,255,255,0.35)';
      c.fillText(l, 0, 0);
      c.restore();
      c.restore();
    });

    // faixa roxa com as pontas dobradas
    const fy = 200;
    const fh = 76;
    const pontas = (x0: number, dir: number) => {
      c.beginPath();
      c.moveTo(x0, fy + 14);
      c.lineTo(x0 + dir * 70, fy + 14);
      c.lineTo(x0 + dir * 70, fy + fh + 14);
      c.lineTo(x0, fy + fh + 14);
      c.lineTo(x0 + dir * 26, fy + 14 + fh / 2);
      c.closePath();
      c.fillStyle = '#5b3a8c';
      c.fill();
      c.strokeStyle = OUTLINE;
      c.lineWidth = 5;
      c.lineJoin = 'round';
      c.stroke();
    };
    pontas(110, -1);
    pontas(w - 110, 1);
    rrect(c, 130, fy, w - 260, fh, 14);
    c.fillStyle = '#7c4fb8';
    c.fill();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 6;
    c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.35)';
    c.lineWidth = 3;
    c.setLineDash([10, 8]);
    rrect(c, 142, fy + 10, w - 284, fh - 20, 10);
    c.stroke();
    c.setLineDash([]);
    c.font = fonte(46);
    c.lineJoin = 'round';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 10;
    c.strokeText('e o ATLAS VIVO', w / 2, fy + fh / 2 + 2);
    c.fillStyle = '#fff4d6';
    c.fillText('e o ATLAS VIVO', w / 2, fy + fh / 2 + 2);
    // estrelinhas nas pontas da faixa
    for (const [sx, sy, r] of [
      [184, fy + fh / 2, 12],
      [w - 184, fy + fh / 2, 12],
    ]) {
      estrela(c, sx, sy, r, '#ffd23f');
    }
  });

  // Botão COMEÇAR: pílula verde com o símbolo de "jogar" (quem não lê reconhece o triângulo)
  tex(scene, 'btn-comecar', 440, 150, (c) => {
    rrect(c, 10, 18, 420, 124, 62);
    c.fillStyle = '#2f7f3c';
    c.fill();
    rrect(c, 10, 8, 420, 124, 62);
    const g = c.createLinearGradient(0, 8, 0, 132);
    g.addColorStop(0, '#7fdc8a');
    g.addColorStop(1, '#45a956');
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 8;
    c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.3)';
    rrect(c, 40, 18, 360, 34, 17);
    c.fill();
    // círculo com o triângulo
    c.beginPath();
    c.arc(78, 70, 44, 0, Math.PI * 2);
    c.fillStyle = '#fff';
    c.fill();
    c.fillStyle = '#45a956';
    c.beginPath();
    c.moveTo(64, 46);
    c.lineTo(102, 70);
    c.lineTo(64, 94);
    c.closePath();
    c.fill();
    c.font = fonte(48);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.lineJoin = 'round';
    c.strokeStyle = '#1f5a2a';
    c.lineWidth = 10;
    c.strokeText('COMEÇAR', 272, 72);
    c.fillStyle = '#fff';
    c.fillText('COMEÇAR', 272, 72);
  });

  // Plaquinha de madeira para os nomes embaixo dos botões
  tex(scene, 'plaquinha', 150, 44, (c) => {
    rrect(c, 3, 3, 144, 38, 12);
    c.fillStyle = '#c98a4b';
    c.fill();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.3)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(16, 12);
    c.lineTo(134, 12);
    c.stroke();
  });
}

function estrela(c: Ctx, x: number, y: number, r: number, cor: string) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath();
  c.fillStyle = cor;
  c.fill();
  c.strokeStyle = OUTLINE;
  c.lineWidth = 2.5;
  c.stroke();
}
