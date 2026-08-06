# Arquitetura Técnica — Diagnostica

Documento de referência para estruturar, desenvolver, testar e publicar a plataforma Diagnostica.

O Diagnostica será uma plataforma de prática clínica baseada em casos interativos para estudantes e profissionais de saúde.

> **Nota de escopo:** esta versão prioriza uma arquitetura enxuta para validar o produto (menos peças para hospedar e manter sozinha) — app único em Next.js/TypeScript, Supabase para banco/auth/storage, sem Docker, Redis, filas ou serviço de IA separado. O documento inteiro foi revisado para ficar consistente com essas decisões, com o foco inicial em medicina e fisioterapia e o desafio diário/compartilhamento já como prioridade do MVP.

---

## 1. Visão técnica do produto

A plataforma deverá permitir que o usuário:

1. Crie uma conta.
2. Informe seu perfil profissional ou acadêmico.
3. Escolha sua profissão ou formação.
4. Selecione áreas de interesse.
5. Defina o nível de dificuldade.
6. Inicie um caso clínico.
7. Receba informações progressivamente.
8. Envie hipóteses diagnósticas.
9. Receba feedback.
10. Consulte a resposta esperada e a explicação.
11. Receba uma pontuação.
12. Acompanhe seu histórico e evolução.

A primeira versão deve priorizar casos clínicos estruturados e revisados. A inteligência artificial pode auxiliar na criação, adaptação e explicação dos casos, mas não deve publicar automaticamente conteúdo clínico sem revisão.

---

## 2. Recomendação geral de arquitetura

Para o MVP, usar **um único aplicativo** em vez de múltiplos serviços — inclusive sem separar um serviço próprio de IA no início. O objetivo é reduzir o que precisa ser hospedado, versionado e mantido por uma pessoa só, antes de saber se o produto será usado.

Essa abordagem permite:

- Lançar mais rápido, sem orquestrar múltiplos deploys.
- Não depender de Docker, Terraform ou múltiplos ambientes para começar.
- Separar responsabilidades internamente por pastas/módulos, não por processos.
- Migrar partes para serviços separados depois, só se houver necessidade real (ex.: carga de IA que exija fila própria ou GPU dedicada).

### Arquitetura recomendada

```text
Frontend + Backend (mesmo app Next.js)
    |
    v
Supabase
    +--> Postgres (dados da aplicação, incluindo JSONB dos casos)
    +--> Auth (cadastro, login, sessão)
    +--> Storage (arquivos, quando necessário)
    |
    v
Provedor de IA externo (chamado direto por uma rota da API, sem serviço próprio)
```

---

## 3. Stack tecnológica recomendada

Um único aplicativo, uma única linguagem (TypeScript), reduz a carga de manter dois ecossistemas (Python + Node) sozinha.

### Aplicativo (frontend + backend)

- Next.js (App Router).
- TypeScript.
- Tailwind CSS.
- React Hook Form.
- Zod para validação, inclusive da saída da IA.
- TanStack Query, se necessário além dos Server Components.
- Prisma como ORM, apontando para o Postgres do Supabase.

### Banco de dados e serviços gerenciados

- Supabase: Postgres + Auth + Storage em um único provedor.
- JSONB para dados flexíveis dos casos.
- `pgvector`, futuramente, para busca semântica — já disponível no Supabase quando for necessário.
- Row Level Security (RLS) do Postgres/Supabase para reforçar permissões por papel (`user`, `reviewer`, `admin`) direto no banco, reduzindo lógica de autorização no backend.

### Infraestrutura

- Vercel para hospedar o aplicativo (preview automático por Pull Request + produção).
- Supabase gerenciado — sem Docker Compose necessário para desenvolver.
- GitHub Actions apenas para lint, type-check, testes e build.

Descartado para o MVP, avaliar só se surgir necessidade real: Docker/Docker Compose, Terraform, Redis, filas (Celery/RQ/BullMQ), serviço de IA separado.

---

## 4. Estrutura de diretórios

