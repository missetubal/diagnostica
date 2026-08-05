import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { updateReport } from '@/lib/admin/reports';
import { requireReviewerOrResponse } from '@/lib/admin/guard';

const bodySchema = z.object({
  status: z.enum(['aberto', 'em_analise', 'resolvido', 'descartado']),
  resolution: z.string().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireReviewerOrResponse();
  if (response) return response;

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  try {
    const updated = await updateReport(id, { ...parsed.data, reviewedBy: user.id });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Reporte não encontrado.' }, { status: 404 });
    }
    throw error;
  }
}
