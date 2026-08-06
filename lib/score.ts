import type { AnswerType } from '@prisma/client';

/**
 * Fórmula de pontuação (docs/tasks/07-resultado-pontuacao.md, escopo):
 * pontuação base pela melhor classificação já obtida na tentativa (entre
 * todas as hipóteses enviadas, já que reenvio — "Nova hipótese" — não
 * penaliza), menos 10 pontos por pista usada, sem ficar negativa.
 *
 * Modo completo nunca usa pistas (hints_used = 0 sempre — docs/tasks/05),
 * então lá a pontuação é sempre a base cheia, sem desconto.
 */
const BASE_SCORE: Record<AnswerType, number> = {
  correta: 100,
  parcialmente_correta: 50,
  incorreta: 0,
};

// ponytail: desconto fixo por pista, ajustar quando houver dados reais de tentativas.
const POINTS_PER_HINT = 10;

const RANK: Record<AnswerType, number> = { correta: 2, parcialmente_correta: 1, incorreta: 0 };

export function bestClassification(classifications: (AnswerType | null)[]): AnswerType | null {
  return classifications
    .filter((c): c is AnswerType => c !== null)
    .reduce<AnswerType | null>((acc, c) => (acc === null || RANK[c] > RANK[acc] ? c : acc), null);
}

export function computeScore(classifications: (AnswerType | null)[], hintsUsed: number): number {
  const best = bestClassification(classifications);
  if (best === null) return 0;
  return Math.max(0, BASE_SCORE[best] - hintsUsed * POINTS_PER_HINT);
}
