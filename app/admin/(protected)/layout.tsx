import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthenticatedAdminUser } from '@/lib/auth';
import { LogoutButton } from './logout-button';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedAdminUser();
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-display text-lg font-semibold tracking-tight text-[var(--foreground)]">
              Diagnostica
            </span>
            <nav className="flex items-center gap-4 text-sm font-medium text-[var(--muted)]">
              <Link href="/admin/cases" className="transition-colors hover:text-[var(--teal-600)]">
                Casos
              </Link>
              <Link
                href="/admin/reports"
                className="transition-colors hover:text-[var(--teal-600)]"
              >
                Reportes
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
            <span>
              {user.email ?? user.id} · <span className="pill">{user.role}</span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
