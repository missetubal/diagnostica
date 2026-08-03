# Diagnostica

Plataforma de prática clínica em casos interativos (estilo Doctordle), para estudantes e profissionais de medicina e fisioterapia.

Ver `docs/visao-geral.md` (produto) e `docs/sugestao-arquitetura.md` (arquitetura técnica completa) para o contexto por trás de todas as decisões abaixo.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma → Postgres (Supabase)
- Supabase Auth (apenas para o painel administrativo no MVP — sem conta de usuário final)
- Zod para validação (inclusive de casos gerados por IA)
- React Hook Form, TanStack Query

## Setup local

```bash
npm install
cp .env.example .env.local   # preencher SUPABASE_SERVICE_ROLE_KEY e DATABASE_URL/DIRECT_URL
npx prisma generate
npx prisma migrate dev       # cria as tabelas no Postgres do Supabase
npm run dev
```

O `.env.example` já vem com a URL e a chave pública (anon) do projeto Supabase `diagnostica` (org Setúbal, região `sa-east-1`). Faltam duas credenciais secretas, disponíveis apenas no [painel do Supabase](https://supabase.com/dashboard/project/ajcrynbnkbqcfiajcham/settings/api):

- `SUPABASE_SERVICE_ROLE_KEY` — em Settings → API.
- `DATABASE_URL` / `DIRECT_URL` — em Settings → Database (connection string).

## Scripts

| Comando                           | O que faz                     |
| --------------------------------- | ----------------------------- |
| `npm run dev`                     | servidor de desenvolvimento   |
| `npm run build`                   | build de produção             |
| `npm run lint`                    | ESLint                        |
| `npm run type-check`              | `tsc --noEmit`                |
| `npm run format` / `format:check` | Prettier                      |
| `npm run prisma:generate`         | gera o client do Prisma       |
| `npm run prisma:migrate`          | cria/aplica migrations locais |
| `npm run prisma:studio`           | UI para inspecionar o banco   |

## Estrutura

```text
app/            rotas (App Router) — páginas e API (app/api/...)
components/     componentes React
lib/            db (Prisma), auth (Supabase), validations (Zod), utils
prisma/         schema.prisma — modelo de dados completo (seção 7 da arquitetura)
content/casos/  casos clínicos em JSON, revisados manualmente antes de existir painel admin
docs/           documentação de produto e arquitetura
tests/          unit / integration / e2e
```

## Estado atual

- [x] Casos clínicos em JSON (`content/casos/`) — status `rascunho`, aguardando revisão clínica antes de virarem `publicado`.
- [x] Scaffold do app (Next.js/TS/Tailwind), schema Prisma completo, projeto Supabase criado.
- [ ] Migrations aplicadas no banco (`npx prisma migrate dev`).
- [ ] Painel administrativo de revisão de casos.
- [ ] Fluxo de diagnóstico progressivo.

Ver seção 25 (`Roadmap técnico`) e seção 30 (`Ordem recomendada para começar`) de `docs/sugestao-arquitetura.md` para os próximos passos detalhados.
