import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getDeviceId } from '@/lib/device-id';

export default async function RootPage() {
  const deviceId = await getDeviceId();
  const user = deviceId ? await db.user.findUnique({ where: { deviceId } }) : null;

  if (!user?.onboardingCompletedAt) {
    redirect('/onboarding');
  }
  redirect('/dashboard');
}
