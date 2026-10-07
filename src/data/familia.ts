// A família do Chico no jogo: o papel de cada um (GDD) e quem aparece em pessoa ou por chamada de vídeo.
// A aparência vem da arte feita pela família, recortada numa folha só: public/familia/familia.png
// (quadros "corpo-<id>" e "rosto-<id>", descritos em familia.json).
import type { Personagem } from '../systems/VoiceManager';

export type Familiar = Exclude<Personagem, 'narrador' | 'bicho'>;

export interface PessoaDaFamilia {
  /** Função no jogo (GDD). */
  papel: string;
  /** Kelly e Laura moram longe: aparecem por chamada de vídeo no Chamador do Atlas. */
  presencial: boolean;
}

export const FAMILIA: Record<Familiar, PessoaDaFamilia> = {
  lili: {
    papel: 'Vovó Lili, a Sábia: dicas depois de várias tentativas (Bússola de Lili)',
    presencial: true,
  },
  marcos: {
    papel: 'Vovô Marcos, o Construtor Viajante: escadas de corda, pontes e bordas',
    presencial: true,
  },
  marcela: {
    papel: 'Tia Marcela, a Guardiã das Histórias: mandou o Atlas Vivo e abre os mundos',
    presencial: true,
  },
  robi: {
    papel: 'Tio Robi, o Companheiro de Brincadeira: desafios de corrida e de pulo',
    presencial: true,
  },
  july: {
    papel: 'Mamãe July, a Super-heroína: resgates',
    presencial: true,
  },
  kelly: {
    // nas fases aparece por chamada de vídeo; entre um mundo e outro, escala com o Chico em pessoa (EscaladaScene)
    papel: 'Tia Kelly, Exploradora à Distância: chamadas de vídeo com dicas de escalada e trilha; segura uma das cordas na escalada entre os mundos',
    presencial: false,
  },
  laura: {
    papel: 'Tia Laura, Exploradora à Distância: chamadas de vídeo sobre natureza e montanha; segura a outra corda na escalada entre os mundos',
    presencial: false,
  },
};

export const FAMILIARES = Object.keys(FAMILIA) as Familiar[];

export function ehFamiliar(quem: Personagem): quem is Familiar {
  return quem in FAMILIA;
}
