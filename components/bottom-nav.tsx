'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/dashboard', label: 'Início' },
  { href: '/perfil', label: 'Perfil' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
              active ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
