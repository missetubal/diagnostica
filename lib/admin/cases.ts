import { Prisma, CaseStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { normalizeText } from '@/lib/utils/normalize-text';
import type { AdminCaseInput } from '@/lib/validations/admin-case';

export const caseListInclude = {
  area: true,
  professions: { include: { profession: true } },
} satisfies Prisma.CaseInclude;

export const caseDetailInclude = {
  area: true,
  professions: { include: { profession: true } },
  patientProfile: true,
  stages: { orderBy: { orderIndex: 'asc' } },
  answers: { include: { terms: true } },
  differentials: true,
  learningPoints: { orderBy: { orderIndex: 'asc' } },
  references: true,
  reviews: { include: { reviewer: true }, orderBy: { reviewedAt: 'desc' } },
  reports: { orderBy: { createdAt: 'desc' } },
} satisfies Prisma.CaseInclude;

export type CaseWithRelations = Prisma.CaseGetPayload<{ include: typeof caseDetailInclude }>;

export function toAdminCaseInput(caseRecord: CaseWithRelations): AdminCaseInput {
  return {
    title: caseRecord.title,
    slug: caseRecord.slug,
    objective: caseRecord.objective,
    areaId: caseRecord.areaId,
    professionIds: caseRecord.professions.map((cp) => cp.professionId),
    difficulty: caseRecord.difficulty,
    sourceType: caseRecord.sourceType,
    patient: {
      age: caseRecord.patientProfile?.age ?? 0,
      sex: caseRecord.patientProfile?.sex ?? '',
      context: caseRecord.patientProfile?.context ?? undefined,
      relevantInformation: caseRecord.patientProfile?.relevantInformation ?? undefined,
    },
    stages: caseRecord.stages.map((stage) => ({
      id: stage.id,
      orderIndex: stage.orderIndex,
      stageType: stage.stageType,
      content: stage.content,
      isRequired: stage.isRequired,
    })),
    answers: caseRecord.answers.map((answer) => ({
      id: answer.id,
      canonicalTerm: answer.canonicalTerm,
      answerType: answer.answerType,
      explanation: answer.explanation,
      terms: answer.terms.map((term) => term.term),
    })),
    differentials: caseRecord.differentials.map((differential) => ({
      id: differential.id,
      name: differential.name,
      explanation: differential.explanation,
      relevance: differential.relevance ?? undefined,
    })),
    learningPoints: caseRecord.learningPoints.map((point) => ({
      id: point.id,
      content: point.content,
    })),
    references: caseRecord.references.map((reference) => ({
      id: reference.id,
      title: reference.title,
      url: reference.url ?? '',
      referenceType: reference.referenceType ?? undefined,
      accessedAt: reference.accessedAt
        ? reference.accessedAt.toISOString().slice(0, 10)
        : undefined,
    })),
  };
}

export interface CaseFilters {
  areaId?: string;
  professionId?: string;
  difficulty?: string;
  status?: string;
}

export function listCases(filters: CaseFilters) {
  return db.case.findMany({
    where: {
      areaId: filters.areaId || undefined,
      difficulty: (filters.difficulty as never) || undefined,
      status: (filters.status as never) || undefined,
      professions: filters.professionId
        ? { some: { professionId: filters.professionId } }
        : undefined,
    },
    include: caseListInclude,
    orderBy: { updatedAt: 'desc' },
  });
}

export function getCaseWithRelations(id: string) {
  return db.case.findUnique({ where: { id }, include: caseDetailInclude });
}

function childrenCreateData(data: AdminCaseInput) {
  return {
    patientProfile: { create: data.patient },
    stages: {
      create: data.stages.map((stage) => ({
        orderIndex: stage.orderIndex,
        stageType: stage.stageType,
        content: stage.content,
        isRequired: stage.isRequired,
      })),
    },
    answers: {
      create: data.answers.map((answer) => ({
        canonicalTerm: answer.canonicalTerm,
        answerType: answer.answerType,
        explanation: answer.explanation,
        terms: {
          create: answer.terms.map((term) => ({
            term,
            normalizedTerm: normalizeText(term),
          })),
        },
      })),
    },
    differentials: { create: data.differentials },
    learningPoints: {
      create: data.learningPoints.map((point, index) => ({
        content: point.content,
        orderIndex: index + 1,
      })),
    },
    references: {
      create: data.references.map((reference) => ({
        title: reference.title,
        url: reference.url || null,
        referenceType: reference.referenceType || null,
        accessedAt: reference.accessedAt ? new Date(reference.accessedAt) : null,
      })),
    },
    professions: {
      create: data.professionIds.map((professionId) => ({ professionId })),
    },
  };
}

export function createCase(data: AdminCaseInput, createdBy: string | null) {
  return db.case.create({
    data: {
      title: data.title,
      slug: data.slug,
      objective: data.objective,
      areaId: data.areaId,
      difficulty: data.difficulty,
      sourceType: data.sourceType,
      status: CaseStatus.rascunho,
      createdBy,
      ...childrenCreateData(data),
    },
    include: caseDetailInclude,
  });
}

export async function updateCase(id: string, data: AdminCaseInput) {
  return db.$transaction(async (tx) => {
    await tx.casePatientProfile.deleteMany({ where: { caseId: id } });
    await tx.caseStage.deleteMany({ where: { caseId: id } });
    await tx.caseAnswer.deleteMany({ where: { caseId: id } });
    await tx.caseDifferential.deleteMany({ where: { caseId: id } });
    await tx.caseLearningPoint.deleteMany({ where: { caseId: id } });
    await tx.caseReference.deleteMany({ where: { caseId: id } });
    await tx.caseProfession.deleteMany({ where: { caseId: id } });

    return tx.case.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        objective: data.objective,
        areaId: data.areaId,
        difficulty: data.difficulty,
        sourceType: data.sourceType,
        ...childrenCreateData(data),
      },
      include: caseDetailInclude,
    });
  });
}

