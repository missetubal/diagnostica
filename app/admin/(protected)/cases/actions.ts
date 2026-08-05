'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin, requireReviewer } from '@/lib/auth';
import * as caseService from '@/lib/admin/cases';
import { adminCaseSchema, type AdminCaseInput } from '@/lib/validations/admin-case';

export async function saveCase(caseId: string | null, data: AdminCaseInput) {
  const user = await requireReviewer();
  const parsed = adminCaseSchema.parse(data);

  const result = caseId
    ? await caseService.updateCase(caseId, parsed)
    : await caseService.createCase(parsed, user.id);

  revalidatePath('/admin/cases');
  revalidatePath(`/admin/cases/${result.id}`);
  return result.id;
}

export async function submitReviewAction(caseId: string) {
  await requireReviewer();
  await caseService.submitForReview(caseId);
  revalidatePath(`/admin/cases/${caseId}`);
}

export async function approveAction(caseId: string, comments?: string) {
  const user = await requireReviewer();
  await caseService.approveCase(caseId, user.id, comments);
  revalidatePath(`/admin/cases/${caseId}`);
}

export async function rejectAction(caseId: string, comments: string) {
  const user = await requireReviewer();
  await caseService.rejectCase(caseId, user.id, comments);
  revalidatePath(`/admin/cases/${caseId}`);
}

export async function publishAction(caseId: string) {
  await requireAdmin();
  await caseService.publishCase(caseId);
  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath('/admin/cases');
}

export async function deleteAction(caseId: string) {
  await requireAdmin();
  await caseService.deleteCase(caseId);
  revalidatePath('/admin/cases');
  redirect('/admin/cases');
}
