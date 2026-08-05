# 03 — Painel administrativo de revisão de casos

**Fase:** 3 do roadmap técnico · **Prioridade:** P0 · **Depende de:** 01

## Contexto

Já existem ~20 casos em `content/casos/*.json` (medicina e fisioterapia), todos com `status: rascunho`,
esperando revisão clínica antes de virar `publicado`. Sem este painel, não há como colocar nenhum caso
em produção — é o maior bloqueador atual (ver "Estado atual" no README).

## Escopo

- CRUD administrativo de `Case` e suas entidades filhas (`case_stages`, `case_answers`,
  `accepted_answer_terms`, `case_differentials`, `case_learning_points`, `case_references`,
  `case_patient_profiles`), protegido pela conta Supabase Auth criada na tarefa 01.
- Import inicial: script (`scripts/import-casos.ts` ou similar) que lê `content/casos/*.json`, valida
  contra o schema Zod (ver `docs/prompt-geracao-casos.md`) e cria os registros no banco com
  `status: rascunho` e `source_type: humano`.
- Lista de casos com filtros por área, profissão, dificuldade e status.
- Editor de caso: campos gerais, etapas em ordem (`order_index`, `stage_type`, conteúdo), respostas
  aceitas com termos sinônimos, diferenciais, pontos de aprendizagem, referências.
- Fila de revisão: transição de status (`rascunho → em_revisao → aprovado/reprovado → publicado`),
  registrando `case_reviews` (decisão + comentários do revisor).
- Regra de publicação: somente casos `publicado` podem ser retornados pelas rotas públicas
  (`GET /api/cases/next`, `GET /api/cases/:id`).

## Fora de escopo

- Geração de casos por IA (Fase 7 / tarefa futura) — aqui os casos entram só via import manual ou editor.
- Múltiplos revisores/permissões granulares — um único papel `admin`/`reviewer` já cobre o MVP.

## Critérios de aceite

- [ ] Rotas `/api/admin/cases*` exigem sessão autenticada; anônimos recebem 401/403.
- [ ] Script de import cria os ~20 casos existentes como `rascunho`, sem duplicar em reimportações.
- [ ] É possível editar um caso, aprová-lo e publicá-lo pelo painel, e ele passa a aparecer via
      `GET /api/cases/next`.
- [ ] Um caso `rascunho`, `em_revisao`, `sinalizado` ou `desativado` nunca aparece na experiência pública.
- [ ] Reportes (tarefa 10) e decisões de revisão ficam visíveis no painel.
