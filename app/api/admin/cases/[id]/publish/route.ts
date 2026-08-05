import { NextResponse, type NextRequest } from 'next/server';
import { publishCase } from '@/lib/admin/cases';
import { requireAdminOrResponse } from '@/lib/admin/guard';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdminOrResponse();
  if (response) return response;

  const { id } = await params;
  try {
    const updated = await publishCase(id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
