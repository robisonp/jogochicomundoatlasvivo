# GDD revisado — Chico e o Atlas Vivo (v1.1)

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
| Conteúdo científico | Vem do documento de fichas da família. O jogo só fala o que estiver na ficha |

### Motor de mecânicas (tudo o que as 40 fases usam)

As fases variam **combinando** estas peças. Nenhum mundo cria uma física nova do zero.

| Peça | Onde aparece |
|---|---|
| Correr, pular (altura variável), escadas/cipós, lajes, buracos, espinhos, pegadas, checkpoints, placas de som | Todas as fases (**já pronto** no protótipo) |
| Páginas voando (plataformas móveis) | Todos os mundos (**pronto**) |
| **Rolar/deslizar** (fica baixinho e rápido: passa em túneis e desliza) | Tatu-bola (M1), wombat (M4), pinguim (M6) |
| **Arrancada** (explosão de velocidade) | Guepardo (M3), golfinho na água (M7) |
| **Super pulo** | Canguru (M4) |
| **Empurrar pesado** | Elefante (M3) |
| **Nado** (zona de água: flutuar, subir com o pulo) | M2, M4, M5, M6, M7 |
| **Mergulho na neve** (pulo que cai de cabeça e quebra neve fofa) | Raposa-do-ártico (M5) |
| **Vento Viravolta** (zonas que empurram o Chico) | Aparece em todos os mundos, porque é o "antagonista" |
| **Gelo** (chão escorregadio) | M5, M6 |
| **Noite** (escuro com trilha iluminada) | M4 |
| **Maré** (água que sobe e desce devagar) | M7 |
| **Cavar** (botão Ação em pontos marcados) | M8 |
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

## 3. Os 8 mundos e as 40 fases

Legenda: ★ = poder novo · ◆ = variação de ambiente. Cada fase tem 2–3 min, com 1 checkpoint por minuto.

### Mundo 1 — Caatinga (sertão da Paraíba)
Animais: tatu-bola, mocó, carcará, asa-branca, preá.
1. **A Página Seca** — correr, pular, pegadas (base = protótipo atual).
2. **Lajedo do Mocó** — lajes, escadas e fendas nas pedras.
3. **O Caminho do Tatu-bola** ★ rolar: túneis baixos.
4. **Chuva no Sertão** ◆ a Caatinga fica verde; primeiras zonas de vento.
5. **Selo do Sertão** — combina tudo.

### Mundo 2 — Amazônia (Brasil)
Animais: onça-pintada, arara, preguiça, boto, sapos.
6. **O Dossel Verde** — cipós (escalada vertical). Tia Kelly e Tia Laura ligam.
7. **O Rio** ◆ nado básico.
8. **Nado da Onça** ★ nado forte contra a correnteza (a onça-pintada nada muito bem).
9. **Vozes da Floresta** — seguir sons com ondas visuais.
10. **Tempestade no Rio** — combina cipó, nado e vento.

### Mundo 3 — Savana (Quênia e Tanzânia)
Animais: guepardo, elefante, girafa, zebra, avestruz.
11. **Pegadas na Savana** — seguir rastros.
12. **Corrida do Guepardo** ★ arrancada.
13. **A Força do Elefante** ★ empurrar troncos e pedras.
14. **Olhos no Alto** — rotas altas (girafa como referência de altura).
15. **A Grande Travessia** — arrancada + empurrar.

### Mundo 4 — Austrália
Animais: canguru, wombat, emu, ornitorrinco, coala.
16. **Saltos do Outback** ★ super pulo.
17. **Tocas do Wombat** — túneis (reaproveita o rolar).
18. **Corrida do Emu** — trecho de velocidade.
19. **O Rio do Ornitorrinco** — nado.
20. **Noite no Outback** ◆ noite com trilha iluminada.

### Mundo 5 — Ártico (Canadá e Noruega como referências)
Animais: urso-polar, raposa-do-ártico, rena, foca, coruja-das-neves.
21. **Sol da Meia-Noite** ◆ gelo escorregadio; o dia que não acaba.
22. **Pegadas na Neve** — rastros.
23. **O Pulo da Raposa** ★ mergulho na neve.
24. **Corrida das Renas** — velocidade no gelo.
25. **Mar Congelado** — gelo, água e resgate (Mamãe July).

### Mundo 6 — Antártica e Oceano Austral
Animais: pinguins, focas, orca, baleias, albatroz.
26. **Um Continente sem País** — chegada pelo mapa.
27. **Deslize do Pinguim** ★ deslizar de barriga (reaproveita o rolar sobre gelo).
28. **Debaixo do Gelo** — nado, com bolhas marcando o caminho.
29. **O Canto das Baleias** — sons com ondas visuais.
30. **Tempestade Branca** — vento forte do Viravolta.

### Mundo 7 — Oceano e Praia (Brasil)
Animais: tartaruga-marinha, peixe-boi-marinho, golfinho, caranguejo, cavalo-marinho.
31. **Um Dia na Praia** — chegada perto de casa.
32. **A Maré Mudou** ◆ maré sobe e desce.
33. **Nado do Golfinho** ★ arrancada na água.
34. **O Berçário do Mar** — manguezal.
35. **Praia Depois da Tempestade** — exploração e cuidado com a praia.

### Mundo 8 — Os Dinossauros (Sousa, PB)
Referências: pegadas do Vale dos Dinossauros (Sousa); fósseis do Nordeste, como o Irritator e os pterossauros da Chapada do Araripe ("nem todo animal pré-histórico era dinossauro"). Outros dinossauros entram como páginas do Atlas.
36. **O Vale dos Dinossauros** — pegadas na rocha, hoje. O Portal do Tempo se abre.
37. **Pegadas do Cretáceo** — o mesmo lugar, milhões de anos atrás; seguir as pegadas.
38. **Escavação** ★ cavar (botão Ação) e limpar fósseis.
39. **Monte o Esqueleto** — o único minijogo: arrastar os ossos até a silhueta.
40. **O Atlas Inteiro** — final com todos os poderes e a família inteira.

> Datas geológicas, espécies e locais exatos devem ser **conferidos na ficha científica** antes de virar fala.

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
| Tia Marcela | Abertura de mundos; páginas voando; Mundo 8 |
| Tio Robi | Desafios de corrida e de pulo |
| Mamãe July | Resgates (M5, M7, fase 40) |
| Tias Kelly e Laura | Chamadas nas fases verticais (M2, M3, M5) |

## 6. Fora do lançamento (depois)

Missões de rotina na Casa, fases "Faísca" extras, modo de dois jogadores com o Tio Robi, vozes pré-gravadas de melhor qualidade e mais opções de acessibilidade.
