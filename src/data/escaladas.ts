// Escaladas com as Tias Kelly e Laura: uma pedra depois de cada mundo.
// As tias viajam pelo mundo escalando; o Atlas leva o Chico até a pedra delas, perto do mundo que ele terminou.
// Cada uma segura uma corda (segurança de escalada). Algumas agarras piscam numa ordem: o Chico memoriza e sobe.
// As falas são sobre escalada, segurança e cuidado com a natureza (valores, não fatos científicos).
import type { Familiar } from './familia';
import type { MundoId } from './mundos';

export interface Fala {
  quem: Familiar;
  texto: string;
}

export interface Escalada {
  mundo: MundoId;
  /** Agarras na pedra (as certas e as outras). */
  agarras: number;
  /** Quantas agarras piscam (o caminho até o topo). */
  passos: number;
  /** Quanto tempo cada agarra fica acesa ao piscar (ms). */
  piscaMs: number;
  /** Cor do mosquetão ganho no topo. */
  cor: number;
  chegada: Fala;
  licao: Fala;
  topo: Fala;
}

export const ESCALADAS: Escalada[] = [
  {
    mundo: 'caatinga',
    agarras: 8,
    passos: 3,
    piscaMs: 950,
    cor: 0xf2a93b,
    chegada: { quem: 'laura', texto: 'Que lajedo bonito! A pedra é firme e boa para escalar.' },
    licao: { quem: 'kelly', texto: 'Fogueira no mato pode virar um incêndio. A gente não faz!' },
    topo: { quem: 'laura', texto: 'Lá de cima dá para ver o sertão inteiro!' },
  },
  {
    mundo: 'amazonia',
    agarras: 10,
    passos: 3,
    piscaMs: 850,
    cor: 0x5cc26a,
    chegada: { quem: 'kelly', texto: 'Que paredão no meio da floresta!' },
    licao: { quem: 'laura', texto: 'Na trilha, o lixo vai com a gente na mochila até em casa.' },
    topo: { quem: 'kelly', texto: 'Olha o tapete verde das árvores lá embaixo!' },
  },
  {
    mundo: 'savana',
    agarras: 11,
    passos: 4,
    piscaMs: 850,
    cor: 0xe8c547,
    chegada: { quem: 'laura', texto: 'Que pedras redondas no meio do capim!' },
    licao: { quem: 'kelly', texto: 'Se encontrar um bicho na trilha, olhe de longe e deixe ele em paz.' },
    topo: { quem: 'laura', texto: 'Daqui de cima, o capim parece um mar dourado!' },
  },
  {
    mundo: 'australia',
    agarras: 12,
    passos: 4,
    piscaMs: 750,
    cor: 0xe5584a,
    chegada: { quem: 'kelly', texto: 'Que pedra vermelha!' },
    licao: { quem: 'laura', texto: 'Nesta pedra pode escalar. Mas algumas pedras são sagradas para os povos daqui, e nessas a gente não sobe.' },
    topo: { quem: 'kelly', texto: 'Que vista do deserto vermelho!' },
  },
  {
    mundo: 'artico',
    agarras: 14,
    passos: 5,
    piscaMs: 750,
    cor: 0x5bb0e8,
    chegada: { quem: 'laura', texto: 'Pedra com neve! Hoje o casaco é bem quentinho.' },
    licao: { quem: 'kelly', texto: 'Fique na trilha, para não pisar nas plantinhas.' },
    topo: { quem: 'laura', texto: 'Tudo branquinho lá embaixo!' },
  },
  {
    mundo: 'antartica',
    agarras: 15,
    passos: 5,
    piscaMs: 750,
    cor: 0xc77dff,
    chegada: { quem: 'kelly', texto: 'Uma pedra escura no meio do gelo!' },
    licao: { quem: 'laura', texto: 'Não escreva nem desenhe nas pedras. A natureza é bonita do jeito que é.' },
    topo: { quem: 'kelly', texto: 'Olha o mar gelado lá embaixo!' },
  },
  {
    mundo: 'praia',
    agarras: 16,
    passos: 6,
    piscaMs: 750,
    cor: 0x2fb9b0,
    chegada: { quem: 'laura', texto: 'Uma pedra bem na beira do mar!' },
    licao: { quem: 'kelly', texto: 'Ninho de passarinho a gente olha de longe e não mexe.' },
    topo: { quem: 'laura', texto: 'Escuta as ondas lá embaixo!' },
  },
  {
    mundo: 'dinossauros',
    agarras: 17,
    passos: 6,
    piscaMs: 700,
    cor: 0xf07ab0,
    chegada: { quem: 'kelly', texto: 'Uma pedra feita de camadas, uma em cima da outra!' },
    licao: { quem: 'laura', texto: 'Fósseis e pedras ficam onde estão. Tirar foto pode, levar para casa não.' },
    topo: { quem: 'kelly', texto: 'Agora vamos para a festa! A família toda está esperando.' },
  },
];

/** Falas que valem para todas as pedras. */
export const FALAS_ESCALADA = {
  /** Só na primeira escalada: as tias explicam quem são e por que estão ali. */
  primeiraVez: [
    { quem: 'kelly', texto: 'Surpresa, Chico! A Tia Kelly e a Tia Laura vieram escalar com você!' },
    { quem: 'laura', texto: 'A gente viaja pelo mundo escalando pedras. O Atlas trouxe você até aqui!' },
    { quem: 'kelly', texto: 'Cada uma de nós segura uma corda. Com a corda, você está seguro.' },
    { quem: 'laura', texto: 'O capacete protege a cabeça. Escalador sempre usa!' },
  ] as Fala[],
  olhar: { quem: 'kelly', texto: 'Olhe bem as agarras que vão piscar!' } as Fala,
  suaVez: { quem: 'laura', texto: 'Agora é sua vez! Toque nas agarras na ordem.' } as Fala,
  maoPe: { quem: 'laura', texto: 'Mão, pé, mão. Uma agarra de cada vez!' } as Fala,
  caiu: [
    { quem: 'kelly', texto: 'Tudo bem! A corda segurou você. Vamos olhar de novo?' },
    { quem: 'laura', texto: 'Escalar é com calma. Respira e olha de novo.' },
  ] as Fala[],
  dica: { quem: 'kelly', texto: 'Olha! A agarra certa está brilhando de leve.' } as Fala,
  passoAPasso: { quem: 'laura', texto: 'Vamos de uma em uma: olhe a próxima agarra.' } as Fala,
  chegou: { quem: 'kelly', texto: 'Chegou no topo! Você é um escalador!' } as Fala,
  mosquetao: { quem: 'laura', texto: 'Ganhou um mosquetão para a coleção!' } as Fala,
};

export const escaladaDe = (mundo: string) => ESCALADAS.find((e) => e.mundo === mundo);
