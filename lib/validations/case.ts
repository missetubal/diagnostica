import { z } from 'zod';

/**
 * Schema de validação de um caso clínico — usado tanto para importar os JSONs
 * de content/casos/ quanto para validar rascunhos gerados por IA antes de
 * qualquer persistência (ver docs/sugestao-arquitetura.md, seções 11 e 12).
 */

export const stageTypeSchema = z.enum([
  'queixa_principal',
  'historia',
  'antecedentes',
  'medicamentos',
  'sinais_vitais',
  'exame_fisico',
  'exames_complementares',
  'evolucao',
  'pista_final',
]);

export const difficultySchema = z.enum(['facil', 'medio', 'dificil']);

export const sourceTypeSchema = z.enum(['humano', 'ia_assistida', 'importado']);

export const caseStatusSchema = z.enum([
  'rascunho',
  'em_revisao',
  'aprovado',
  'publicado',
  'sinalizado',
  'desativado',
]);

export const caseStageSchema = z.object({
  order: z.number().int().positive(),
  type: stageTypeSchema,
  content: z.string().min(1, 'Etapa não pode ter conteúdo vazio.'),
});

export const caseMainAnswerSchema = z.object({
  canonical_term: z.string().min(1),
  accepted_terms: z.array(z.string().min(1)).default([]),
  partial_terms: z.array(z.string().min(1)).default([]),
});

export const caseDifferentialSchema = z.object({
  name: z.string().min(1),
  explanation: z.string().min(1),
});

export const caseReferenceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
});

export const casePatientSchema = z.object({
  age: z.number().int().nonnegative(),
  sex: z.string().min(1),
});

export const caseSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    objective: z.string().min(1),
    professions: z.array(z.string().min(1)).min(1, 'Caso precisa de ao menos uma profissão.'),
    area: z.string().min(1),
    difficulty: difficultySchema,
    patient: casePatientSchema,
    stages: z.array(caseStageSchema).min(1, 'Caso precisa de ao menos uma etapa.'),
    main_answer: caseMainAnswerSchema,
    differentials: z.array(caseDifferentialSchema).default([]),
    explanation: z.string().min(1, 'Caso precisa de explicação da resposta.'),
    learning_points: z.array(z.string().min(1)).default([]),
    references: z.array(caseReferenceSchema).default([]),
    avisos_para_revisor: z.array(z.string()).optional(),
    status: caseStatusSchema,
    source_type: sourceTypeSchema,
    version: z.number().int().positive().default(1),
  })
  .superRefine((data, ctx) => {
    // Etapas devem estar em ordem estritamente crescente, sem lacunas.
    const orders = data.stages.map((s) => s.order).sort((a, b) => a - b);
    orders.forEach((order, index) => {
      if (order !== index + 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Etapas devem estar numeradas sequencialmente a partir de 1, sem lacunas.',
          path: ['stages'],
        });
      }
    });
  });

export type CaseInput = z.infer<typeof caseSchema>;
