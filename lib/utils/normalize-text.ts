/**
 * Normalização de texto para comparação de respostas do usuário contra os
 * termos aceitos de um caso (ver docs/sugestao-arquitetura.md, seções 13 e 14).
 * Minúsculas, sem acentos, sem espaços duplicados/nas pontas.
 */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
