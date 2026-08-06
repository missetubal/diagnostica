import { CheckCircle2, CircleAlert, MinusCircle } from 'lucide-react';

export type AnswerType = 'correta' | 'parcialmente_correta' | 'incorreta';

export const CLASSIFICATION_LABELS: Record<AnswerType, string> = {
  correta: 'Correto',
  parcialmente_correta: 'Parcialmente correto',
  incorreta: 'Incorreto',
};

export const CLASSIFICATION_STYLE: Record<AnswerType, { icon: typeof CheckCircle2; className: string }> = {
  correta: { icon: CheckCircle2, className: 'border-[var(--teal-100)] bg-[var(--teal-50)] text-[var(--teal-700)]' },
  parcialmente_correta: { icon: MinusCircle, className: 'border-amber-200 bg-amber-50 text-amber-700' },
  incorreta: { icon: CircleAlert, className: 'border-red-200 bg-red-50 text-red-700' },
};
