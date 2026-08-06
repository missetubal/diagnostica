-- Modo da tentativa: progressivo (pistas graduais) vs completo (tudo revelado
-- de uma vez) — ver docs/tasks/05-modo-caso-completo.md.
CREATE TYPE "AttemptMode" AS ENUM ('progressivo', 'completo');

ALTER TABLE "attempts" ADD COLUMN "mode" "AttemptMode" NOT NULL DEFAULT 'progressivo';
