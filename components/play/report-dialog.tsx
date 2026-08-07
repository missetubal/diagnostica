'use client';

import { useRef, useState } from 'react';
import { Flag, X } from 'lucide-react';
import { REPORT_CATEGORIES } from '@/lib/validations/report';

type Category = (typeof REPORT_CATEGORIES)[number];

function extractErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error;
  }
  return fallback;
}

/**
 * Formulário de reporte via <dialog> nativo — showModal()/close() já dão
 * backdrop, foco preso e fechamento por Esc de graça, sem lib de modal.
 */
export default function ReportDialog({
  caseId,
  attemptId,
}: {
  caseId: string;
  attemptId?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [category, setCategory] = useState<Category>(REPORT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleDialogClose() {
    setSent(false);
    setCategory(REPORT_CATEGORIES[0]);
    setDescription('');
    setError(null);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId, attempt_id: attemptId, category, description }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(body, 'Não foi possível enviar o reporte.'));
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn-secondary flex-1"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Flag className="h-4 w-4" />
        Reportar
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[var(--border)] p-0 backdrop:bg-black/40"
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold">Reportar problema</p>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Fechar">
              <X className="h-4 w-4 text-[var(--muted)]" />
            </button>
          </div>

          {sent ? (
            <>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Reporte enviado. Obrigado por ajudar a melhorar os casos.
              </p>
              <button
                type="button"
                className="btn-primary mt-4 w-full"
                onClick={() => dialogRef.current?.close()}
              >
                Fechar
              </button>
            </>
          ) : (
            <>
              <label className="mt-4 block text-sm font-semibold" htmlFor="report-category">
                Categoria
              </label>
              <select
                id="report-category"
                className="input mt-1"
                value={category}
                onChange={(event) => setCategory(event.target.value as Category)}
              >
                {REPORT_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="mt-3 block text-sm font-semibold" htmlFor="report-description">
                Descrição
              </label>
              <textarea
                id="report-description"
                className="input mt-1"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />

              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

              <button
                type="button"
                className="btn-primary mt-4 w-full"
                disabled={submitting || !description.trim()}
                onClick={handleSubmit}
              >
                {submitting ? 'Enviando…' : 'Enviar reporte'}
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
