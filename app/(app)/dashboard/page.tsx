import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Flame, Activity, ChevronRight, Sparkles, TrendingUp, CalendarDays } from 'lucide-react';
import { getDeviceId } from '@/lib/device-id';
import { getProfileByDeviceId, serializeProfile } from '@/lib/profile';
import { getUserStats } from '@/lib/stats';
import { DIFFICULTY_LABELS, USER_TYPE_LABELS } from '@/lib/labels';

export default async function DashboardPage() {
  const deviceId = await getDeviceId();
  const user = deviceId ? await getProfileByDeviceId(deviceId) : null;

  if (!user) {
    redirect('/onboarding');
  }

  const profile = serializeProfile(user);
  const stats = await getUserStats(user.id);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <p className="text-sm text-[var(--muted)]">Bem-vindo de volta</p>
      <h1 className="font-display mt-1 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
        Pronto para praticar?
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Sequência</p>
          <p className="mt-2 flex items-center gap-1.5 text-2xl font-semibold">
            <Flame className="h-5 w-5 text-orange-500" />
            {stats.streak_current}{' '}
            <span className="text-sm font-normal text-[var(--muted)]">dias</span>
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--muted)]">Taxa de acerto</p>
          <p className="mt-2 flex items-center gap-1.5 text-2xl font-semibold">
            <Activity className="h-5 w-5 text-[var(--teal-600)]" />
            {stats.accuracy}%
          </p>
        </div>
      </div>

      <div className="card mt-4">
        <p className="text-sm text-[var(--muted)]">Seu perfil</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {profile.user_type && (
            <span className="font-semibold text-[var(--teal-700)]">
              {USER_TYPE_LABELS[profile.user_type]}
            </span>
          )}
          {profile.preferences?.difficulty && (
            <span className="text-[var(--muted)]">
              · {DIFFICULTY_LABELS[profile.preferences.difficulty]}
            </span>
          )}
        </div>
        {profile.user_areas.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.user_areas.map((area) => (
              <span key={area.id} className="pill">
                {area.name}
              </span>
            ))}
          </div>
        )}
        <Link
          href="/onboarding?edit=1"
          className="mt-4 inline-block text-sm font-medium text-[var(--teal-600)] hover:text-[var(--teal-700)]"
        >
          Editar perfil
        </Link>
      </div>

      <Link
        href="/play/progressivo"
        className="mt-4 flex items-center gap-4 rounded-2xl border border-[var(--teal-100)] bg-gradient-to-br from-[var(--teal-50)] to-white p-5 shadow-sm transition-transform active:scale-[0.99]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--teal-600)] text-white">
          <Sparkles className="h-6 w-6" />
        </span>
        <span className="flex-1">
          <span className="font-display block text-base font-semibold">Praticar agora</span>
          <span className="block text-sm text-[var(--muted)]">Novo caso clínico personalizado</span>
        </span>
        <ChevronRight className="h-5 w-5 text-[var(--muted)]" />
      </Link>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Link href="/daily" className="card flex flex-col items-start gap-2">
          <CalendarDays className="h-5 w-5 text-[var(--teal-600)]" />
          <span className="text-sm font-semibold">Desafio diário</span>
          <span className="text-xs text-[var(--muted)]">Um caso por dia</span>
        </Link>
        <Link href="/progress" className="card flex flex-col items-start gap-2">
          <TrendingUp className="h-5 w-5 text-[var(--teal-600)]" />
          <span className="text-sm font-semibold">Meu progresso</span>
          <span className="text-xs text-[var(--muted)]">Histórico e estatísticas</span>
        </Link>
      </div>
    </div>
  );
}
