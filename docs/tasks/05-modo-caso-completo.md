# 05 — Modo "Caso completo"

**Fase:** 4 do roadmap técnico (variação) · **Prioridade:** P1 · **Depende de:** 04

## Contexto

Segunda opção no seletor de modo em `/play`, ao lado de "Progressivo": "Caso completo — Todas as
informações de uma vez." Não foi possível abrir esse modo no protótipo durante a exploração, então o
comportamento exato de tela precisa ser confirmado com quem fez o protótipo antes de implementar — mas o
back-end é uma variação direta do modo progressivo.

## Escopo

- Mesma tela de caso, mas todas as `case_stages` aparecem de uma vez (sem `hint`/"Próxima pista").
- Um único campo de hipótese, avaliado como no modo progressivo (tarefa 06).
- Pontuação não penaliza por "pistas usadas" (não existe pista) — revisar fórmula de pontuação da
  tarefa 07 para este modo (provavelmente pontuação cheia por acerto, sem bônus por poucas pistas).
- Guardar o modo escolhido em `Attempt` (adicionar campo, ex. `mode: progressivo | completo`, se ainda
  não existir no schema) para diferenciar nas estatísticas (tarefa 08).

## Fora de escopo

- Qualquer mecânica nova de pontuação além de "sem bônus de pistas" — mecânicas mais elaboradas ficam
  para depois do MVP.

## Critérios de aceite

- [ ] Escolher "Caso completo" no seletor abre um caso com todas as etapas visíveis de imediato.
- [ ] Enviar a hipótese usa a mesma lógica de classificação do modo progressivo.
- [ ] Estatísticas (tarefa 08) conseguem distinguir tentativas por modo.

## Observação

Antes de começar: confirmar com quem fez o protótipo o que exatamente aparece nessa tela — este arquivo
assume o comportamento mais provável, não uma captura confirmada.
