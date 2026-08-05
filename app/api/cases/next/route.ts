import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publicCaseSelect } from '@/lib/public-case';

/**
 * Versão mínima do contrato de docs/sugestao-arquitetura.md (seção 9) — só o
 * suficiente para validar que um caso publicado fica jogável. Seleção de
 * "próximo caso" (desafio diário, progresso do usuário) é escopo da tarefa 04.
 * Não expõe respostas/diferenciais/pontos de aprendizagem — spoiler do jogo.
 */
export async function GET() {
  const ids = await db.case.findMany({
    where: { status: 'publicado' },
    select: { id: true },
  });

  if (ids.length === 0) {
    return NextResponse.json({ error: 'Nenhum caso publicado no momento.' }, { status: 404 });
  }

  const randomId = ids[Math.floor(Math.random() * ids.length)].id;
  const caseRecord = await db.case.findUnique({
    where: { id: randomId },
    select: publicCaseSelect,
  });

  return NextResponse.json(caseRecord);
}
