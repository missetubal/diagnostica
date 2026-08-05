import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getDeviceId } from '@/lib/device-id';
import { profileInclude, serializeProfile } from '@/lib/profile';
import { updateProfileSchema } from '@/lib/validations/profile';

export async function PATCH(request: Request) {
  const deviceId = await getDeviceId();
  if (!deviceId) {
    return NextResponse.json({ error: 'device_id ausente.' }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { deviceId } });
  if (!user) {
    return NextResponse.json(
      { error: 'Perfil não encontrado. Chame POST /api/profile primeiro.' },
      { status: 404 },
    );
  }

  const parsed = updateProfileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { user_type, profession_id, user_areas } = parsed.data;

  const profession = await db.profession.findUnique({ where: { id: profession_id } });
  if (!profession || !profession.isActive) {
    return NextResponse.json({ error: 'Profissão inválida.' }, { status: 400 });
  }

  const matchingAreas = await db.professionArea.count({
    where: { professionId: profession_id, areaId: { in: user_areas } },
  });
  if (matchingAreas !== user_areas.length) {
    return NextResponse.json(
      { error: 'Alguma área de interesse não pertence à profissão selecionada.' },
      { status: 400 },
    );
  }

  const completingOnboarding = !user.onboardingCompletedAt;

  const updated = await db.$transaction(async (tx) => {
    await tx.userArea.deleteMany({ where: { userId: user.id } });
    await tx.userArea.createMany({
      data: user_areas.map((areaId) => ({ userId: user.id, areaId })),
    });

    return tx.user.update({
      where: { id: user.id },
      data: {
        userType: user_type,
        professionId: profession_id,
        ...(completingOnboarding ? { onboardingCompletedAt: new Date() } : {}),
      },
      include: profileInclude,
    });
  });

  return NextResponse.json(serializeProfile(updated));
}
