import { NextResponse } from 'next/server';
import { getDeviceId } from '@/lib/device-id';
import { getProfileByDeviceId, serializeProfile } from '@/lib/profile';

export async function GET() {
  const deviceId = await getDeviceId();
  if (!deviceId) {
    return NextResponse.json({ error: 'device_id ausente.' }, { status: 400 });
  }

  const user = await getProfileByDeviceId(deviceId);
  if (!user) {
    return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(serializeProfile(user));
}
