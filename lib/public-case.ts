import { Prisma } from '@prisma/client';

/**
 * Shape exposto pelas rotas públicas de jogo (GET /api/cases/next,
 * GET /api/cases/:id) — sem respostas/diferenciais/pontos de aprendizagem,
 * que são spoiler do caso.
 */
export const publicCaseSelect = {
  id: true,
  title: true,
  objective: true,
  difficulty: true,
  area: { select: { id: true, name: true, slug: true } },
  patientProfile: { select: { age: true, sex: true, context: true } },
  stages: {
    select: { id: true, orderIndex: true, stageType: true, content: true, isRequired: true },
    orderBy: { orderIndex: 'asc' },
  },
} satisfies Prisma.CaseSelect;
