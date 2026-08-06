import { db } from '@/lib/db';
import { bestClassification } from '@/lib/score';

/**
 * Sequência de dias em UTC (docs/tasks/08-historico-progresso.md, "Decisões
 * de implementação") — sem timezone de usuário armazenado no MVP.
 */
function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toUtcDateKey(date);
}

export function computeStreaks(
  sortedUniqueDays: string[],
  today: string = toUtcDateKey(new Date()),
): { current: number; best: number } {
  if (sortedUniqueDays.length === 0) return { current: 0, best: 0 };

  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedUniqueDays.length; i++) {
    run = addUtcDays(sortedUniqueDays[i - 1], 1) === sortedUniqueDays[i] ? run + 1 : 1;
    best = Math.max(best, run);
  }

  const lastDay = sortedUniqueDays[sortedUniqueDays.length - 1];
  const yesterday = addUtcDays(today, -1);
  if (lastDay !== today && lastDay !== yesterday) {
    return { current: 0, best };
  }

  let current = 1;
  for (let i = sortedUniqueDays.length - 1; i > 0; i--) {
    if (addUtcDays(sortedUniqueDays[i - 1], 1) === sortedUniqueDays[i]) current += 1;
    else break;
  }
  return { current, best };
}

export async function getUserStats(userId: string) {
  const attempts = await db.attempt.findMany({
    where: { userId, status: 'concluida' },
    select: {
      finishedAt: true,
      score: true,
      responses: { select: { classification: true } },
      case: { select: { area: { select: { id: true, name: true, slug: true } } } },
    },
  });

  const uniqueDays = Array.from(
    new Set(attempts.filter((a) => a.finishedAt).map((a) => toUtcDateKey(a.finishedAt!))),
  ).sort();
  const { current, best } = computeStreaks(uniqueDays);

  const totalScore = attempts.reduce((sum, a) => sum + (a.score ?? 0), 0);
  const correctCount = attempts.filter(
    (a) => bestClassification(a.responses.map((r) => r.classification)) === 'correta',
  ).length;

  const areaCounts = new Map<string, { id: string; name: string; slug: string; count: number }>();
  for (const attempt of attempts) {
    const area = attempt.case.area;
    const entry = areaCounts.get(area.id) ?? { ...area, count: 0 };
    entry.count += 1;
    areaCounts.set(area.id, entry);
  }

  return {
    streak_current: current,
    streak_best: best,
    total_score: totalScore,
    accuracy: attempts.length > 0 ? Math.round((correctCount / attempts.length) * 100) : 0,
    correct_count: correctCount,
    cases_completed: attempts.length,
    areas: Array.from(areaCounts.values()).sort((a, b) => b.count - a.count),
  };
}

export async function getUserHistory(userId: string) {
  const attempts = await db.attempt.findMany({
    where: { userId, status: 'concluida' },
    orderBy: { finishedAt: 'desc' },
    select: {
      id: true,
      mode: true,
      score: true,
      hintsUsed: true,
      finishedAt: true,
      case: {
        select: {
          difficulty: true,
          area: { select: { id: true, name: true, slug: true } },
          answers: { where: { answerType: 'correta' }, take: 1, select: { canonicalTerm: true } },
        },
      },
    },
  });

  return attempts.map((attempt) => ({
    id: attempt.id,
    mode: attempt.mode,
    score: attempt.score,
    hints_used: attempt.hintsUsed,
    finished_at: attempt.finishedAt,
    difficulty: attempt.case.difficulty,
    area: attempt.case.area,
    diagnosis: attempt.case.answers[0]?.canonicalTerm ?? null,
  }));
}
