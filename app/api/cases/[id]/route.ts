import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { publicCaseSelect } from '@/lib/public-case';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseRecord = await db.case.findUnique({
    where: { id, status: 'publicado' },
    select: publicCaseSelect,
  });

  if (!caseRecord) {
    return NextResponse.json({ error: 'Caso não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(caseRecord);
}
