// Formato de fase: uma lista de "trechos" desenhados em texto, colados lado a lado.
// Cada trecho tem LINHAS linhas (as que faltarem em cima são preenchidas com vazio).
//
// Legenda:
//   .  vazio                      #  chão (terra)
//   R  rocha (lajedo)             =  laje (atravessa por baixo)
//   ^  espinhos (xique-xique)     o  pegada (colecionável)
//   C  checkpoint                 P  início do Chico
//   G  Atlas (fim da fase)        H  escada de corda
//   S  placa de som (dica falada) A  animal da fase (na ordem de `animais`)
//   M  página voando (horizontal) V  página voando (vertical)
//   Q  pedrinhas caindo daqui (perigo; o poder "Virar bola" protege)

import type { Personagem } from '../systems/VoiceManager';

export const LINHAS = 13;

export type Poder = 'bola';

export interface Fala {
  texto: string;
  quem: Personagem;
}

export interface AnimalNaFase {
  /** Id da ficha do animal (docs/DOSSIE-CIENTIFICO.md). */
  id: 'moco' | 'tatu-bola';
  /** Fala tirada do dossiê científico. */
  fala: string;
  curiosidade?: string;
  /** Demonstração ao encontrar o Chico. */
  demo: { tipo: 'pular'; dx: number; dy: number } | { tipo: 'bola' };
  /** Poder que o Chico ganha depois da demonstração. */
  daPoder?: Poder;
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
  /** Animais "A", na ordem em que aparecem da esquerda para a direita. */
  animais?: AnimalNaFase[];
  trechos: string[][];
}
