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

Atlas: **toque no livro roxo da tela de título**. Cada bicho encontrado vira uma figurinha; na ficha, os símbolos falam onde ele vive (🗺️), o que come (🍃), o tamanho (📏) e uma curiosidade (⭐). Os textos vêm de `src/data/animais.ts`, tirados do dossiê científico.

Área dos adultos: **segure a engrenagem por 2 segundos** (no título ou na pausa). Lá ficam o lado do direcional, os volumes, "reduzir movimento" e os códigos de save.

## Estrutura

```
src/
  art/Textures.ts       arte desenhada por código (Chico em partes, cenário, objetos, UI)
  core/SaveManager.ts   save local versionado (com migração) + configurações
  data/visual.ts        cores do Chico e da paleta de cada mundo
  entities/Player.ts    física do movimento + animação procedural
  levels/               fases em texto (ver legenda em levels/types.ts)
  scenes/               Boot, Título, Fase, HUD, Pausa, Fim, Área adulta
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

A legenda completa (rocha `R`, animal `A`, pedrinhas caindo `Q`, vento `<` `>`, chuva `U` etc.) está em `src/levels/types.ts`. As falas das placas, dos bichos (tiradas do dossiê científico) e as dicas da Vovó Lili ficam na própria definição da fase, separadas do código. A ordem da campanha fica em `src/levels/index.ts`.

## Publicação

O workflow `.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main`.
Uma única vez, ative em **Settings → Pages → Source: GitHub Actions**.
