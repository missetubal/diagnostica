import Link from 'next/link';
import { listReports } from '@/lib/admin/reports';
import { ReportRow } from './report-row';

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const reports = await listReports({ status: params.status });

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        Reportes
      </h1>

      <form className="flex gap-3 text-sm">
        <select name="status" defaultValue={params.status ?? ''} className="input w-auto">
          <option value="">Todos os status</option>
          <option value="aberto">Aberto</option>
          <option value="em_analise">Em análise</option>
          <option value="resolvido">Resolvido</option>
          <option value="descartado">Descartado</option>
        </select>
        <button type="submit" className="btn-secondary">
          Filtrar
        </button>
      </form>

      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="card space-y-2 text-sm">
            <p>
              <Link
                href={`/admin/cases/${report.case.id}`}
                className="font-medium text-[var(--teal-600)] hover:text-[var(--teal-700)]"
              >
                {report.case.title}
              </Link>{' '}
              · {report.category} · {report.createdAt.toLocaleDateString('pt-BR')}
            </p>
            <p className="text-[var(--muted)]">{report.description}</p>
            {report.attempt && (
              <p className="text-xs text-[var(--muted)]">
                Tentativa: {report.attempt.mode} · {report.attempt.status}
                {report.attempt.finishedAt ? ` · ${report.attempt.hintsUsed} pistas` : ''}
                {report.attempt.score !== null ? ` · ${report.attempt.score} pts` : ''}
              </p>
            )}
            <ReportRow reportId={report.id} status={report.status} resolution={report.resolution} />
          </div>
        ))}
        {reports.length === 0 && <p className="text-[var(--muted)]">Nenhum reporte encontrado.</p>}
      </div>
    </div>
  );
}
