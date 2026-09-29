// Desenho da família do Chico (mesmo estilo do Chico: contorno escuro, formas simples).
// Gera, para cada pessoa: corpo inteiro ("familia-<id>") e retrato redondo ("rosto-<id>").
// As cores e detalhes vêm de data/familia.ts.
import Phaser from 'phaser';
import { tex, rrect, OUTLINE, type Ctx } from './Textures';
import { FAMILIA, FAMILIARES, type VisualPessoa } from '../data/familia';

const LARG = 110;
const ALT = 190;

export function gerarFamilia(scene: Phaser.Scene) {
  for (const id of FAMILIARES) {
    const v = FAMILIA[id].visual;
    tex(scene, `familia-${id}`, LARG, ALT, (c) => corpo(c, v));
    tex(scene, `rosto-${id}`, 120, 120, (c) => retrato(c, v));
  }
  chamador(scene);
}

function escurecer(cor: string, f = 0.8) {
  const n = parseInt(cor.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `rgb(${r},${g},${b})`;
}

/** Cabeça virada para a direita, centro em (cx, cy), raio r. */
function cabeca(c: Ctx, v: VisualPessoa, cx: number, cy: number, r: number) {
  const s = r / 22;
  c.lineWidth = 3;
  c.strokeStyle = OUTLINE;
  // cabelo de trás (comprido, rabo, preso, coque)
  c.fillStyle = v.cabelo;
  if (v.penteado === 'comprido') {
    c.beginPath();
    // cabelo caindo pelas costas (atrás da nuca, sem aparecer embaixo do queixo)
    c.ellipse(cx - 13 * s, cy + 8 * s, 14 * s, 26 * s, 0.15, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  } else if (v.penteado === 'rabo') {
    c.beginPath();
    c.ellipse(cx - 24 * s, cy + 4 * s, 8 * s, 16 * s, 0.4, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  } else if (v.penteado === 'coque') {
    c.beginPath();
    c.arc(cx - 12 * s, cy - 22 * s, 9 * s, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  } else if (v.penteado === 'preso') {
    c.beginPath();
    c.arc(cx - 20 * s, cy - 8 * s, 8 * s, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }
  // orelha e rosto
  c.fillStyle = v.pele;
  c.beginPath();
  c.ellipse(cx - 14 * s, cy + 2 * s, 5 * s, 7 * s, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.beginPath();
  c.ellipse(cx, cy, r, r * 1.05, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = 'rgba(230,110,90,0.3)';
  c.beginPath();
  c.ellipse(cx + 12 * s, cy + 9 * s, 5 * s, 3.5 * s, 0, 0, Math.PI * 2);
  c.fill();
  // cabelo de cima
  c.fillStyle = v.cabelo;
  if (v.penteado === 'cacheado') {
    for (const [x, y, rr] of [
      [-16, -10, 9],
      [-8, -19, 9],
      [4, -21, 9],
      [15, -16, 8],
      [-20, 2, 8],
      [-18, 13, 7],
    ]) {
      c.beginPath();
      c.arc(cx + x * s, cy + y * s, rr * s, 0, Math.PI * 2);
      c.fill();
    }
  } else {
    c.beginPath();
    c.moveTo(cx - r - 1, cy + (v.penteado === 'curto' ? -2 : 6) * s);
    c.quadraticCurveTo(cx - r, cy - r * 1.25, cx + 6 * s, cy - r * 1.02);
    c.quadraticCurveTo(cx + r * 0.95, cy - r * 0.9, cx + r * 0.9, cy - 8 * s);
    c.quadraticCurveTo(cx + 4 * s, cy - 14 * s, cx - 8 * s, cy - 6 * s);
    c.closePath();
    c.fill();
  }
  // olhos (virado para a direita)
  for (const dx of [2, 13]) {
    c.fillStyle = '#fff';
    c.beginPath();
    c.ellipse(cx + dx * s, cy - 2 * s, 4.2 * s, 5.2 * s, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#2b1a10';
    c.beginPath();
    c.arc(cx + (dx + 1.2) * s, cy - 1.4 * s, 2.6 * s, 0, Math.PI * 2);
    c.fill();
  }
  if (v.oculos) {
    c.strokeStyle = '#3a2a2a';
    c.lineWidth = 2;
    for (const dx of [2, 13]) {
      c.beginPath();
      c.arc(cx + dx * s, cy - 2 * s, 6 * s, 0, Math.PI * 2);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(cx + 8 * s, cy - 2 * s);
    c.lineTo(cx + 7 * s, cy - 2 * s);
    c.moveTo(cx - 4 * s, cy - 3 * s);
    c.lineTo(cx - 14 * s, cy - 4 * s);
    c.stroke();
  }
  // bigode / barba
  if (v.barba) {
    c.fillStyle = v.cabelo;
    c.beginPath();
    c.moveTo(cx - 14 * s, cy + 6 * s);
    c.quadraticCurveTo(cx - 6 * s, cy + 26 * s, cx + 12 * s, cy + 20 * s);
    c.quadraticCurveTo(cx + 20 * s, cy + 14 * s, cx + 20 * s, cy + 8 * s);
    c.quadraticCurveTo(cx + 6 * s, cy + 14 * s, cx - 14 * s, cy + 6 * s);
    c.fill();
  }
  if (v.bigode || v.barba) {
    c.fillStyle = v.cabelo;
    c.beginPath();
    c.ellipse(cx + 12 * s, cy + 9 * s, 7 * s, 2.6 * s, -0.1, 0, Math.PI * 2);
    c.fill();
  }
  // sorriso
  c.strokeStyle = OUTLINE;
  c.lineWidth = 2.2;
  c.beginPath();
  c.arc(cx + 11 * s, cy + 11 * s, 5 * s, 0.15 * Math.PI, 0.8 * Math.PI);
  c.stroke();
  // chapéus
  if (v.extra === 'capacete') {
    c.fillStyle = v.corExtra ?? '#f2c230';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(cx - r - 2, cy - 8 * s);
    c.bezierCurveTo(cx - r, cy - r * 1.55, cx + r, cy - r * 1.55, cx + r + 2, cy - 8 * s);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillRect(cx - r - 4, cy - 10 * s, 2 * r + 12, 5 * s);
    c.strokeRect(cx - r - 4, cy - 10 * s, 2 * r + 12, 5 * s);
  } else if (v.extra === 'bone') {
    c.fillStyle = v.corExtra ?? '#d9434b';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(cx - r, cy - 8 * s);
    c.bezierCurveTo(cx - r, cy - r * 1.35, cx + r * 0.8, cy - r * 1.35, cx + r * 0.9, cy - 8 * s);
    c.closePath();
    c.fill();
    c.stroke();
    c.beginPath();
    c.ellipse(cx + r * 0.95, cy - 9 * s, 14 * s, 4 * s, 0.1, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  }
}

function corpo(c: Ctx, v: VisualPessoa) {
  c.save();
  // altura: encolhe a partir dos pés
  c.translate(LARG / 2, ALT);
  c.scale(v.altura, v.altura);
  c.translate(-LARG / 2, -ALT);
  const cx = 52;
  c.lineWidth = 3;
  c.strokeStyle = OUTLINE;
  // capa (atrás de tudo)
  if (v.extra === 'capa') {
    c.fillStyle = v.corExtra ?? '#5b3fa0';
    c.beginPath();
    c.moveTo(cx - 14, 72);
    c.quadraticCurveTo(cx - 44, 120, cx - 36, 168);
    c.lineTo(cx + 2, 160);
    c.lineTo(cx + 8, 76);
    c.closePath();
    c.fill();
    c.stroke();
  }
  // pernas
  c.fillStyle = v.calca;
  if (v.saia) {
    c.fillStyle = v.pele;
    for (const x of [cx - 12, cx + 2]) {
      rrect(c, x, 140, 10, 38, 4);
      c.fill();
      c.stroke();
    }
    c.fillStyle = v.calca;
    c.beginPath();
    c.moveTo(cx - 18, 110);
    c.lineTo(cx + 20, 110);
    c.lineTo(cx + 26, 150);
    c.lineTo(cx - 24, 150);
    c.closePath();
    c.fill();
    c.stroke();
  } else {
    for (const x of [cx - 14, cx + 2]) {
      rrect(c, x, 116, 13, 62, 5);
      c.fill();
      c.stroke();
    }
  }
  // sapatos
  c.fillStyle = v.sapato;
  for (const x of [cx - 14, cx + 2]) {
    rrect(c, x - 1, 174, 20, 12, 5);
    c.fill();
    c.stroke();
  }
  // braço de trás
  c.fillStyle = escurecer(v.blusa, 0.85);
  rrect(c, cx - 26, 76, 12, 44, 6);
  c.fill();
  c.stroke();
  // tronco
  c.fillStyle = v.blusa;
  rrect(c, cx - 20, 68, 42, 54, 12);
  c.fill();
  c.stroke();
  // objetos no peito
  if (v.extra === 'bussola') {
    // Bússola de Lili pendurada no pescoço
    c.strokeStyle = '#6b5a3a';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(cx - 8, 70);
    c.lineTo(cx + 2, 92);
    c.lineTo(cx + 12, 70);
    c.stroke();
    c.fillStyle = v.corExtra ?? '#e8b83a';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2.5;
    c.beginPath();
    c.arc(cx + 2, 97, 8, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = '#d9434b';
    c.beginPath();
    c.moveTo(cx + 2, 91);
    c.lineTo(cx + 5, 97);
    c.lineTo(cx - 1, 97);
    c.closePath();
    c.fill();
  } else if (v.extra === 'binoculo') {
    c.fillStyle = v.corExtra ?? '#2a2a2a';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    rrect(c, cx - 6, 88, 9, 14, 3);
    c.fill();
    rrect(c, cx + 5, 88, 9, 14, 3);
    c.fill();
  } else if (v.extra === 'capa') {
    // emblema de heroína no peito
    c.fillStyle = '#f2c230';
    c.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
      const rr = k % 2 === 0 ? 10 : 4.5;
      c.lineTo(cx + 2 + Math.cos(a) * rr, 92 + Math.sin(a) * rr);
    }
    c.closePath();
    c.fill();
    c.strokeStyle = OUTLINE;
    c.lineWidth = 2;
    c.stroke();
  }
  // braço da frente
  c.fillStyle = v.blusa;
  c.strokeStyle = OUTLINE;
  c.lineWidth = 3;
  rrect(c, cx + 12, 76, 12, 26, 6);
  c.fill();
  c.stroke();
  c.fillStyle = v.pele;
  rrect(c, cx + 13, 98, 10, 20, 5);
  c.fill();
  c.stroke();
  // livro (o Atlas) na mão da Tia Marcela
  if (v.extra === 'livro') {
    c.fillStyle = v.corExtra ?? '#7b3f8c';
    rrect(c, cx + 8, 100, 30, 24, 4);
    c.fill();
    c.stroke();
    c.fillStyle = '#f2c230';
    c.beginPath();
    c.arc(cx + 23, 112, 5, 0, Math.PI * 2);
    c.fill();
  }
  // pescoço e cabeça
  c.fillStyle = v.pele;
  rrect(c, cx - 5, 60, 12, 12, 3);
  c.fill();
  cabeca(c, v, cx + 2, 38, 22);
  c.restore();
}

function retrato(c: Ctx, v: VisualPessoa) {
  // fundo redondo claro e ombros
  c.fillStyle = '#fff4d6';
  c.strokeStyle = '#1d2b3a';
  c.lineWidth = 5;
  c.beginPath();
  c.arc(60, 60, 56, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.save();
  c.beginPath();
  c.arc(60, 60, 53, 0, Math.PI * 2);
  c.clip();
  if (v.extra === 'capa') {
    c.fillStyle = v.corExtra ?? '#5b3fa0';
    c.fillRect(0, 88, 120, 40);
  }
  c.fillStyle = v.blusa;
  c.strokeStyle = OUTLINE;
  c.lineWidth = 3;
  c.beginPath();
  c.ellipse(60, 122, 42, 30, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  cabeca(c, v, 58, 58, 30);
  c.restore();
}

// Chamador do Atlas: tabletzinho que mostra a chamada de vídeo das tias que moram longe.
function chamador(scene: Phaser.Scene) {
  tex(scene, 'chamador', 150, 124, (c, w, h) => {
    c.fillStyle = '#2a2f3a';
    c.strokeStyle = OUTLINE;
    c.lineWidth = 4;
    rrect(c, 3, 3, w - 6, h - 20, 14);
    c.fill();
    c.stroke();
    c.fillStyle = '#bfe3f2';
    rrect(c, 12, 12, w - 24, h - 38, 8);
    c.fill();
    // ícone de chamada (telefone verde) embaixo
    c.fillStyle = '#5cc26a';
    c.beginPath();
    c.arc(w / 2, h - 14, 12, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.strokeStyle = '#fff';
    c.lineWidth = 3.5;
    c.lineCap = 'round';
    c.beginPath();
    c.arc(w / 2, h - 12, 5, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
  });
}
