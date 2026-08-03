import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Cliente Supabase para uso em Server Components / Route Handlers.
 * Usado apenas para autenticar o painel administrativo (reviewer/admin) —
 * não há autenticação de usuário final no MVP (ver docs/sugestao-arquitetura.md, seção 10).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component sem permissão de escrita
            // em cookies — seguro ignorar quando há middleware renovando a sessão.
          }
        },
      },
    },
  );
}
