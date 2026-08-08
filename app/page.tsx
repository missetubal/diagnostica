import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Bot, CalendarDays, Layers, Stethoscope } from 'lucide-react';
import { db } from '@/lib/db';
import { getDeviceId } from '@/lib/device-id';
import EducationalDisclaimer from '@/components/educational-disclaimer';

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: 'Diagnóstico progressivo',
    description: 'Pistas reveladas aos poucos, no seu ritmo.',
  },
  {
    icon: CalendarDays,
    title: 'Desafio diário',
    description: 'Um caso por dia, igual para sua profissão.',
  },
  {
    icon: Bot,
    title: 'Casos por IA',
    description: 'Conteúdo revisado por humanos antes de publicar.',
  },
];

export default async function LandingPage() {
  const deviceId = await getDeviceId();
  const user = deviceId ? await db.user.findUnique({ where: { deviceId } }) : null;

  if (user?.onboardingCompletedAt) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--teal-600)] text-white">
          <Stethoscope className="h-7 w-7" />
        </span>
        <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight">Diagnostica</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Pratique raciocínio clínico com casos interativos personalizados para sua profissão e
          nível.
        </p>

        <Link href="/onboarding" className="btn-primary mt-6 w-full">
          Começar a praticar
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-2 text-xs text-[var(--muted)]">Sem cadastro. Comece em segundos.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3">
        {HIGHLIGHTS.map((highlight) => (
          <div key={highlight.title} className="card flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--teal-50)] text-[var(--teal-600)]">
              <highlight.icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{highlight.title}</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{highlight.description}</p>
            </div>
          </div>
        ))}
      </div>

      <EducationalDisclaimer className="mt-8" />
    </div>
  );
}
