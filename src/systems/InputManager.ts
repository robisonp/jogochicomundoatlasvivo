// Junta teclado, controle (gamepad) e toque em uma única "intenção" por frame.
import Phaser from 'phaser';

/** Estado escrito pelos controles de toque (TouchControls). */
export const touchState = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  action: false,
  power: false,
};

export interface Intent {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jumpHeld: boolean;
  jumpPressed: boolean;
  actionPressed: boolean;
  powerPressed: boolean;
  pausePressed: boolean;
}

export class InputManager {
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private prev = { jump: false, action: false, power: false, pause: false };
  intent: Intent = {
    left: false,
    right: false,
    up: false,
    down: false,
    jumpHeld: false,
    jumpPressed: false,
    actionPressed: false,
    powerPressed: false,
    pausePressed: false,
  };

  constructor(private scene: Phaser.Scene) {
    const kb = scene.input.keyboard;
    if (kb) {
      this.keys = kb.addKeys({
        left: 'LEFT',
        right: 'RIGHT',
        up: 'UP',
        down: 'DOWN',
        a: 'A',
        d: 'D',
        w: 'W',
        s: 'S',
        space: 'SPACE',
        z: 'Z',
        x: 'X',
        e: 'E',
        c: 'C',
        shift: 'SHIFT',
        esc: 'ESC',
        p: 'P',
      }) as Record<string, Phaser.Input.Keyboard.Key>;
      kb.addCapture('SPACE,UP,DOWN,LEFT,RIGHT');
    }
  }

  update(): Intent {
    const k = this.keys;
    const down = (name: string) => !!k[name]?.isDown;
    const pad = this.scene.input.gamepad?.pad1;

    let left = down('left') || down('a') || touchState.left;
    let right = down('right') || down('d') || touchState.right;
    let up = down('up') || down('w') || touchState.up;
    let dn = down('down') || down('s') || touchState.down;
    let jump = down('space') || down('z') || touchState.jump;
    let action = down('x') || down('e') || touchState.action;
    let power = down('c') || down('shift') || touchState.power;
    let pause = down('esc') || down('p');

    if (pad) {
      const ax = pad.leftStick.x;
      const ay = pad.leftStick.y;
      left ||= pad.left || ax < -0.4;
      right ||= pad.right || ax > 0.4;
      up ||= pad.up || ay < -0.5;
      dn ||= pad.down || ay > 0.5;
      jump ||= pad.A;
      action ||= pad.X || pad.B;
      power ||= pad.Y || pad.R1 > 0 || pad.L1 > 0;
      pause ||= !!pad.buttons[9]?.pressed;
    }

    const i = this.intent;
    i.left = left && !right;
    i.right = right && !left;
    i.up = up;
    i.down = dn;
    i.jumpHeld = jump;
    i.jumpPressed = jump && !this.prev.jump;
    i.actionPressed = action && !this.prev.action;
    i.powerPressed = power && !this.prev.power;
    i.pausePressed = pause && !this.prev.pause;
    this.prev = { jump, action, power, pause };
    return i;
  }
}
