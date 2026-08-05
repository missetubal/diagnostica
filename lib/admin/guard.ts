import { NextResponse } from 'next/server';
import { getAuthenticatedAdminUser } from '@/lib/auth';

/**
 * Guardas de rota para app/api/admin/* — devolvem a resposta de erro pronta
 * para `return` direto, em vez de usar exceptions (mais simples de tipar em
 * Route Handlers do que o throw de requireAdmin/requireReviewer de lib/auth.ts).
 */

export async function requireReviewerOrResponse() {
  const user = await getAuthenticatedAdminUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'Não autenticado.' }, { status: 401 }) };
  }
  return { user, response: null };
}

export async function requireAdminOrResponse() {
  const user = await getAuthenticatedAdminUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: 'Não autenticado.' }, { status: 401 }) };
  }
  if (user.role !== 'admin') {
    return {
      user: null,
      response: NextResponse.json({ error: 'Restrito a administradores.' }, { status: 403 }),
    };
  }
  return { user, response: null };
}
