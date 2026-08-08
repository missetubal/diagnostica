import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import EducationalDisclaimer from '@/components/educational-disclaimer';

export default function PlaySelectPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Escolha o modo</h1>
      <EducationalDisclaimer className="mt-2" />

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/play/progressivo"
          className="flex items-center gap-4 rounded-2xl border border-[var(--teal-100)] bg-gradient-to-br from-[var(--teal-50)] to-white p-5 shadow-sm transition-transform active:scale-[0.99]"
        >
          <span className="flex-1">
            <span className="font-display block text-base font-semibold">Progressivo</span>
            <span className="block text-sm text-[var(--muted)]">Pistas reveladas aos poucos</span>
          </span>
          <ChevronRight className="h-5 w-5 text-[var(--muted)]" />
        </Link>

        <Link
          href="/play/completo"
          className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition-transform active:scale-[0.99]"
        >
          <span className="flex-1">
            <span className="font-display block text-base font-semibold">Caso completo</span>
            <span className="block text-sm text-[var(--muted)]">
              Todas as informações de uma vez
            </span>
          </span>
          <ChevronRight className="h-5 w-5 text-[var(--muted)]" />
        </Link>
      </div>
    </div>
  );
}
