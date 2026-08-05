-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('estudante', 'residente', 'profissional', 'professor');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'reviewer', 'admin');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('facil', 'medio', 'dificil');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('humano', 'ia_assistida', 'importado');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('rascunho', 'em_revisao', 'aprovado', 'publicado', 'sinalizado', 'desativado');

-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('queixa_principal', 'historia', 'antecedentes', 'medicamentos', 'sinais_vitais', 'exame_fisico', 'exames_complementares', 'evolucao', 'pista_final');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('correta', 'parcialmente_correta', 'incorreta');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('iniciada', 'em_andamento', 'concluida', 'abandonada');

-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('aprovado', 'reprovado', 'necessita_ajustes');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('aberto', 'em_analise', 'resolvido', 'descartado');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "device_id" TEXT,
    "auth_user_id" TEXT,
    "email" TEXT,
    "name" TEXT,
    "user_type" "UserType",
    "profession_id" TEXT,
    "experience_level" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profession_areas" (
    "profession_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,

    CONSTRAINT "profession_areas_pkey" PRIMARY KEY ("profession_id","area_id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "difficulty" "Difficulty",
    "daily_goal" INTEGER,
    "preferred_case_mode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_areas" (
    "user_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,

    CONSTRAINT "user_areas_pkey" PRIMARY KEY ("user_id","area_id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "source_type" "SourceType" NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'rascunho',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT,
    "reviewed_by" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_professions" (
    "case_id" TEXT NOT NULL,
    "profession_id" TEXT NOT NULL,

    CONSTRAINT "case_professions_pkey" PRIMARY KEY ("case_id","profession_id")
);

-- CreateTable
CREATE TABLE "case_patient_profiles" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "context" TEXT,
    "relevant_information" TEXT,

    CONSTRAINT "case_patient_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_stages" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "stage_type" "StageType" NOT NULL,
    "content" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_answers" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "canonical_term" TEXT NOT NULL,
    "answer_type" "AnswerType" NOT NULL,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accepted_answer_terms" (
    "id" TEXT NOT NULL,
    "answer_id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "normalized_term" TEXT NOT NULL,

    CONSTRAINT "accepted_answer_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_differentials" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "relevance" TEXT,

    CONSTRAINT "case_differentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_learning_points" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "case_learning_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_references" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "reference_type" TEXT,
    "accessed_at" TIMESTAMP(3),

    CONSTRAINT "case_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'iniciada',
    "current_stage" INTEGER NOT NULL DEFAULT 0,
    "hints_used" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_responses" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "stage_id" TEXT NOT NULL,
    "submitted_text" TEXT NOT NULL,
    "normalized_text" TEXT NOT NULL,
    "classification" "AnswerType",
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attempt_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "attempt_id" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'aberto',
    "reviewed_by" TEXT,
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_reviews" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "decision" "ReviewDecision" NOT NULL,
    "comments" TEXT,
    "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_challenges" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "case_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_device_id_key" ON "users"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_user_id_key" ON "users"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "professions_slug_key" ON "professions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "areas_slug_key" ON "areas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cases_slug_key" ON "cases"("slug");

-- CreateIndex
CREATE INDEX "cases_status_area_id_difficulty_idx" ON "cases"("status", "area_id", "difficulty");

-- CreateIndex
CREATE INDEX "cases_status_published_at_idx" ON "cases"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "case_patient_profiles_case_id_key" ON "case_patient_profiles"("case_id");

-- CreateIndex
CREATE INDEX "case_stages_case_id_order_index_idx" ON "case_stages"("case_id", "order_index");

-- CreateIndex
CREATE INDEX "accepted_answer_terms_normalized_term_idx" ON "accepted_answer_terms"("normalized_term");

-- CreateIndex
CREATE INDEX "attempts_user_id_created_at_idx" ON "attempts"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "attempts_case_id_created_at_idx" ON "attempts"("case_id", "created_at");

-- CreateIndex
CREATE INDEX "reports_status_created_at_idx" ON "reports"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenges_date_key" ON "daily_challenges"("date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_areas" ADD CONSTRAINT "profession_areas_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_areas" ADD CONSTRAINT "profession_areas_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_areas" ADD CONSTRAINT "user_areas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_areas" ADD CONSTRAINT "user_areas_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_professions" ADD CONSTRAINT "case_professions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_professions" ADD CONSTRAINT "case_professions_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_patient_profiles" ADD CONSTRAINT "case_patient_profiles_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_stages" ADD CONSTRAINT "case_stages_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_answers" ADD CONSTRAINT "case_answers_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepted_answer_terms" ADD CONSTRAINT "accepted_answer_terms_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "case_answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_differentials" ADD CONSTRAINT "case_differentials_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_learning_points" ADD CONSTRAINT "case_learning_points_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_references" ADD CONSTRAINT "case_references_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_responses" ADD CONSTRAINT "attempt_responses_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_responses" ADD CONSTRAINT "attempt_responses_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "case_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_reviews" ADD CONSTRAINT "case_reviews_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_reviews" ADD CONSTRAINT "case_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
