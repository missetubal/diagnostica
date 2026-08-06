import { NextResponse, type NextRequest } from 'next/server';
import { finishAttempt } from '@/lib/attempts';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  const { id } = await params;
  try {
    const attempt = await finishAttempt(id, user.id);
    return NextResponse.json(attempt);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
