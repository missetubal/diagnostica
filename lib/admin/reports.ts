import { Prisma, ReportStatus } from '@prisma/client';
import { db } from '@/lib/db';

export const reportListInclude = {
  user: true,
  case: { select: { id: true, title: true, slug: true } },
} satisfies Prisma.ReportInclude;

export interface ReportFilters {
  status?: string;
  caseId?: string;
}

export function listReports(filters: ReportFilters) {
  return db.report.findMany({
    where: {
      status: (filters.status as ReportStatus) || undefined,
      caseId: filters.caseId || undefined,
    },
    include: reportListInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export interface UpdateReportInput {
  status: ReportStatus;
  resolution?: string;
  reviewedBy: string;
}

export function updateReport(id: string, data: UpdateReportInput) {
  return db.report.update({
    where: { id },
    data: {
      status: data.status,
      resolution: data.resolution,
      reviewedBy: data.reviewedBy,
    },
  });
}
