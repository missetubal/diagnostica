import { NextResponse, type NextRequest } from 'next/server';
import { createReportSchema } from '@/lib/validations/report';
import { createReport } from '@/lib/reports';
import { requireDeviceUserOrResponse } from '@/lib/game-guard';

export async function POST(request: NextRequest) {
  const { user, response } = await requireDeviceUserOrResponse();
  if (response) return response;

  const parsed = createReportSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const report = await createReport({
      userId: user.id,
      caseId: parsed.data.case_id,
      attemptId: parsed.data.attempt_id,
      category: parsed.data.category,
      description: parsed.data.description,
    });
    return NextResponse.json({ id: report.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
