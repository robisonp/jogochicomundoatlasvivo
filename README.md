# Chico e o Atlas Vivo

Jogo 2D de plataforma e aventura para navegador, feito para uma criança de 5 anos que ainda não lê.
Phaser 4 + TypeScript + Vite. Arte, música e efeitos gerados por código; vozes sintéticas do próprio aparelho.

- Auditoria do GDD: [docs/AUDITORIA.md](docs/AUDITORIA.md)
- GDD revisado (decisões, correções e os 8 mundos): [docs/GDD-REVISADO.md](docs/GDD-REVISADO.md)
- Dossiê científico (fonte das falas e fichas do Atlas): [docs/DOSSIE-CIENTIFICO.md](docs/DOSSIE-CIENTIFICO.md)

## Rodar

```bash
npm install
npm run dev        # abre em http://localhost:5173 (e na rede local, para testar no tablet)
npm run build      # gera dist/
```

Parâmetros de URL úteis:
- `?fase=caatinga-2` abre direto uma fase (ids em `src/levels/`);
- `?atlas` abre direto o Atlas;
- `?mapa` abre direto o mapa-múndi;
- `?toque` mostra os controles de toque no computador;
- `?debug` mostra as caixas de colisão.

## Controles

| | Tablet | Teclado | Controle |
|---|---|---|---|
| Andar / subir escada | Direcional (à direita) | Setas ou WASD | Analógico ou direcional |
| Pular (segurar = mais alto) | Botão ↑ (à esquerda) | Espaço ou Z | A |
| Ação (ouvir placa) | Botão ✋ | X ou E | X / B |
| Poder do Bicho | Botão 🐾 (só quando houver) | C ou Shift | Y / RB / LB |
| Pausa | ⏸ no canto | Esc ou P | Start |

Menu de entrada: o letreiro "CHICO e o Atlas Vivo" cai do céu, a família chega pulando e o botão verde **COMEÇAR** leva ao mapa. Embaixo ficam o livro do Atlas e a panela da Cozinha, com o nome numa plaquinha. No celular e no tablet, COMEÇAR liga a tela cheia e trava a tela deitada, quando o navegador permite. A arte do menu fica em `src/art/Menu.ts`.

Tamanho da tela: o jogo ocupa a tela toda, com pelo menos 1280x720 visíveis, e acompanha a proporção do aparelho. Se a tela muda depois de abrir (o celular abriu em pé e foi girado, a barra do navegador sumiu, entrou em tela cheia), as telas de menu (título, mapa, Atlas e cozinha) se remontam sozinhas. No meio de uma fase nada reinicia: o jogo só encolhe para caber até voltar ao mapa (`src/core/Tela.ts`).

Mapa: o **botão COMEÇAR** abre o mapa-múndi com a rota dos 8 mundos. Toque num mundo aberto para escolher a fase, ou no botão verde do mapa para continuar de onde parou. Na primeira vez, a Tia Marcela liga pelo Chamador do Atlas e conta a história do livro; quando um mundo novo abre, o Chico viaja pela rota e o narrador diz o continente e o país.

Família: cada pessoa aparece em pé ao lado da placa em que fala (as Tias Kelly e Laura aparecem por chamada de vídeo, no Chamador do Atlas), e o rosto de quem está falando surge no alto da tela. Na tela de título, toque em alguém para ele se apresentar. **A aparência vem da arte feita pela família**, recortada numa folha só (`public/familia/familia.png`, com os quadros `corpo-<id>` e `rosto-<id>` descritos em `familia.json`). O papel de cada um no jogo fica em `src/data/familia.ts`.

Chico: vem da **folha de personagem feita pela família**, recortada em peças (`public/chico/chico.png` e `chico.json`: cabeça, camisa, bermuda, braço e perna). O jogo monta o boneco com elas e anima braços e pernas girando no ombro e no quadril (posições em `C`, no topo de `src/entities/Player.ts`); a piscada é uma pálpebra desenhada por cima dos olhos.

Encontro com um bicho: o jogo para, a tela escurece e a figura do bicho cresce no meio dela enquanto ele fala (com o botão de ouvir de novo). Quando a fala acaba, a figura volta para o lugar e o Chico pode seguir (no mínimo 2,2 s de figura na tela). O HUD desenha a figura (`HudScene.focarBicho`) e a fase espera (`LevelScene.focarBicho` / `soltarFoco`).

Falas sem atraso: as gravações da família são baixadas em segundo plano depois do primeiro toque e tocam da memória. A voz sintética é "acordada" nesse primeiro toque, prefere as vozes do próprio aparelho (as de internet demoram para começar) e confere sozinha quando a fala acabou, sem depender do aviso do navegador, que às vezes falha.

Placas, pessoas da família e bandeiras sempre ficam em chão firme: se o desenho da fase as deixou na beira de um buraco ou um pouco acima do chão, o jogo as coloca no bloco com chão mais perto.

Fim de fase com bicho novo: a figurinha entra no Atlas e vem uma adivinha "Quem sou eu?": o bicho dá 3 pistas (em `pistas`, nas fichas de `src/data/animais.ts`) e o Chico escolhe entre 3 figuras (`src/scenes/RevelacaoScene.ts`).

