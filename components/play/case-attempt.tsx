'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, RotateCcw, User } from 'lucide-react';
import { CLASSIFICATION_LABELS, CLASSIFICATION_STYLE, type AnswerType } from '@/lib/classification-ui';
import { DIFFICULTY_LABELS } from '@/lib/labels';

type Difficulty = 'facil' | 'medio' | 'dificil';
type StageType =
  | 'queixa_principal'
  | 'historia'
  | 'antecedentes'
  | 'medicamentos'
  | 'sinais_vitais'
  | 'exame_fisico'
  | 'exames_complementares'
  | 'evolucao'
  | 'pista_final';

type Stage = { id: string; order_index: number; stage_type: StageType; content: string };
type Response = { id: string; classification: AnswerType | null; feedback: string | null };

type AttemptState = {
  id: string;
  status: 'iniciada' | 'em_andamento' | 'concluida' | 'abandonada';
  mode: 'progressivo' | 'completo';
  current_stage: number;
  hints_used: number;
  total_stages: number;
  is_last_stage: boolean;
  case: {
    id: string;
    difficulty: Difficulty;
    area: { id: string; name: string; slug: string };
    patient: { age: number; sex: string } | null;
  };
  stages: Stage[];
  responses: Response[];
};

const STAGE_LABELS: Record<StageType, string> = {
  queixa_principal: 'Queixa principal',
  historia: 'História da doença atual',
  antecedentes: 'Antecedentes e fatores de risco',
  medicamentos: 'Medicamentos em uso',
  sinais_vitais: 'Sinais vitais e exame físico',
  exame_fisico: 'Sinais vitais e exame físico',
  exames_complementares: 'Exames complementares',
  evolucao: 'Evolução',
  pista_final: 'Informação decisiva',
};

function extractErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error;
  }
  return fallback;
}

export default function CaseAttempt({
  mode = 'progressivo',
  initialAttemptId,
}: {
  mode?: 'progressivo' | 'completo';
  /** Retoma uma tentativa já criada (ex.: desafio diário) em vez de sortear um caso novo. */
  initialAttemptId?: string;
}) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<AttemptState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attemptNonce, setAttemptNonce] = useState(0);

  const [hypothesis, setHypothesis] = useState('');
  const [lastResult, setLastResult] = useState<{ classification: AnswerType; feedback: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let startBody: AttemptState;

        if (initialAttemptId) {
          const res = await fetch(`/api/attempts/${initialAttemptId}`);
          startBody = await res.json();
          if (!res.ok) throw new Error(extractErrorMessage(startBody, 'Não foi possível carregar a tentativa.'));
        } else {
          const nextRes = await fetch('/api/cases/next');
          const nextBody = await nextRes.json();
          if (!nextRes.ok) throw new Error(extractErrorMessage(nextBody, 'Não foi possível carregar um caso.'));

          const startRes = await fetch(`/api/cases/${nextBody.id}/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode }),
          });
          startBody = await startRes.json();
          if (!startRes.ok) throw new Error(extractErrorMessage(startBody, 'Não foi possível iniciar a tentativa.'));
        }

        if (cancelled) return;
        if (startBody.status === 'concluida') {
          router.push(`/play/resultado/${startBody.id}`);
          return;
        }
        setAttempt(startBody);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, initialAttemptId, attemptNonce, router]);

  async function handleSubmitHypothesis() {
    if (!attempt || !hypothesis.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/attempts/${attempt.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: hypothesis }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(body, 'Não foi possível avaliar a hipótese.'));
      setLastResult(body);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleNovaHipotese() {
    setLastResult(null);
    setHypothesis('');
  }

  async function handleAdvance() {
    if (!attempt) return;
    setAdvancing(true);
    setError(null);
    try {
      const endpoint = attempt.is_last_stage ? 'finish' : 'hint';
      const res = await fetch(`/api/attempts/${attempt.id}/${endpoint}`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(body, 'Não foi possível avançar.'));
      if (endpoint === 'finish') {
        router.push(`/play/resultado/${attempt.id}`);
        return;
      }
      setAttempt(body);
      setLastResult(null);
      setHypothesis('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdvancing(false);
    }
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-start justify-center px-6 py-8">
        <div className="card w-full border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <button
          type="button"
          className="btn-secondary mt-4"
          onClick={() => {
            setAttempt(null);
            setError(null);
            setLastResult(null);
            setHypothesis('');
            setAttemptNonce((n) => n + 1);
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--teal-100)] border-t-[var(--teal-600)]" />
        <p className="mt-4 text-sm text-[var(--muted)]">Montando o caso clínico…</p>
      </div>
    );
  }

  const progressPct = ((attempt.current_stage + 1) / attempt.total_stages) * 100;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pill">{attempt.case.area.name}</span>
        <span className="pill">{DIFFICULTY_LABELS[attempt.case.difficulty]}</span>
        {attempt.case.patient && (
          <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
            <User className="h-3.5 w-3.5" />
            {attempt.case.patient.sex}, {attempt.case.patient.age} anos
          </span>
        )}
      </div>

      {attempt.mode === 'progressivo' && (
        <div className="mt-3">
          <p className="text-xs font-medium text-[var(--muted)]">
            Pista {attempt.current_stage + 1}/{attempt.total_stages}
          </p>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--border)]">
            <div
              className="h-1.5 rounded-full bg-[var(--teal-600)] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {attempt.stages.map((stage) => (
          <div key={stage.id} className="card py-3.5">
            <p className="text-xs font-semibold tracking-wide text-[var(--teal-600)] uppercase">
              {stage.order_index}. {STAGE_LABELS[stage.stage_type]}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{stage.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {lastResult ? (
          (() => {
            const style = CLASSIFICATION_STYLE[lastResult.classification];
            const Icon = style.icon;
            return (
              <div className={`card ${style.className}`}>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Icon className="h-4.5 w-4.5" />
                  {CLASSIFICATION_LABELS[lastResult.classification]}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed opacity-90">{lastResult.feedback}</p>
                <button type="button" className="btn-secondary mt-3 bg-white" onClick={handleNovaHipotese}>
                  Nova hipótese
                </button>
              </div>
            );
          })()
        ) : (
          <>
            <label className="text-sm font-semibold" htmlFor="hypothesis">
              Qual sua hipótese diagnóstica?
            </label>
            <textarea
              id="hypothesis"
              className="input mt-2"
              rows={3}
              value={hypothesis}
              onChange={(event) => setHypothesis(event.target.value)}
            />
            <button
              type="button"
              className="btn-primary mt-2 w-full"
              disabled={submitting || !hypothesis.trim()}
              onClick={handleSubmitHypothesis}
            >
              {submitting ? 'Avaliando…' : 'Enviar hipótese'}
            </button>
          </>
        )}
      </div>

      <button type="button" className="btn-secondary mt-3 w-full" disabled={advancing} onClick={handleAdvance}>
        {advancing ? '…' : attempt.is_last_stage ? 'Ver resposta' : 'Próxima pista'}
        {!advancing && <ArrowRight className="h-4 w-4" />}
      </button>

      {attempt.mode === 'progressivo' && (
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          Quanto menos pistas usar, maior sua pontuação.
        </p>
      )}
    </div>
  );
}
