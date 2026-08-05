import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDeviceId } from '@/lib/device-id';
import { getProfileByDeviceId, serializeProfile } from '@/lib/profile';

const USER_TYPE_LABELS: Record<string, string> = {
  estudante: 'Estudante',
  residente: 'Residente',
  profissional: 'Profissional',
  professor: 'Professor',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

export default async function PerfilPage() {
  const deviceId = await getDeviceId();
  const user = deviceId ? await getProfileByDeviceId(deviceId) : null;

  if (!user) {
    redirect('/onboarding');
  }

  const profile = serializeProfile(user);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <h1 className="text-xl font-semibold">Perfil</h1>

      <dl className="mt-6 flex flex-col gap-4 text-sm">
        <div>
          <dt className="text-zinc-500">Você é</dt>
          <dd className="font-medium">
            {profile.user_type ? USER_TYPE_LABELS[profile.user_type] : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Áreas de interesse</dt>
          <dd className="font-medium">
            {profile.user_areas.length > 0
              ? profile.user_areas.map((area) => area.name).join(', ')
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Nível de dificuldade</dt>
          <dd className="font-medium">
            {profile.preferences?.difficulty
              ? DIFFICULTY_LABELS[profile.preferences.difficulty]
              : '—'}
          </dd>
        </div>
      </dl>

      <Link
        href="/onboarding?edit=1"
        className="mt-8 rounded-full border border-zinc-200 py-3 text-center font-medium dark:border-zinc-800"
      >
        Editar preferências
      </Link>
    </div>
  );
}