```text
diagnostica/
├── app/
│   ├── (marketing)/
│   ├── (app)/
│   └── api/
│       ├── cases/
│       ├── attempts/
│       ├── gamification/
│       ├── reports/
│       └── ai/
├── components/
├── lib/
│   ├── db.ts              # cliente Prisma
│   ├── auth.ts             # helpers de sessão/Supabase Auth
│   └── validations/        # schemas Zod
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── content/
│   └── casos/               # primeiros casos em JSON, antes de existir painel admin
├── docs/
│   ├── visao-geral.md
│   ├── sugestao-arquitetura.md
│   └── modelo-de-dados.md
├── tests/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

## 5. Módulos do sistema

Os mesmos domínios de negócio da proposta original continuam válidos — a diferença é que agora são pastas/módulos dentro de um único app, não serviços separados.

### Auth

- **Fora do MVP.** Cadastro, login, logout e recuperação de senha de usuário final ficam para a Fase 2, via Supabase Auth.
- No MVP, existe apenas uma conta protegida por Supabase Auth para uso administrativo (revisão de casos) — sem tela de cadastro pública.

### Users, Professions, Areas

- Dados do usuário passam a existir a partir de um **perfil anônimo** identificado por um `device_id` (cookie/local storage), sem exigir conta.
- Cadastro de profissões e áreas, e a relação entre elas, seguem como na proposta original.

### Cases

- Cadastro, edição, etapas progressivas, diagnóstico principal, diagnósticos diferenciais, referências, status de revisão, versionamento.

### Attempts, Feedback, Gamification

- Início de tentativa, respostas do usuário, etapas desbloqueadas, resultado, pontuação, sequência de dias, estatísticas.

### Review, Reports

- Fila de revisão humana, aprovação ou reprovação de casos, comentários dos revisores, reportes enviados por usuários.

### AI Generation

- Chamada direta a um provedor de IA a partir de uma rota da API (`app/api/ai`), sem serviço dedicado. Saída validada com Zod antes de qualquer persistência.

### Analytics

- Eventos de uso, conversão, retenção. Pode começar com uma ferramenta gerenciada (ex.: PostHog) em vez de um pipeline de eventos próprio.

---

## 6. Fluxo principal do usuário

```text
Página inicial
    |
    v
Criação do perfil anônimo (automática, sem tela própria)
    |
    v
Onboarding
    |
    +--> Tipo de usuário
    +--> Profissão ou formação
    +--> Nível de experiência
    +--> Áreas de interesse
    +--> Nível de dificuldade
    |
    v
Dashboard
    |
    +--> Novo caso
    +--> Desafio diário
    +--> Continuar caso
    +--> Histórico
    +--> Estatísticas
    |
    v
Preparação do caso
    |
    v
Caso clínico progressivo
    |
    +--> Visualizar pista
    +--> Enviar hipótese
    +--> Receber feedback
    +--> Liberar próxima pista
    |
    v
Resultado
    |
    +--> Diagnóstico esperado
    +--> Explicação
    +--> Diagnósticos diferenciais
    +--> Pontos de aprendizagem
    +--> Pontuação
    |
    v
Histórico e progresso
```

---

## 7. Modelo de dados

A modelagem é a mesma da proposta original — ela já era independente do framework. A mudança prática do MVP: `users` não depende mais de conta desde o início. Cada linha começa como um **perfil anônimo** identificado por `device_id` e só ganha `auth_user_id` quando a pessoa criar uma conta na Fase 2 — nesse momento, o progresso do perfil anônimo é migrado (não recriado) para o mesmo registro.

### Entidade `users`

```text
users
- id
- device_id          (identificador anônimo, obrigatório até haver conta)
- auth_user_id        (= auth.users.id do Supabase; nulo até a Fase 2)
- email               (nulo até a Fase 2)
- name
- user_type
- profession_id
- experience_level
- role
- is_active
- created_at
- updated_at
```

Valores possíveis:

```text
user_type:
- estudante
- residente
- profissional
- professor

role:
- user
- reviewer
- admin
```

No MVP, `role` só é relevante para a conta administrativa (reviewer/admin); perfis anônimos são sempre `user`.

### Entidade `professions`

```text
professions
- id
- name
- slug
- description
- is_active
- created_at
- updated_at
```

### Entidade `areas`

```text
areas
- id
- name
- slug
- description
- is_active
- created_at
- updated_at
```

### Entidade `profession_areas`

```text
profession_areas
- profession_id
- area_id
```

### Entidade `user_preferences`

```text
user_preferences
- id
- user_id
- difficulty
- daily_goal
- preferred_case_mode
- created_at
- updated_at
```

### Entidade `user_areas`

```text
user_areas
- user_id
- area_id
```

### Entidade `cases`

```text
cases
- id
- title
- slug
- objective
- area_id
- difficulty
- source_type
- status
- version
- created_by
- reviewed_by
- published_at
- created_at
- updated_at
```

Valores possíveis:

```text
source_type:
- humano
- ia_assistida
- importado

difficulty:
- facil
- medio
- dificil

