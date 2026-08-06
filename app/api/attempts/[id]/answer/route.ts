import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { submitAnswer } from '@/lib/attempts';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

const bodySchema = z.object({ text: z.string().min(1, 'Digite uma hipótese diagnóstica.') });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  try {
    const result = await submitAnswer(id, user.id, parsed.data.text);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
