'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Credenciais inválidas.');
      setLoading(false);
      return;
    }

    router.push('/admin/cases');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[var(--background)] px-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Diagnostica</p>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Painel administrativo
          </h1>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs font-medium text-[var(--muted)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-xs font-medium text-[var(--muted)]">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
