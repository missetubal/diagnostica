'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Profession = { id: string; name: string };
type Area = { id: string; name: string };
type Difficulty = 'facil' | 'medio' | 'dificil';

type ProfileData = {
  user_type: string | null;
  profession_id: string | null;
  user_areas: Area[];
  preferences: { difficulty: Difficulty | null } | null;
};

const USER_TYPES: { value: 'estudante' | 'profissional'; label: string }[] = [
  { value: 'estudante', label: 'Estudante' },
  { value: 'profissional', label: 'Profissional' },
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
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
          <span>{STEP_TITLES[step - 1]}</span>
          <span>{step}/4</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-1.5 rounded-full bg-zinc-950 transition-all dark:bg-zinc-50"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="flex flex-col gap-3">
            {USER_TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setUserType(option.value)}
                className={`rounded-xl border px-4 py-4 text-left font-medium transition-colors ${
                  userType === option.value
                    ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {option.label}
              </button>
            ))}
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
                className={`rounded-xl border px-4 py-4 text-left font-medium transition-colors ${
                  professionId === profession.id
                    ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {profession.name}
              </button>
            ))}
            <p className="mt-2 text-sm text-zinc-500">
              Mais profissões em breve: enfermagem, farmácia, nutrição.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-wrap gap-2">
            {areasLoading && <p className="text-sm text-zinc-500">Carregando áreas…</p>}
            {!areasLoading &&
              areas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleArea(area.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    userAreas.includes(area.id)
                      ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {area.name}
                </button>
              ))}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3">
            {DIFFICULTIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                  difficulty === option.value
                    ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-black'
                    : 'border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div
                  className={`text-sm ${
                    difficulty === option.value ? 'text-zinc-300' : 'text-zinc-500'
                  }`}
                >
                  {option.description}
                </div>
              </button>
            ))}
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
            className="flex-1 rounded-full border border-zinc-200 py-3 font-medium disabled:opacity-50 dark:border-zinc-800"
          >
            Voltar
          </button>
        )}
        <button
          type="button"
          disabled={!canAdvance() || submitting}
          onClick={() => (step < 4 ? setStep(step + 1) : handleSubmit())}
          className="flex-1 rounded-full bg-zinc-950 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-black"
        >
          {step < 4 ? 'Continuar' : submitting ? 'Salvando…' : 'Começar'}
        </button>
      </div>
    </div>
  );
}
