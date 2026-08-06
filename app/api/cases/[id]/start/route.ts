import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { startAttempt } from '@/lib/attempts';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

const bodySchema = z.object({ mode: z.enum(['progressivo', 'completo']).default('progressivo') });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  try {
    const attempt = await startAttempt(user.id, id, parsed.data.mode);
    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 404 });
  }
}
