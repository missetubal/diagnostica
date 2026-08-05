import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const professions = await db.profession.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(professions);
}
