'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CaseStatus, UserRole } from '@prisma/client';
import { approveAction, deleteAction, publishAction, rejectAction, submitReviewAction } from './actions';

export function ReviewActions({
  caseId,
  status,
  userRole,
}: {
  caseId: string;
  status: CaseStatus;
  userRole: UserRole;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectComments, setRejectComments] = useState('');
  const isAdmin = userRole === 'admin';

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na ação.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded border p-4 text-sm">
      <p>
        Status atual: <strong>{status}</strong>
      </p>

      <div className="flex flex-wrap gap-2">
        {status === 'rascunho' && (
          <button
            type="button"
            disabled={busy}
            className="btn-secondary"
            onClick={() => run(() => submitReviewAction(caseId))}
          >
            Enviar para revisão
          </button>
        )}

        {status === 'em_revisao' && (
          <button
            type="button"
            disabled={busy}
            className="btn-secondary"
            onClick={() => run(() => approveAction(caseId))}
          >
            Aprovar
          </button>
        )}

        {status === 'aprovado' && isAdmin && (
          <button
            type="button"
            disabled={busy}
            className="btn-secondary"
            onClick={() => run(() => publishAction(caseId))}
          >
            Publicar
          </button>
        )}

        {isAdmin && (
          <button
            type="button"
            disabled={busy}
            className="btn-danger"
            onClick={() => {
              if (confirm('Excluir este caso definitivamente?')) run(() => deleteAction(caseId));
            }}
          >
            Excluir caso
          </button>
        )}
      </div>

      {status === 'em_revisao' && (
        <div className="space-y-2">
          <textarea
            value={rejectComments}
            onChange={(event) => setRejectComments(event.target.value)}
            placeholder="Motivo da reprovação (obrigatório)"
            rows={2}
            className="input"
          />
          <button
            type="button"
            disabled={busy || !rejectComments.trim()}
            className="btn-danger"
            onClick={() => run(() => rejectAction(caseId, rejectComments))}
          >
            Reprovar
          </button>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
