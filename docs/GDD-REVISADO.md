# GDD revisado — Chico e o Atlas Vivo (v1.2)

Este documento **complementa** o GDD v1.0: tudo o que não está aqui continua valendo. Ele registra as decisões da família, as correções de lógica e a estrutura simplificada dos 8 mundos.

## 1. Regras de produção (novas)

| Regra | Valor |
|---|---|
| Duração de cada fase | **2 a 3 minutos** |
| Campanha | 8 mundos × 5 fases = **40 fases** (~1h30–2h + replay) |
| Novidade por mundo | **1 poder novo + 1 variação de ambiente**, no máximo |
| Plataforma | Navegador em **tablet Android** (Chrome), paisagem. Teclado e controle também funcionam |
| Controles de toque | Direcional à **direita**; botões **Pular**, **Ação** e **Poder** à **esquerda** (lado trocável na área adulta). O botão Poder só aparece quando há poder |
| Vozes | **Gravadas pela família** quando o áudio existe (`public/vozes/<pessoa>/<código>`); nas outras falas, **sintéticas**, com um perfil de tom e velocidade por personagem sobre a voz pt-BR do aparelho |
| Arte | Vetorial, desenhada por código. Animais como figuras simples e reconhecíveis |
| Conteúdo científico | Vem do [dossiê científico](DOSSIE-CIENTIFICO.md) da família. O jogo só fala o que estiver nele |

### Motor de mecânicas (tudo o que as 40 fases usam)

As fases variam **combinando** estas peças. Nenhum mundo cria uma física nova do zero.

| Peça | Onde aparece |
|---|---|
| Correr, pular (altura variável), escadas/cipós, lajes, buracos, espinhos, pegadas, checkpoints, placas de som | Todas as fases (**já pronto** no protótipo) |
| Páginas voando (plataformas móveis) | Todos os mundos (**pronto**) |
| **Virar bola** (fecha-se e fica protegido por alguns segundos: perigos não machucam) | Tatu-bola (M1) |
| **Baixinho/deslizar** (fica baixo e desliza: passa em túneis e em gelo) | Wombat cavando túneis (M4), pinguim-de-adélia no tobogã (M6) |
| **Arrancada** (explosão de velocidade, curta) | Guepardo (M3) |
| **Salto giratório** (sai da água girando e alcança o alto) | Golfinho-rotador (M7) |
| **Grudar** (sobe paredes de tronco) | Perereca-leiteira (M2, trechos opcionais) |
| **Super pulo** | Canguru (M4) |
| **Empurrar pesado** | Elefante (M3) |
| **Nado** (zona de água: flutuar, subir com o pulo). Sem poder, só água rasa; com o poder da onça, água funda | M2, M4, M5, M6, M7 |
| **Mergulho na neve** (pulo que cai de cabeça e quebra neve fofa) | Raposa-do-ártico (M5) |
| **Vento Viravolta** (zonas que empurram o Chico) | Aparece em todos os mundos, porque é o "antagonista" |
| **Gelo** (chão escorregadio) | M5, M6 |
| **Noite** (escuro com trilha iluminada) | M4 |
| **Maré** (água que sobe e desce devagar) | M7 |
| **Cavar** (botão Ação em pontos marcados) | M8 (Araripe) |
| **Montar esqueleto** (único minijogo: arrastar 4–5 ossos) | M8 |

## 2. Correções de lógica

