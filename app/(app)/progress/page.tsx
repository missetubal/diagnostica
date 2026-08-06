import { redirect } from 'next/navigation';
import { Flame, Trophy, Activity, CheckCircle2, Layers, History, Info } from 'lucide-react';
import { getDeviceId } from '@/lib/device-id';
import { getProfileByDeviceId } from '@/lib/profile';
import { getUserStats, getUserHistory } from '@/lib/stats';
import { DIFFICULTY_LABELS } from '@/lib/labels';

export default async function ProgressPage() {
  const deviceId = await getDeviceId();
  const user = deviceId ? await getProfileByDeviceId(deviceId) : null;

  if (!user) {
    redirect('/onboarding');
  }

  const [stats, history] = await Promise.all([getUserStats(user.id), getUserHistory(user.id)]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Progresso</h1>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Sequência atual</p>
          <p className="mt-2 flex items-center gap-1.5 text-2xl font-semibold">
            <Flame className="h-5 w-5 text-orange-500" />
            {stats.streak_current}{' '}
            <span className="text-sm font-normal text-[var(--muted)]">dias</span>
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Recorde: {stats.streak_best} dias</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Pontuação total</p>
          <p className="mt-2 flex items-center gap-1.5 text-2xl font-semibold">
            <Trophy className="h-5 w-5 text-amber-500" />
            {stats.total_score}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Taxa de acerto</p>
          <p className="mt-2 flex items-center gap-1.5 text-2xl font-semibold">
            <Activity className="h-5 w-5 text-[var(--teal-600)]" />
            {stats.accuracy}%
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {stats.correct_count}/{stats.cases_completed} casos
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Casos resolvidos</p>
          <p className="mt-2 flex items-center gap-1.5 text-2xl font-semibold">
            <CheckCircle2 className="h-5 w-5 text-[var(--teal-600)]" />
            {stats.cases_completed}
          </p>
        </div>
      </div>

      <div className="card mt-4">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--teal-600)] uppercase">
          <Layers className="h-4 w-4" />
          Áreas mais praticadas
        </p>
        {stats.areas.length > 0 ? (
          <div className="mt-3 flex flex-col gap-2">
            {stats.areas.map((area) => (
              <div key={area.id} className="flex items-center justify-between text-sm">
                <span>{area.name}</span>
                <span className="pill">{area.count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">Nenhum caso concluído ainda.</p>
        )}
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
          <History className="h-4 w-4" />
          Histórico recente
        </p>
        {history.length > 0 ? (
          <div className="mt-2 flex flex-col gap-2">
            {history.map((attempt) => (
              <div key={attempt.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">
                    {attempt.diagnosis ?? 'Caso sem diagnóstico registrado'}
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-[var(--teal-600)]">
                    {attempt.score ?? 0} pts
                  </p>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="pill">{attempt.area.name}</span>
                  <span className="pill">{DIFFICULTY_LABELS[attempt.difficulty]}</span>
                  <span>{attempt.hints_used} pistas usadas</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="card mt-2 text-sm text-[var(--muted)]">
            Você ainda não concluiu nenhum caso. Comece a praticar para ver seu histórico aqui.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--border)] bg-white p-3 text-xs text-[var(--muted)]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Seu progresso é salvo localmente neste dispositivo/navegador. Sincronização entre
        dispositivos chegará em breve.
      </div>
    </div>
  );
}
