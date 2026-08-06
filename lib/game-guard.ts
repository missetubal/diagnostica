import { NextResponse } from 'next/server';
import { getDeviceId } from '@/lib/device-id';
import { ensureAnonymousProfile } from '@/lib/profile';

/**
 * Guarda de rota para app/api/cases/:id/start e app/api/attempts/** — resolve
 * o perfil anônimo pelo device_id (mesmo padrão de lib/admin/guard.ts).
 */
export async function requireDeviceUserOrResponse() {
  const deviceId = await getDeviceId();
  if (!deviceId) {
    return { user: null, response: NextResponse.json({ error: 'Perfil não identificado.' }, { status: 401 }) };
  }
  const user = await ensureAnonymousProfile(deviceId);
  return { user, response: null };
}
