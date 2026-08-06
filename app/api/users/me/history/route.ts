import { NextResponse } from 'next/server';
import { getUserHistory } from '@/lib/stats';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

export async function GET() {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  return NextResponse.json(await getUserHistory(user.id));
}
