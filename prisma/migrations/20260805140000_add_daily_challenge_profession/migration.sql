-- Desafio diário por profissão (docs/tasks/09): um caso por profissão por
-- dia civil, não um caso único global.

DROP INDEX "daily_challenges_date_key";

ALTER TABLE "daily_challenges" ADD COLUMN "profession_id" TEXT NOT NULL;

ALTER TABLE "daily_challenges"
  ADD CONSTRAINT "daily_challenges_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "daily_challenges_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE UNIQUE INDEX "daily_challenges_date_profession_id_key" ON "daily_challenges"("date", "profession_id");

-- Uma tentativa por usuário por desafio diário (NULL = prática livre, não
-- contado pela constraint — comportamento padrão do Postgres).
ALTER TABLE "attempts" ADD COLUMN "daily_challenge_id" TEXT;

ALTER TABLE "attempts"
  ADD CONSTRAINT "attempts_daily_challenge_id_fkey" FOREIGN KEY ("daily_challenge_id") REFERENCES "daily_challenges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "attempts_user_id_daily_challenge_id_key" ON "attempts"("user_id", "daily_challenge_id");
