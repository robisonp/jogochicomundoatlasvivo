import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager';

/** Botão-imagem grande com retorno visual e sonoro. */
export function botaoGrande(
  scene: Phaser.Scene,
  x: number,
  y: number,
  textura: string,
  aoTocar: () => void,
  escala = 1,
): Phaser.GameObjects.Image {
  const img = scene.add.image(x, y, textura).setScale(escala).setInteractive({ useHandCursor: true });
  img.on('pointerdown', () => {
    AudioManager.desbloquear();
    AudioManager.tocar('botao');
    scene.tweens.add({
      targets: img,
      scale: { from: escala * 0.88, to: escala },
      duration: 160,
      onComplete: aoTocar,
    });
  });
  return img;
}

/**
 * Engrenagem da área adulta: precisa segurar por 2 segundos (evita que a criança entre sem querer).
 */
export function engrenagemAdulta(scene: Phaser.Scene, x: number, y: number, aoAbrir: () => void) {
  const g = scene.add.image(x, y, 'engrenagem').setInteractive({ useHandCursor: true }).setAlpha(0.7);
  const anel = scene.add.graphics();
  let inicio = 0;
  let segurando = false;
  const desenhar = (frac: number) => {
    anel.clear();
    if (frac <= 0) return;
    anel.lineStyle(6, 0xffd766, 1);
    anel.beginPath();
    anel.arc(g.x, g.y, 38, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    anel.strokePath();
  };
  g.on('pointerdown', () => {
    segurando = true;
    inicio = scene.time.now;
  });
  const soltar = () => {
    segurando = false;
    desenhar(0);
  };
  g.on('pointerup', soltar);
  g.on('pointerout', soltar);
  const aoAtualizar = () => {
    if (!segurando) return;
    const frac = (scene.time.now - inicio) / 2000;
    desenhar(Math.min(1, frac));
    if (frac >= 1) {
      soltar();
      aoAbrir();
    }
  };
  scene.events.on(Phaser.Scenes.Events.UPDATE, aoAtualizar);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => scene.events.off(Phaser.Scenes.Events.UPDATE, aoAtualizar));
  return g;
}

export const estiloTexto = (tamanho = 32, cor = '#ffffff'): Phaser.Types.GameObjects.Text.TextStyle => ({
  fontFamily: 'system-ui, sans-serif',
  fontSize: `${tamanho}px`,
  fontStyle: 'bold',
  color: cor,
  stroke: '#1d2b3a',
  strokeThickness: Math.max(4, tamanho / 6),
});
