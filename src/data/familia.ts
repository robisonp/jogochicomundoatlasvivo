// A família do Chico no jogo. O desenho de cada pessoa é gerado a partir daqui:
// ajuste cores, penteado, óculos, barba etc. para ficar parecido com cada um (como em data/visual.ts para o Chico).
// Personagens estilizados, sem fotos (o repositório é público).
import type { Personagem } from '../systems/VoiceManager';

export type Familiar = Exclude<Personagem, 'narrador' | 'bicho'>;

export interface VisualPessoa {
  pele: string;
  cabelo: string;
  penteado: 'curto' | 'coque' | 'comprido' | 'rabo' | 'cacheado' | 'preso';
  oculos?: boolean;
  bigode?: boolean;
  barba?: boolean;
  blusa: string;
  calca: string;
  /** Saia ou vestido no lugar da calça. */
  saia?: boolean;
  sapato: string;
  /** Objeto que mostra o papel de cada um no jogo (GDD, seção "Elenco"). */
  extra?: 'bussola' | 'capacete' | 'livro' | 'bone' | 'capa' | 'binoculo';
  corExtra?: string;
  /** 1 = adulto padrão. */
  altura: number;
}

export interface PessoaDaFamilia {
  /** Função no jogo (GDD). */
  papel: string;
  /** Kelly e Laura moram longe: aparecem por chamada de vídeo no Chamador do Atlas. */
  presencial: boolean;
  visual: VisualPessoa;
}

export const FAMILIA: Record<Familiar, PessoaDaFamilia> = {
  lili: {
    papel: 'Vovó Lili, a Sábia: dicas depois de várias tentativas (Bússola de Lili)',
    presencial: true,
    visual: {
      pele: '#e8b48f',
      cabelo: '#d9d5cc',
      penteado: 'coque',
      oculos: true,
      blusa: '#9b6bb5',
      calca: '#7d4f97',
      saia: true,
      sapato: '#5a3a2a',
      extra: 'bussola',
      corExtra: '#e8b83a',
      altura: 0.95,
    },
  },
  marcos: {
    papel: 'Vovô Marcos, o Construtor Viajante: escadas de corda, pontes e bordas',
    presencial: true,
    visual: {
      pele: '#d9a07a',
      cabelo: '#c9c4bb',
      penteado: 'curto',
      bigode: true,
      blusa: '#4f7cc4',
      calca: '#6b5a4a',
      sapato: '#3a2a1e',
      extra: 'capacete',
      corExtra: '#f2c230',
      altura: 1.02,
    },
  },
  marcela: {
    papel: 'Tia Marcela, a Guardiã das Histórias: mandou o Atlas Vivo e abre os mundos',
    presencial: true,
    visual: {
      pele: '#e2a77a',
      cabelo: '#5a3a22',
      penteado: 'comprido',
      blusa: '#e0763b',
      calca: '#3f4f7a',
      sapato: '#5a2a2a',
      extra: 'livro',
      corExtra: '#7b3f8c',
      altura: 0.97,
    },
  },
  robi: {
    papel: 'Tio Robi, o Companheiro de Brincadeira: desafios de corrida e de pulo',
    presencial: true,
    visual: {
      pele: '#c98a5e',
      cabelo: '#2a1c14',
      penteado: 'curto',
      barba: true,
      blusa: '#f2c230',
      calca: '#3f6fb5',
      sapato: '#e8e8e8',
      extra: 'bone',
      corExtra: '#d9434b',
      altura: 1.05,
    },
  },
  july: {
    papel: 'Mamãe July, a Super-heroína: resgates',
    presencial: true,
    visual: {
      pele: '#e2a77a',
      cabelo: '#3a2418',
      penteado: 'rabo',
      blusa: '#d9434b',
      calca: '#2f3b66',
      sapato: '#2a2a3a',
      extra: 'capa',
      corExtra: '#5b3fa0',
      altura: 0.98,
    },
  },
  kelly: {
    papel: 'Tia Kelly, Exploradora à Distância: chamadas de vídeo com dicas de escalada e trilha',
    presencial: false,
    visual: {
      pele: '#e6b08a',
      cabelo: '#8a4a2a',
      penteado: 'preso',
      blusa: '#4f8a4a',
      calca: '#5a5a4a',
      sapato: '#4a3a2a',
      extra: 'binoculo',
      corExtra: '#2a2a2a',
      altura: 0.96,
    },
  },
  laura: {
    papel: 'Tia Laura, Exploradora à Distância: chamadas de vídeo sobre natureza e montanha',
    presencial: false,
    visual: {
      pele: '#e8b894',
      cabelo: '#c99a4a',
      penteado: 'cacheado',
      blusa: '#2f7d7a',
      calca: '#4a4a5a',
      sapato: '#4a3a2a',
      altura: 0.96,
    },
  },
};

export const FAMILIARES = Object.keys(FAMILIA) as Familiar[];

export function ehFamiliar(quem: Personagem): quem is Familiar {
  return quem in FAMILIA;
}
