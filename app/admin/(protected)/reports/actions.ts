'use server';

import { revalidatePath } from 'next/cache';
import type { ReportStatus } from '@prisma/client';
import { requireReviewer } from '@/lib/auth';
import { updateReport } from '@/lib/admin/reports';

export async function updateReportAction(reportId: string, status: ReportStatus, resolution?: string) {
  const user = await requireReviewer();
  await updateReport(reportId, { status, resolution, reviewedBy: user.id });
  revalidatePath('/admin/reports');
}
