// Mapa-múndi: os 8 mundos da campanha, em ordem, com onde ficam (longitude/latitude) e o que o narrador fala.
// Regra do GDD: nome do continente e do país ou região, sem dizer que o bicho vive "só" ali.
// `mostrar` desloca o marcador quando dois mundos ficam muito perto no mapa (uma linha liga ao lugar certo).
import type { MundoId } from './mundos';

export interface MundoNoMapa {
  id: MundoId;
  nome: string;
  /** Fala da chegada: onde fica. */
  lugar: string;
  lon: number;
  lat: number;
  mostrar?: { lon: number; lat: number };
  /** Textura do selo (só nos mundos que já existem no jogo). */
  selo?: string;
  /** Id do selo salvo quando o mundo é concluído. */
  seloId?: string;
}

export const MAPA_MUNDOS: MundoNoMapa[] = [
  { id: 'caatinga', nome: 'Caatinga', lugar: 'no sertão da Paraíba, no Brasil, na América do Sul', lon: -38, lat: -7, mostrar: { lon: -41, lat: -9 }, selo: 'selo-sertao', seloId: 'sertao' },
  { id: 'amazonia', nome: 'Amazônia', lugar: 'no norte do Brasil, na América do Sul', lon: -62, lat: -4, selo: 'selo-amazonia', seloId: 'amazonia' },
  { id: 'savana', nome: 'Savana', lugar: 'no Quênia e na Tanzânia, na África', lon: 36, lat: -3, selo: 'selo-savana', seloId: 'savana' },
  { id: 'australia', nome: 'Austrália', lugar: 'na Austrália, na Oceania', lon: 134, lat: -25, selo: 'selo-australia', seloId: 'australia' },
  { id: 'artico', nome: 'Ártico', lugar: 'no norte do mundo, perto do Canadá e da Noruega', lon: 15, lat: 76, mostrar: { lon: 15, lat: 70 }, selo: 'selo-artico', seloId: 'artico' },
  { id: 'antartica', nome: 'Antártica', lugar: 'no extremo sul do planeta, um continente sem um único país', lon: 0, lat: -75, mostrar: { lon: -10, lat: -68 }, selo: 'selo-antartica', seloId: 'antartica' },
  { id: 'praia', nome: 'Praia', lugar: 'no litoral do Brasil, pertinho de casa', lon: -32.4, lat: -3.9, mostrar: { lon: -22, lat: 3 }, selo: 'selo-praia', seloId: 'praia' },
  { id: 'dinossauros', nome: 'Brasil dos Dinossauros', lugar: 'em Sousa, na Paraíba, no Brasil', lon: -38.2, lat: -6.8, mostrar: { lon: -29, lat: -24 }, selo: 'selo-dinossauros', seloId: 'dinossauros' },
];
