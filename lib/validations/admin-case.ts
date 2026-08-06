import { z } from 'zod';
import { difficultySchema, sourceTypeSchema, stageTypeSchema } from '@/lib/validations/case';

/**
 * Schema do formulário do painel administrativo (app/admin/cases). Opera
 * diretamente sobre o shape do banco (ids reais de área/profissão, um
 * CaseAnswer por linha) — diferente de `caseSchema` em lib/validations/case.ts,
 * que valida o JSON de import (slugs, main_answer único com partial_terms).
 */

export const answerTypeSchema = z.enum(['correta', 'parcialmente_correta', 'incorreta']);

export const adminCaseStageSchema = z.object({
  id: z.string().optional(),
  orderIndex: z.number().int().positive(),
  stageType: stageTypeSchema,
  content: z.string().min(1, 'Etapa não pode ter conteúdo vazio.'),
  isRequired: z.boolean().default(true),
});

export const adminCaseAnswerSchema = z.object({
  id: z.string().optional(),
  canonicalTerm: z.string().min(1),
  answerType: answerTypeSchema,
  explanation: z.string().min(1),
  terms: z.array(z.string().min(1)).default([]),
});

export const adminCaseDifferentialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  explanation: z.string().min(1),
  relevance: z.string().optional(),
});

export const adminCaseLearningPointSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1),
});

export const adminCaseReferenceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  url: z.string().url().optional().or(z.literal('')),
  referenceType: z.string().optional(),
  accessedAt: z.string().optional(),
});

export const adminCaseSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Slug deve ser kebab-case (letras minúsculas, números, hífens).',
    ),
  objective: z.string().min(1),
  areaId: z.string().uuid(),
  professionIds: z.array(z.string().uuid()).min(1, 'Caso precisa de ao menos uma profissão.'),
  difficulty: difficultySchema,
  sourceType: sourceTypeSchema,
  patient: z.object({
    age: z.number().int().nonnegative(),
    sex: z.string().min(1),
    context: z.string().optional(),
    relevantInformation: z.string().optional(),
  }),
  stages: z.array(adminCaseStageSchema).min(1, 'Caso precisa de ao menos uma etapa.'),
  answers: z.array(adminCaseAnswerSchema).min(1, 'Caso precisa de ao menos uma resposta.'),
  differentials: z.array(adminCaseDifferentialSchema).default([]),
  learningPoints: z.array(adminCaseLearningPointSchema).default([]),
  references: z.array(adminCaseReferenceSchema).default([]),
});

export type AdminCaseInput = z.infer<typeof adminCaseSchema>;