| # | No GDD v1.0 | Problema | Como fica |
|---|---|---|---|
| 1 | Tia Marcela encontra o Atlas e aparece "por chamada"; Chico toca o livro | Como o livro chega à casa do Chico? | Tia Marcela **manda o Atlas pelo correio**. Na chamada de vídeo, ela conta a história e ensina a abri-lo |
| 2 | Vento Viravolta só existe na história | O antagonista não tem papel no jogo | O vento vira **mecânica recorrente**: zonas de vento e páginas voando em todos os mundos |
| 3 | Camaleão = camuflagem | Mito; e ele não estava em nenhum mundo | **Removido** |
| 4 | Tatu-peba **ou** tatu-bola, "rolagem conforme espécie" | Só o tatu-bola se fecha em bola | **Tatu-bola** (espécie da Caatinga) |
| 5 | Mundo 8 espalhado por vários países | Muitos lugares e nenhum vínculo com o resto da história | O Portal do Tempo abre em **Sousa (PB), no Vale dos Dinossauros**: o mesmo sertão do Mundo 1, milhões de anos antes. Outros dinossauros (Argentina, Mongólia, América do Norte) entram como **páginas do Atlas**, com a frase "fósseis encontrados onde hoje fica…" |
| 6 | "Vozes da Floresta" (M2) e "O Som das Baleias" (M6): direção pelo som | Alto-falante de tablet quase não tem estéreo | O som vem acompanhado de **ondas visuais** que mostram a direção |
| 7 | "Noite no Outback": visibilidade reduzida + memória de rota | Frustrante aos 5 anos | Noite com **trilha iluminada** (vaga-lumes e pegadas brilhantes) |
| 8 | 6–10 h em 40 fases | Daria 9–15 min por fase | 2–3 min por fase |
| 9 | Globo 3D girando antes de cada mundo | Caro e sem ganho de aprendizado | **Mapa 2D** com rota animada, nome do continente e do país falados |
| 10 | Música adaptativa em camadas | Escopo alto | **1 tema por mundo** (gerado por código) + vinhetas de vitória e checkpoint |
| 11 | Missões de rotina (dentes, quarto, cozinha, escola) no hub | Cada uma é um jogo à parte | **Depois do lançamento**, menos a **cozinha**: a Cozinha da Vovó Lili entrou a pedido da família (seção 3) |
| 12 | Cidade real de uma familiar no roteiro | Contradiz a seção de privacidade do próprio GDD | Nenhuma cidade de familiar no conteúdo |
| 13 | Mundo 7 (praia, perto de casa) vem depois da Antártica | Parecia fora de ordem | Mantido: é a **volta para casa** pelo Oceano Atlântico. A saída "praia" da Casa se abre ao chegar no M7 |
| 14 | Protótipo na Savana (M3), mas a campanha começa na Caatinga | O tutorial ficaria fora do lugar | O protótipo de movimento já é a **Caatinga** e vira a base da Fase 1 |
| 15 | 10 opções de acessibilidade | Excesso para a v1 | v1: volumes separados, pausa, reduzir movimento, lado dos controles |
| 16 | Poder do tatu-bola = rolar | Dossiê: fechar-se em bola é VERDADEIRO; sair rolando é PARCIAL | Poder **Virar bola** (proteção). Túneis passam para o wombat (M4) |
| 17 | Onça nada "contra a correnteza" | Dossiê: não documentado | Poder **Nado da Onça**: atravessar rios e água funda |
| 18 | Golfinho = "nada muito rápido" | Dossiê: PARCIAL (números populares exagerados) | Poder **Salto giratório** do golfinho-rotador (comportamento real que dá nome à espécie) |
| 19 | Escavação e esqueleto em Sousa | Em Sousa há **só pegadas**, não esqueletos | M8 vira um passeio pelo Brasil dos dinossauros: pegadas em **Sousa (PB)**, escavação no **Araripe (CE)**, esqueleto do **Buriolestes (RS)** |
| 20 | Asa-branca vai embora na seca e volta com a chuva | Associação cultural, não regra biológica | Aparece como **cultura sertaneja** (música), separada da fala científica |

## 3. Os 8 mundos e as 40 fases

Legenda: ★ = poder novo · ◆ = variação de ambiente. Cada fase tem 2–3 min, com 1 checkpoint por minuto.

### Redemoinhos do Vento Viravolta (pronto)
Pedido da família depois de jogar: faltavam inimigos no estilo dos jogos de plataforma, que andam para lá e para cá e somem com um pulo em cima. O GDD v1.0 pede "nada de vilão cruel nem batalhas", e os bichos são amigos do Atlas. Por isso o inimigo é um **redemoinho do Vento Viravolta**, um pedaço de vento travesso com cara de arteiro. Ele anda devagar, até 3 blocos para cada lado de onde nasceu, e vira na parede, na beirada, na água e nos espinhos.
- **Pular em cima** desmancha o redemoinho: as folhas (ou flocos) se espalham, a página que o Viravolta tinha levado sai voando, e o Chico quica.
- **Encostar de lado** machuca, como os espinhos, e o Chico volta ao checkpoint. Depois de renascer, há um instante sem dano.
- **Bola, arrancada, tobogã, salto girando e mergulho** também desmancham.
- Na primeira vez, o narrador explica: "Um redemoinho do Vento Viravolta! Pule em cima dele para desmanchar!".
- São 29 redemoinhos em 21 fases (`X` nas fases), sempre em chão plano do caminho principal, com espaço livre em cima e chão firme dos lados. Nenhum fica entre buracos, perto de placas, bichos, checkpoints ou do objetivo. A quantidade cresce aos poucos: 1 por fase no Mundo 1, até 3 nos últimos. Fases de água e maré ficam quase sem redemoinho.

