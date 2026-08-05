# 01 — Aplicar migrations e criar conta administrativa

**Fase:** 1/2 do roadmap técnico · **Prioridade:** P0 · **Depende de:** nada

## Contexto

O schema Prisma (`prisma/schema.prisma`) já está completo e a primeira migration existe em
`prisma/migrations/20260803170123_first_migration/`, mas ainda não foi confirmada como aplicada ao Postgres
do projeto Supabase (`diagnostica`, org Setúbal, `sa-east-1`). Sem isso, nenhuma outra tarefa funciona.

## Escopo

- Preencher `SUPABASE_SERVICE_ROLE_KEY` e `DATABASE_URL`/`DIRECT_URL` em `.env.local` (valores em
  Settings → API / Settings → Database no painel Supabase do projeto).
- Rodar `npx prisma migrate deploy` (ou `migrate dev` em desenvolvimento) e confirmar que todas as
  tabelas da seção 7 de `docs/sugestao-arquitetura.md` existem no banco.
- Popular as tabelas `professions` e `areas` com os valores iniciais: profissões `medicina` e
  `fisioterapia`; áreas vistas no protótipo — Clínica médica, Emergência, Cardiologia, Neurologia,
  Pneumologia, Infectologia, Gastroenterologia (medicina) — mais as áreas de fisioterapia listadas na
  seção 9.2 de `docs/visao-geral.md`. Ligar via `profession_areas`.
- Criar uma conta única no Supabase Auth para uso administrativo (`role: admin`), sem tela de cadastro
  pública — conforme seção 10 de `docs/sugestao-arquitetura.md`.
- Configurar Row Level Security básica: usuários anônimos só podem ler `cases` com `status = publicado`;
  escrita em `cases`/`case_*` restrita a `reviewer`/`admin`.

## Fora de escopo

- Painel administrativo em si (tarefa 03).
- Autenticação de usuário final (Fase 2 / pós-MVP).

## Critérios de aceite

- [ ] `npx prisma migrate deploy` roda sem erro contra o banco de produção/dev do Supabase.
- [ ] `professions` e `areas` populadas e consultáveis via `GET /api/professions` e `GET /api/areas`
      (endpoints simples, sem lógica — podem ser criados nesta tarefa ou na 02).
- [ ] Login com a conta admin funciona; usuário anônimo não consegue escrever em `cases` (testar via RLS).
- [ ] `.env.example` continua sem segredos reais; `.env.local` no `.gitignore`.
