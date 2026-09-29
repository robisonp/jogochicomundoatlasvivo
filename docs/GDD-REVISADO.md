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
| Vozes | **Sintéticas**. Cada personagem tem um perfil de tom e velocidade sobre a voz pt-BR do aparelho |
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
| 11 | Missões de rotina (dentes, quarto, cozinha, escola) no hub | Cada uma é um jogo à parte | **Depois do lançamento.** A Casa, no lançamento, tem mapa, Atlas e chamadas da família |
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

### Mundo 5 — Ártico (Canadá e Noruega como referências)
Animais: urso-polar, raposa-do-ártico, rena/caribu, foca-anelada, coruja-das-neves. **Sem pinguins** (eles não vivem no Ártico).
21. **Sol da Meia-Noite** ◆ gelo escorregadio; o dia que não acaba.
22. **Pegadas na Neve** — rastros.
23. **O Pulo da Raposa** ★ mergulho na neve.
24. **Corrida das Renas** — velocidade no gelo.
25. **Mar Congelado** — gelo, água e resgate (Mamãe July).

### Mundo 6 — Antártica e Oceano Austral
Animais: pinguim-de-adélia, foca-de-weddell, orca, baleia-jubarte, albatroz-errante. **Sem ursos-polares.**
26. **Um Continente sem País** — chegada pelo mapa.
27. **Deslize do Pinguim** ★ tobogã de barriga (reaproveita o "baixinho/deslizar" sobre gelo).
28. **Debaixo do Gelo** — nado, com bolhas marcando o caminho.
29. **O Canto das Baleias** — sons com ondas visuais.
30. **Tempestade Branca** — vento forte do Viravolta.

### Mundo 7 — Oceano e Praia (Brasil)
Animais: tartaruga-de-pente, peixe-boi-marinho, golfinho-rotador, caranguejo-uçá, cavalo-marinho-de-focinho-longo.
31. **Um Dia na Praia** — chegada perto de casa.
32. **A Maré Mudou** ◆ maré sobe e desce.
33. **Salto do Golfinho** ★ salto giratório para fora d'água (referência: golfinhos-rotadores de Fernando de Noronha).
34. **O Berçário do Mar** — manguezal.
35. **Praia Depois da Tempestade** — exploração e cuidado com a praia.

### Mundo 8 — O Brasil dos Dinossauros
O Portal do Tempo abre em Sousa (PB) e leva o Chico a três lugares do Brasil onde fósseis foram encontrados. Outros dinossauros (Carnotaurus, Argentinosaurus, Velociraptor, T. rex) entram como **páginas do Atlas**.
36. **O Vale dos Dinossauros** (Sousa, PB) — hoje: centenas de pegadas na rocha. O Portal do Tempo se abre.
37. **Pegadas do Cretáceo** (Sousa, entre 145 e 125 milhões de anos atrás) — seguir as trilhas. Os dinossauros aparecem como silhuetas de **grupos** (terópode, saurópode, ornitópode), porque ninguém sabe a espécie exata de quem deixou cada pegada.
38. **Escavação no Araripe** (CE) ★ cavar (botão Ação) e limpar fósseis: o crânio do Irritator e um pterossauro. Minijogo rápido de dois cestos: "é dinossauro" / "não é dinossauro".
39. **Monte o Esqueleto** (RS) — o único minijogo grande: montar o **Buriolestes** em 5 peças (crânio; coluna e costelas; braços; bacia; pernas e cauda). O esqueleto dele foi encontrado quase completo.
40. **O Atlas Inteiro** — final com todos os poderes e a família inteira.

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
| Vovó Lili | Dicas depois de falhas; placas de cuidado |
| Vovô Marcos | Construções: escadas de corda, pontes, jangadas |
| Tia Marcela | Abertura de mundos; páginas voando; Mundo 8. Canta/conta a tradição da asa-branca (cultura, não ciência) |
| Tio Robi | Desafios de corrida e de pulo |
| Mamãe July | Resgates (M5, M7, fase 40) |
| Tias Kelly e Laura | Chamadas nas fases verticais (M2, M3, M5) |

## 6. Fora do lançamento (depois)

Missões de rotina na Casa, fases "Faísca" extras, modo de dois jogadores com o Tio Robi, vozes pré-gravadas de melhor qualidade e mais opções de acessibilidade.
