import { NextResponse, type NextRequest } from 'next/server';
import { submitForReview } from '@/lib/admin/cases';
import { requireReviewerOrResponse } from '@/lib/admin/guard';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireReviewerOrResponse();
  if (response) return response;

  const { id } = await params;
  try {
    const updated = await submitForReview(id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
