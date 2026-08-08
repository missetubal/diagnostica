'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, CalendarDays, TrendingUp, User } from 'lucide-react';

const ITEMS = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/play', label: 'Praticar', icon: Activity },
  { href: '/daily', label: 'Diário', icon: CalendarDays },
  { href: '/progress', label: 'Progresso', icon: TrendingUp },
  { href: '/onboarding?edit=1', label: 'Perfil', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                active ? 'text-[var(--teal-600)]' : 'text-[var(--muted)]'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
