// Área dos adultos (acesso segurando a engrenagem por 2 segundos). Pode ter texto: não é para o Chico.
import Phaser from 'phaser';
import { SaveManager } from '../core/SaveManager';
import { AudioManager } from '../systems/AudioManager';
import { estiloTexto } from '../ui/widgets';

export class AdultScene extends Phaser.Scene {
  private voltarPara = 'Titulo';
  private linhas: Phaser.GameObjects.GameObject[] = [];
  private confirmarApagar = false;

  constructor() {
    super('Adulto');
  }

  init(data: { voltarPara: string }) {
    this.voltarPara = data.voltarPara;
    this.confirmarApagar = false;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0x10202e, 0.96).setOrigin(0).setInteractive();
    this.add.text(W / 2, 50, 'Área dos adultos', estiloTexto(40)).setOrigin(0.5);
    this.desenhar();
  }

  private desenhar() {
    this.linhas.forEach((l) => l.destroy());
    this.linhas = [];
    const { width: W } = this.scale;
    const s = SaveManager.data.settings;
    let y = 130;
    const x0 = W / 2 - 420;

    const rotulo = (txt: string) => {
      this.linhas.push(this.add.text(x0, y, txt, estiloTexto(26)).setOrigin(0, 0.5));
    };
    const botao = (x: number, txt: string, acao: () => void, destaque = false) => {
      const t = this.add
        .text(x, y, txt, {
          ...estiloTexto(24),
          backgroundColor: destaque ? '#3f9e6b' : '#2e4a63',
          padding: { x: 16, y: 10 },
        })
        .setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true });
      t.on('pointerdown', () => {
        AudioManager.tocar('botao');
        acao();
        SaveManager.salvar();
        AudioManager.aplicarVolumes();
        this.desenhar();
      });
      this.linhas.push(t);
      return t;
    };
    const volume = (nome: string, chave: 'volumeVoz' | 'volumeMusica' | 'volumeEfeitos') => {
      rotulo(nome);
      botao(x0 + 420, ' – ', () => (s[chave] = Math.max(0, +(s[chave] - 0.25).toFixed(2))));
      this.linhas.push(this.add.text(x0 + 520, y, `${Math.round(s[chave] * 100)}%`, estiloTexto(26)).setOrigin(0, 0.5));
      botao(x0 + 620, ' + ', () => (s[chave] = Math.min(1, +(s[chave] + 0.25).toFixed(2))));
      y += 70;
    };

    rotulo('Controles na tela');
    botao(x0 + 420, 'Direcional à direita', () => (s.controles = 'dpad-direita'), s.controles === 'dpad-direita');
    y += 64;
    botao(x0 + 420, 'Direcional à esquerda', () => (s.controles = 'dpad-esquerda'), s.controles === 'dpad-esquerda');
    y += 76;
    volume('Volume da voz', 'volumeVoz');
    volume('Volume da música', 'volumeMusica');
    volume('Volume dos efeitos', 'volumeEfeitos');
    rotulo('Reduzir movimento');
    botao(x0 + 420, s.reduzirMovimento ? 'Ligado' : 'Desligado', () => (s.reduzirMovimento = !s.reduzirMovimento), s.reduzirMovimento);
    y += 76;
    rotulo('Progresso');
    botao(x0 + 420, 'Copiar código do save', () => {
      const cod = SaveManager.exportar();
      navigator.clipboard?.writeText(cod).catch(() => window.prompt('Código do save:', cod));
    });
    y += 64;
    botao(x0 + 420, 'Colar código do save', () => {
      const cod = window.prompt('Cole o código do save:');
      if (cod && !SaveManager.importar(cod)) window.alert('Código inválido.');
    });
    y += 64;
    // Confirmação por dois toques (sem caixas de diálogo do navegador).
    botao(x0 + 420, this.confirmarApagar ? 'Toque de novo para apagar' : 'Apagar progresso', () => {
      if (this.confirmarApagar) SaveManager.apagarTudo();
      this.confirmarApagar = !this.confirmarApagar;
    }, this.confirmarApagar);

    const fechar = this.add
      .text(W - 40, 50, '✕', { ...estiloTexto(40), backgroundColor: '#2e4a63', padding: { x: 16, y: 4 } })
      .setOrigin(1, 0.5)
      .setInteractive({ useHandCursor: true });
    fechar.on('pointerdown', () => {
      AudioManager.tocar('botao');
      this.scene.stop();
      if (this.voltarPara === 'Titulo') this.scene.resume('Titulo');
      // Reposiciona controles de toque com o lado novo, se a fase estiver aberta.
      if (this.scene.isActive('Hud') || this.scene.isPaused('Hud')) {
        const hud = this.scene.get('Hud') as Phaser.Scene & { controles?: { posicionar(): void } };
        hud.controles?.posicionar();
      }
    });
    this.linhas.push(fechar);
  }
}
