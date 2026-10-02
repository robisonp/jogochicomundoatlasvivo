// Redemoinho do Vento Viravolta: o "inimigo" que anda para lá e para cá. Não é um bicho (os bichos são amigos
// do Atlas): é um pedaço de vento travesso, e pular em cima dele desmancha o redemoinho e solta a página
// que o Viravolta tinha levado. Cara travessa, nada assustador.
import Phaser from 'phaser';
import { tex, OUTLINE } from './Textures';

export function gerarInimigos(scene: Phaser.Scene) {
  for (const [key, inclina] of [
    ['redemoinho', 0],
    ['redemoinho-2', 1],
  ] as const) {
    tex(scene, key, 76, 76, (c) => {
      // funil de vento: largo em cima, fino embaixo (com um leve balanço entre os dois quadros)
      const d = inclina ? 3 : -3;
      const funil = () => {
        c.beginPath();
        c.moveTo(8 + d, 14);
        c.quadraticCurveTo(38, 2, 68 + d, 14);
        c.quadraticCurveTo(60, 40, 44, 58);
        c.quadraticCurveTo(40, 70, 34, 74);
        c.quadraticCurveTo(32, 64, 30, 58);
        c.quadraticCurveTo(14, 40, 8 + d, 14);
        c.closePath();
      };
      const g = c.createLinearGradient(0, 0, 0, 76);
      g.addColorStop(0, '#dfe8f0');
      g.addColorStop(1, '#a9b8c8');
      c.fillStyle = g;
      funil();
      c.fill();
      c.strokeStyle = OUTLINE;
      c.lineWidth = 3;
      c.lineJoin = 'round';
      funil();
      c.stroke();
      // faixas do vento girando
      c.strokeStyle = 'rgba(90,110,135,0.55)';
      c.lineWidth = 2.5;
      c.lineCap = 'round';
      for (const [y, l] of [
        [20, 26],
        [44, 14],
        [58, 7],
      ]) {
        c.beginPath();
        c.ellipse(38 + (inclina ? 2 : -2), y, l, 4, 0, inclina ? 0.2 : Math.PI + 0.2, inclina ? Math.PI - 0.2 : 2 * Math.PI - 0.2);
        c.stroke();
      }
      // cara travessa: olhos grandes, sobrancelhas levantadas e um sorrisinho de lado
      for (const x of [29, 46]) {
        c.fillStyle = '#fff';
        c.beginPath();
        c.ellipse(x, 30, 6, 7, 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = OUTLINE;
        c.lineWidth = 2;
        c.stroke();
        c.fillStyle = OUTLINE;
        c.beginPath();
        c.arc(x + 1.5, 31, 3, 0, Math.PI * 2);
        c.fill();
      }
      c.strokeStyle = OUTLINE;
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(23, 22);
      c.lineTo(33, 18);
      c.moveTo(42, 21);
      c.lineTo(52, 22);
      c.stroke();
      c.beginPath();
      c.moveTo(31, 41);
      c.quadraticCurveTo(39, 46, 47, 39);
      c.stroke();
    });
  }
}
