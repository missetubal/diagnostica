import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { rejectCase } from '@/lib/admin/cases';
import { requireReviewerOrResponse } from '@/lib/admin/guard';

const bodySchema = z.object({
  comments: z.string().min(1, 'Explique o motivo da reprovação.'),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireReviewerOrResponse();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  try {
    const updated = await rejectCase(id, user.id, parsed.data.comments);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
