import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getAuthenticatedAdminUser } from '@/lib/auth';
import { getCaseWithRelations, toAdminCaseInput } from '@/lib/admin/cases';
import { CaseEditor } from '../case-editor';
import { ReviewActions } from '../review-actions';

export default async function AdminCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, caseRecord, areas, professions] = await Promise.all([
    getAuthenticatedAdminUser(),
    getCaseWithRelations(id),
    db.area.findMany({ orderBy: { name: 'asc' } }),
    db.profession.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!caseRecord || !user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {caseRecord.title}
      </h1>

      <ReviewActions caseId={caseRecord.id} status={caseRecord.status} userRole={user.role} />

      <CaseEditor
        caseId={caseRecord.id}
        initialData={toAdminCaseInput(caseRecord)}
        areas={areas}
        professions={professions}
      />

      <section className="max-w-3xl space-y-3 text-sm">
        <h2 className="font-semibold text-[var(--foreground)]">Histórico de revisão</h2>
        {caseRecord.reviews.length === 0 && (
          <p className="text-[var(--muted)]">Nenhuma revisão ainda.</p>
        )}
        {caseRecord.reviews.map((review) => (
          <div key={review.id} className="card">
            <p>
              <strong>{review.decision}</strong> por {review.reviewer.email ?? review.reviewer.id} em{' '}
              {review.reviewedAt.toLocaleString('pt-BR')}
            </p>
            {review.comments && <p className="mt-1 text-[var(--muted)]">{review.comments}</p>}
          </div>
        ))}
      </section>

      <section className="max-w-3xl space-y-3 text-sm">
        <h2 className="font-semibold text-[var(--foreground)]">Reportes</h2>
        {caseRecord.reports.length === 0 && <p className="text-[var(--muted)]">Nenhum reporte.</p>}
        {caseRecord.reports.map((report) => (
          <div key={report.id} className="card">
            <p>
              <strong>{report.category}</strong> · {report.status} ·{' '}
              {report.createdAt.toLocaleDateString('pt-BR')}
            </p>
            <p className="mt-1 text-[var(--muted)]">{report.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
