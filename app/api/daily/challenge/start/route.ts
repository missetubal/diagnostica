import { NextResponse } from 'next/server';
import { startDailyAttempt } from '@/lib/daily-challenge';
import { getAttemptState } from '@/lib/attempts';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

export async function POST() {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  if (!user.professionId) {
    return NextResponse.json(
      { error: 'Defina sua profissão no perfil para acessar o desafio diário.' },
      { status: 400 },
    );
  }

  try {
    const attemptId = await startDailyAttempt(user.id, user.professionId);
    return NextResponse.json(await getAttemptState(attemptId, user.id), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
