import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

/**
 * No MVP, autenticação via Supabase Auth só existe para o painel administrativo
 * (papéis `reviewer` e `admin`). Jogar não exige conta — ver seção 10 de
 * docs/sugestao-arquitetura.md.
 */
export async function getAuthenticatedAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const user = await db.user.findUnique({
    where: { authUserId: authUser.id },
  });

  if (!user || (user.role !== 'reviewer' && user.role !== 'admin')) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await getAuthenticatedAdminUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Acesso restrito a administradores.');
  }
  return user;
}

export async function requireReviewer() {
  const user = await getAuthenticatedAdminUser();
  if (!user) {
    throw new Error('Acesso restrito a revisores ou administradores.');
  }
  return user;
}
