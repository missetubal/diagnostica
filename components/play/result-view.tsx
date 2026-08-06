'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Flag, ListChecks, RotateCcw, Sparkles, User } from 'lucide-react';
import { CLASSIFICATION_LABELS, CLASSIFICATION_STYLE, type AnswerType } from '@/lib/classification-ui';
import { bestClassification } from '@/lib/score';
import { DIFFICULTY_LABELS } from '@/lib/labels';

type Difficulty = 'facil' | 'medio' | 'dificil';
type SourceType = 'humano' | 'ia_assistida' | 'importado';

type AttemptResult = {
  id: string;
  mode: 'progressivo' | 'completo';
  hints_used: number;
  score: number | null;
  case: {
    difficulty: Difficulty;
    area: { name: string };
    patient: { age: number; sex: string } | null;
    source_type: SourceType;
    diagnosis: { canonical_term: string; explanation: string } | null;
    differentials: { name: string; explanation: string }[];
    learning_points: string[];
    references: { title: string; url: string | null }[];
  };
  responses: { id: string; submitted_text: string; classification: AnswerType | null; stage_order: number }[];
};

const STATUS_PHRASE: Record<AnswerType | 'nenhuma', string> = {
  correta: 'Você acertou! Confira a justificativa clínica abaixo.',
  parcialmente_correta: 'Quase lá — revise a explicação abaixo.',
  incorreta: 'Não foi dessa vez — revise a explicação abaixo.',
  nenhuma: 'Não foi dessa vez — revise a explicação abaixo.',
};

function extractErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error;
  }
  return fallback;
}

export default function ResultView({ attemptId }: { attemptId: string }) {
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/attempts/${attemptId}/result`);
        const body = await res.json();
        if (!res.ok) throw new Error(extractErrorMessage(body, 'Não foi possível carregar o resultado.'));
        if (!cancelled) setResult(body);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-start justify-center px-6 py-8">
        <div className="card w-full border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <Link href="/play" className="btn-secondary mt-4">
          <RotateCcw className="h-4 w-4" />
          Voltar
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--teal-100)] border-t-[var(--teal-600)]" />
        <p className="mt-4 text-sm text-[var(--muted)]">Calculando pontuação…</p>
      </div>
    );
  }

  const best = bestClassification(result.responses.map((r) => r.classification));
  const phrase = STATUS_PHRASE[best ?? 'nenhuma'];

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">Caso encerrado</p>
      <p className="font-display mt-1 text-4xl font-bold">{result.score ?? 0} PTS</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{phrase}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="pill">{result.case.area.name}</span>
        <span className="pill">{DIFFICULTY_LABELS[result.case.difficulty]}</span>
        {result.case.patient && (
          <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
            <User className="h-3.5 w-3.5" />
            {result.case.patient.sex}, {result.case.patient.age} anos
          </span>
        )}
      </div>

      {result.case.source_type === 'ia_assistida' && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
          Caso gerado com auxílio de IA — conteúdo educacional, sujeito a revisão.
        </div>
      )}

      {result.case.diagnosis && (
        <div className="card mt-4">
          <p className="text-xs font-semibold tracking-wide text-[var(--teal-600)] uppercase">Diagnóstico</p>
          <p className="font-display mt-1 text-lg font-semibold">{result.case.diagnosis.canonical_term}</p>
          <p className="mt-2 text-xs font-medium text-[var(--muted)]">Justificativa clínica</p>
          <p className="mt-1 text-sm leading-relaxed">{result.case.diagnosis.explanation}</p>
        </div>
      )}

      {result.case.differentials.length > 0 && (
        <div className="card mt-3">
          <p className="text-xs font-semibold tracking-wide text-[var(--teal-600)] uppercase">
            Diagnósticos diferenciais
          </p>
          <ul className="mt-2 flex flex-col gap-3">
            {result.case.differentials.map((d) => (
              <li key={d.name}>
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-[var(--muted)]">{d.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.case.learning_points.length > 0 && (
        <div className="card mt-3">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--teal-600)] uppercase">
            <ListChecks className="h-4 w-4" />
            Pontos de aprendizagem
          </p>
          <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-4">
            {result.case.learning_points.map((point, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {point}
              </li>
            ))}
          </ol>
        </div>
      )}

      {result.case.references.length > 0 && (
        <div className="card mt-3">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--teal-600)] uppercase">
            <BookOpen className="h-4 w-4" />
            Referências
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {result.case.references.map((ref, index) => (
              <li key={index} className="text-sm leading-relaxed">
                {ref.url ? (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 text-[var(--teal-700)] hover:underline"
                  >
                    {ref.title}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                ) : (
                  ref.title
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.responses.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">Suas tentativas</p>
          <div className="mt-2 flex flex-col gap-2">
            {result.responses.map((response) => {
              const style = response.classification ? CLASSIFICATION_STYLE[response.classification] : null;
              return (
                <div
                  key={response.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${style?.className ?? 'border-[var(--border)] bg-white'}`}
                >
                  <p className="font-medium">{response.submitted_text}</p>
                  {response.classification && (
                    <p className="mt-0.5 text-xs opacity-80">{CLASSIFICATION_LABELS[response.classification]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link href="/play" className="btn-primary flex-1">
          Novo caso
        </Link>
        <button type="button" disabled className="btn-secondary flex-1 cursor-not-allowed opacity-60">
          <Flag className="h-4 w-4" />
          Reportar
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        Conteúdo educacional para treino de raciocínio clínico. Não substitui protocolos, diretrizes ou
        supervisão profissional.
      </p>
    </div>
  );
}
