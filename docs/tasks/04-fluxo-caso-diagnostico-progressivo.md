# 04 — Fluxo de caso: diagnóstico progressivo

**Fase:** 4 do roadmap técnico · **Prioridade:** P0 · **Depende de:** 02, 03, 06

## Contexto

Esta é a mecânica principal do produto (seção 7 de `docs/visao-geral.md`) e o que o protótipo demonstra
com mais detalhe em `/play`. Fluxo observado no protótipo, caso "Cardiologia · Médio · masculino, 62
anos", modo Progressivo:

1. Tela `/play` abre com seletor de modo: **Progressivo** (revela pistas gradualmente) vs. **Caso
   completo** (tarefa 05), aviso educacional fixo, depois "Montando o caso clínico…" (loading).
2. Cabeçalho do caso: badges de área e dificuldade + `sexo, idade` do paciente + contador "Pista X/6".
3. Etapas reveladas cumulativamente, uma por vez, numeradas (1 a 6): Queixa principal → História da
   doença atual → Antecedentes e fatores de risco → Sinais vitais e exame físico → Exames complementares
   → Evolução ou informação decisiva (= `case_stages.stage_type`, na ordem de `order_index`).
4. Campo "Qual sua hipótese diagnóstica?" com textarea + botão "Enviar hipótese".
5. Ao enviar, estado "Avaliando…" e depois o resultado inline: rótulo de classificação (ex. "Parcialmente
   correto") + explicação de 2–3 frases direcionando o raciocínio, sem entregar a resposta. Botão "Nova
   hipótese" permite tentar de novo na mesma pista.
6. Botão "Próxima pista" avança a etapa (incrementa `hints_used`/`current_stage`); na última etapa o
   botão vira "Ver resposta" e leva à tela de resultado (tarefa 07).
7. Texto de reforço fixo: "Quanto menos pistas usar, maior sua pontuação."

## Escopo

- `POST /api/cases/:id/start` → cria `Attempt` (`status: iniciada`, `current_stage: 0`).
- `GET /api/attempts/:id` → estado atual (etapas já liberadas, tentativas já enviadas com feedback).
- `POST /api/attempts/:id/hint` → libera a próxima `case_stage`, incrementa `hints_used`.
- `POST /api/attempts/:id/answer` → recebe texto livre, classifica (tarefa 06), grava
  `AttemptResponse` (texto original, texto normalizado, classificação, feedback), retorna o resultado
  para exibir inline. Não revela `canonical_term` nem `explanation` do `CaseAnswer`.
- `POST /api/attempts/:id/finish` → chamado quando o usuário chega em "Ver resposta"; marca
  `status: concluida`, `finished_at`, calcula `score` (ver tarefa 07).
- UI: reaproveitar os mesmos componentes de card/etapa entre modo Progressivo e Caso completo.

## Decisão confirmada

Classificação **baseada em taxonomia do caso**, não avaliação de IA em texto livre. Motivos:

- `docs/sugestao-arquitetura.md` §13, §28 e §31 recomendam explicitamente essa abordagem ("feedback
  baseado em regras e taxonomia"; IA apenas assistiva, nunca decidindo a classificação sozinha).
- O schema Prisma já está desenhado para taxonomia, não para avaliação livre: `CaseAnswer`
  (`canonicalTerm` + `answerType` + `explanation`) com `AcceptedAnswerTerm[]` por termo, e
  `AttemptResponse.classification`/`feedback` como campos derivados — não há campo para resposta de IA
  gerada por tentativa.

A leitura do protótipo em `/play` como "avaliação de IA livre" não corresponde ao MVP; tarefa 06
implementa a comparação por taxonomia (`normalized_term` + fuzzy match), e `POST
/api/attempts/:id/answer` (escopo abaixo) consome esse resultado.

## Fora de escopo

- Cálculo de pontuação final e tela de resultado (tarefa 07).
- Modo Caso completo (tarefa 05).

## Critérios de aceite

- [ ] Uma tentativa nova sempre começa na etapa 1, sem pistas extras liberadas.
- [ ] Enviar uma hipótese nunca revela o diagnóstico esperado, mesmo quando errado.
- [ ] "Nova hipótese" permite reenvio sem penalizar como uma nova pista.
- [ ] Avançar pista incrementa `hints_used` corretamente; a última pista mostra "Ver resposta".
- [ ] Fluxo funciona de ponta a ponta em mobile, com estados de carregamento e erro.