export function deleteCase(id: string) {
  return db.case.delete({ where: { id } });
}

export async function submitForReview(id: string) {
  const current = await db.case.findUniqueOrThrow({ where: { id } });
  if (current.status !== CaseStatus.rascunho) {
    throw new Error('Só é possível enviar para revisão um caso em rascunho.');
  }
  return db.case.update({ where: { id }, data: { status: CaseStatus.em_revisao } });
}

export async function approveCase(id: string, reviewerId: string, comments?: string) {
  const current = await db.case.findUniqueOrThrow({ where: { id } });
  if (current.status !== CaseStatus.em_revisao) {
    throw new Error('Só é possível aprovar um caso em revisão.');
  }
  return db.$transaction([
    db.case.update({
      where: { id },
      data: { status: CaseStatus.aprovado, reviewedBy: reviewerId },
    }),
    db.caseReview.create({
      data: { caseId: id, reviewerId, decision: 'aprovado', comments },
    }),
  ]);
}

export async function rejectCase(id: string, reviewerId: string, comments: string) {
  const current = await db.case.findUniqueOrThrow({ where: { id } });
  if (current.status !== CaseStatus.em_revisao) {
    throw new Error('Só é possível reprovar um caso em revisão.');
  }
  return db.$transaction([
    db.case.update({
      where: { id },
      data: { status: CaseStatus.rascunho, reviewedBy: reviewerId },
    }),
    db.caseReview.create({
      data: { caseId: id, reviewerId, decision: 'reprovado', comments },
    }),
  ]);
}

export async function publishCase(id: string) {
  const current = await db.case.findUniqueOrThrow({ where: { id } });
  if (current.status !== CaseStatus.aprovado) {
    throw new Error('Só é possível publicar um caso aprovado.');
  }
  return db.case.update({
    where: { id },
    data: { status: CaseStatus.publicado, publishedAt: new Date() },
  });
}
