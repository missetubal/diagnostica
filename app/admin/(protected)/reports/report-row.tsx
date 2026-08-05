'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReportStatus } from '@prisma/client';
import { updateReportAction } from './actions';

const STATUS_OPTIONS: ReportStatus[] = ['aberto', 'em_analise', 'resolvido', 'descartado'];

export function ReportRow({
  reportId,
  status: initialStatus,
  resolution: initialResolution,
}: {
  reportId: string;
  status: ReportStatus;
  resolution: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ReportStatus>(initialStatus);
  const [resolution, setResolution] = useState(initialResolution ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateReportAction(reportId, status, resolution || undefined);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as ReportStatus)}
        className="input w-auto"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <input
        value={resolution}
        onChange={(event) => setResolution(event.target.value)}
        placeholder="Resolução (opcional)"
        className="input flex-1"
      />
      <button type="button" disabled={saving} className="btn-secondary" onClick={handleSave}>
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
}
