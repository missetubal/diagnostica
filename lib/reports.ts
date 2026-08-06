import { db } from '@/lib/db';

/**
 * Criação de reporte pelo perfil anônimo (docs/tasks/10) — distinto de
 * lib/admin/reports.ts, que cobre a fila de revisão do painel administrativo.
 */
export async function createReport(input: {
  userId: string;
  caseId: string;
  attemptId?: string;
  category: string;
  description: string;
}) {
  if (input.attemptId) {
    const attempt = await db.attempt.findUnique({ where: { id: input.attemptId } });
    if (!attempt || attempt.userId !== input.userId || attempt.caseId !== input.caseId) {
      throw new Error('Tentativa inválida para esse reporte.');
    }
  } else {
    const caseExists = await db.case.findUnique({
      where: { id: input.caseId },
      select: { id: true },
    });
    if (!caseExists) throw new Error('Caso não encontrado.');
  }

  return db.report.create({
    data: {
      userId: input.userId,
      caseId: input.caseId,
      attemptId: input.attemptId,
      category: input.category,
      description: input.description,
    },
  });
}
