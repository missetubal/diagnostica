# 09 — Desafio diário e compartilhamento

**Fase:** 5 do roadmap técnico · **Prioridade:** P0 (promovido — motor de crescimento orgânico, ver
seção 10 de `docs/visao-geral.md`) · **Depende de:** 04, 07, 08

## Contexto

Tela `/daily` no protótipo: "Desafio Diário — Um caso clínico por dia, igual para todos de [profissão].
Você só pode jogar uma vez por dia — use bem as pistas.", com três marcadores ("Mesmo caso para sua
profissão hoje", "Compartilhe o resultado sem revelar a resposta", "Conta para sua sequência de dias") e
botão "Iniciar desafio". O modelo `DailyChallenge` (`date` + `case_id`) já existe no schema.

## Escopo

- Job/rotina (pode ser uma rota chamada por cron da Vercel, sem fila) que seleciona e grava o caso do dia
  em `daily_challenges`, por profissão — confirmar se é um caso por profissão ou um caso único
  independente de profissão (o texto do protótipo diz "igual para todos de Medicina", sugerindo um por
  profissão).
- `GET /api/cases/next` ou endpoint dedicado retorna o caso do dia atual para a profissão do usuário.
- Restrição de uma tentativa por dia por usuário: constraint única (`user_id` + `case_id` + data) em vez
  de lock distribuído (seção 15 da arquitetura).
- Fluxo de jogo reaproveita o modo Progressivo (tarefa 04); ao concluir, tela de resultado ganha um botão
  "Compartilhar resultado" que gera um texto/imagem no estilo Wordle (grade de acertos/pistas usadas, sem
  citar o diagnóstico).
- Conclusão do desafio diário conta para o cálculo de sequência (tarefa 08).

## Decisões de implementação

- **Um caso por profissão por dia civil**, não um caso único global — confirma a leitura sugerida pelo
  texto do protótipo. `DailyChallenge` ganhou `profession_id` (antes só `date` + `case_id`), com unique
  `(date, profession_id)`. Dia civil em UTC, mesma convenção da tarefa 08.
- **Sem job/cron real**: a escolha do caso do dia é determinística — hash de `data + profession_id` sobre
  a lista ordenada de casos publicados daquela profissão — calculada sob demanda na primeira leitura do
  dia (`ensureDailyChallenge`, `lib/daily-challenge.ts`) e persistida via `upsert` (`INSERT ... ON
  CONFLICT`, atômico no Postgres). Chamadas concorrentes calculam o mesmo caso, então não há race nem
  necessidade de lock/fila — cron da Vercel viraria só um "aquecimento" opcional, não uma dependência de
  corretude.
- **Uma tentativa por desafio**, não "por `user_id + case_id + data`" como o escopo original sugeria —
  isso confundiria uma tentativa de prática livre que caísse no mesmo caso do desafio com o desafio em si.
  Em vez disso, `Attempt` ganhou `daily_challenge_id` (nullable) com unique `(user_id, daily_challenge_id)`
  — Postgres trata `NULL` como distinto por padrão, então tentativas de prática livre não são afetadas.
- **Sequência de dias**: nenhuma mudança necessária em `lib/stats.ts` — o cálculo já considera qualquer
  `Attempt` concluído, independente de `mode` ou `daily_challenge_id`, então o desafio diário conta
  automaticamente como uma prática livre concluída no dia.

## Fora de escopo

- Desafio diário por área (só por profissão, no MVP).
- Ranking ou comparação entre usuários (P2).

## Critérios de aceite

- [ ] Cada profissão tem exatamente um caso de desafio por dia civil.
- [ ] Usuário não consegue jogar o desafio do dia duas vezes (nem reiniciar para "resetar" a tentativa).
- [ ] Texto de compartilhamento nunca inclui o diagnóstico, só o desempenho (pistas usadas, acerto/erro).
- [ ] Concluir o desafio diário incrementa a sequência exatamente como uma prática livre concluída no dia.
