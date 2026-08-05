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
        <h1 className="text-xl font-semibold">Casos</h1>
        <Link href="/admin/cases/new" className="rounded bg-black px-3 py-2 text-sm text-white">
          Novo caso
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 text-sm">
        <select name="area_id" defaultValue={params.area_id ?? ''} className="rounded border px-2 py-1">
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
          className="rounded border px-2 py-1"
        >
          <option value="">Todas as profissões</option>
          {professions.map((profession) => (
            <option key={profession.id} value={profession.id}>
              {profession.name}
            </option>
          ))}
        </select>

        <select
          name="difficulty"
          defaultValue={params.difficulty ?? ''}
          className="rounded border px-2 py-1"
        >
          <option value="">Todas as dificuldades</option>
          {difficultySchema.options.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>

        <select name="status" defaultValue={params.status ?? ''} className="rounded border px-2 py-1">
          <option value="">Todos os status</option>
          {caseStatusSchema.options.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <button type="submit" className="rounded border px-3 py-1">
          Filtrar
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b text-neutral-500">
            <th className="py-2">Título</th>
            <th>Área</th>
            <th>Profissões</th>
            <th>Dificuldade</th>
            <th>Status</th>
            <th>Atualizado</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseRecord) => (
            <tr key={caseRecord.id} className="border-b">
              <td className="py-2">
                <Link href={`/admin/cases/${caseRecord.id}`} className="font-medium underline">
                  {caseRecord.title}
                </Link>
              </td>
              <td>{caseRecord.area.name}</td>
              <td>{caseRecord.professions.map((cp) => cp.profession.name).join(', ')}</td>
              <td>{caseRecord.difficulty}</td>
              <td>{STATUS_LABELS[caseRecord.status]}</td>
              <td>{caseRecord.updatedAt.toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
          {cases.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-neutral-500">
                Nenhum caso encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
