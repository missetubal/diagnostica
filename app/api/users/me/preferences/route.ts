import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getDeviceId } from '@/lib/device-id';
import { updatePreferencesSchema } from '@/lib/validations/profile';

export async function PATCH(request: Request) {
  const deviceId = await getDeviceId();
  if (!deviceId) {
    return NextResponse.json({ error: 'device_id ausente.' }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { deviceId } });
  if (!user) {
    return NextResponse.json(
      { error: 'Perfil não encontrado. Chame POST /api/profile primeiro.' },
      { status: 404 },
    );
  }

  const parsed = updatePreferencesSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const preferences = await db.userPreferences.upsert({
    where: { userId: user.id },
    update: { difficulty: parsed.data.difficulty },
    create: { userId: user.id, difficulty: parsed.data.difficulty },
  });

  return NextResponse.json({ difficulty: preferences.difficulty });
}
