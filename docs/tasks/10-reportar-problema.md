# 10 — Reportar problema

**Fase:** 6 do roadmap técnico · **Prioridade:** P0 · **Depende de:** 04, 07

## Contexto

Botão "Reportar" aparece na tela de resultado do protótipo. O modelo `Report` já existe no schema
(`category`, `description`, `status`, `attempt_id` opcional).

## Escopo

- Modal/formulário de reporte a partir da tela de resultado (e, se fizer sentido, também durante o caso):
  categoria (ex. "Diagnóstico incorreto", "Pista confusa", "Erro de digitação/tradução", "Conteúdo
  inadequado", "Outro") + descrição livre.
- `POST /api/reports`: cria o `Report` vinculado ao `case_id` e, quando existir, ao `attempt_id`.
- `GET /api/reports/:id`: status do reporte para o usuário que abriu (opcional para o MVP, já que não há
  conta — pode ficar só para o admin).
- No painel administrativo (tarefa 03), fila de reportes com filtro por status
  (`aberto | em_analise | resolvido | descartado`) e campo de resolução.
- Reportes acumulados em um caso podem sinalizá-lo automaticamente (`status: sinalizado`) a partir de um
  limite a definir — avaliar se entra neste MVP ou fica manual por enquanto.

## Fora de escopo

- Notificações automáticas para o revisor (e-mail/Slack) — avaliar depois, sem fila dedicada.

## Critérios de aceite

- [ ] Reportar um caso funciona mesmo sem conta (usa o perfil anônimo).
- [ ] Reporte enviado aparece na fila do painel administrativo com todos os dados de contexto
      (caso, tentativa, categoria, descrição).
- [ ] Marcar um reporte como resolvido grava `resolution` e `reviewed_by`.
