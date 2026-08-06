'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, GraduationCap, Stethoscope } from 'lucide-react';

type Profession = { id: string; name: string };
type Area = { id: string; name: string };
type Difficulty = 'facil' | 'medio' | 'dificil';

type ProfileData = {
  user_type: string | null;
  profession_id: string | null;
  user_areas: Area[];
  preferences: { difficulty: Difficulty | null } | null;
};

const USER_TYPES: {
  value: 'estudante' | 'profissional';
  label: string;
  icon: typeof GraduationCap;
}[] = [
  { value: 'estudante', label: 'Estudante', icon: GraduationCap },
  { value: 'profissional', label: 'Profissional', icon: Stethoscope },
];

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  {
    value: 'facil',
    label: 'Fácil',
    description: 'Condições comuns, apresentação típica, poucos diferenciais.',
  },
  {
    value: 'medio',
    label: 'Médio',
    description: 'Sinais menos óbvios, histórico mais detalhado para interpretar.',
  },
  {
    value: 'dificil',
    label: 'Difícil',
    description: 'Apresentações atípicas, múltiplos diferenciais, poucas pistas óbvias.',
  },
];

const STEP_TITLES = ['Você é…', 'Sua profissão', 'Áreas de interesse', 'Nível de dificuldade'];

function extractErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error;
  }
  return fallback;
}

export default function OnboardingWizard({
  initialProfile,
  professions,
  redirectTo,
}: {
  initialProfile: ProfileData;
  professions: Profession[];
  redirectTo: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(initialProfile.user_type ?? '');
  const [professionId, setProfessionId] = useState(initialProfile.profession_id ?? '');
  const [userAreas, setUserAreas] = useState<string[]>(
    initialProfile.user_areas.map((area) => area.id),
  );
  const [difficulty, setDifficulty] = useState(initialProfile.preferences?.difficulty ?? '');
  const [areas, setAreas] = useState<Area[]>(initialProfile.user_areas);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!professionId) return;
    let cancelled = false;
    fetch(`/api/areas?profession_id=${professionId}`)
      .then((res) => res.json())
      .then((data: Area[]) => {
        if (!cancelled) setAreas(data);
      });
    return () => {
      cancelled = true;
    };
  }, [professionId]);

  const areasLoading = step === 3 && areas.length === 0;

  function toggleArea(areaId: string) {
    setUserAreas((current) =>
      current.includes(areaId) ? current.filter((id) => id !== areaId) : [...current, areaId],
    );
  }

  function canAdvance() {
    if (step === 1) return userType !== '';
    if (step === 2) return professionId !== '';
    if (step === 3) return userAreas.length > 0;
    return difficulty !== '';
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const profileRes = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_type: userType,
          profession_id: professionId,
          user_areas: userAreas,
        }),
      });
      if (!profileRes.ok) {
        throw new Error(extractErrorMessage(await profileRes.json(), 'Erro ao salvar perfil.'));
      }

      const preferencesRes = await fetch('/api/users/me/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      });
      if (!preferencesRes.ok) {
        throw new Error(
          extractErrorMessage(await preferencesRes.json(), 'Erro ao salvar preferências.'),
        );
      }

      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.');
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-6 py-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-[var(--muted)]">
          <span className="font-display font-semibold text-[var(--foreground)]">
            {STEP_TITLES[step - 1]}
          </span>
          <span>{step}/4</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--border)]">
          <div
            className="h-1.5 rounded-full bg-[var(--teal-600)] transition-all"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            {USER_TYPES.map((option) => {
              const Icon = option.icon;
              const active = userType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setUserType(option.value)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left font-medium transition-colors ${
                    active
                      ? 'border-[var(--teal-600)] bg-[var(--teal-600)] text-white'
                      : 'border-[var(--border)] bg-white hover:border-[var(--teal-500)]'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-[var(--teal-600)]'}`} />
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            {professions.map((profession) => (
              <button
                key={profession.id}
                type="button"
                onClick={() => {
                  setProfessionId(profession.id);
                  setUserAreas([]);
                }}
                className={`rounded-2xl border px-4 py-4 text-left font-medium transition-colors ${
                  professionId === profession.id
                    ? 'border-[var(--teal-600)] bg-[var(--teal-600)] text-white'
                    : 'border-[var(--border)] bg-white hover:border-[var(--teal-500)]'
                }`}
              >
                {profession.name}
              </button>
            ))}
            <p className="mt-2 text-sm text-[var(--muted)]">
              Mais profissões em breve: enfermagem, farmácia, nutrição.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-wrap gap-2">
            {areasLoading && <p className="text-sm text-[var(--muted)]">Carregando áreas…</p>}
            {!areasLoading &&
              areas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleArea(area.id)}
                  className={
                    userAreas.includes(area.id)
                      ? 'pill-active px-4 py-2 text-sm'
                      : 'pill px-4 py-2 text-sm'
                  }
                >
                  {area.name}
                </button>
              ))}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3">
            {DIFFICULTIES.map((option) => {
              const active = difficulty === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                    active
                      ? 'border-[var(--teal-600)] bg-[var(--teal-600)] text-white'
                      : 'border-[var(--border)] bg-white hover:border-[var(--teal-500)]'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className={`text-sm ${active ? 'text-teal-50' : 'text-[var(--muted)]'}`}>
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={submitting}
            className="btn-secondary flex-1 py-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>
        )}
        <button
          type="button"
          disabled={!canAdvance() || submitting}
          onClick={() => (step < 4 ? setStep(step + 1) : handleSubmit())}
          className="btn-primary flex-1 py-3"
        >
          {step < 4 ? 'Continuar' : submitting ? 'Salvando…' : 'Começar'}
        </button>
      </div>
    </div>
  );
}
