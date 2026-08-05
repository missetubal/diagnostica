# 06 — Classificação de respostas

**Fase:** 4 do roadmap técnico (suporte) · **Prioridade:** P0 · **Depende de:** 03

## Contexto

Toda hipótese enviada em texto livre precisa virar `correta | parcialmente_correta | incorreta` mais uma
explicação curta — sem nunca revelar o diagnóstico. `docs/sugestao-arquitetura.md` (seções 11 e 13)
recomenda uma abordagem por taxonomia (termos aceitos no próprio caso), com IA só para normalizar termos,
não para julgar livremente. O protótipo parece usar uma avaliação de IA mais livre e explicativa por
resposta (ver nota na tarefa 04). Esta tarefa implementa a versão **por taxonomia**, que é a recomendação
já registrada na arquitetura — revisitar apenas se a decisão em 04 mudar.

## Escopo

- Normalização de texto: minúsculas, remover acentos, colapsar espaços (usada tanto para comparação
  quanto para indexação — seção 14 da arquitetura).
- Comparação do texto normalizado contra `accepted_answer_terms.normalized_term` do `CaseAnswer` do caso,
  com correspondência exata + fuzzy (avaliar `pg_trgm`, já disponível no Postgres do Supabase, para achar
  o termo mais próximo antes de cair em "incorreta").
- Resultado: `AnswerType` do termo mais próximo encontrado, com `CaseAnswer.explanation` correspondente
  como feedback (nunca o `canonical_term` em si, quando a resposta não for `correta`).
- Ponto de extensão opcional para IA: uma chamada de apoio que só **normaliza/reformula** o termo do
  usuário antes da comparação (ex. corrigir "iam" → "infarto agudo do miocárdio"), nunca decide a
  classificação sozinha — consistente com "IA no MVP: assistiva, não autônoma" (seção 28 da arquitetura).

## Fora de escopo

- Avaliação por LLM em texto livre e personalizada por resposta (o que o protótipo sugere) — só entra se
  a decisão da tarefa 04 for nessa direção.

## Critérios de aceite

- [ ] Função de classificação é testável isoladamente (unit tests — ver seção 20 da arquitetura).
- [ ] Sinônimos comuns (ex. "iam", "iam com supra", "infarto agudo do miocárdio") classificam
      corretamente conforme o exemplo da seção 13 da arquitetura.
- [ ] Resposta claramente errada (ex. termo de outra área) cai em "incorreta" sem falso positivo.
- [ ] Nenhum caminho do código expõe `canonical_term` antes do fim do caso.
