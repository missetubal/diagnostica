'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, ListChecks, Share2, TrendingUp, User } from 'lucide-react';
import CaseAttempt from '@/components/play/case-attempt';
import { DIFFICULTY_LABELS } from '@/lib/labels';

type Difficulty = 'facil' | 'medio' | 'dificil';

type DailyStatus = {
  case: {
    id: string;
    area: { name: string };
    difficulty: Difficulty;
    patient: { age: number; sex: string } | null;
  };
  attempt: { id: string; status: string; score: number | null; hints_used: number } | null;
};

function extractErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error;
  }
  return fallback;
}

export default function DailyChallengeView() {
  const [status, setStatus] = useState<DailyStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [startedAttemptId, setStartedAttemptId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/daily/challenge');
        const body = await res.json();
        if (!res.ok)
          throw new Error(extractErrorMessage(body, 'Não foi possível carregar o desafio diário.'));
        if (!cancelled) setStatus(body);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStart() {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/daily/challenge/start', { method: 'POST' });
      const body = await res.json();
      if (!res.ok)
        throw new Error(extractErrorMessage(body, 'Não foi possível iniciar o desafio.'));
      setStartedAttemptId(body.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setStarting(false);
    }
  }

  const activeAttemptId =
    startedAttemptId ??
    (status?.attempt && status.attempt.status !== 'concluida' ? status.attempt.id : null);

  if (activeAttemptId) {
    return <CaseAttempt mode="progressivo" initialAttemptId={activeAttemptId} />;
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-start justify-center px-6 py-8">
        <div className="card w-full border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        {error.includes('profissão') ? (
          <Link href="/onboarding?edit=1" className="btn-primary mt-4">
            Completar perfil
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-secondary mt-4">
            Voltar
          </Link>
        )}
      </div>
    );
  }

  if (!status) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--teal-100)] border-t-[var(--teal-600)]" />
        <p className="mt-4 text-sm text-[var(--muted)]">Carregando desafio diário…</p>
      </div>
    );
  }

  if (status.attempt?.status === 'concluida') {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--teal-50)] text-[var(--teal-600)]">
          <CalendarCheck className="h-7 w-7" />
        </span>
        <h1 className="font-display mt-4 text-2xl font-semibold">Você já jogou hoje</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {status.attempt.score ?? 0} pts · {status.attempt.hints_used} pistas usadas
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">Volte amanhã para o próximo desafio.</p>
        <Link href={`/play/resultado/${status.attempt.id}`} className="btn-primary mt-6 w-full">
          Ver resultado e compartilhar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Desafio Diário</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Um caso clínico por dia, igual para todos de sua profissão. Você só pode jogar uma vez por
        dia — use bem as pistas.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="pill">{status.case.area.name}</span>
        <span className="pill">{DIFFICULTY_LABELS[status.case.difficulty]}</span>
        {status.case.patient && (
          <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
            <User className="h-3.5 w-3.5" />
            {status.case.patient.sex}, {status.case.patient.age} anos
          </span>
        )}
      </div>

      <ul className="card mt-4 flex flex-col gap-3">
        <li className="flex items-start gap-2 text-sm">
          <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-600)]" />
          Mesmo caso para sua profissão hoje
        </li>
        <li className="flex items-start gap-2 text-sm">
          <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-600)]" />
          Compartilhe o resultado sem revelar a resposta
        </li>
        <li className="flex items-start gap-2 text-sm">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal-600)]" />
          Conta para sua sequência de dias
        </li>
      </ul>

      <button
        type="button"
        className="btn-primary mt-6 w-full"
        disabled={starting}
        onClick={handleStart}
      >
        {starting ? 'Iniciando…' : 'Iniciar desafio'}
      </button>
    </div>
  );
}
