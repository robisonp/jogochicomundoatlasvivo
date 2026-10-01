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

Mapa: o **botão verde da tela de título** abre o mapa-múndi com a rota dos 8 mundos. Toque num mundo aberto para escolher a fase, ou no botão verde do mapa para continuar de onde parou. Na primeira vez, a Tia Marcela liga pelo Chamador do Atlas e conta a história do livro; quando um mundo novo abre, o Chico viaja pela rota e o narrador diz o continente e o país.

Família: cada pessoa aparece em pé ao lado da placa em que fala (as Tias Kelly e Laura aparecem por chamada de vídeo, no Chamador do Atlas), e o rosto de quem está falando surge no alto da tela. Na tela de título, toque em alguém para ele se apresentar. **A aparência vem da arte feita pela família**, recortada numa folha só (`public/familia/familia.png`, com os quadros `corpo-<id>` e `rosto-<id>` descritos em `familia.json`). O papel de cada um no jogo fica em `src/data/familia.ts`.

Chico: vem da **folha de personagem feita pela família**, recortada em peças (`public/chico/chico.png` e `chico.json`: cabeça, camisa, bermuda, braço e perna). O jogo monta o boneco com elas e anima braços e pernas girando no ombro e no quadril (posições em `C`, no topo de `src/entities/Player.ts`); a piscada é uma pálpebra desenhada por cima dos olhos.

Fim de fase com bicho novo: a figurinha entra no Atlas e vem uma adivinha "Quem disse isso?" com 3 figuras (`src/scenes/RevelacaoScene.ts`).

Minijogos do Mundo 8: na fase 38, separar em dois cestos quem é e quem não é dinossauro; na 39, montar o esqueleto do Buriolestes. Os dois são falados e funcionam só arrastando ou tocando (`src/scenes/CestosScene.ts` e `EsqueletoScene.ts`). A fase 40 muda o poder do botão da pata a cada trecho (`poderPorTrecho`).

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

A legenda completa (rocha `R`, animal `A`, pedrinhas caindo `Q`, vento `<` `>`, chuva `U`, água rasa `~` e funda `w`, cipó `J`, chamado de bicho `Z`, pedregulho `B`, rastros `:`, terra fofa `F`, tronco de eucalipto `E`, vaga-lume `*`, túnel `t`, gelo `I`, neve fofa `N`, estação de pesquisa `&`, água da maré `%`, lixo do mar `l` etc.; um animal `A` com `fossil` vira monte de escavação, aberto com o botão Ação) está em `src/levels/types.ts`. As falas das placas, dos bichos (tiradas do dossiê científico) e as dicas da Vovó Lili ficam na própria definição da fase, separadas do código. A ordem da campanha fica em `src/levels/index.ts`.

## Publicação

O workflow `.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main`.
Uma única vez, ative em **Settings → Pages → Source: GitHub Actions**.
