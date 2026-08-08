import { ShieldAlert } from 'lucide-react';

/**
 * Texto fixo exigido em landing, /play e tela de resultado (docs/tasks/11 —
 * consistente com docs/sugestao-arquitetura.md, seção 23, aviso obrigatório).
 */
export default function EducationalDisclaimer({ className = '' }: { className?: string }) {
  return (
    <p className={`flex gap-2 text-sm text-[var(--muted)] ${className}`}>
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      Plataforma de finalidade exclusivamente educacional. Casos simulados — não substitui
      supervisão profissional, protocolos ou avaliação individualizada de pacientes.
    </p>
  );
}
