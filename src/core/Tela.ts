// Tamanho do jogo na tela do aparelho.
// O jogo ocupa a tela toda, sem barras: a largura (ou a altura) cresce conforme a proporção da tela, sempre com
// pelo menos 1280x720 visíveis. Cada tela é montada com esse tamanho quando abre. Se a tela do aparelho muda
// depois (o celular abriu em pé e foi girado, a barra do navegador sumiu, entrou em tela cheia), as telas de menu
// são remontadas na hora com o tamanho novo. No meio de uma fase nada é remontado: o jogo só encolhe para
// caber (com faixas nas bordas) até a próxima tela de menu.
import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

/** Telas que podem ser remontadas a qualquer momento sem perder nada importante. */
const REMONTAVEIS = new Set(['Titulo', 'Mapa', 'Atlas', 'Cozinha']);

let jogo: Phaser.Game | undefined;
let espera: number | undefined;

/** Tamanho ideal para a tela do aparelho agora (em pé, conta como deitado: a tela pede para girar). */
export function tamanhoIdeal(): { w: number; h: number } {
  const el = document.getElementById('game');
  let largura = el?.clientWidth || window.innerWidth;
  let altura = el?.clientHeight || window.innerHeight;
  if (altura > largura) [largura, altura] = [altura, largura];
  const proporcao = largura / Math.max(1, altura);
  const base = GAME_WIDTH / GAME_HEIGHT;
  // telas muito compridas ou muito quadradas ganham faixas nas bordas, em vez de esticar demais o cenário
  if (proporcao >= base) return { w: Math.round(GAME_HEIGHT * Math.min(proporcao, 2.6)), h: GAME_HEIGHT };
  return { w: GAME_WIDTH, h: Math.round(GAME_WIDTH / Math.max(proporcao, 4 / 3)) };
}

function precisaMudar() {
  if (!jogo) return false;
  const { w, h } = tamanhoIdeal();
  return Math.abs(w - jogo.scale.width) > 4 || Math.abs(h - jogo.scale.height) > 4;
}

/** Ajusta o tamanho do jogo à tela; chamado no começo do create() das telas de menu, antes de montar. */
export function ajustarTela() {
  if (!jogo || !precisaMudar()) return;
  const { w, h } = tamanhoIdeal();
  jogo.scale.setGameSize(w, h);
}

/** Abertas agora (rodando, pausadas ou dormindo). */
function cenasAbertas(game: Phaser.Game) {
  return game.scene.scenes.filter((s) => {
    const k = s.sys.settings.key;
    return game.scene.isActive(k) || game.scene.isPaused(k) || game.scene.isSleeping(k);
  });
}

function aoMudarATela() {
  const game = jogo;
  if (!game || !precisaMudar()) return;
  const abertas = cenasAbertas(game);
  const chaves = abertas.map((s) => s.sys.settings.key);
  if (chaves.includes('Boot')) {
    // ainda carregando: a primeira tela já abre no tamanho certo
    ajustarTela();
    return;
  }
  if (!chaves.every((k) => REMONTAVEIS.has(k))) return; // numa fase: espera a próxima tela de menu
  ajustarTela();
  for (const s of abertas) s.scene.restart();
}

/** Liga a observação da tela; o tamanho inicial vem de tamanhoIdeal(). */
export function observarTela(game: Phaser.Game) {
  jogo = game;
  const agendar = () => {
    window.clearTimeout(espera);
    // espera a tela parar de mudar (girar o celular dispara vários avisos seguidos)
    espera = window.setTimeout(aoMudarATela, 250);
  };
  window.addEventListener('resize', agendar);
  window.addEventListener('orientationchange', agendar);
  window.visualViewport?.addEventListener('resize', agendar);
  document.addEventListener('fullscreenchange', agendar);
}
