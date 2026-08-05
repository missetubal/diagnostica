import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getDeviceId } from '@/lib/device-id';
import { ensureAnonymousProfile, serializeProfile } from '@/lib/profile';

export async function POST() {
  const deviceId = await getDeviceId();
  if (!deviceId) {
    return NextResponse.json({ error: 'device_id ausente.' }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { deviceId } });
  const user = await ensureAnonymousProfile(deviceId);

  return NextResponse.json(serializeProfile(user), { status: existing ? 200 : 201 });
}
