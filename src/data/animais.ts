// Fichas do Atlas. Todo conteúdo vem de docs/DOSSIE-CIENTIFICO.md (falas curtas, sem números para a criança).
// A linha "adulto" traz nome científico e conservação para a família; não é lida em voz alta.

export type RegiaoMapa = 'nordeste' | 'amazonia' | 'brasil' | 'america-do-sul';

export interface FichaAnimal {
  id: string;
  nome: string;
  mundo: 'caatinga' | 'amazonia';
  textura: string;
  /** Onde aparece no mapinha. */
  regiao: RegiaoMapa;
  falas: {
    /** Fala do próprio bicho ao abrir a ficha (a mesma da fase). */
    apresentacao: string;
    mapa: string;
    comida: string;
    tamanho: string;
    curiosidade: string;
  };
  adulto: string;
}

export const ANIMAIS: FichaAnimal[] = [
  {
    id: 'tatu-bola',
    nome: 'Tatu-bola',
    mundo: 'caatinga',
    textura: 'tatu',
    regiao: 'nordeste',
    falas: {
      apresentacao: 'Quando há perigo, eu me fecho numa bola!',
      mapa: 'Eu vivo no Brasil, principalmente no Nordeste, na Caatinga e no Cerrado.',
      comida: 'Eu como insetos e outros bichinhos bem pequenos.',
      tamanho: 'Sou do tamanho de um gato pequeno, mas bem baixinho.',
      curiosidade: 'Sou um tatu que só vive no Brasil!',
    },
    adulto: 'Tolypeutes tricinctus · IUCN: Vulnerável · Brasil: Em Perigo',
  },
  {
    id: 'moco',
    nome: 'Mocó',
    mundo: 'caatinga',
    textura: 'moco',
    regiao: 'nordeste',
    falas: {
      apresentacao: 'Eu conheço cada cantinho entre estas pedras!',
      mapa: 'Eu vivo no Nordeste do Brasil, entre as pedras da Caatinga.',
      comida: 'Eu como folhas, brotos e cascas.',
      tamanho: 'Sou parecido com um coelho pequeno.',
      curiosidade: 'Minhas patas me ajudam a subir nos lajedos!',
    },
    adulto: 'Kerodon rupestris · IUCN: Menos Preocupante',
  },
  {
    id: 'asa-branca',
    nome: 'Asa-branca',
    mundo: 'caatinga',
    textura: 'asa-branca',
    regiao: 'america-do-sul',
    falas: {
      apresentacao: 'Eu voo por muitos lugares procurando comida e água!',
      mapa: 'Eu vivo no Brasil e em outros países da América do Sul.',
      comida: 'Eu como sementes e frutos.',
      tamanho: 'Sou maior que um pombo da cidade.',
      curiosidade: 'Nem toda asa-branca faz a mesma viagem todo ano!',
    },
    adulto: 'Patagioenas picazuro · IUCN: Menos Preocupante',
  },
  {
    id: 'carcara',
    nome: 'Carcará',
    mundo: 'caatinga',
    textura: 'carcara',
    regiao: 'america-do-sul',
    falas: {
      apresentacao: 'Do alto, observo o sertão e encontro meu caminho!',
      mapa: 'Eu vivo em quase todo o Brasil e em outros países da América do Sul.',
      comida: 'Eu como insetos e pequenos animais.',
      tamanho: 'Sou uma ave grande, do comprimento do braço de uma criança.',
      curiosidade: 'Eu também caminho muito bem pelo chão!',
    },
    adulto: 'Caracara plancus · IUCN: Menos Preocupante',
  },
  {
    id: 'prea',
    nome: 'Preá',
    mundo: 'caatinga',
    textura: 'prea',
    regiao: 'nordeste',
    falas: {
      apresentacao: 'Sou pequeno e conheço os caminhos por baixo da vegetação!',
      mapa: 'Eu vivo no Brasil, na Caatinga e em lugares perto dela.',
      comida: 'Eu como folhas, brotos e outras plantas.',
      tamanho: 'Sou parecido com um porquinho-da-índia pequeno.',
      curiosidade: 'Minha cauda é tão pequena que quase não aparece!',
    },
    adulto: 'Galea spixii · IUCN: Menos Preocupante',
  },
  // ---------------------------------------------------------------- Amazônia
  {
    id: 'onca',
    nome: 'Onça-pintada',
    mundo: 'amazonia',
    textura: 'onca',
    regiao: 'america-do-sul',
    falas: {
      apresentacao: 'Eu atravesso rios nadando com muita habilidade!',
      mapa: 'Eu vivo do México até a América do Sul. Muitas onças vivem no Brasil.',
      comida: 'Eu como outros animais.',
      tamanho: 'Sou muito maior e mais forte que um gato de casa.',
      curiosidade: 'Sou o maior felino das Américas!',
    },
    adulto: 'Panthera onca · IUCN: Quase Ameaçada · Brasil: Vulnerável',
  },
  {
    id: 'arara',
    nome: 'Arara-vermelha',
    mundo: 'amazonia',
    textura: 'arara',
    regiao: 'america-do-sul',
    falas: {
      apresentacao: 'Minhas asas me levam por cima das grandes árvores!',
      mapa: 'Eu vivo no Brasil, no Peru, na Bolívia e em outros países.',
      comida: 'Eu como frutos, sementes e castanhas.',
      tamanho: 'Com a minha cauda comprida, sou quase do tamanho de uma criança pequena.',
      curiosidade: 'Machos e fêmeas da minha espécie são muito parecidos!',
    },
    adulto: 'Ara chloropterus (arara-vermelha-grande) · IUCN: Menos Preocupante · Brasil: Quase Ameaçada',
  },
  {
    id: 'preguica',
    nome: 'Preguiça',
    mundo: 'amazonia',
    textura: 'preguica',
    regiao: 'america-do-sul',
    falas: {
      apresentacao: 'Minhas garras me ajudam a ficar firme nos galhos!',
      mapa: 'Eu vivo no alto das florestas do Brasil e de outros países.',
      comida: 'Eu como principalmente folhas, e também flores e frutos.',
      tamanho: 'Sou do tamanho de um gato grande, com braços compridos.',
      curiosidade: 'Algas podem crescer no meu pelo!',
    },
    adulto: 'Bradypus variegatus (preguiça-de-garganta-marrom) · IUCN: Menos Preocupante',
  },
  {
    id: 'boto',
    nome: 'Boto-cor-de-rosa',
    mundo: 'amazonia',
    textura: 'boto',
    regiao: 'amazonia',
    falas: {
      apresentacao: 'Eu viro meu corpo depressa entre árvores e rios!',
      mapa: 'Eu vivo nos rios da Amazônia e do Orinoco.',
      comida: 'Eu como principalmente peixes.',
      tamanho: 'Sou mais comprido do que um adulto é alto.',
      curiosidade: 'Eu consigo nadar para trás!',
    },
    adulto: 'Inia geoffrensis · IUCN: Em Perigo · Brasil: Em Perigo',
  },
  {
    id: 'perereca',
    nome: 'Perereca-leiteira',
    mundo: 'amazonia',
    textura: 'perereca',
    regiao: 'amazonia',
    falas: {
      apresentacao: 'Meus dedos grudentos me ajudam a subir bem alto!',
      mapa: 'Eu vivo na floresta amazônica, em vários países.',
      comida: 'Eu como insetos e outros bichinhos pequenos.',
      tamanho: 'Eu caibo na palma de uma mão.',
      curiosidade: 'Eu quase nunca desço até o chão!',
    },
    adulto: 'Trachycephalus resinifictrix · IUCN: Menos Preocupante',
  },
];

export const MUNDOS_ATLAS = [
  {
    id: 'caatinga',
    nome: 'Caatinga',
    selo: 'sertao',
    nomeSelo: 'Selo do Sertão',
    texturaSelo: 'selo-sertao',
    abertura: 'Aqui a chuva é rara, mas a Caatinga está cheia de vida!',
  },
  {
    id: 'amazonia',
    nome: 'Amazônia',
    selo: 'amazonia',
    nomeSelo: 'Selo da Amazônia',
    texturaSelo: 'selo-amazonia',
    abertura: 'Uma floresta enorme, cheia de rios, árvores e sons!',
  },
];