### Revelação e adivinha no fim da fase (pronto)
Pedido da família depois de jogar: as fichas do Atlas estavam escondidas. Agora, quando um bicho entra no Atlas pela **primeira vez**, o fim da fase mostra a figurinha grande voando para dentro do livro ("Nova figurinha no Atlas: o tatu-bola!"). Depois vem uma **adivinha "Quem sou eu?" só com figuras**: o bicho dá 3 pistas, da mais geral para a mais reveladora ("Eu sou um mamífero e como insetos. Eu tenho uma carapaça com três faixas. Quando há perigo, eu me fecho numa bola!"), e o Chico escolhe entre 3 bichos do mesmo mundo. As pistas estão em cada ficha (`pistas` em `src/data/animais.ts`), todas do dossiê e escritas para separar o bicho dos outros do mesmo mundo (cavar é pista do wombat e do caranguejo-uçá; o dossiê não diz que o tatu-bola cava). Errar explica ("Quase! Esse é o mocó. Escute as pistas de novo.") e deixa tentar; depois de 2 erros, a figura certa pisca. No máximo 2 adivinhas por fase; nas fases com minijogo (38 e 39) só a figurinha. Não é quiz de pontos: continua valendo "conteúdo ligado à ação" do GDD v1.0. No Atlas, a primeira ficha aberta explica em voz alta os desenhos (mapa, folha, régua, estrela).

### Cozinha da Vovó Lili (pronto)
Pedido da família depois de jogar: faltava a parte em que o Chico ajuda a vovó. Na tela de título, a **panela laranja** abre a cozinha da Vovó Lili. É um cantinho calmo, fora das fases, sem tempo e sem pontos, e cada receita treina uma ideia simples:
- **Salada de frutas** (sempre aberta): cada fruta vai na tigela da **mesma cor** (vermelho: morango e maçã; amarelo: banana e abacaxi; verde: uva e kiwi).
- **Sopa de legumes** (1 selo): **forma**. Os redondinhos (tomate, batata, cebola) numa panela, os compridos (cenoura, vagem, milho) na outra. Cada panela tem o desenho da forma na frente.
- **Feira** (3 selos): **tamanho**. Melancia, abóbora e abacaxi na cesta grande; uva, morango e jabuticaba na cesta pequena.
- **Bolo de cenoura** (5 selos): **contar**. A tigela mostra a sombra de 3 ovos e 2 cenouras, e a vovó conta junto ("Um ovo! Dois ovos!"). Tomate e banana ficam de fora. Quem leva ao forno é a vovó; o Chico não mexe no fogão.

Tocar num ingrediente diz o nome dele. Dá para arrastar ou tocar no ingrediente e depois no recipiente. Se não combina, a vovó diz "Hmm, essa não combina aqui. Tente outra!" e o ingrediente volta para a prateleira. Receita fechada mostra um cadeado e bolinhas com os selos que faltam. No fim, o prato pronto aparece com confete e a vovó agradece. As falas novas da vovó (`lili-161` a `lili-179`) entraram no documento de gravação.

### Mapa-múndi e família (prontos)
- **Mapa 2D** (correção 9): o botão verde do título abre o mapa com a rota dos 8 mundos. Mundos abertos têm o selo colorido; os seguintes, cadeado; os que ainda não existem no jogo, ampulheta ("em breve"). Tocar num mundo fala o nome, o continente e o país ou região e abre a escolha das 5 fases. Quando um mundo abre, o Chico viaja pela rota até ele.
- **História do Atlas** (correção 1): na primeira vez no mapa, a Tia Marcela liga pelo Chamador do Atlas e conta que mandou o livro pelo correio e que o Vento Viravolta bagunçou as páginas.
- **Família visível**, com a arte feita pela família: quem fala numa placa aparece em pé ao lado dela; as Tias Kelly e Laura aparecem por chamada de vídeo. O rosto de quem da família está falando surge no alto da tela (dicas da Vovó Lili, resgates da Mamãe July). O Chico usa as cores da mesma arte (camiseta vermelha, bermuda azul, tênis branco), com o chapéu e a mochila de explorador.

