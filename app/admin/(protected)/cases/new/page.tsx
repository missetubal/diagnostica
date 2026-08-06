import { db } from '@/lib/db';
import { CaseEditor } from '../case-editor';

export default async function NewAdminCasePage() {
  const [areas, professions] = await Promise.all([
    db.area.findMany({ orderBy: { name: 'asc' } }),
    db.profession.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        Novo caso
      </h1>
      <CaseEditor caseId={null} initialData={null} areas={areas} professions={professions} />
    </div>
  );
}
