import { NextResponse, type NextRequest } from 'next/server';
import { getAttemptResult } from '@/lib/attempts';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  const { id } = await params;
  try {
    const result = await getAttemptResult(id, user.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
