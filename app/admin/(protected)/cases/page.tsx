import Link from 'next/link';
import { db } from '@/lib/db';
import { listCases } from '@/lib/admin/cases';
import { caseStatusSchema, difficultySchema } from '@/lib/validations/case';

const STATUS_LABELS: Record<string, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em revisão',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
  sinalizado: 'Sinalizado',
  desativado: 'Desativado',
};

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [cases, areas, professions] = await Promise.all([
    listCases({
      areaId: params.area_id,
      professionId: params.profession_id,
      difficulty: params.difficulty,
      status: params.status,
    }),
    db.area.findMany({ orderBy: { name: 'asc' } }),
    db.profession.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Casos
        </h1>
        <Link href="/admin/cases/new" className="btn-primary">
          Novo caso
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 text-sm">
        <select name="area_id" defaultValue={params.area_id ?? ''} className="input w-auto">
          <option value="">Todas as áreas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        <select
          name="profession_id"
          defaultValue={params.profession_id ?? ''}
          className="input w-auto"
        >
          <option value="">Todas as profissões</option>
          {professions.map((profession) => (
            <option key={profession.id} value={profession.id}>
              {profession.name}
            </option>
          ))}
        </select>

        <select name="difficulty" defaultValue={params.difficulty ?? ''} className="input w-auto">
          <option value="">Todas as dificuldades</option>
          {difficultySchema.options.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>

        <select name="status" defaultValue={params.status ?? ''} className="input w-auto">
          <option value="">Todos os status</option>
          {caseStatusSchema.options.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-secondary">
          Filtrar
        </button>
      </form>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="px-5 py-3 font-medium">Título</th>
              <th className="px-5 py-3 font-medium">Área</th>
              <th className="px-5 py-3 font-medium">Profissões</th>
              <th className="px-5 py-3 font-medium">Dificuldade</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Atualizado</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseRecord) => (
              <tr key={caseRecord.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/cases/${caseRecord.id}`}
                    className="font-medium text-[var(--teal-600)] hover:text-[var(--teal-700)]"
                  >
                    {caseRecord.title}
                  </Link>
                </td>
                <td className="px-5 py-3">{caseRecord.area.name}</td>
                <td className="px-5 py-3">
                  {caseRecord.professions.map((cp) => cp.profession.name).join(', ')}
                </td>
                <td className="px-5 py-3">{caseRecord.difficulty}</td>
                <td className="px-5 py-3">
                  <span className="pill">{STATUS_LABELS[caseRecord.status]}</span>
                </td>
                <td className="px-5 py-3">{caseRecord.updatedAt.toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
            {cases.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[var(--muted)]">
                  Nenhum caso encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
