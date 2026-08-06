import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publicCaseSelect } from '@/lib/public-case';
import { ensureDailyChallenge, getDailyAttempt } from '@/lib/daily-challenge';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

export async function GET() {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  if (!user.professionId) {
    return NextResponse.json(
      { error: 'Defina sua profissão no perfil para acessar o desafio diário.' },
      { status: 400 },
    );
  }

  try {
    const challenge = await ensureDailyChallenge(user.professionId);
    const [caseRecord, attempt] = await Promise.all([
      db.case.findUnique({ where: { id: challenge.caseId }, select: publicCaseSelect }),
      getDailyAttempt(user.id, challenge.id),
    ]);

    return NextResponse.json({
      case: caseRecord,
      attempt: attempt
        ? {
            id: attempt.id,
            status: attempt.status,
            score: attempt.score,
            hints_used: attempt.hintsUsed,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