Minijogos do Mundo 8: na fase 38, separar em dois cestos quem é e quem não é dinossauro; na 39, montar o esqueleto do Buriolestes. Os dois são falados e funcionam só arrastando ou tocando (`src/scenes/CestosScene.ts` e `EsqueletoScene.ts`). A fase 40 muda o poder do botão da pata a cada trecho (`poderPorTrecho`).

Vozes gravadas pela família: coloque os áudios em `public/vozes/<pessoa>/` (ex.: `public/vozes/lili/lili-001.m4a`), com o código de cada fala no nome (os códigos estão no documento "Falas da família para gravar" e em `src/data/vozes.ts`). O jogo toca a gravação quando ela existe e usa a voz sintética nas outras falas. Funcionam .m4a, .mp3, .ogg, .opus, .wav, .webm e .aac; o nome aceita variações como `Lili_1` ou `lili 001`. Na área dos adultos aparece quantas falas já têm gravação, com um botão para ouvir todas.

Escalada com as Tias Kelly e Laura: depois de cada mundo, o Chico encontra as tias numa pedra perto de onde passou (lajedo do sertão, paredão da floresta, pedras redondas da savana, pedra vermelha do deserto, pedra com neve no Ártico, pedra escura na Antártica, granito à beira-mar e camadas de rocha no Mundo 8). Cada tia segura uma corda. Algumas agarras piscam numa ordem, cada uma com uma nota musical que sobe; o Chico toca nelas na mesma ordem e sobe. Errou: escorrega, a corda segura e as tias o descem; a sequência pisca de novo. Depois de 2 erros a próxima agarra certa brilha de leve; depois de 4, pisca uma de cada vez, então ninguém fica travado. A dificuldade cresce de mundo em mundo (3 de 8 agarras na Caatinga até 6 de 17 no Mundo 8). No topo, um mosquetão colorido para a coleção. A escalada é obrigatória na primeira vez (o botão verde do mapa leva até ela se ficou para trás); depois, a pedra no meio da rota do mapa deixa escalar de novo, com um caminho novo sorteado. A pedra do Mundo 8 vem antes da festa final (`src/scenes/EscaladaScene.ts`, dados em `src/data/escaladas.ts`, arte em `src/art/Escalada.ts`; `?escalada=<mundo>` abre direto uma pedra).

Cozinha da Vovó Lili: **toque na panela laranja da tela de título**. O Chico ajuda a avó em 4 receitas, só com figuras e voz: salada de frutas (separar por cor), sopa de legumes (redondos e compridos), feira (grande e pequeno) e bolo de cenoura (contar 3 ovos e 2 cenouras). Dá para arrastar o ingrediente ou tocar nele e depois na tigela. As receitas abrem com 0, 1, 3 e 5 selos das aventuras (`src/scenes/CozinhaScene.ts`, arte em `src/art/Cozinha.ts`). As falas da vovó são `lili-161` a `lili-179`.

Atlas: **toque no livro roxo da tela de título** (ou no livro do mapa). Cada bicho encontrado vira uma figurinha; na ficha, os símbolos falam onde ele vive (🗺️), o que come (🍃), o tamanho (📏) e uma curiosidade (⭐). Os textos vêm de `src/data/animais.ts`, tirados do dossiê científico.

Área dos adultos: **segure a engrenagem por 2 segundos** (no título ou na pausa). Lá ficam o lado do direcional, os volumes, "reduzir movimento" e os códigos de save.

## Estrutura

```
src/
  art/Textures.ts       arte desenhada por código (Chico em partes, cenário, objetos, UI)
  core/SaveManager.ts   save local versionado (com migração) + configurações
  data/visual.ts        cores do Chico e da paleta de cada mundo
  data/familia.ts       papel de cada pessoa da família (a arte fica em public/familia)
  data/mapa.ts          os 8 mundos no mapa-múndi (onde ficam e o que o narrador fala)
  entities/Player.ts    física do movimento + animação procedural
  levels/               fases em texto (ver legenda em levels/types.ts)
  scenes/               Boot, Título, Mapa, Atlas, Fase, HUD, Pausa, Fim, Área adulta
  systems/              entrada unificada, áudio sintetizado, vozes
  ui/                   controles de toque e widgets
```

### Como criar uma fase

As fases são trechos desenhados em texto, colados lado a lado (`src/levels/caatinga1.ts` é o exemplo mais simples):

```
'..o.o......',     o = pegada
'.....====..',     = = laje (atravessa por baixo)
'.P..S...^..',     P = início, S = placa de som, ^ = espinhos
'###########',     # = chão
```

A legenda completa (rocha `R`, animal `A`, pedrinhas caindo `Q`, vento `<` `>`, chuva `U`, água rasa `~` e funda `w`, cipó `J`, chamado de bicho `Z`, pedregulho `B`, rastros `:`, terra fofa `F`, tronco de eucalipto `E`, vaga-lume `*`, túnel `t`, gelo `I`, neve fofa `N`, estação de pesquisa `&`, água da maré `%`, lixo do mar `l`, redemoinho do Vento Viravolta `X` etc.; um animal `A` com `fossil` vira monte de escavação, aberto com o botão Ação) está em `src/levels/types.ts`. As falas das placas, dos bichos (tiradas do dossiê científico) e as dicas da Vovó Lili ficam na própria definição da fase, separadas do código. A ordem da campanha fica em `src/levels/index.ts`.

## Publicação

O workflow `.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main`.
Uma única vez, ative em **Settings → Pages → Source: GitHub Actions**.
