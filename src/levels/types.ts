// Formato de fase: uma lista de "trechos" desenhados em texto, colados lado a lado.
// Cada trecho tem LINHAS linhas (as que faltarem em cima são preenchidas com vazio).
//
// Legenda:
//   .  vazio                     #  chão (terra)
//   =  laje (atravessa por baixo) ^  espinhos (xique-xique)
//   o  pegada (colecionável)     C  checkpoint
//   P  início do Chico           G  Atlas (fim da fase)
//   H  escada de corda           S  placa de som (dica falada)
//   M  página voando (horizontal) V  página voando (vertical)

import type { Personagem } from '../systems/VoiceManager';

export const LINHAS = 13;

export interface Fala {
  texto: string;
  quem: Personagem;
}

export interface LevelDef {
  id: string;
  nome: string;
  mundo: string;
  /** Fala ao começar a fase. */
  abertura?: Fala;
  /** Uma fala por placa "S", na ordem em que aparecem da esquerda para a direita. */
  placas: Fala[];
  /** Dica da Vovó Lili por trecho (índice do checkpoint: 0 = início). */
  dicas: Record<number, string>;
  trechos: string[][];
}
