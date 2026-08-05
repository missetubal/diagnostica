import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const professionId = new URL(request.url).searchParams.get('profession_id');

  const areas = await db.area.findMany({
    where: {
      isActive: true,
      ...(professionId ? { professions: { some: { professionId } } } : {}),
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(areas);
}
