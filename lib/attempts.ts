import { Prisma, type AttemptMode } from '@prisma/client';
import { db } from '@/lib/db';
import { normalizeText } from '@/lib/utils/normalize-text';
import { classifyAnswer } from '@/lib/classify-answer';
import { computeScore } from '@/lib/score';

const attemptInclude = {
  case: {
    include: {
      area: { select: { id: true, name: true, slug: true } },
      patientProfile: { select: { age: true, sex: true } },
      stages: { orderBy: { orderIndex: 'asc' } },
    },
  },
  responses: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.AttemptInclude;

type AttemptWithRelations = Prisma.AttemptGetPayload<{ include: typeof attemptInclude }>;

/**
 * `current_stage` é o índice (0-based) da última pista liberada — a etapa 1
 * já vem revelada ao criar a tentativa. `total_stages` reflete o caso real
 * (varia por caso; a UI não deve assumir um número fixo de pistas).
 */
function serializeAttempt(attempt: AttemptWithRelations) {
  const totalStages = attempt.case.stages.length;
  const revealedCount = Math.min(attempt.currentStage + 1, totalStages);
  const revealedStages = attempt.case.stages.slice(0, revealedCount);
  const currentStageId = revealedStages[revealedStages.length - 1]?.id;

  return {
    id: attempt.id,
    status: attempt.status,
    mode: attempt.mode,
    current_stage: attempt.currentStage,
    hints_used: attempt.hintsUsed,
    total_stages: totalStages,
    is_last_stage: revealedCount >= totalStages,
    finished_at: attempt.finishedAt,
    score: attempt.score,
    case: {
      id: attempt.case.id,
      difficulty: attempt.case.difficulty,
      area: attempt.case.area,
      patient: attempt.case.patientProfile,
    },
    stages: revealedStages.map((stage) => ({
      id: stage.id,
      order_index: stage.orderIndex,
      stage_type: stage.stageType,
      content: stage.content,
    })),
    responses: attempt.responses
      .filter((response) => response.stageId === currentStageId)
      .map((response) => ({
        id: response.id,
        submitted_text: response.submittedText,
        classification: response.classification,
        feedback: response.feedback,
        created_at: response.createdAt,
      })),
  };
}

export async function startAttempt(userId: string, caseId: string, mode: AttemptMode = 'progressivo') {
  const caseRecord = await db.case.findUnique({
    where: { id: caseId, status: 'publicado' },
    include: { stages: true },
  });
  if (!caseRecord) {
    throw new Error('Caso não encontrado ou não publicado.');
  }

  // Modo completo revela todas as etapas de uma vez, sem conceito de pista
  // (docs/tasks/05-modo-caso-completo.md) — currentStage já nasce na última.
  const currentStage = mode === 'completo' ? caseRecord.stages.length - 1 : 0;

  const attempt = await db.attempt.create({
    data: { userId, caseId, status: 'iniciada', mode, currentStage },
    include: attemptInclude,
  });
  return serializeAttempt(attempt);
}

async function getOwnedAttempt(attemptId: string, userId: string) {
  const attempt = await db.attempt.findUnique({ where: { id: attemptId }, include: attemptInclude });
  if (!attempt || attempt.userId !== userId) {
    throw new Error('Tentativa não encontrada.');
  }
  return attempt;
}

export async function getAttemptState(attemptId: string, userId: string) {
  return serializeAttempt(await getOwnedAttempt(attemptId, userId));
}

export async function revealHint(attemptId: string, userId: string) {
  const attempt = await getOwnedAttempt(attemptId, userId);
  if (attempt.status === 'concluida') {
    throw new Error('Tentativa já concluída.');
  }
  if (attempt.currentStage >= attempt.case.stages.length - 1) {
    throw new Error('Não há mais pistas para revelar.');
  }

  const updated = await db.attempt.update({
    where: { id: attemptId },
    data: { currentStage: attempt.currentStage + 1, hintsUsed: attempt.hintsUsed + 1, status: 'em_andamento' },
    include: attemptInclude,
  });
  return serializeAttempt(updated);
}

export async function submitAnswer(attemptId: string, userId: string, text: string) {
  const attempt = await getOwnedAttempt(attemptId, userId);
  if (attempt.status === 'concluida') {
    throw new Error('Tentativa já concluída.');
  }

  const revealedCount = Math.min(attempt.currentStage + 1, attempt.case.stages.length);
  const currentStage = attempt.case.stages[revealedCount - 1];

  const { classification, feedback } = await classifyAnswer(attempt.caseId, text);

  await db.attemptResponse.create({
    data: {
      attemptId: attempt.id,
      stageId: currentStage.id,
      submittedText: text,
      normalizedText: normalizeText(text),
      classification,
      feedback,
    },
  });

  return { classification, feedback };
}

export async function finishAttempt(attemptId: string, userId: string) {
  const attempt = await getOwnedAttempt(attemptId, userId);
  if (attempt.status === 'concluida') {
    return serializeAttempt(attempt);
  }

  const score = computeScore(
    attempt.responses.map((response) => response.classification),
    attempt.hintsUsed,
  );

  const updated = await db.attempt.update({
    where: { id: attemptId },
    data: { status: 'concluida', finishedAt: new Date(), score },
    include: attemptInclude,
  });
  return serializeAttempt(updated);
}

const resultInclude = {
  case: {
    include: {
      area: { select: { id: true, name: true, slug: true } },
      patientProfile: { select: { age: true, sex: true } },
      answers: { where: { answerType: 'correta' }, take: 1 },
      differentials: true,
      learningPoints: { orderBy: { orderIndex: 'asc' } },
      references: true,
      stages: { select: { id: true } },
    },
  },
  responses: { orderBy: { createdAt: 'asc' }, include: { stage: { select: { orderIndex: true } } } },
} satisfies Prisma.AttemptInclude;

/**
 * Dados da tela de resultado (docs/tasks/07). Só chamável depois de `finish`
 * — nunca revela diagnóstico/justificativa antes disso (critério de aceite).
 */
export async function getAttemptResult(attemptId: string, userId: string) {
  const attempt = await db.attempt.findUnique({ where: { id: attemptId }, include: resultInclude });
  if (!attempt || attempt.userId !== userId) {
    throw new Error('Tentativa não encontrada.');
  }
  if (attempt.status !== 'concluida') {
    throw new Error('Tentativa ainda não concluída.');
  }

  const diagnosis = attempt.case.answers[0];

  return {
    id: attempt.id,
    mode: attempt.mode,
    is_daily_challenge: attempt.dailyChallengeId !== null,
    hints_used: attempt.hintsUsed,
    total_stages: attempt.case.stages.length,
    score: attempt.score,
    finished_at: attempt.finishedAt,
    case: {
      id: attempt.case.id,
      difficulty: attempt.case.difficulty,
      area: attempt.case.area,
      patient: attempt.case.patientProfile,
      source_type: attempt.case.sourceType,
      diagnosis: diagnosis ? { canonical_term: diagnosis.canonicalTerm, explanation: diagnosis.explanation } : null,
      differentials: attempt.case.differentials.map((d) => ({ name: d.name, explanation: d.explanation })),
      learning_points: attempt.case.learningPoints.map((p) => p.content),
      references: attempt.case.references.map((r) => ({ title: r.title, url: r.url })),
    },
    responses: attempt.responses.map((response) => ({
      id: response.id,
      submitted_text: response.submittedText,
      classification: response.classification,
      stage_order: response.stage.orderIndex,
      created_at: response.createdAt,
    })),
  };
}
