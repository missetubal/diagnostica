# 07 — Tela de resultado e pontuação

**Fase:** 5 do roadmap técnico · **Prioridade:** P0 · **Depende de:** 04

## Contexto

Tela final observada no protótipo ao terminar um caso ("Ver resposta"):

- Cabeçalho "Caso encerrado" + pontuação em destaque ("0 PTS") + uma frase de status
  ("Não foi dessa vez — revise a explicação abaixo.").
- Bloco "DIAGNÓSTICO": nome do diagnóstico esperado + "Justificativa clínica" (parágrafo).
- "Diagnósticos differenciais": lista com nome + explicação.
- "Pontos de aprendizagem": lista numerada.
- "Referências": lista de fontes.
- "Suas tentativas": chips com cada hipótese que o usuário enviou durante o caso.
- Aviso "Caso gerado com auxílio de IA — conteúdo educacional, sujeito a revisão." (mostrar só quando
  `source_type = ia_assistida`) + o disclaimer educacional fixo do rodapé.
- Botões "Novo caso" (volta para `/play`) e "Reportar" (abre o fluxo da tarefa 10).

## Escopo

- `POST /api/attempts/:id/finish`: calcula `score` a partir de `hints_used` e da classificação final
  (ex.: pontuação cheia se acertou usando poucas pistas, decrescente por pista usada — definir fórmula
  exata e documentá-la aqui ou em `docs/sugestao-arquitetura.md`), marca `status: concluida`.
- Endpoint/consulta que devolve, para a tela de resultado: dados do `Case` (diagnóstico, justificativa =
  `CaseAnswer.explanation` do termo correto, `case_differentials`, `case_learning_points`,
  `case_references`) + todas as `AttemptResponse` da tentativa (para "Suas tentativas").
- UI da tela de resultado replicando as seções acima.
- Gravar o resultado no histórico do perfil anônimo (liga com tarefa 08).

## Fórmula de pontuação (implementada em `lib/score.ts`)

```
base = 100 se a melhor classificação obtida na tentativa for "correta"
     =  50 se "parcialmente_correta"
     =   0 se nunca passou de "incorreta" (ou nenhuma hipótese enviada)

score = max(0, base − hints_used × 10)
```

"Melhor classificação obtida" considera todas as `AttemptResponse` da tentativa, não só a última — reenviar
hipótese ("Nova hipótese") não é penalizado, então uma resposta correta enviada antes de avançar pistas
conta mesmo que o usuário tenha reformulado depois. `hints_used` é o valor final gravado em `Attempt` no
momento do `finish`. Modo completo (tarefa 05) nunca incrementa `hints_used`, então lá o score é sempre a
pontuação base cheia — sem bônus por "poucas pistas" porque não existe pista nesse modo.

ponytail: 10 pontos por pista é um valor fixo, ajustar quando houver dados reais de tentativas.

## Fora de escopo

- Compartilhamento do resultado (esse fluxo é específico do desafio diário — tarefa 09, que não revela o
  diagnóstico).
- "Opção de marcar como revisado" citada na seção 18 de `docs/visao-geral.md` — avaliar se entra no MVP
  ou fica para depois; não visto no protótipo.

## Critérios de aceite

- [ ] Pontuação é determinística e coerente com "quanto menos pistas usar, maior sua pontuação".
- [ ] Diagnóstico e explicação só aparecem depois de `finish`, nunca antes.
- [ ] "Suas tentativas" mostra, na ordem certa, todas as hipóteses enviadas na tentativa.
- [ ] "Novo caso" inicia uma tentativa nova sem herdar estado da anterior.
