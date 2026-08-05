import { z } from 'zod';
import { difficultySchema } from '@/lib/validations/case';

// UserType do banco também suporta `residente`/`professor`, mas o wizard só
// expõe Estudante/Profissional no MVP (decisão registrada em docs/tasks/02).
export const onboardingUserTypeSchema = z.enum(['estudante', 'profissional']);

export const updateProfileSchema = z.object({
  user_type: onboardingUserTypeSchema,
  profession_id: z.string().uuid(),
  user_areas: z.array(z.string().uuid()).min(1, 'Selecione ao menos uma área de interesse.'),
});

export const updatePreferencesSchema = z.object({
  difficulty: difficultySchema,
});
