import { NextResponse, type NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { deleteCase, getCaseWithRelations, updateCase } from '@/lib/admin/cases';
import { requireAdminOrResponse, requireReviewerOrResponse } from '@/lib/admin/guard';
import { adminCaseSchema } from '@/lib/validations/admin-case';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requireReviewerOrResponse();
  if (response) return response;

  const { id } = await params;
  const caseRecord = await getCaseWithRelations(id);
  if (!caseRecord) {
    return NextResponse.json({ error: 'Caso não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(caseRecord);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { response } = await requireReviewerOrResponse();
  if (response) return response;

  const { id } = await params;
  const parsed = adminCaseSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updated = await updateCase(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Já existe um caso com esse slug.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Caso não encontrado.' }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requireAdminOrResponse();
  if (response) return response;

  const { id } = await params;
  try {
    await deleteCase(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Caso não encontrado.' }, { status: 404 });
    }
    throw error;
  }
}
