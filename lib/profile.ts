import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

export const profileInclude = {
  profession: true,
  areas: { include: { area: true } },
  preferences: true,
} satisfies Prisma.UserInclude;

type ProfileWithRelations = Prisma.UserGetPayload<{ include: typeof profileInclude }>;

export async function ensureAnonymousProfile(deviceId: string) {
  return db.user.upsert({
    where: { deviceId },
    update: {},
    create: { deviceId },
    include: profileInclude,
  });
}

export async function getProfileByDeviceId(deviceId: string) {
  return db.user.findUnique({ where: { deviceId }, include: profileInclude });
}

export function serializeProfile(user: ProfileWithRelations) {
  return {
    id: user.id,
    user_type: user.userType,
    profession_id: user.professionId,
    user_areas: user.areas.map(({ area }) => ({ id: area.id, name: area.name, slug: area.slug })),
    preferences: user.preferences
      ? { difficulty: user.preferences.difficulty }
      : null,
    onboarding_completed_at: user.onboardingCompletedAt,
  };
}
