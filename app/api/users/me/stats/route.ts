import { NextResponse } from 'next/server';
import { getUserStats } from '@/lib/stats';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

export async function GET() {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  return NextResponse.json(await getUserStats(user.id));
}
