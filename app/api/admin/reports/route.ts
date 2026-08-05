import { NextResponse, type NextRequest } from 'next/server';
import { listReports } from '@/lib/admin/reports';
import { requireReviewerOrResponse } from '@/lib/admin/guard';

export async function GET(request: NextRequest) {
  const { response } = await requireReviewerOrResponse();
  if (response) return response;

  const searchParams = request.nextUrl.searchParams;
  const reports = await listReports({
    status: searchParams.get('status') || undefined,
    caseId: searchParams.get('case_id') || undefined,
  });

  return NextResponse.json(reports);
}
