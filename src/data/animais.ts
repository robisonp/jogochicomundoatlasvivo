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
  | 'artico'
  | 'antartica'
  | 'oceanos'
  | 'oceano-sul'
  | 'mares-tropicais'
  | 'litoral-brasil'
  | 'rio-grande-do-sul'
  | 'argentina'
  | 'mongolia'
  | 'america-do-norte';

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
  /** Pistas da adivinha "Quem sou eu?" no fim da fase: 3 frases do dossiê, da mais geral para a mais reveladora. */
  pistas?: [string, string, string];
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
    pistas: [
      'Eu sou um mamífero e como insetos.',
      'Eu tenho uma carapaça com três faixas.',
      'Quando há perigo, eu me fecho numa bola!',
    ],
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
    pistas: [
      'Eu sou parecido com um coelho pequeno.',
      'Eu como folhas, brotos e cascas.',
      'Eu moro nas fendas e ando ligeiro de pedra em pedra!',
    ],
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
    pistas: [
      'Eu sou uma ave.',
      'Eu como sementes e frutos.',
      'Eu vivo em muitos tipos de lugar, até perto das cidades!',
    ],
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
    pistas: [
      'Eu sou uma ave e saio de dia.',
      'Eu passo bastante tempo andando no chão.',
      'Eu como de tudo um pouco: bichinhos e insetos!',
    ],
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
    pistas: [
      'Eu pareço um porquinho-da-índia pequeno.',
      'Eu quase não tenho rabo.',
      'Meus dentes da frente são amarelados!',
    ],
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
    pistas: [
      'Eu como carne e gosto de andar sozinha.',
      'Eu nado muito bem.',
      'Eu sou o maior felino das Américas!',
    ],
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
    pistas: [
      'Eu sou uma ave muito barulhenta.',
      'Eu como frutos, sementes e castanhas.',
      'Com a cauda, sou quase do tamanho de uma criança pequena!',
    ],
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
    pistas: [
      'Eu passo quase a vida toda nas árvores.',
      'Eu como principalmente folhas.',
      'Às vezes crescem algas no meu pelo!',
    ],
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
    pistas: [
      'Eu vivo nos rios e lagos.',
      'Eu como principalmente peixes.',
      'Eu consigo nadar para trás!',
    ],
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
    pistas: [
      'Eu caibo na palma de uma mão.',
      'Eu passeio pelas árvores, quase sempre à noite.',
      'Os discos dos meus dedos grudam nos troncos!',
    ],
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
    pistas: [
      'Eu como carne.',
      'Minha cauda me ajuda a virar sem cair.',
      'Eu sou o mamífero mais rápido em corridas curtas!',
    ],
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
    pistas: [
      'Eu como capim, folhas, cascas e frutos.',
      'Eu sou o maior animal terrestre de hoje.',
      'Com a tromba, eu respiro, cheiro e pego coisas!',
    ],
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
    pistas: [
      'Eu como folhas do alto das árvores.',
      'Minhas manchas ajudam a me reconhecer.',
      'Eu consigo olhar por cima de uma casa!',
    ],
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
    pistas: [
      'Eu como capim.',
      'Eu vivo em grupo com a minha família.',
      'Cada uma de nós tem listras diferentes!',
    ],
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
    pistas: [
      'Eu sou uma ave, mas não voo.',
      'Minhas pernas compridas correm muito rápido.',
      'Eu sou a maior ave do mundo!',
    ],
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
    pistas: [
      'Eu como plantas.',
      'Minha cauda me dá apoio e equilíbrio.',
      'Eu ando dando saltos bem longos!',
    ],
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
    pistas: [
      'Eu como plantas e saio mais à noite.',
      'Minhas patas são muito fortes.',
      'Eu cavo tocas e túneis debaixo da terra!',
    ],
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
    pistas: [
      'Eu sou uma ave, mas não voo.',
      'Posso ficar tão alto quanto um adulto.',
      'Eu sou um ótimo corredor!',
    ],
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
    pistas: [
      'Eu vivo nos rios.',
      'Minhas patas da frente são boas para nadar.',
      'Eu sou mamífero, mas boto ovos!',
    ],
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
    pistas: [
      'Eu passo muito tempo nas árvores, dormindo ou comendo.',
      'Eu como folhas de eucalipto.',
      'Eu não sou urso: sou marsupial!',
    ],
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
    pistas: [
      'Eu sou uma ave.',
      'Eu faço meu ninho no chão.',
      'No verão, eu posso caçar de dia!',
    ],
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
    pistas: [
      'Eu como principalmente focas.',
      'Minhas patas largas ajudam na neve e na água.',
      'Em pé, eu fico muito mais alto que uma pessoa!',
    ],
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
    pistas: [
      'Eu pareço um cachorro pequeno.',
      'Minha pelagem muda com as estações.',
      'Eu pulo e mergulho de cabeça na neve!',
    ],
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
    pistas: [
      'Eu como líquens e outras plantas.',
      'Eu ando em grupo e faço grandes viagens.',
      'Eu tenho galhadas na cabeça, e as fêmeas também podem ter!',
    ],
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
    pistas: [
      'Eu como peixes.',
      'Eu nado e uso buracos no gelo.',
      'Eu descanso em cima do gelo do Ártico!',
    ],
  },
  // ---------------------------------------------------------------- Antártica e Oceano Austral
  {
    id: 'orca',
    nome: 'Orca',
    mundo: 'antartica',
    textura: 'orca',
    regiao: 'oceanos',
    falas: {
      apresentacao: 'Minha família e eu viajamos juntas pelo oceano!',
      mapa: 'Eu vivo em todos os oceanos do mundo, até perto da Antártida.',
      comida: 'Depende da minha família: peixes, lulas e outros animais do mar.',
      tamanho: 'Uma orca grande é comprida como um ônibus pequeno.',
      curiosidade: 'Apesar do tamanho, eu sou um tipo de golfinho!',
    },
    adulto: 'Orcinus orca · IUCN: Dados Insuficientes',
    pistas: [
      'Eu vivo em todos os oceanos.',
      'Eu nado em equipe com a minha família.',
      'Eu sou o maior da família dos golfinhos!',
    ],
  },
  {
    id: 'pinguim',
    nome: 'Pinguim-de-adélia',
    mundo: 'antartica',
    textura: 'pinguim',
    regiao: 'antartica',
    falas: {
      apresentacao: 'Na neve macia, deslizo de barriga como num tobogã!',
      mapa: 'Eu vivo na Antártida e nos mares e ilhas perto dela.',
      comida: 'Eu como krill, peixes e outros bichinhos do mar.',
      tamanho: 'Sou mais ou menos até a cintura de uma criança pequena.',
      curiosidade: 'Minhas asas funcionam como nadadeiras debaixo d’água!',
    },
    adulto: 'Pygoscelis adeliae · IUCN: Menos Preocupante',
    pistas: [
      'Eu sou uma ave, mas não voo.',
      'Eu nado usando as asas como nadadeiras.',
      'Na neve, eu deslizo de barriga!',
    ],
  },
  {
    id: 'foca-de-weddell',
    nome: 'Foca-de-weddell',
    mundo: 'antartica',
    textura: 'foca-de-weddell',
    regiao: 'antartica',
    falas: {
      apresentacao: 'Eu mergulho por baixo do gelo para explorar o mar!',
      mapa: 'Eu vivo no gelo da costa da Antártida.',
      comida: 'Eu como peixes, lulas e outros animais do mar.',
      tamanho: 'Sou comprida como um carro pequeno.',
      curiosidade: 'Faço sons incríveis debaixo d’água!',
    },
    adulto: 'Leptonychotes weddellii · IUCN: Menos Preocupante',
    pistas: [
      'Eu mergulho por baixo do gelo.',
      'Eu fico muito tempo debaixo d’água.',
      'Eu faço muitos sons debaixo d’água!',
    ],
  },
  {
    id: 'jubarte',
    nome: 'Baleia-jubarte',
    mundo: 'antartica',
    textura: 'jubarte',
    regiao: 'oceanos',
    falas: {
      apresentacao: 'Os machos da minha espécie fazem longas canções no oceano!',
      mapa: 'Eu vivo nos oceanos do mundo e viajo entre mares diferentes.',
      comida: 'Eu como peixinhos e krill, que eu filtro da água.',
      tamanho: 'Sou maior que um ônibus da cidade.',
      curiosidade: 'Viajo milhares de quilômetros entre diferentes mares!',
    },
    adulto: 'Megaptera novaeangliae · IUCN: Menos Preocupante',
    pistas: [
      'Eu filtro peixinhos e krill da água.',
      'Minhas nadadeiras do peito são bem compridas.',
      'Sou maior que um ônibus, e os machos cantam no mar!',
    ],
  },
  {
    id: 'albatroz',
    nome: 'Albatroz-errante',
    mundo: 'antartica',
    textura: 'albatroz',
    regiao: 'oceano-sul',
    falas: {
      apresentacao: 'Com minhas asas enormes, viajo muito longe sem bater asas o tempo todo!',
      mapa: 'Eu voo sobre os mares do sul do mundo e faço ninho em ilhas no meio do oceano.',
      comida: 'Eu como animais do mar que encontro perto da superfície.',
      tamanho: 'Minhas asas abertas são maiores que uma cama de casal.',
      curiosidade: 'Minhas asas abertas podem passar de três metros!',
    },
    adulto: 'Diomedea exulans · IUCN: Vulnerável',
    pistas: [
      'Eu sou uma ave do mar aberto.',
      'Eu faço ninho em ilhas no meio do oceano.',
      'Minhas asas abertas são maiores que uma cama de casal!',
    ],
  },
  // ---------------------------------------------------------------- Praia e oceano do Brasil
  {
    id: 'tartaruga',
    nome: 'Tartaruga-de-pente',
    mundo: 'praia',
    textura: 'tartaruga',
    regiao: 'mares-tropicais',
    falas: {
      apresentacao: 'Eu vivo no mar, mas as mamães voltam à praia para colocar ovos!',
      mapa: 'Eu vivo nos mares quentes do mundo. No Brasil, faço ninhos principalmente no Nordeste.',
      comida: 'Eu como esponjas e outros bichinhos do mar.',
      tamanho: 'Meu casco é do comprimento do corpo de uma criança.',
      curiosidade: 'Existem várias espécies de tartarugas marinhas no Brasil!',
    },
    adulto: 'Eretmochelys imbricata · IUCN: Criticamente Em Perigo · Brasil: Em Perigo',
    pistas: [
      'Eu sou um réptil e vivo no mar.',
      'Eu tenho um casco com placas.',
      'As mamães saem do mar para pôr ovos na areia!',
    ],
  },
  {
    id: 'peixe-boi',
    nome: 'Peixe-boi-marinho',
    mundo: 'praia',
    textura: 'peixe-boi',
    regiao: 'litoral-brasil',
    falas: {
      apresentacao: 'Meu nome diz peixe, mas eu sou um mamífero!',
      mapa: 'Eu vivo nas Américas. No Brasil, fico no litoral do Norte e do Nordeste.',
      comida: 'Eu como plantas: capins marinhos, folhas de mangue e algas.',
      tamanho: 'Um adulto pode ser tão comprido quanto um carro pequeno.',
      curiosidade: 'Minha cauda larga me empurra devagar pela água!',
    },
    adulto: 'Trichechus manatus · Brasil: Em Perigo',
    pistas: [
      'Eu como plantas da água e folhas de mangue.',
      'Eu não tenho nadadeira nas costas.',
      'Minha cauda é larga e redonda, como uma pá!',
    ],
  },
  {
    id: 'golfinho',
    nome: 'Golfinho-rotador',
    mundo: 'praia',
    textura: 'golfinho',
    regiao: 'mares-tropicais',
    falas: {
      apresentacao: 'Eu nado rápido e posso girar no ar quando salto!',
      mapa: 'Eu vivo nos mares quentes do mundo. No Brasil, sou muito estudado em Fernando de Noronha.',
      comida: 'Eu como peixes e lulas.',
      tamanho: 'Sou mais ou menos do comprimento da altura de um adulto.',
      curiosidade: 'Meu giro no salto deu origem ao nome golfinho-rotador!',
    },
    adulto: 'Stenella longirostris · IUCN: Menos Preocupante',
    pistas: [
      'Eu como peixes e lulas.',
      'Eu vivo em grupo e nado rápido.',
      'Eu salto e giro no ar!',
    ],
  },
  {
    id: 'caranguejo',
    nome: 'Caranguejo-uçá',
    mundo: 'praia',
    textura: 'caranguejo',
    regiao: 'litoral-brasil',
    falas: {
      apresentacao: 'Minha toca fica escondida no chão do manguezal!',
      mapa: 'Eu vivo nos manguezais de grande parte do litoral do Brasil.',
      comida: 'Eu como principalmente folhas do mangue.',
      tamanho: 'Meu corpo cabe na mão de um adulto, sem contar as pernas.',
      curiosidade: 'Ajudo a transformar folhas velhas do mangue!',
    },
    adulto: 'Ucides cordatus · Brasil: Quase Ameaçado',
    pistas: [
      'Eu vivo no manguezal.',
      'Eu como folhas do mangue.',
      'Eu cavo minha toca no chão de lama!',
    ],
  },
  {
    id: 'cavalo-marinho',
    nome: 'Cavalo-marinho',
    mundo: 'praia',
    textura: 'cavalo-marinho',
    regiao: 'litoral-brasil',
    falas: {
      apresentacao: 'Minha cauda funciona como uma mãozinha para eu me segurar!',
      mapa: 'Eu vivo no mar do lado de cá do Atlântico, e também no litoral do Brasil.',
      comida: 'Eu como bichinhos bem pequenos, como pequenos crustáceos.',
      tamanho: 'Sou do tamanho de um lápis, curto ou grande.',
      curiosidade: 'Nos cavalos-marinhos, o papai carrega os filhotes!',
    },
    adulto: 'Hippocampus reidi (cavalo-marinho-de-focinho-longo) · Brasil: Vulnerável',
    pistas: [
      'Eu sou um peixe do tamanho de um lápis.',
      'Eu nado em pé.',
      'Minha cauda se segura nas plantas e nas raízes!',
    ],
  },
  // ---------------------------------------------------------------- Dinossauros (fósseis: "encontrados onde hoje fica...")
  {
    id: 'pegadas-sousa',
    nome: 'Pegadas de Sousa',
    mundo: 'dinossauros',
    textura: 'pegadas-sousa',
    regiao: 'nordeste',
    falas: {
      apresentacao: 'Aqui não encontramos o dinossauro: encontramos os passos que ele deixou!',
      mapa: 'Estas pegadas foram encontradas onde hoje fica Sousa, na Paraíba, no Brasil.',
      comida: 'Quem deixou as pegadas? Principalmente terópodes, e também saurópodes e ornitópodes.',
      tamanho: 'São centenas de pegadas e trilhas, em muitos lugares da região.',
      curiosidade: 'Hoje, o Vale dos Dinossauros tem passarelas para visitar as pegadas!',
    },
    adulto: 'Formação Sousa, Bacia do Rio do Peixe (PB) · Cretáceo Inferior, cerca de 145 a 125 milhões de anos',
  },
  {
    id: 'irritator',
    nome: 'Irritator',
    mundo: 'dinossauros',
    textura: 'irritator',
    regiao: 'nordeste',
    falas: {
      apresentacao: 'Meu esqueleto não apareceu inteiro: cientistas estudam principalmente meu crânio!',
      mapa: 'Meu fóssil foi encontrado onde hoje fica a Chapada do Araripe, no Ceará.',
      comida: 'Eu era carnívoro e provavelmente comia peixes e outros animais.',
      tamanho: 'Meu tamanho é estimado comparando com dinossauros parentes.',
      curiosidade: 'Eu sou um espinossaurídeo, e meu crânio ajuda a entender todo o grupo!',
    },
    adulto: 'Irritator challengeri · Formação Romualdo, Cretáceo Inferior (fim do Aptiano) · crânio amplamente preservado',
    pistas: [
      'Meu fóssil foi encontrado no Ceará.',
      'Eu provavelmente comia peixes.',
      'Os cientistas estudam principalmente o meu crânio!',
    ],
  },
  {
    id: 'pterossauro',
    nome: 'Pterossauro',
    mundo: 'dinossauros',
    textura: 'pterossauro',
    regiao: 'nordeste',
    falas: {
      apresentacao: 'Eu voava na época dos dinossauros, mas não sou um dinossauro!',
      mapa: 'Meus fósseis foram encontrados onde hoje fica a região do Araripe, no Nordeste do Brasil.',
      comida: 'Depende do tipo de pterossauro: alguns pegavam peixes.',
      tamanho: 'Os cientistas descobrem meu tamanho pelos ossos que ficaram na rocha.',
      curiosidade: 'No Araripe, meus ossos ficaram guardados na rocha com muitos detalhes!',
    },
    adulto: 'Pterossauros do Araripe (ex.: Tupandactylus imperator, Anhanguera) · Cretáceo Inferior · répteis voadores, não dinossauros',
    pistas: [
      'Eu vivi na época dos dinossauros.',
      'Eu voava!',
      'Mas eu não sou um dinossauro!',
    ],
  },
  {
    id: 'staurikosaurus',
    nome: 'Staurikosaurus',
    mundo: 'dinossauros',
    textura: 'staurikosaurus',
    regiao: 'rio-grande-do-sul',
    falas: {
      apresentacao: 'Eu vivi no Brasil quando os primeiros dinossauros estavam aparecendo!',
      mapa: 'Meu fóssil foi encontrado onde hoje fica o Rio Grande do Sul, no Brasil.',
      comida: 'Eu era carnívoro.',
      tamanho: 'Eu tinha cerca de dois metros de comprimento.',
      curiosidade: 'Eu sou um dos dinossauros mais antigos conhecidos!',
    },
    adulto: 'Staurikosaurus pricei · Triássico Superior, cerca de 227 a 221 milhões de anos · esqueleto incompleto',
    pistas: [
      'Eu comia carne.',
      'Meu fóssil foi encontrado no Rio Grande do Sul.',
      'Eu sou um dos dinossauros mais antigos conhecidos!',
    ],
  },
  {
    id: 'buriolestes',
    nome: 'Buriolestes',
    mundo: 'dinossauros',
    textura: 'buriolestes',
    regiao: 'rio-grande-do-sul',
    falas: {
      apresentacao: 'Meu esqueleto foi encontrado quase completo!',
      mapa: 'Meu fóssil foi encontrado onde hoje fica São João do Polêsine, no Rio Grande do Sul.',
      comida: 'Os cientistas estudam meus dentes para descobrir o que eu comia.',
      tamanho: 'Os cientistas medem meus ossos para descobrir meu tamanho.',
      curiosidade: 'Eu vivi muito, muito tempo atrás: há cerca de duzentos e trinta e três milhões de anos!',
    },
    adulto: 'Buriolestes schultzi · Triássico Superior, cerca de 233 milhões de anos · esqueleto quase completo e articulado',
    pistas: [
      'Meu fóssil foi encontrado no Rio Grande do Sul.',
      'Eu vivi há muito, muito tempo.',
      'Meu esqueleto foi encontrado quase inteiro!',
    ],
  },
  {
    id: 'carnotaurus',
    nome: 'Carnotaurus',
    mundo: 'dinossauros',
    textura: 'carnotaurus',
    regiao: 'argentina',
    falas: {
      apresentacao: 'Meus fósseis guardaram até marcas da pele!',
      mapa: 'Meu fóssil foi encontrado onde hoje fica a Argentina.',
      comida: 'Eu era carnívoro.',
      tamanho: 'Eu tinha cerca de oito metros de comprimento.',
      curiosidade: 'Eu tinha dois chifres acima dos olhos e braços bem pequenos!',
    },
    adulto: 'Carnotaurus sastrei · Cretáceo Superior, cerca de 71 a 69 milhões de anos',
    pistas: [
      'Eu comia carne.',
      'Meus braços eram bem pequenininhos.',
      'Eu tinha dois chifres em cima dos olhos!',
    ],
  },
  {
    id: 'argentinosaurus',
    nome: 'Argentinosaurus',
    mundo: 'dinossauros',
    textura: 'argentinosaurus',
    regiao: 'argentina',
    falas: {
      apresentacao: 'Sou enorme, mas os cientistas precisaram estimar meu tamanho pelos ossos encontrados!',
      mapa: 'Meus fósseis foram encontrados onde hoje fica a Argentina.',
      comida: 'Eu era herbívoro: comia plantas.',
      tamanho: 'Estou entre os maiores dinossauros conhecidos!',
      curiosidade: 'Não existe um esqueleto meu inteiro para simplesmente medir!',
    },
    adulto: 'Argentinosaurus huinculensis · Cretáceo Superior, cerca de 90 a 95 milhões de anos · cerca de 30 a 35 m (estimativa)',
    pistas: [
      'Eu comia plantas.',
      'Meu fóssil foi encontrado na Argentina.',
      'Eu estou entre os maiores dinossauros conhecidos!',
    ],
  },
  {
    id: 'velociraptor',
    nome: 'Velociraptor',
    mundo: 'dinossauros',
    textura: 'velociraptor',
    regiao: 'mongolia',
    falas: {
      apresentacao: 'Eu era menor que nos filmes, e meu corpo tinha penas!',
      mapa: 'Meus fósseis foram encontrados onde hoje fica a Mongólia, na Ásia.',
      comida: 'Eu era carnívoro.',
      tamanho: 'Eu tinha quase dois metros de comprimento, contando a cauda.',
      curiosidade: 'Meus braços tinham penas longas!',
    },
    adulto: 'Velociraptor mongoliensis · Cretáceo Superior, cerca de 74 a 70 milhões de anos · evidência de penas nos braços',
    pistas: [
      'Eu comia carne.',
      'Eu era menor que nos filmes.',
      'Eu tinha penas nos braços!',
    ],
  },
  {
    id: 'trex',
    nome: 'Tiranossauro rex',
    mundo: 'dinossauros',
    textura: 'trex',
    regiao: 'america-do-norte',
    falas: {
      apresentacao: 'Vivi bem no final da era dos grandes dinossauros não aviários!',
      mapa: 'Meus fósseis foram encontrados onde hoje ficam os Estados Unidos e o Canadá.',
      comida: 'Eu era carnívoro, com dentes enormes e fortes.',
      tamanho: 'Um adulto grande tinha cerca de doze metros de comprimento.',
      curiosidade: 'Eu vivi mais perto do fim dos dinossauros do que muitos dinossauros famosos!',
    },
    adulto: 'Tyrannosaurus rex · final do Cretáceo, cerca de 68 a 66 milhões de anos',
    pistas: [
      'Eu comia carne.',
      'Meus dentes eram enormes e fortes.',
      'Eu vivi bem no final da era dos grandes dinossauros!',
    ],
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
  {
    id: 'antartica',
    nome: 'Antártica',
    selo: 'antartica',
    nomeSelo: 'Selo da Antártica',
    texturaSelo: 'selo-antartica',
    abertura: 'Aqui, países trabalham juntos para estudar um continente de gelo!',
  },
  {
    id: 'praia',
    nome: 'Praia',
    selo: 'praia',
    nomeSelo: 'Selo da Praia',
    texturaSelo: 'selo-praia',
    abertura: 'Entre a terra e o mar, o manguezal vira abrigo para muitos filhotes!',
  },
  {
    id: 'dinossauros',
    nome: 'Dinossauros',
    selo: 'dinossauros',
    nomeSelo: 'Selo dos Dinossauros',
    texturaSelo: 'selo-dinossauros',
    abertura: 'Um fóssil é uma parte ou marca de um ser vivo muito antigo guardada nas rochas.',
  },
];

/** Nomes femininos (para falar "a arara", "o tatu-bola"). */
const FEMININOS = new Set([
  'asa-branca', 'onca', 'arara', 'preguica', 'perereca', 'girafa', 'zebra', 'coruja-das-neves', 'raposa-artica',
  'rena', 'foca', 'orca', 'foca-de-weddell', 'jubarte', 'tartaruga',
]);

export function fichaDe(id: string): FichaAnimal | undefined {
  return ANIMAIS.find((a) => a.id === id);
}

/** Nome para falar em voz alta, com artigo: "o tatu-bola", "a arara-vermelha", "o Irritator". */
export function comArtigo(f: FichaAnimal): string {
  if (f.id === 'pegadas-sousa') return 'as Pegadas de Sousa';
  // nomes de dinossauros são nomes científicos: ficam com maiúscula
  const nome = f.mundo === 'dinossauros' ? f.nome : f.nome.toLowerCase();
  return `${FEMININOS.has(f.id) ? 'a' : 'o'} ${nome}`;
}

/** Bichos que entram na adivinha "Quem sou eu?" (os que têm pistas; as pegadas de Sousa não). */
export function entraNaAdivinha(f: FichaAnimal): boolean {
  return !!f.pistas;
}
