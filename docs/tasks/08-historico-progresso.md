# 08 — Dashboard, histórico e progresso

**Fase:** 5 do roadmap técnico · **Prioridade:** P0 · **Depende de:** 02, 07

## Contexto

Duas telas do protótipo cobertas aqui:

**Início (dashboard)** — "Bem-vindo de volta / Pronto para praticar?", cards de Sequência (dias) e Taxa
de acerto, card "Seu perfil" (profissão, tipo, dificuldade, áreas + link "Editar perfil"), e três atalhos:
"Praticar agora" (novo caso), "Desafio diário", "Meu progresso".

**Progresso** (aba "Progresso") — cards de Sequência atual (+ recorde), Pontuação total, Taxa de acerto
(`X/Y casos`), Casos resolvidos; seção "Áreas mais praticadas" (contagem por área); "Histórico recente"
com card por tentativa concluída (diagnóstico, área, dificuldade, nº de pistas, pontuação); aviso de que
o progresso é local ao dispositivo/navegador e que sincronização entre dispositivos "chegará em breve".

## Escopo

- `GET /api/users/me/stats`: sequência atual + recorde, pontuação total, taxa de acerto, casos
  resolvidos, contagem por área.
- `GET /api/users/me/history`: lista de tentativas concluídas com os campos exibidos no histórico
  recente.
- Cálculo de sequência de dias (`streak`): dias consecutivos com pelo menos uma tentativa concluída;
  usar apenas consulta direta em `attempts` por data (seção 15 da arquitetura — sem Redis).
- Dashboard (`/`, pós-onboarding) e tela "Progresso" (`/progress`) consumindo esses endpoints.
- Estado vazio: usuário sem tentativas ainda vê os cards zerados, sem erro (visto no protótipo:
  "Sequência: 0 dias", "Taxa de acerto: 0%").

## Fora de escopo

- Sincronização entre dispositivos / contas de usuário (Fase 2/9).
- Recomendação de casos com base no histórico (P1, ver seção 29 da arquitetura).

## Critérios de aceite

- [ ] Sequência de dias soma corretamente mesmo com fuso horário/limite de dia consistente (definir e
      documentar qual timezone é usada como referência).
- [ ] Taxa de acerto = tentativas concluídas com acerto correto / total de tentativas concluídas.
- [ ] "Áreas mais praticadas" reflete contagem real de tentativas por `area_id`.
- [ ] Limpar cookies/localStorage do navegador perde o histórico (comportamento esperado no MVP) — o
      aviso correspondente aparece na tela de Progresso.
