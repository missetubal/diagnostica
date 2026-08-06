# Tasks de implementação

Cada arquivo neste diretório é uma tarefa de implementação pronta para virar um ticket (GitHub Issue,
Linear, etc.) — copiar o conteúdo do arquivo para a descrição do ticket, ou linkar o arquivo. Derivadas
do fluxo demonstrado no protótipo em `case-clinic-flow.base44.app` e da arquitetura já definida em
`docs/visao-geral.md` e `docs/sugestao-arquitetura.md` (seções 25, 29 e 30).

## Ordem recomendada

| #   | Tarefa                                                                             | Prioridade | Depende de        |
| --- | ---------------------------------------------------------------------------------- | ---------- | ----------------- |
| 01  | [Migrations Supabase + conta admin](01-supabase-migrations-admin-account.md)       | P0         | —                 |
| 11  | [Landing, navegação e shell do app](11-navegacao-shell.md)                         | P0         | — (paralelo a 01) |
| 02  | [Perfil anônimo e onboarding](02-perfil-anonimo-onboarding.md)                     | P0         | 01                |
| 03  | [Painel administrativo de revisão de casos](03-admin-panel-revisao-casos.md)       | P0         | 01                |
| 06  | [Classificação de respostas](06-classificacao-respostas.md)                        | P0         | 03                |
| 04  | [Fluxo de caso: diagnóstico progressivo](04-fluxo-caso-diagnostico-progressivo.md) | P0         | 02, 03, 06        |
| 07  | [Resultado e pontuação](07-resultado-pontuacao.md)                                 | P0         | 04                |
| 08  | [Dashboard, histórico e progresso](08-historico-progresso.md)                      | P0         | 02, 07            |
| 09  | [Desafio diário e compartilhamento](09-desafio-diario-compartilhamento.md)         | P0         | 04, 07, 08        |
| 10  | [Reportar problema](10-reportar-problema.md)                                       | P0         | 04, 07            |
| 05  | [Modo "Caso completo"](05-modo-caso-completo.md)                                   | P1         | 04                |

Numeração dos arquivos segue as fases do roadmap técnico (seção 25 da arquitetura), não a ordem de
execução — use a coluna "Depende de" acima para sequenciar.

## Antes de começar: uma decisão em aberto

O protótipo parece avaliar cada hipótese com uma IA de texto livre (feedback personalizado por resposta),
enquanto `docs/sugestao-arquitetura.md` (seção 13) recomenda classificação por taxonomia do caso
(termo canônico + sinônimos), com IA só assistindo a normalização — não julgando sozinha. Isso muda o
contrato da tarefa 04/06. Detalhado nas duas tarefas; vale decidir antes de começar a implementação.

## O que já existe (não precisa de tarefa própria)

- Schema Prisma completo (`prisma/schema.prisma`) e primeira migration criada.
- ~20 casos clínicos em JSON (`content/casos/`), status `rascunho`, aguardando o painel da tarefa 03.
- Scaffold Next.js/TypeScript/Tailwind e projeto Supabase já criados.
