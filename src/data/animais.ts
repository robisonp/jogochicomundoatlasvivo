// Fichas do Atlas. Todo conteúdo vem de docs/DOSSIE-CIENTIFICO.md (falas curtas, sem números para a criança).
// A linha "adulto" traz nome científico e conservação para a família; não é lida em voz alta.
import type { MundoId } from './mundos';

export type RegiaoMapa =
  | 'nordeste'
  | 'amazonia'
  | 'brasil'
  | 'america-do-sul'
  | 'africa'
  | 'africa-leste'
  | 'australia'
  | 'australia-leste'
  | 'artico';

export interface FichaAnimal {
  id: string;
  nome: string;
  mundo: MundoId;
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
  // ---------------------------------------------------------------- Savana (Quênia e Tanzânia)
  {
    id: 'guepardo',
    nome: 'Guepardo',
    mundo: 'savana',
    textura: 'guepardo',
    regiao: 'africa',
    falas: {
      apresentacao: 'Eu corro muito depressa, mas preciso descansar logo!',
      mapa: 'Eu vivo em partes da África, como no Quênia e na Tanzânia. Também existem alguns na Ásia.',
      comida: 'Eu como outros animais.',
      tamanho: 'Sou do tamanho de um cachorro grande, só que mais alto e magrinho.',
      curiosidade: 'Sou o mamífero terrestre mais rápido em corridas curtas!',
    },
    adulto: 'Acinonyx jubatus · IUCN: Vulnerável',
  },
  {
    id: 'elefante',
    nome: 'Elefante-africano',
    mundo: 'savana',
    textura: 'elefante',
    regiao: 'africa',
    falas: {
      apresentacao: 'Minha tromba e meu corpo forte movem grandes galhos!',
      mapa: 'Eu vivo em várias partes da África, como no Quênia e na Tanzânia.',
      comida: 'Eu como capim, folhas, cascas e frutos.',
      tamanho: 'Sou mais alto que muitos cômodos de uma casa.',
      curiosidade: 'Sou o maior animal terrestre que vive hoje!',
    },
    adulto: 'Loxodonta africana (elefante-africano-da-savana) · IUCN: Em Perigo',
  },
  {
    id: 'girafa',
    nome: 'Girafa-masai',
    mundo: 'savana',
    textura: 'girafa',
    regiao: 'africa-leste',
    falas: {
      apresentacao: 'Meu pescoço alto alcança folhas que ficam lá em cima!',
      mapa: 'Eu vivo no sul do Quênia e em grande parte da Tanzânia.',
      comida: 'Eu como folhas e brotos de árvores e arbustos.',
      tamanho: 'Consigo olhar por cima de uma casa de um andar!',
      curiosidade: 'Minhas manchas ajudam a reconhecer cada girafa!',
    },
    adulto: 'Giraffa tippelskirchi · taxonomia das girafas em revisão',
  },
  {
    id: 'zebra',
    nome: 'Zebra',
    mundo: 'savana',
    textura: 'zebra',
    regiao: 'africa',
    falas: {
      apresentacao: 'Minhas listras são diferentes das listras de qualquer outra zebra!',
      mapa: 'Eu vivo no leste e no sul da África, e não só no Quênia e na Tanzânia.',
      comida: 'Eu como principalmente capim.',
      tamanho: 'Sou do tamanho de um pônei.',
      curiosidade: 'Eu gosto de viver junto de outras zebras!',
    },
    adulto: 'Equus quagga (zebra-da-planície) · IUCN: Quase Ameaçada',
  },
  {
    id: 'avestruz',
    nome: 'Avestruz',
    mundo: 'savana',
    textura: 'avestruz',
    regiao: 'africa',
    falas: {
      apresentacao: 'Eu não voo, mas minhas pernas correm muito depressa!',
      mapa: 'Eu vivo em lugares abertos de várias partes da África.',
      comida: 'Eu como principalmente plantas, e às vezes bichinhos.',
      tamanho: 'Sou muito mais alta que uma pessoa adulta.',
      curiosidade: 'Sou a maior ave que vive hoje!',
    },
    adulto: 'Struthio camelus · IUCN: Menos Preocupante',
  },
  // ---------------------------------------------------------------- Austrália
  {
    id: 'canguru',
    nome: 'Canguru-vermelho',
    mundo: 'australia',
    textura: 'canguru',
    regiao: 'australia',
    falas: {
      apresentacao: 'Minhas pernas fortes me levam bem longe a cada salto!',
      mapa: 'Eu vivo na Austrália, nos lugares secos e abertos do interior.',
      comida: 'Eu como capim e outras plantas.',
      tamanho: 'Um canguru grande, em pé, fica quase da altura de um adulto.',
      curiosidade: 'Sou o maior marsupial vivo!',
    },
    adulto: 'Osphranter rufus (antes Macropus rufus) · IUCN: Menos Preocupante',
  },
  {
    id: 'wombat',
    nome: 'Wombat',
    mundo: 'australia',
    textura: 'wombat',
    regiao: 'australia-leste',
    falas: {
      apresentacao: 'Minhas patas fortes cavam túneis debaixo da terra!',
      mapa: 'Eu vivo na Austrália, em matas abertas, campos e matagais.',
      comida: 'Eu como capim e outras plantas.',
      tamanho: 'Sou do tamanho de um cachorro médio, mas bem mais forte e gordinho.',
      curiosidade: 'Minha casa pode ficar escondida no chão!',
    },
    adulto: 'Vombatus ursinus (wombat-comum) · IUCN: Menos Preocupante',
  },
  {
    id: 'emu',
    nome: 'Emu',
    mundo: 'australia',
    textura: 'emu',
    regiao: 'australia',
    falas: {
      apresentacao: 'Minhas asas são pequenas, mas minhas pernas são ótimas para correr!',
      mapa: 'Eu vivo em muitos lugares abertos da Austrália.',
      comida: 'Eu como sementes, frutos, plantas e bichinhos pequenos.',
      tamanho: 'Posso ficar tão alto quanto uma pessoa adulta.',
      curiosidade: 'Sou uma ave enorme que não precisa voar!',
    },
    adulto: 'Dromaius novaehollandiae · IUCN: Menos Preocupante',
  },
  {
    id: 'ornitorrinco',
    nome: 'Ornitorrinco',
    mundo: 'australia',
    textura: 'ornitorrinco',
    regiao: 'australia-leste',
    falas: {
      apresentacao: 'Debaixo d’água, sinto pequenos sinais elétricos ao meu redor!',
      mapa: 'Eu vivo em rios e riachos do leste da Austrália e da ilha da Tasmânia.',
      comida: 'Eu como bichinhos pequenos que vivem na água.',
      tamanho: 'Sou mais ou menos do comprimento de um gato.',
      curiosidade: 'Sou um mamífero que põe ovos!',
    },
    adulto: 'Ornithorhynchus anatinus · IUCN: Quase Ameaçado',
  },
  {
    id: 'coala',
    nome: 'Coala',
    mundo: 'australia',
    textura: 'coala',
    regiao: 'australia-leste',
    falas: {
      apresentacao: 'Minhas garras me seguram firme nos eucaliptos!',
      mapa: 'Eu vivo nas matas de eucalipto da Austrália.',
      comida: 'Eu como folhas de alguns tipos de eucalipto.',
      tamanho: 'Sou do tamanho de um cachorro pequeno, bem redondinho.',
      curiosidade: 'Eu sou um marsupial, não um urso!',
    },
    adulto: 'Phascolarctos cinereus · IUCN: Vulnerável (algumas populações: Em Perigo na lei australiana)',
  },
  // ---------------------------------------------------------------- Ártico
  {
    id: 'coruja-das-neves',
    nome: 'Coruja-das-neves',
    mundo: 'artico',
    textura: 'coruja-das-neves',
    regiao: 'artico',
    falas: {
      apresentacao: 'No verão do Ártico, posso caçar até com o sol brilhando!',
      mapa: 'Eu vivo na tundra, nas terras frias bem no norte do mundo.',
      comida: 'Eu como principalmente bichinhos pequenos e aves.',
      tamanho: 'Com as asas abertas, sou maior que muitas crianças!',
      curiosidade: 'Nem toda coruja precisa esperar a noite!',
    },
    adulto: 'Bubo scandiacus · IUCN: Vulnerável',
  },
  {
    id: 'urso-polar',
    nome: 'Urso-polar',
    mundo: 'artico',
    textura: 'urso-polar',
    regiao: 'artico',
    falas: {
      apresentacao: 'Minhas patas enormes também funcionam muito bem na água!',
      mapa: 'Eu vivo no gelo do mar e nas costas do Ártico, como no Canadá, na Groenlândia e na Noruega.',
      comida: 'Eu como principalmente animais do mar, especialmente focas.',
      tamanho: 'Em pé, fico muito mais alto que uma pessoa.',
      curiosidade: 'Preciso do gelo do mar para viver no Ártico!',
    },
    adulto: 'Ursus maritimus · IUCN: Vulnerável',
  },
  {
    id: 'raposa-artica',
    nome: 'Raposa-do-ártico',
    mundo: 'artico',
    textura: 'raposa-artica',
    regiao: 'artico',
    falas: {
      apresentacao: 'Escuto debaixo da neve e... pulo de cabeça!',
      mapa: 'Eu vivo na tundra, em volta de todo o Ártico.',
      comida: 'Eu como bichinhos pequenos, aves, ovos e o que encontrar.',
      tamanho: 'Sou do tamanho de um cachorro pequeno.',
      curiosidade: 'Minha pelagem ajuda a enfrentar o frio do Ártico!',
    },
    adulto: 'Vulpes lagopus · IUCN: Menos Preocupante (algumas populações muito ameaçadas)',
  },
  {
    id: 'rena',
    nome: 'Rena',
    mundo: 'artico',
    textura: 'rena',
    regiao: 'artico',
    falas: {
      apresentacao: 'Minhas patas me ajudam a caminhar pelas terras frias!',
      mapa: 'Eu vivo no norte do mundo: Canadá, Alasca, Groenlândia, Noruega e Rússia.',
      comida: 'Eu como líquens, capim, folhas e outras plantas.',
      tamanho: 'Sou do tamanho de um cervo grande.',
      curiosidade: 'Rena e caribu são nomes usados para animais da mesma espécie!',
    },
    adulto: 'Rangifer tarandus (rena/caribu) · IUCN: Vulnerável',
  },
  {
    id: 'foca',
    nome: 'Foca-anelada',
    mundo: 'artico',
    textura: 'foca',
    regiao: 'artico',
    falas: {
      apresentacao: 'Eu encontro meu caminho entre a água e o gelo!',
      mapa: 'Eu vivo nos mares frios em volta de todo o Ártico.',
      comida: 'Eu como peixes e bichinhos pequenos do mar.',
      tamanho: 'Sou do comprimento da altura de uma criança grande.',
      curiosidade: 'O gelo também é parte da minha casa!',
    },
    adulto: 'Pusa hispida · IUCN: Menos Preocupante (global)',
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
  {
    id: 'savana',
    nome: 'Savana',
    selo: 'savana',
    nomeSelo: 'Selo da Savana',
    texturaSelo: 'selo-savana',
    abertura: 'Aqui, campos enormes mudam com a chegada das chuvas!',
  },
  {
    id: 'australia',
    nome: 'Austrália',
    selo: 'australia',
    nomeSelo: 'Selo da Austrália',
    texturaSelo: 'selo-australia',
    abertura: 'A Austrália não é toda deserto: tem interior seco e matas de eucalipto!',
  },
  {
    id: 'artico',
    nome: 'Ártico',
    selo: 'artico',
    nomeSelo: 'Selo do Ártico',
    texturaSelo: 'selo-artico',
    abertura: 'No verão, há lugares onde o Sol nem se põe!',
  },
];
