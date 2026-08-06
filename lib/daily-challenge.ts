import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

/**
 * Um desafio por profissão por dia civil (docs/tasks/09) — não um caso único
 * global, conforme o texto do protótipo ("igual para todos de [profissão]").
 * Dia civil em UTC, mesma convenção da sequência de dias (docs/tasks/08).
 */
export function todayUtcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function deterministicIndex(seed: string, length: number): number {
  const hash = crypto.createHash('sha256').update(seed).digest();
  return hash.readUInt32BE(0) % length;
}

/**
 * Garante e devolve o DailyChallenge de hoje para a profissão. Sem
 * job/cron: a escolha do caso é determinística (hash de data+profissão),
 * então chamadas concorrentes calculam o mesmo caso e o upsert vira um
 * INSERT ... ON CONFLICT atômico no Postgres — sem lock distribuído nem fila
 * (docs/sugestao-arquitetura.md, seção 15).
 *
 * ponytail: escolha por hash simples, sem pesos/histórico de repetição —
 * upgrade se casos repetirem com frequência incômoda entre dias.
 */
export async function ensureDailyChallenge(
  professionId: string,
  dateKey: string = todayUtcDateKey(),
) {
  const date = new Date(`${dateKey}T00:00:00Z`);

  const existing = await db.dailyChallenge.findUnique({
    where: { date_professionId: { date, professionId } },
  });
  if (existing) return existing;

  const eligibleCases = await db.case.findMany({
    where: { status: 'publicado', professions: { some: { professionId } } },
    select: { id: true },
    orderBy: { id: 'asc' },
  });
  if (eligibleCases.length === 0) {
    throw new Error('Nenhum caso publicado disponível para o desafio diário dessa profissão.');
  }

  const caseId =
    eligibleCases[deterministicIndex(`${dateKey}:${professionId}`, eligibleCases.length)].id;

  return db.dailyChallenge.upsert({
    where: { date_professionId: { date, professionId } },
    update: {},
    create: { date, professionId, caseId },
  });
}

export async function getDailyAttempt(userId: string, dailyChallengeId: string) {
  return db.attempt.findUnique({
    where: { userId_dailyChallengeId: { userId, dailyChallengeId } },
    select: { id: true, status: true, score: true, hintsUsed: true },
  });
}

/**
 * Cria a tentativa do desafio diário. Se duas abas concorrentes tentarem
 * criar ao mesmo tempo, a constraint única (user_id, daily_challenge_id)
 * rejeita a segunda com P2002 — devolvemos a tentativa já existente em vez
 * de erro, mantendo a operação idempotente do ponto de vista do cliente.
 */
export async function startDailyAttempt(userId: string, professionId: string): Promise<string> {
  const challenge = await ensureDailyChallenge(professionId);

  try {
    const attempt = await db.attempt.create({
      data: {
        userId,
        caseId: challenge.caseId,
        dailyChallengeId: challenge.id,
        status: 'iniciada',
        mode: 'progressivo',
        currentStage: 0,
      },
    });
    return attempt.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const existing = await getDailyAttempt(userId, challenge.id);
      if (existing) return existing.id;
    }
    throw error;
  }
}
