import { redirect } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Stethoscope, Gauge, Pencil } from 'lucide-react';
import { getDeviceId } from '@/lib/device-id';
import { getProfileByDeviceId, serializeProfile } from '@/lib/profile';
import { DIFFICULTY_LABELS, USER_TYPE_LABELS } from '@/lib/labels';

export default async function PerfilPage() {
  const deviceId = await getDeviceId();
  const user = deviceId ? await getProfileByDeviceId(deviceId) : null;

  if (!user) {
    redirect('/onboarding');
  }

  const profile = serializeProfile(user);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Perfil</h1>
      <p className="mt-1 text-sm text-muted">Suas preferências de treino</p>

      <div className="card mt-6 flex flex-col divide-y divide-[var(--border)]">
        <div className="flex items-center gap-3 py-3 first:pt-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--teal-50)] text-[var(--teal-600)]">
            <GraduationCap className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-xs text-muted">Você é</p>
            <p className="text-sm font-semibold">
              {profile.user_type ? USER_TYPE_LABELS[profile.user_type] : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--teal-50)] text-[var(--teal-600)]">
            <Stethoscope className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-xs text-muted">Áreas de interesse</p>
            {profile.user_areas.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {profile.user_areas.map((area) => (
                  <span key={area.id} className="pill">
                    {area.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold">—</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 last:pb-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--teal-50)] text-[var(--teal-600)]">
            <Gauge className="h-4.5 w-4.5" />
          </span>
          <div>
            <p className="text-xs text-[var(--muted)]">Nível de dificuldade</p>
            <p className="text-sm font-semibold">
              {profile.preferences?.difficulty ? DIFFICULTY_LABELS[profile.preferences.difficulty] : '—'}
            </p>
          </div>
        </div>
      </div>

      <Link href="/onboarding?edit=1" className="btn-primary mt-6">
        <Pencil className="h-4 w-4" />
        Editar preferências
      </Link>
    </div>
  );
}