### Mundo 1 — Caatinga (sertão da Paraíba) — completo (fases 1 a 5 jogáveis)
Animais: tatu-bola, mocó, carcará, asa-branca, preá.
1. **A Página Seca** — correr, pular, pegadas (base = protótipo atual).
2. **Lajedo do Mocó** — lajes, escadas e fendas nas pedras.
3. **O Tatu-bola** ★ virar bola: passar protegido por chuva de pedrinhas e espinhos.
4. **Chuva no Sertão** ◆ a Caatinga fica verde; primeiras zonas de vento.
5. **Selo do Sertão** — combina tudo.

### Mundo 2 — Amazônia (Brasil) — completo (fases 6 a 10 jogáveis)
Animais: onça-pintada, arara-vermelha-grande, preguiça-de-garganta-marrom, boto-cor-de-rosa, perereca-leiteira.
6. **O Dossel Verde** — cipós (escalada vertical). Tia Kelly e Tia Laura ligam.
7. **O Rio** ◆ nado básico em água rasa.
8. **Nado da Onça** ★ atravessar rios e água funda (a onça-pintada é excelente nadadora). Poder passivo: sem botão; permite entrar na água escura e mergulhar (passar por baixo de troncos).
9. **Vozes da Floresta** — seguir sons com ondas visuais.
10. **Tempestade no Rio** — combina cipó, nado e vento.

### Mundo 3 — Savana (Quênia e Tanzânia) — completo (fases 11 a 15 jogáveis)
Animais: guepardo, elefante-africano-da-savana, girafa-masai, zebra-da-planície, avestruz.
11. **Pegadas na Savana** — seguir rastros.
12. **Corrida do Guepardo** ★ arrancada curta (o guepardo só sustenta a velocidade máxima por segundos: a arrancada acaba e precisa "recarregar"). Na Savana o botão da pata vira arrancada; o anel em volta do botão mostra a recarga.
13. **A Força do Elefante** ★ empurrar pedregulhos. Poder passivo: sem botão; o pedregulho só anda depois que o elefante ensina. Cada vala é tapada por **um** pedregulho (dois juntos se encavalavam).
14. **Olhos no Alto** — rotas altas (girafa como referência de altura).
15. **A Grande Travessia** — arrancada + empurrar.

### Mundo 4 — Austrália — completo (fases 16 a 20 jogáveis)
Animais: canguru-vermelho, wombat-comum, emu, ornitorrinco, coala.
Dois ambientes, como pede o dossiê ("a Austrália não é toda deserto"): o interior seco (Outback: terra vermelha, arenito, capim-espinifex) nas fases 16 e 18, e a mata úmida de eucaliptos do leste nas fases 17, 19 e 20 (onde vivem wombat, ornitorrinco, coala e vaga-lumes).
16. **Saltos do Outback** ★ super pulo. Na Austrália o botão da pata vira super pulo: bem mais alto e mais longo, só a partir do chão (o botão fica meio apagado no ar).
17. **Tocas do Wombat** ★ cavar. Poder passivo: andar contra a terra fofa (ou apertar para baixo em cima dela) cava depois de um instante. Só a terra fofa se cava (dossiê: não cavar qualquer material de uma vez). Os túneis têm a altura do Chico, então ele não precisa se abaixar.
18. **Corrida do Emu** — trecho de velocidade: o emu corre na frente do Chico mostrando o caminho, por cima de pedras, buracos e espinifex.
19. **O Rio do Ornitorrinco** — nado e mergulho (usa o Nado da Onça do Mundo 2). Debaixo d'água, o chamado vira os sinais que o ornitorrinco sente: ondas azuis mostram a passagem por baixo das pedras. Eletrorrecepção não é "dar choque".
20. **Noite na Mata** ◆ noite com trilha de vaga-lumes (vivem em áreas úmidas com vegetação, não no deserto do Outback). Só uma roda de luz em volta do Chico; o coala no galho do eucalipto; combina tronco para escalar, cavar e super pulo. Termina no **Selo da Austrália** (Cruzeiro do Sul, que também se vê do Brasil).

