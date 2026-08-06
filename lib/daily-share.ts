import type { AnswerType } from '@prisma/client';

/**
 * Texto de compartilhamento estilo Wordle — grade de pistas usadas +
 * resultado, nunca o diagnóstico (docs/tasks/09, critério de aceite). A
 * assinatura só aceita esses campos de desempenho, então não há como o
 * diagnóstico vazar por aqui mesmo por engano do chamador.
 */
export function buildShareText(input: {
  dateLabel: string;
  areaName: string;
  totalStages: number;
  hintsUsed: number;
  classification: AnswerType | null;
}): string {
  const revealedStages = Math.min(input.hintsUsed + 1, input.totalStages);
  const grid = Array.from({ length: input.totalStages }, (_, i) => (i < revealedStages ? '🟩' : '⬜')).join('');

  const resultLabel =
    input.classification === 'correta'
      ? '✅ Resolvido'
      : input.classification === 'parcialmente_correta'
        ? '🟨 Quase lá'
        : '❌ Não resolvido';

  return [
    `Diagnostica 🩺 Desafio diário — ${input.dateLabel}`,
    input.areaName,
    grid,
    `${resultLabel} · ${input.hintsUsed} ${input.hintsUsed === 1 ? 'pista usada' : 'pistas usadas'}`,
  ].join('\n');
}
