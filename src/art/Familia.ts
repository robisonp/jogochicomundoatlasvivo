// Chamador do Atlas (tabletzinho das chamadas de vídeo), desenhado por código.
// A família em si vem da arte feita pela família (public/familia/*.png, carregada na BootScene).
import Phaser from 'phaser';
import { tex, rrect, OUTLINE } from './Textures';

export function gerarFamilia(scene: Phaser.Scene) {
  chamador(scene);
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