### Mundo 5 — Ártico (Canadá e Noruega como referências) — completo (fases 21 a 25 jogáveis)
Animais: urso-polar, raposa-do-ártico, rena/caribu, foca-anelada, coruja-das-neves. **Sem pinguins** (eles não vivem no Ártico).
Correção de lógica: o Chico **não nada no mar do Ártico** (água gelada demais). Se cair na água, a **Mamãe July tira ele** e ele volta ao checkpoint — esse é o "resgate" do mundo. Os bichos (urso-polar, foca) nadam normalmente.
21. **Sol da Meia-Noite** ◆ gelo escorregadio; o dia que não acaba (sol baixinho no horizonte). A coruja-das-neves aparece de dia (dossiê: "coruja = sempre noturna" é simplificação errada).
22. **Pegadas na Neve** — rastros do urso-polar sobem pelas bordas de gelo; no fim, o urso entra no mar e nada.
23. **O Pulo da Raposa** ★ mergulho na neve. No Ártico o botão da pata vira mergulho: do chão, o Chico salta e cai de cabeça; no ar, mergulha na hora. Só a **neve fofa** quebra (várias camadas seguidas); em gelo, rocha ou neve firme o mergulho acaba.
24. **Corrida das Renas** — velocidade no gelo, com a rena correndo na frente (como o emu).
25. **Mar Congelado** — placas de gelo que se movem sobre o mar, a foca-anelada, um paredão para passar por baixo mergulhando na neve fofa, e o resgate da Mamãe July. Termina no **Selo do Ártico** (sol da meia-noite).

### Mundo 6 — Antártica e Oceano Austral — completo (fases 26 a 30 jogáveis)
Animais: pinguim-de-adélia, foca-de-weddell, orca, baleia-jubarte, albatroz-errante. **Sem ursos-polares, iglus ou povos nativos** (não há população humana nativa na Antártida).
Como no Ártico, o Chico **não nada no mar gelado**: cair na água é resgate da Mamãe July (volta ao checkpoint).
26. **Um Continente sem País** — chegada numa estação de pesquisa ("aqui, países trabalham juntos para estudar um continente de gelo"; o Brasil tem a Estação Antártica Comandante Ferraz). A orca nada perto das bordas de gelo.
27. **Deslize do Pinguim** ★ tobogã de barriga. Na Antártica o botão da pata vira tobogã: o Chico deita e desliza rápido, baixinho — passa por túneis de um bloco de altura e, embaixo de teto baixo, continua deitado até sair.
28. **Debaixo do Gelo** — correção de lógica: em vez de nadar no mar gelado, o Chico vai no **submarino do Vovô Marcos** (o Construtor Viajante), que protege do frio e mergulha por baixo do gelo. Bolhas subindo marcam o caminho; a foca-de-weddell mergulha junto.
29. **O Canto das Baleias** — o canto da jubarte (som grave e ondas azuis) marca por onde passam as placas de gelo. Sem dizer que a baleia canta "porque está apaixonada" (cuidado do dossiê).
30. **Tempestade Branca** — ventania do Viravolta com neve soprando e a tela clareando nas rajadas; deitado no tobogã o vento quase não empurra. O albatroz-errante plana no vento. Termina no **Selo da Antártica**.

### Mundo 7 — Oceano e Praia (Brasil) — completo (fases 31 a 35 jogáveis)
Animais: tartaruga-de-pente, peixe-boi-marinho, golfinho-rotador, caranguejo-uçá, cavalo-marinho-de-focinho-longo.
A volta para casa: mar quente, então o Chico **nada normalmente** de novo. Mecânica nova do mundo: a **maré** (`%` nas fases) — a água sobe e desce devagar (a Lua puxa a água e o Sol ajuda, como no dossiê).
31. **Um Dia na Praia** — chegada perto de casa (sem dizer a cidade). Rastros da tartaruga na areia até o mar; a jangada do Vovô Marcos; pedras com ouriços; o píer.
32. **A Maré Mudou** ◆ maré alta leva o Chico até a pedra que ele não alcança pulando e cobre os ouriços do fundo (na maré baixa eles machucam). O peixe-boi nada devagar ("meu nome diz peixe, mas eu sou um mamífero").
33. **Salto do Golfinho** ★ salto girando. Na Praia o botão da pata vira o salto do golfinho: **dentro da água**, o Chico sai bem alto girando e alcança pedras altas. Junta com a maré: a pedra mais alta só com maré alta + giro. Referência: golfinhos-rotadores de Fernando de Noronha.
34. **O Berçário do Mar** — manguezal (lama, raízes, galhos, ostras). "Berçário para muitos animais" (não para todos, cuidado do dossiê). O caranguejo-uçá corre para a toca; o cavalo-marinho se segura com a cauda ("o papai carrega os filhotes").
35. **Praia Depois da Tempestade** — o mar trouxe lixo (`l`): o Chico recolhe encostando (contador no alto da tela; recolher tudo é opcional e a Mamãe July agradece). Maré, ouriços e giro juntos. Termina no **Selo da Praia**.

