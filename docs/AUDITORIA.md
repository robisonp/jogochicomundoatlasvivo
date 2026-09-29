# Auditoria do GDD — Chico e o Atlas Vivo (v1.0)

Data: 29/09/2026 · Documento auditado: *Game Design Document v1.0* (36 seções + apêndice técnico).

## 1. Veredito

- **O GDD é sólido.** Princípios coerentes (jogar primeiro, aprender dentro da ação, nada essencial depende de leitura) e uma auditoria de escopo honesta.
- **É viável fazer tudo sem gastos obrigatórios.** Todas as ferramentas usadas são gratuitas e de código aberto.
- **Complexidade geral: alta, mas desigual.** A programação é média. O gargalo real é o **conteúdo**: arte de dezenas de animais, áudio e revisão científica.
- **Risco imediato de privacidade:** o repositório no GitHub é **público**. Tudo o que for commitado (nomes da família, falas, cidades) fica aberto na internet.

## 2. Verificação técnica

| Item | Resultado |
|---|---|
| Phaser 4.2.1 é a versão estável atual? | ✅ Sim (`latest` no npm). Vite 8 e TypeScript também confirmados. |
| Programação e build neste ambiente | ✅ Node 22 + npm funcionam. O protótipo já compila e roda. |
| Vozes sintéticas grátis | ✅ A voz pt-BR do próprio aparelho, via Web Speech API (Android/Chrome). Sem arquivos e sem custo. |
| Arte | ✅ Desenhada por código (Canvas 2D), sem arquivos de imagem. Consistente e ajustável. |
| Música e efeitos | ✅ Sintetizados por código (Web Audio). Sem arquivos de som. |
| Pacotes de arte externos (Kenney, OpenGameArt) e vozes Piper do HuggingFace | ⚠️ Bloqueados pela rede do ambiente de desenvolvimento. **Não são necessários** com a abordagem acima. |

## 3. Complexidade por módulo

| Módulo | Complexidade | Situação |
|---|---|---|
| Base (Vite + TS + Phaser, cenas, save versionado) | Baixa | **Feito** no protótipo |
| Movimento (coyote time, jump buffer, pulo variável, câmera que antecipa) | Média, a mais importante | **Feito**; ajuste fino com o Chico jogando |
| Controles de toque (direcional + botões) | Alta (risco de UX) | **Feito**; validar no tablet |
| Poderes simples (arrancada, super pulo, rolar, empurrar) | Média | A fazer, reaproveitando um motor comum |
| Poderes que mudam a física (nado, gelo, mergulho na neve) | Alta | Reduzidos a 3 variações reaproveitáveis (ver GDD revisado) |
| Minijogos | Média cada | Reduzidos a **1** (montar esqueleto); as rotinas ficam para depois do lançamento |
| Atlas, mapa, diálogos, áudio | Média | A fazer |
| Arte de ~40 animais | **Alta**, o maior gargalo | Estilo vetorial por código; animais como ícones/figuras simples |
| Fichas científicas | Média × ~40 | **Responsabilidade da família** (documento completo com fontes) |
| 40 fases curtas | **Alta** pelo volume | Formato de fase em texto + biblioteca de trechos reutilizáveis |

## 4. Custos

**Caminho adotado: R$ 0.**

| Item | Custo |
|---|---|
| Phaser, Vite, TypeScript | Grátis (código aberto) |
| Hospedagem no GitHub Pages | Grátis (o repositório é público) |
| Vozes (síntese do aparelho) | Grátis |
| Arte, música e efeitos (gerados por código) | Grátis |

**Opcionais, se quiserem subir o nível depois:**
- controle Bluetooth (~R$ 100–200);
- voz sintética premium pré-gravada (a partir de ~US$ 5/mês);
- ilustrador para as folhas de modelo dos personagens (orçamento variável).

**Sobre privacidade × hospedagem:**
- O GitHub Pages só é grátis com repositório público, e o site fica acessível a quem tiver o link.
- A meta tag `noindex` impede apenas a indexação pelo Google; não é proteção de acesso.
- Se for preciso fechar o acesso de verdade, a alternativa grátis é repositório privado + Cloudflare Pages + Cloudflare Access (login só da família).

## 5. Achados

1. **Privacidade.** O repositório é público e o GDD usa nomes reais da família. Também há uma contradição interna: o GDD cita a cidade de uma familiar e, na seção de privacidade, manda não expor localização. **Correção:** nenhuma cidade de familiar no conteúdo do jogo.
2. **Controle.** O GDD não menciona controle de videogame, e plataforma com botões na tela é difícil aos 5 anos. **Feito:** suporte a gamepad e a teclado, zonas de toque generosas e lado do direcional configurável.
3. **iPad/iPhone.** **Fora do escopo** por decisão da família. Os cuidados específicos do Safari (apagamento de dados após 7 dias, botão de silencioso) não se aplicam.
4. **Erros científicos no GDD:**
   - *Camaleão = camuflagem* é mito comum: a mudança de cor serve principalmente para comunicação e temperatura. Além disso, ele não estava em nenhum mundo. **Removido.**
   - *Tatu que rola:* só o **tatu-bola** se fecha em bola, não o tatu-peba. E o tatu-bola é da Caatinga. **Adotado no Mundo 1.**
5. **Mundo 8.** O Vale dos Dinossauros, em Sousa (PB), tem pegadas fossilizadas do Cretáceo. **Adotado:** o Portal do Tempo abre em Sousa, e a campanha começa e termina no sertão nordestino.
6. **Inconsistências de lógica.** Corrigidas no [GDD revisado](GDD-REVISADO.md#2-correções-de-lógica).
7. **Duração.** "6 a 10 h em 40 fases" dá 9 a 15 min por fase, longo demais para 5 anos. **Decisão:** fases de 2 a 3 minutos, cerca de 1h30–2h de campanha, mais o replay.
8. **Escopo.** Com o escopo original, a campanha terminaria quando o Chico já soubesse ler. **Decisão:** mundos simplificados para lançar os 8, com poucas mecânicas reaproveitadas.
9. **Faltavam no GDD:** controle de licenças dos materiais, divisão de responsabilidades e limite de tamanho de download. **Endereçados:** tudo é gerado por código e o download fica em ~1,4 MB.
10. **Acessibilidade.** A lista original tem 10 opções. **Primeira versão:** volumes separados, pausa, reduzir movimento e lado dos controles.

## 6. Decisões da família (29/09/2026)

| Tema | Decisão |
|---|---|
| Vozes | Todas sintéticas (narrador e família) |
| Fichas científicas | A família fornece um documento completo, com fontes |
| Controle no tablet | Direcional à direita e 2–3 botões à esquerda (trocável na área adulta) |
| iPad/iPhone | Não precisa ser compatível |
| Mundo 8 | Começa em Sousa (PB) |
| Lógica do GDD | Corrigir tudo que não fecha |
| Duração das fases | 2 a 3 minutos |
| Mundos | Simplificados, para lançar todos: ~40 fases curtinhas |
| Validação com o Chico | Feita pela família, sem necessidade de um grande teste formal |
