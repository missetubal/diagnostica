import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { createCase, listCases } from '@/lib/admin/cases';
import { requireReviewerOrResponse } from '@/lib/admin/guard';
import { adminCaseSchema } from '@/lib/validations/admin-case';

export async function GET(request: NextRequest) {
  const { response } = await requireReviewerOrResponse();
  if (response) return response;

  const searchParams = request.nextUrl.searchParams;
  const cases = await listCases({
    areaId: searchParams.get('area_id') || undefined,
    professionId: searchParams.get('profession_id') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    status: searchParams.get('status') || undefined,
  });

  return NextResponse.json(cases);
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireReviewerOrResponse();
  if (response) return response;

  const parsed = adminCaseSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const created = await createCase(parsed.data, user.id);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um caso com esse slug.' }, { status: 409 });
    }
    throw error;
  }
}