### Mundo 8 — O Brasil dos Dinossauros — completo (fases 36 a 40 jogáveis)
O Portal do Tempo abre em Sousa (PB) e leva o Chico a lugares do Brasil onde fósseis foram encontrados. Sempre "fósseis encontrados onde hoje fica...". Outros dinossauros (Carnotaurus, Argentinosaurus, Velociraptor, T. rex) entram como **páginas do Atlas**. Figurinhas do Atlas deste mundo (9): Pegadas de Sousa, Irritator, pterossauro, Staurikosaurus, Buriolestes e as quatro páginas.
36. **O Vale dos Dinossauros** (Sousa, PB, hoje) — lajedo com pegadas de três dedos e passarelas por cima das valas ("aqui não encontramos o dinossauro: encontramos os passos que ele deixou!"; centenas de pegadas, sem número exato). Termina no **Portal do Tempo**.
37. **Pegadas do Cretáceo** (Sousa, entre cerca de 145 e 125 milhões de anos) — seguir as trilhas; os dinossauros são **silhuetas de grupos** (terópode, saurópode, ornitópode), porque ninguém sabe a espécie exata de quem deixou cada pegada. Sem flores, capim moderno ou vulcão de filme: samambaias, cicadáceas, cavalinhas e coníferas. As silhuetas não viram figurinha.
38. **Escavação no Araripe** (CE) ★ escavar: perto do monte de terra, o **botão Ação** escava (pincel e espátula) e revela o **crânio do Irritator** e um **pterossauro** na pedra. No fim, minijogo dos **dois cestos** ("é dinossauro" com pegada verde / "não é" com X vermelho): Staurikosaurus, pterossauro, asa-branca (os passarinhos de hoje são dinossauros!), réptil marinho e Irritator. Dá para arrastar a figura ou tocar no cesto; errar só explica e deixa tentar de novo.
39. **Monte o Esqueleto** (RS, Triássico) — o Staurikosaurus (um dos dinossauros mais antigos conhecidos) e a Pangeia. No fim, o minijogo grande: montar o **Buriolestes** em 5 peças (crânio; coluna e costelas; braços; bacia; pernas e cauda), arrastando cada osso para a sombra dele. Tocar numa peça diz o nome.
40. **O Atlas Inteiro** — o botão da pata muda a cada trecho: bola (tatu-bola) nos espinhos, arrancada (guepardo) nos buracos, super pulo (canguru) na pedra alta, tobogã (pinguim) no túnel e salto girando (golfinho) no mar. No fim, a família inteira (Kelly e Laura pelo Chamador) e as páginas do Atlas Vivo com Carnotaurus, Argentinosaurus (enorme), Velociraptor (pequeno e com penas) e T. rex. Termina no **Selo dos Dinossauros** e na festa do Atlas completo.

## 4. Curva de dificuldade (ajustada)

- **M1–M2:** uma habilidade por vez; buracos curtos; checkpoints frequentes.
- **M3–M4:** movimento + poder; primeiros obstáculos móveis.
- **M5–M6:** gelo e vento pedem timing; rotas secretas mais escondidas.
- **M7–M8:** duas habilidades combinadas; a fase 40 revisita um trecho de cada mundo.

Ajuda da Vovó Lili: depois de **4 falhas** no mesmo trecho, ela fala uma dica curta daquele trecho. **Nunca resolve pelo Chico.** Já implementado.

## 5. Personagens: função no jogo

| Personagem | Quando aparece |
|---|---|
| Narrador | Instruções gerais, países, animais |
| Vovó Lili | Dicas depois de falhas; placas de cuidado; a Cozinha da Vovó (tela de título) |
| Vovô Marcos | Construções: escadas de corda, pontes, jangadas |
| Tia Marcela | Abertura de mundos; páginas voando; Mundo 8. Canta/conta a tradição da asa-branca (cultura, não ciência) |
| Tio Robi | Desafios de corrida e de pulo |
| Mamãe July | Resgates (M5, M7, fase 40) |
| Tias Kelly e Laura | Chamadas nas fases verticais (M2, M3, M5) |

## 6. Fora do lançamento (depois)

Missões de rotina na Casa, fases "Faísca" extras, modo de dois jogadores com o Tio Robi, vozes pré-gravadas de melhor qualidade e mais opções de acessibilidade.
