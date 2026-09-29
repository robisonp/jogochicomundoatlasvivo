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
//   <  vento soprando para a esquerda   >  vento soprando para a direita (Vento Viravolta)
//   U  começa a chover quando o Chico passa aqui (na Caatinga, depois fica verde)
//   ~  água rasa (o Chico boia e nada)   w  água funda (só com o poder "Nado da Onça")
//   J  cipó (escala como a escada)       Z  chamado de bicho: som + ondas visuais mostram o caminho
//   B  pedregulho (2x2, marcado no bloco de baixo à esquerda): só se move com a força do elefante
//   :  rastros de bicho no chão (decoração que mostra o caminho)

import type { Personagem } from '../systems/VoiceManager';
import type { MundoId } from '../data/mundos';

export const LINHAS = 13;

export type Poder = 'bola' | 'onca' | 'arrancada' | 'forca';

export interface Fala {
  texto: string;
  quem: Personagem;
}

export interface AnimalNaFase {
  /** Id da ficha do animal (docs/DOSSIE-CIENTIFICO.md). */
  id:
    | 'moco'
    | 'tatu-bola'
    | 'asa-branca'
    | 'carcara'
    | 'prea'
    | 'onca'
    | 'arara'
    | 'preguica'
    | 'boto'
    | 'perereca'
    | 'guepardo'
    | 'elefante'
    | 'girafa'
    | 'zebra'
    | 'avestruz';
  /** Fala tirada do dossiê científico. */
  fala: string;
  curiosidade?: string;
  /** Demonstração ao encontrar o Chico. */
  demo:
    | { tipo: 'pular'; dx: number; dy: number }
    | { tipo: 'voar'; dx: number; dy: number }
    | { tipo: 'correr'; dx: number }
    | { tipo: 'nadar'; dx: number }
    | { tipo: 'ficar' }
    | { tipo: 'empurrar' }
    | { tipo: 'bola' };
  /** Poder que o Chico ganha depois da demonstração. */
  daPoder?: Poder;
}

export interface LevelDef {
  id: string;
  nome: string;
  mundo: MundoId;
  /** Fala ao começar a fase. */
  abertura?: Fala;
  /** Uma fala por placa "S", na ordem em que aparecem da esquerda para a direita. */
  placas: Fala[];
  /** Dica da Vovó Lili por trecho (índice do checkpoint: 0 = início). */
  dicas: Record<number, string>;
  /** Animais "A", na ordem em que aparecem da esquerda para a direita. */
  animais?: AnimalNaFase[];
  /** Falas da chuva (marcador U): quando começa e quando a Caatinga fica verde. */
  chuva?: { comeca: Fala; verde: Fala };
  /** Última fase do mundo: o objetivo é o Selo do mundo em vez do Atlas. */
  selo?: { id: string; fala: Fala };
  trechos: string[][];
}
