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
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/admin/cases">Casos</Link>
          <Link href="/admin/reports">Reportes</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span>
            {user.email ?? user.id} · {user.role}
          </span>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
