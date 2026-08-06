import type { AnswerType } from '@prisma/client';
import { db } from '@/lib/db';
import { normalizeText } from '@/lib/utils/normalize-text';

/**
 * Classificação por taxonomia do caso (docs/sugestao-arquitetura.md, §13),
 * não avaliação de IA em texto livre — ver decisão registrada em
 * docs/tasks/04-fluxo-caso-diagnostico-progressivo.md.
 */

export interface CaseAnswerForMatching {
  answerType: AnswerType;
  canonicalTerm: string;
  explanation: string;
  terms: { normalizedTerm: string }[];
}

export interface ClassificationResult {
  classification: AnswerType;
  feedback: string;
}

// Só a explicação de uma resposta `correta` é exposta como feedback. Para as
// demais classificações o feedback é genérico — nunca sugere o diagnóstico
// esperado, mesmo indiretamente (docs/tasks/04, critério de aceite).
const GENERIC_FEEDBACK: Record<Exclude<AnswerType, 'correta'>, string> = {
  parcialmente_correta:
    'Você está no caminho certo, mas ainda não é a hipótese mais específica para este quadro. Revise as pistas já reveladas e pense em diagnósticos próximos.',
  incorreta:
    'Essa hipótese não se sustenta com as informações reveladas até agora. Reveja os principais achados e pense em quais diagnósticos os explicam melhor.',
};

function feedbackFor(answerType: AnswerType, explanation: string): string {
  return answerType === 'correta' ? explanation : GENERIC_FEEDBACK[answerType];
}

export function matchAnswer(
  answers: CaseAnswerForMatching[],
  submittedText: string,
): ClassificationResult {
  const normalized = normalizeText(submittedText);

  for (const answer of answers) {
    const candidates = [
      normalizeText(answer.canonicalTerm),
      ...answer.terms.map((t) => t.normalizedTerm),
    ];
    if (candidates.includes(normalized)) {
      return {
        classification: answer.answerType,
        feedback: feedbackFor(answer.answerType, answer.explanation),
      };
    }
  }

  return { classification: 'incorreta', feedback: GENERIC_FEEDBACK.incorreta };
}

// ponytail: limiar fixo, ajustar quando houver dados reais de tentativas.
const FUZZY_SIMILARITY_THRESHOLD = 0.4;

export async function classifyAnswer(
  caseId: string,
  submittedText: string,
): Promise<ClassificationResult> {
  const answers = await db.caseAnswer.findMany({
    where: { caseId },
    select: {
      answerType: true,
      canonicalTerm: true,
      explanation: true,
      terms: { select: { normalizedTerm: true } },
    },
  });

  const exact = matchAnswer(answers, submittedText);
  if (exact.classification !== 'incorreta') return exact;

  const normalized = normalizeText(submittedText);
  const fuzzy = await db.$queryRaw<
    { answerType: AnswerType; explanation: string; similarity: number }[]
  >`
    SELECT * FROM (
      SELECT ca."answer_type" AS "answerType", ca."explanation", similarity(ca."canonical_term", ${normalized}) AS similarity
      FROM case_answers ca
      WHERE ca.case_id = ${caseId}
      UNION ALL
      SELECT ca."answer_type" AS "answerType", ca."explanation", similarity(t."normalized_term", ${normalized}) AS similarity
      FROM accepted_answer_terms t
      JOIN case_answers ca ON ca.id = t.answer_id
      WHERE ca.case_id = ${caseId}
    ) matches
    ORDER BY similarity DESC
    LIMIT 1
  `;

  const best = fuzzy[0];
  if (best && best.similarity >= FUZZY_SIMILARITY_THRESHOLD) {
    return {
      classification: best.answerType,
      feedback: feedbackFor(best.answerType, best.explanation),
    };
  }

  return exact;
}
