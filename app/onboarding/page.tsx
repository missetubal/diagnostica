import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getDeviceId } from '@/lib/device-id';
import { ensureAnonymousProfile, serializeProfile } from '@/lib/profile';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const isEdit = edit === '1';

  const deviceId = await getDeviceId();
  if (!deviceId) {
    redirect('/');
  }

  const user = await ensureAnonymousProfile(deviceId);

  if (user.onboardingCompletedAt && !isEdit) {
    redirect('/dashboard');
  }

  const professions = await db.profession.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return (
    <OnboardingWizard
      initialProfile={serializeProfile(user)}
      professions={professions.map((p) => ({ id: p.id, name: p.name }))}
      redirectTo={isEdit ? '/perfil' : '/dashboard'}
    />
  );
}