status:
- rascunho
- em_revisao
- aprovado
- publicado
- sinalizado
- desativado
```

### Entidade `case_professions`

```text
case_professions
- case_id
- profession_id
```

### Entidade `case_patient_profiles`

```text
case_patient_profiles
- id
- case_id
- age
- sex
- context
- relevant_information
```

Não devem ser armazenadas informações de pacientes reais.

### Entidade `case_stages`

```text
case_stages
- id
- case_id
- order_index
- stage_type
- content
- is_required
- created_at
- updated_at
```

Valores possíveis:

```text
stage_type:
- queixa_principal
- historia
- antecedentes
- medicamentos
- sinais_vitais
- exame_fisico
- exames_complementares
- evolucao
- pista_final
```

### Entidade `case_answers`

```text
case_answers
- id
- case_id
- canonical_term
- answer_type
- explanation
- created_at
- updated_at
```

Valores possíveis:

```text
answer_type:
- correta
- parcialmente_correta
- incorreta
```

### Entidade `accepted_answer_terms`

```text
accepted_answer_terms
- id
- answer_id
- term
- normalized_term
```

### Entidade `case_differentials`

```text
case_differentials
- id
- case_id
- name
- explanation
- relevance
```

### Entidade `case_learning_points`

```text
case_learning_points
- id
- case_id
- content
- order_index
```

### Entidade `case_references`

```text
case_references
- id
- case_id
- title
- url
- reference_type
- accessed_at
```

### Entidade `attempts`

```text
attempts
- id
- user_id
- case_id
- status
- current_stage
- hints_used
- score
- started_at
- finished_at
- created_at
- updated_at
```

Valores possíveis:

```text
status:
- iniciada
- em_andamento
- concluida
- abandonada
```

### Entidade `attempt_responses`

```text
attempt_responses
- id
- attempt_id
- stage_id
- submitted_text
- normalized_text
- classification
- feedback
- created_at
```

### Entidade `reports`

```text
reports
- id
- user_id
- case_id
- attempt_id
- category
- description
- status
- reviewed_by
- resolution
- created_at
- updated_at
```

### Entidade `case_reviews`

```text
case_reviews
- id
- case_id
- reviewer_id
- decision
- comments
- reviewed_at
```

Valores possíveis:

```text
decision:
- aprovado
- reprovado
- necessita_ajustes
```

---

## 8. Exemplo de caso clínico estruturado

```json
{
  "id": "caso-001",
  "title": "Dor torácica em adulto",
  "objective": "Identificar a hipótese diagnóstica mais provável",
  "professions": ["medicina"],
  "area": "emergencia",
  "difficulty": "medio",
  "patient": {
    "age": 58,
    "sex": "masculino"
  },
  "stages": [
    {
      "order": 1,
      "type": "queixa_principal",
      "content": "Homem de 58 anos apresenta dor torácica iniciada há 40 minutos."
    },
    {
      "order": 2,
      "type": "history",
      "content": "A dor é opressiva e irradiada para o braço esquerdo."
    },
    {
      "order": 3,
      "type": "vital_signs",
      "content": "Pressão arterial de 150/95 mmHg e frequência cardíaca de 102 bpm."
    },
    {
      "order": 4,
      "type": "complementary_exams",
      "content": "O eletrocardiograma apresenta alterações compatíveis com isquemia."
    }
  ],
  "main_answer": {
    "canonical_term": "síndrome coronariana aguda",
    "accepted_terms": ["síndrome coronariana aguda", "infarto agudo do miocárdio", "iam"],
    "partial_terms": ["dor torácica", "isquemia cardíaca"]
  },
  "differentials": [
    {
      "name": "dissecção aórtica",
      "explanation": "Deve ser considerada em dor torácica súbita e intensa."
    },
    {
      "name": "embolia pulmonar",
      "explanation": "Pode causar dor torácica e alterações cardiovasculares."
    }
  ],
  "explanation": "A hipótese é favorecida pela característica da dor, irradiação e pelos achados do exame complementar.",
  "learning_points": [
    "Reconhecer sinais de alerta em dor torácica.",
    "Considerar diagnósticos diferenciais graves.",
    "Relacionar sintomas aos achados do eletrocardiograma."
  ],
  "references": [
    {
      "title": "Referência clínica",
      "url": "https://exemplo.org/referencia"
    }
  ],
  "status": "em_revisao",
  "version": 1
}
```

---

## 9. API

Implementar como Route Handlers do Next.js (`app/api/...`) dentro do mesmo aplicativo, em vez de um serviço FastAPI separado. O contrato dos endpoints permanece o mesmo.

### Perfil (sem autenticação de usuário no MVP)

Cria/recupera o perfil anônimo a partir de um `device_id` gerado no cliente e salvo em cookie — sem tela de cadastro/login.

```text
POST /api/profile           # cria o perfil anônimo, se ainda não existir
GET  /api/profile/me
```

### Usuário

```text
GET   /api/users/me
PATCH /api/users/me
GET   /api/users/me/preferences
PATCH /api/users/me/preferences
GET   /api/users/me/stats
GET   /api/users/me/history
```

### Profissões e áreas

```text
GET /api/professions
GET /api/professions/:id/areas
GET /api/areas
GET /api/areas/:id
```

### Casos

```text
GET  /api/cases/next
GET  /api/cases/:id
POST /api/cases/:id/start
```

### Tentativas

```text
GET  /api/attempts/:id
POST /api/attempts/:id/answer
POST /api/attempts/:id/hint
POST /api/attempts/:id/finish
```

### Gamificação

```text
GET /api/gamification/score
GET /api/gamification/streak
GET /api/gamification/achievements
```

### Reportes

```text
POST /api/reports
GET  /api/reports/:id
```

### Administração

```text
GET    /api/admin/cases
POST   /api/admin/cases
GET    /api/admin/cases/:id
PATCH  /api/admin/cases/:id
DELETE /api/admin/cases/:id
POST   /api/admin/cases/:id/submit-review
POST   /api/admin/cases/:id/approve
POST   /api/admin/cases/:id/reject
GET    /api/admin/reports
PATCH  /api/admin/reports/:id
```

### IA

```text
POST /api/admin/ai/generate-draft
POST /api/admin/ai/validate-case
POST /api/admin/ai/generate-hint
POST /api/admin/ai/classify-answer
```

Essas rotas devem ser restritas a administradores e revisores autorizados — únicas rotas do MVP que exigem autenticação (ver seção 10).

---

## 10. Autenticação e autorização

### No MVP: sem autenticação de usuário final

Jogar não exige conta. O usuário é identificado por um perfil anônimo (`device_id`), como descrito na seção 7. Isso preserva o desafio diário, a sequência de dias e o compartilhamento de resultado sem exigir cadastro — a mesma lógica usada por jogos como Wordle.

**Trade-off a ter em mente:** sem conta, o progresso fica preso ao navegador/dispositivo. Limpar dados do navegador ou trocar de aparelho perde o histórico até a Fase 2 existir.

### Painel administrativo: autenticação mínima

O painel de revisão de casos precisa de alguma proteção desde o MVP, mesmo sem autenticação de usuário final:

- Uma única conta Supabase Auth, criada manualmente para você (e futuros revisores) — sem fluxo de cadastro público.
- Rotas `/api/admin/*` e `/api/admin/ai/*` exigem essa autenticação.

### Fase 2: autenticação recomendada

Usar **Supabase Auth** diretamente, já que o Supabase também hospeda o banco — evita decidir entre três provedores e integrar um serviço de auth separado do banco de dados.

### Perfis de acesso

Os mesmos três papéis valem para perfis anônimos (MVP) e para contas (Fase 2) — `user` não exige autenticação; `reviewer` e `admin` exigem, desde o MVP.

```text
user:
- Resolver casos.
- Visualizar histórico.
- Visualizar estatísticas.
- Reportar problemas.

reviewer:
- Visualizar casos em revisão.
- Editar conteúdo.
- Aprovar ou reprovar casos.
- Analisar reportes.

admin:
- Gerenciar usuários.
- Gerenciar profissões e áreas.
- Gerenciar casos.
- Gerenciar revisores.
- Visualizar métricas.
```

### Segurança

- Usar Row Level Security (RLS) do Postgres/Supabase como primeira camada de autorização, além das checagens na aplicação.
- Access token com duração curta e refresh token gerenciados pelo Supabase Auth.
- Validar todas as entradas com Zod.
- Configurar CORS restrito.
- Usar HTTPS em produção (padrão na Vercel).
- Não expor a `service_role key` do Supabase no frontend — apenas em rotas de servidor.
- Não registrar tokens em logs.

---

## 11. Inteligência artificial

### Recomendação

Utilizar uma arquitetura híbrida:

```text
Casos estruturados e revisados
        +
IA para adaptação, explicação e personalização
```

A IA não deve ser responsável sozinha por determinar o diagnóstico correto em produção.

### Usos recomendados

- Gerar rascunhos.
- Adaptar linguagem.
- Criar variações de casos.
- Sugerir dicas.
- Classificar respostas.
- Normalizar termos.
- Gerar explicações baseadas no conteúdo aprovado.
- Recomendar casos.
- Criar perguntas de revisão.

### Usos que devem ser evitados inicialmente

- Publicar casos automaticamente.
- Inventar referências.
- Definir condutas clínicas sem validação.
- Avaliar qualquer resposta de forma livre.
- Utilizar dados identificáveis de pacientes.
- Apresentar a IA como ferramenta de diagnóstico real.

### Fluxo seguro

```text
Administrador define tema
    |
    v
Rota da API chama o provedor de IA e recebe um rascunho estruturado
    |
    v
Validação do schema (Zod)
    |
    v
Validações automáticas
    |
    v
Revisão humana
    |
    v
Aprovação
    |
    v
Publicação
```

Nenhum serviço próprio de IA é necessário no MVP — a chamada ao provedor externo acontece dentro da própria rota administrativa.

### Status de um caso gerado por IA

```text
rascunho
em_revisao
aprovado
publicado
sinalizado
desativado
```

---

## 12. Schema de validação da IA

Utilizar **Zod** nas rotas da API (TypeScript).

A saída da IA deve ser obrigatoriamente estruturada.

Campos mínimos:

```text
title
objective
profession
area
difficulty
patient
stages
main_answer
differentials
explanation
learning_points
references
```

O sistema deve rejeitar casos que:

- Não possuam diagnóstico principal.
- Não possuam etapas.
- Possuam campos vazios.
- Tenham tipos inválidos.
- Tenham etapas fora de ordem.
- Não possuam explicação.
- Tenham diagnóstico e pistas incompatíveis.
- Possuam referências inexistentes.
- Não tenham status de revisão.

---

## 13. Classificação das respostas

Não utilizar somente comparação exata de texto.

O caso deve possuir:

- Termo canônico.
- Sinônimos aceitos.
- Respostas parcialmente corretas.
- Respostas incorretas conhecidas.
- Explicações por classificação.

Exemplo:

```json
{
  "canonical_term": "infarto agudo do miocárdio com supradesnivelamento do segmento ST",
  "correct_terms": ["iam com supra", "infarto com supradesnivelamento do st"],
  "partial_terms": ["síndrome coronariana aguda", "infarto agudo do miocárdio"],
  "incorrect_terms": ["refluxo gastroesofágico", "ansiedade"]
}
```

A inteligência artificial pode auxiliar na normalização da resposta, mas a classificação final deve ser limitada à taxonomia do caso.

---

## 14. Banco de dados e índices

Índices importantes:

```text
cases(status, area_id, difficulty)
cases(status, published_at)
attempts(user_id, created_at)
attempts(case_id, created_at)
case_stages(case_id, order_index)
reports(status, created_at)
```

Para buscas em respostas:

- Utilizar normalização de texto.
- Remover acentos.
- Converter para letras minúsculas.
- Remover espaços duplicados.
- Criar índice textual, se necessário.
- Avaliar `pg_trgm`, já disponível como extensão no Postgres do Supabase.

---

## 15. Cache e filas

**Fora do MVP inicial.** Redis, Celery, RQ ou BullMQ resolvem problemas de escala e concorrência que este produto ainda não tem — adicioná-los agora é infraestrutura para manter sem benefício imediato.

O que fazer em vez disso, enquanto o volume for baixo:

- Controle do desafio diário: uma tabela `daily_challenges` com a data e o `case_id` do dia, consultada diretamente — sem Redis.
- Evitar tentativas duplicadas: uma constraint única no banco (`user_id` + `case_id` + data) em vez de locks distribuídos.
- Rate limiting básico: middleware simples na própria rota, ou o rate limiting já oferecido pela Vercel.
- Envio de e-mails: chamada direta a um provedor transacional (ex.: Resend) a partir da rota — sem fila.

Reavaliar Redis/filas quando houver necessidade real: geração de IA em lote, processamento pesado em background, ou volume de usuários que justifique cache de casos.

---

## 16. Infraestrutura

### Desenvolvimento local

Não é necessário Docker para o MVP. O fluxo mais simples:

- Next.js rodando localmente (`npm run dev`).
- Banco de desenvolvimento no próprio Supabase (projeto separado do de produção) ou via Supabase CLI (`supabase start`), se preferir um Postgres local.

### Ambientes

Começar com dois ambientes, não três:

```text
development (local ou projeto Supabase de dev)
production
```

Um ambiente de staging formal pode ser adicionado depois — os preview deployments automáticos da Vercel por Pull Request já cobrem boa parte dessa necessidade no início.

---

## 17. Variáveis de ambiente

Criar um arquivo `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DATABASE_URL=postgresql://user:password@host:5432/postgres

AI_PROVIDER=
AI_API_KEY=

FRONTEND_URL=http://localhost:3000

SENTRY_DSN=
ANALYTICS_KEY=
```

Nunca versionar o arquivo `.env` real. A `SUPABASE_SERVICE_ROLE_KEY` só deve ser usada em rotas de servidor, nunca exposta ao cliente.

---

## 18. Hospedagem

### Aplicativo (frontend + backend)

- Vercel, com integração direta ao GitHub (deploy automático em produção e preview por Pull Request).

### Banco de dados, autenticação e storage

- Supabase — um único provedor gerenciado para os três.

### Serviço de IA

- Nenhum servidor próprio no início. Chamar um provedor de IA por API diretamente das rotas administrativas.
- Avaliar modelo próprio (RunPod, Modal, servidor com GPU) apenas quando houver volume, necessidade de privacidade adicional ou custo que justifique.

---

## 19. CI/CD

Utilizar GitHub Actions para:

- Instalar dependências.
- Rodar lint.
- Rodar testes.
- Verificar tipos.
- Validar migrations do Prisma.
- Build.

### Pipeline mínimo

```text
Pull Request
    |
    +--> Lint
    +--> Type-check
    +--> Testes
    +--> Build
    |
    v
Merge na branch principal
    |
    v
Deploy em produção (automático via integração Vercel + GitHub)
```

Sem etapa de aprovação manual de staging por enquanto — o preview deployment de cada PR já serve para revisar antes do merge. Reintroduzir um gate formal de staging quando houver mais de uma pessoa no time ou usuários reais em produção.

---

## 20. Testes

### Testes unitários

Testar:

- Classificação de respostas.
- Cálculo de pontuação.
- Cálculo de sequência de dias.
- Validação de casos.
- Seleção de casos.
- Permissões.
- Normalização de texto.

### Testes de integração

Testar:

- Criação do perfil anônimo.
- Autenticação da conta administrativa.
- Criação de tentativa.
- Envio de resposta.
- Finalização de caso.
- Salvamento de histórico.
- Reporte de problema.
- Aprovação de caso.

### Testes end-to-end

Fluxo principal:

```text
Criação do perfil anônimo
    |
    v
Onboarding
    |
    v
Dashboard
    |
    v
Iniciar caso
    |
    v
Enviar resposta
    |
    v
Receber feedback
    |
    v
Finalizar caso
    |
    v
Visualizar resultado
```

Ferramentas:

- Playwright.
- Cypress.
- Vitest ou Jest.

---

## 21. Qualidade de código

### TypeScript

- ESLint.
- Prettier.
- TypeScript strict mode.
- Vitest ou Jest.
- Playwright.
- Husky.
- lint-staged.

### Práticas

- Usar tipagem forte.
- Evitar lógica de negócio dentro das rotas.
- Escrever serviços pequenos.
- Criar testes para regras importantes.
- Utilizar migrations.
- Fazer code review.
- Padronizar commits.

### Exemplos de commits

```text
feat: adiciona fluxo de onboarding
fix: corrige cálculo de pontuação
chore: atualiza dependências
test: adiciona testes de classificação
docs: atualiza arquitetura técnica
```

---

## 22. Observabilidade

### Erros

Utilizar:

- Sentry.
- Logs estruturados.
- Alertas de exceções.
- Rastreamento de requisições.

### Métricas técnicas

Monitorar:

- Tempo de resposta da API.
- Taxa de erro.
- Uso de CPU e memória (na Vercel).
- Tempo de resposta do provedor de IA.
- Conexões com banco.
- Disponibilidade.

Uso de GPU e filas pendentes só passam a fazer sentido se um serviço de IA próprio ou processamento assíncrono forem adotados no futuro (ver seção 15).

### Métricas do produto

Monitorar:

- Usuários cadastrados.
- Casos iniciados.
- Casos concluídos.
- Taxa de conclusão.
- Taxa de acerto.
- Média de pistas usadas.
- Sequência de dias.
- Retenção.
- Casos reportados.
- Áreas mais praticadas.

---

## 23. Segurança e LGPD

O projeto deve considerar requisitos da LGPD.

### Dados que devem ser coletados com cuidado

- Nome.
- E-mail.
- Profissão.
- Nível de formação.
- Histórico de desempenho.
- Preferências de estudo.
- Dados de uso.

### Regras importantes

- Coletar somente o necessário.
- Informar a finalidade da coleta.
- Permitir exclusão da conta.
- Permitir solicitação de dados.
- Não armazenar dados identificáveis de pacientes.
- Não utilizar casos reais sem anonimização adequada.
- Não registrar dados sensíveis em logs.
- Restringir acesso ao painel administrativo.
- Criptografar dados em trânsito.
- Proteger dados em repouso.
- Criar política de privacidade.
- Criar termos de uso.

### Aviso obrigatório na experiência

A plataforma deve deixar claro que:

- O conteúdo é educacional.
- Não substitui supervisão profissional.
- Não substitui protocolos institucionais.
- Não deve ser usada para diagnosticar pacientes reais.
- Não devem ser inseridos dados identificáveis de pacientes.

---

## 24. Administração e revisão de conteúdo

Criar uma área administrativa com:

- Lista de casos.
- Filtros por área.
- Filtros por profissão.
- Filtros por dificuldade.
- Filtros por status.
- Editor de caso.
- Editor de etapas.
- Editor de respostas aceitas.
- Editor de diferenciais.
- Editor de referências.
- Histórico de versões.
- Fila de revisão.
- Aprovação ou reprovação.
- Visualização de reportes.

### Regra de publicação

Somente casos com o seguinte status podem aparecer para usuários:

```text
publicado
```

Casos em:

```text
rascunho
em_revisao
sinalizado
desativado
```

não devem ser exibidos na experiência principal.

---

## 25. Roadmap técnico

### Fase 1 — Fundação

- Criar repositório.
- Definir stack.
- Criar estrutura de pastas.
- Configurar projeto Supabase (banco, auth, storage).
- Configurar deploy na Vercel.
- Configurar CI.
- Configurar lint.
- Criar documentação inicial.

### Fase 2 — Onboarding (perfil anônimo, sem conta)

- Criação do perfil anônimo (`device_id`).
- Conta única de administrador/revisor (Supabase Auth, criada manualmente).
- Perfil: tipo de usuário, profissão, nível de experiência.
- Áreas de interesse.
- Nível de dificuldade.

### Fase 3 — Casos manuais

- Modelagem dos casos.
- CRUD administrativo.
- Cadastro de etapas.
- Respostas aceitas.
- Diagnósticos diferenciais.
- Referências.
- Status de revisão.

### Fase 4 — Modo de diagnóstico progressivo

- Iniciar tentativa.
- Liberar etapas.
- Enviar hipótese.
- Classificar resposta.
- Exibir feedback.
- Finalizar caso.

### Fase 5 — Resultado e progresso

- Pontuação.
- Histórico.
- Estatísticas.
- Sequência de dias.
- Dashboard.

### Fase 6 — Reportes e revisão

- Reportar problema.
- Fila de revisão.
- Aprovação de casos.
- Versionamento.
- Auditoria.

### Fase 7 — IA assistida

- Geração de rascunhos.
- Validação de schema.
- Geração de dicas.
- Classificação controlada.
- Revisão humana.

### Fase 8 — Produção

- Deploy.
- Domínio.
- HTTPS.
- Monitoramento.
- Backup.
- Alertas.
- Política de privacidade.
- Termos de uso.

### Fase 9 — Contas de usuário (pós-MVP)

- Cadastro.
- Login.
- Recuperação de senha.
- Migração do progresso do perfil anônimo para a conta.
- Sincronização entre dispositivos.

---

## 26. O que não construir no início

Para evitar excesso de escopo, deixar para versões futuras:

- Aplicativo mobile nativo.
- Multiplayer.
- Ranking global.
- Casos ramificados complexos.
- Vídeos e áudios.
- Integração com hospitais.
- Integração com prontuários.
- Certificados.
- Créditos de educação continuada.
- Marketplace de cursos.
- Geração ilimitada de casos em tempo real.
- Fine-tuning antes de existir uma base revisada.
- Sistema complexo de permissões.
- Microserviços separados desde o primeiro dia.

---

## 27. Definição de pronto

Uma funcionalidade estará pronta quando:

- Estiver implementada conforme os critérios de aceitação.
- Possuir validação de entrada.
- Possuir estado de carregamento.
- Possuir estado de erro.
- Possuir estado vazio.
- Funcionar em dispositivos móveis.
- Possuir testes automatizados.
- Estiver documentada.
- Não expuser dados sensíveis.
- Estiver integrada ao fluxo principal.
- Tiver sido revisada no preview deployment do Pull Request.
- Não quebrar funcionalidades existentes.

Um caso clínico estará pronto quando:

- Possuir objetivo educacional.
- Possuir público-alvo definido.
- Possuir área e dificuldade.
- Possuir etapas ordenadas.
- Possuir diagnóstico principal.
- Possuir respostas aceitas.
- Possuir diagnósticos diferenciais.
- Possuir explicação.
- Possuir pontos de aprendizagem.
- Possuir referências, quando aplicável.
- Tiver sido revisado clinicamente.
- Tiver sido revisado pedagogicamente.
- Estiver com status `publicado`.

---

## 28. Decisões recomendadas

| Item               | Recomendação                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Arquitetura        | Aplicativo único (Next.js), sem serviços separados                                                                       |
| Frontend           | Next.js + TypeScript                                                                                                     |
| Backend            | Route Handlers do próprio Next.js (TypeScript)                                                                           |
| ORM                | Prisma                                                                                                                   |
| Banco de dados     | PostgreSQL (via Supabase)                                                                                                |
| Cache              | Não utilizado no MVP                                                                                                     |
| Filas              | Não utilizadas no MVP                                                                                                    |
| IA                 | Chamada direta a provedor externo, sem serviço próprio                                                                   |
| Casos clínicos     | Estruturados e revisados                                                                                                 |
| IA no MVP          | Assistiva, não autônoma                                                                                                  |
| Autenticação       | Sem conta de usuário no MVP (perfil anônimo); Supabase Auth só para o painel administrativo; contas de usuário na Fase 2 |
| API                | REST                                                                                                                     |
| Documentação       | OpenAPI/Swagger                                                                                                          |
| Desenvolvimento    | Local (`npm run dev`) + projeto Supabase de desenvolvimento                                                              |
| Deploy             | Vercel (app único) + Supabase (dados)                                                                                    |
| Testes E2E         | Playwright                                                                                                               |
| Observabilidade    | Sentry + logs estruturados                                                                                               |
| Analytics          | PostHog ou solução própria                                                                                               |
| Controle de versão | Git + GitHub                                                                                                             |
| CI/CD              | GitHub Actions                                                                                                           |
| Banco vetorial     | Supabase (pgvector) futuramente                                                                                          |

---

## 29. Prioridade de implementação

### Prioridade P0 — Essencial

- Perfil anônimo (`device_id`), sem cadastro nem login.
- Autenticação da conta administrativa (Supabase Auth, uso interno).
- Onboarding.
- Profissão.
- Área de estudo.
- Nível de dificuldade.
- Casos estruturados.
- Diagnóstico progressivo.
- Envio de respostas.
- Feedback.
- Resultado final.
- Histórico básico (vinculado ao perfil anônimo).
- Painel administrativo.
- Revisão de casos.
- Aviso educacional.
- Reporte de problemas.
- Desafio diário.
- Compartilhamento de resultado do desafio diário.

> Desafio diário e compartilhamento foram promovidos para P0: são o motor de crescimento orgânico do produto, por isso entram no MVP (ver `visao-geral.md`, seção 10). Cadastro/login de usuário final saiu do P0 e virou Fase 2 (ver seção 25).

### Prioridade P1 — Importante

- Cadastro e login de usuário final, com migração do progresso anônimo (Fase 2).
- Pontuação.
- Sequência de dias.
- Estatísticas.
- Recomendações de casos.
- Geração de rascunhos com IA.
- Filtros avançados no painel administrativo.

### Prioridade P2 — Futuro

- Casos com imagens.
- Casos ramificados.
- Ranking.
- Multiplayer.
- Modo professor.
- Turmas.
- Revisão espaçada.
- Aplicativo mobile.
- Fine-tuning de modelo local.

---

## 30. Ordem recomendada para começar

Sem etapa de validação por entrevista — já decidido pular essa fase e ir direto à execução.

1. Profissões e áreas iniciais já definidas: medicina e fisioterapia, com as áreas listadas em `visao-geral.md` (seção 9.2).
2. Criar o schema de um caso clínico.
3. Criar manualmente os primeiros casos (medicina e fisioterapia), com revisão dos profissionais de contato.
4. Definir as regras de classificação de respostas.
5. Criar o projeto Supabase (banco e storage) e a conta administrativa única (Supabase Auth, uso interno).
6. Criar o painel administrativo, protegido pela conta administrativa.
7. Implementar o perfil anônimo (`device_id`) — sem cadastro nem login de usuário final.
8. Implementar o fluxo do caso.
9. Implementar o resultado.
10. Adicionar histórico vinculado ao perfil anônimo.
11. Adicionar desafio diário e compartilhamento de resultado.
12. Testar com usuários reais.
13. Medir dificuldades e reportes.
14. Só depois adicionar IA para gerar rascunhos e dicas.
15. Avaliar a necessidade de um modelo local.
16. Adicionar cadastro/login de usuário final e migração do progresso anônimo (Fase 2).

---

## 31. Resumo executivo

A primeira versão do Diagnostica deve ser construída com:

- Um único aplicativo em Next.js e TypeScript (frontend e backend juntos).
- Supabase para banco (PostgreSQL) e storage; autenticação usada apenas para proteger o painel administrativo no MVP.
- Sem cadastro nem login de usuário final no MVP — perfil anônimo por `device_id`; contas ficam para a Fase 2.
- Hospedagem na Vercel, sem Docker, Redis ou filas.
- API REST.
- Casos clínicos estruturados, com foco inicial em medicina e fisioterapia.
- Painel de revisão administrativa.
- Fluxo de diagnóstico progressivo.
- Feedback baseado em regras e taxonomia.
- Desafio diário e compartilhamento de resultado já no MVP.
- IA apenas como apoio, chamada direto de uma rota da API.
- Revisão humana obrigatória.
- Testes automatizados.
- Monitoramento.
- Proteção de dados.

A prioridade deve ser validar a experiência e a qualidade dos casos antes de investir em geração automática, fine-tuning ou infraestrutura complexa de inteligência artificial.
