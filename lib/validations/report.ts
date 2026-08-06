import { z } from 'zod';

/**
 * Categorias fixas do formulário de reporte (docs/tasks/10). `Report.category`
 * no schema é texto livre — guardamos o rótulo em português direto, sem
 * mapa de slug↔label separado (nada mais consome esse valor além do painel
 * administrativo, que já exibe texto livre).
 */
export const REPORT_CATEGORIES = [
  'Diagnóstico incorreto',
  'Pista confusa',
  'Erro de digitação/tradução',
  'Conteúdo inadequado',
  'Outro',
] as const;

export const createReportSchema = z.object({
  case_id: z.string().uuid(),
  attempt_id: z.string().uuid().optional(),
  category: z.enum(REPORT_CATEGORIES),
  description: z.string().trim().min(1, 'Descreva o problema.').max(2000),
});
