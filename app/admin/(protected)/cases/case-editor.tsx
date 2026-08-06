'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { answerTypeSchema, type AdminCaseInput } from '@/lib/validations/admin-case';
import { difficultySchema, sourceTypeSchema, stageTypeSchema } from '@/lib/validations/case';
import { saveCase } from './actions';

interface Option {
  id: string;
  name: string;
}

/**
 * Shape do formulário: igual a AdminCaseInput, exceto `answers[].terms`, que
 * vira um campo de texto separado por vírgula — react-hook-form's useFieldArray
 * só suporta arrays de objetos, não arrays de string aninhados dentro de outro
 * array dinâmico.
 */
type AnswerFormValues = Omit<AdminCaseInput['answers'][number], 'terms'> & { termsText: string };
type CaseFormValues = Omit<AdminCaseInput, 'answers'> & { answers: AnswerFormValues[] };

function toFormValues(data: AdminCaseInput): CaseFormValues {
  return {
    ...data,
    answers: data.answers.map(({ terms, ...answer }) => ({
      ...answer,
      termsText: terms.join(', '),
    })),
  };
}

const EMPTY_VALUES: CaseFormValues = toFormValues({
  title: '',
  slug: '',
  objective: '',
  areaId: '',
  professionIds: [],
  difficulty: 'medio',
  sourceType: 'humano',
  patient: { age: 0, sex: '', context: '', relevantInformation: '' },
  stages: [{ orderIndex: 1, stageType: 'queixa_principal', content: '', isRequired: true }],
  answers: [{ canonicalTerm: '', answerType: 'correta', explanation: '', terms: [] }],
  differentials: [],
  learningPoints: [],
  references: [],
});

export function CaseEditor({
  caseId,
  initialData,
  areas,
  professions,
}: {
  caseId: string | null;
  initialData: AdminCaseInput | null;
  areas: Option[];
  professions: Option[];
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CaseFormValues>({
    defaultValues: initialData ? toFormValues(initialData) : EMPTY_VALUES,
  });

  const stages = useFieldArray({ control, name: 'stages' });
  const answers = useFieldArray({ control, name: 'answers' });
  const differentials = useFieldArray({ control, name: 'differentials' });
  const learningPoints = useFieldArray({ control, name: 'learningPoints' });
  const references = useFieldArray({ control, name: 'references' });

  async function onSubmit(data: CaseFormValues) {
    setSubmitError(null);
    const payload: AdminCaseInput = {
      ...data,
      answers: data.answers.map(({ termsText, ...answer }) => ({
        ...answer,
        terms: termsText
          .split(',')
          .map((term) => term.trim())
          .filter(Boolean),
      })),
    };

    try {
      const savedId = await saveCase(caseId, payload);
      if (!caseId) {
        router.push(`/admin/cases/${savedId}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro ao salvar caso.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8 text-sm">
      <section className="space-y-3">
        <h2 className="font-semibold text-[var(--foreground)]">Geral</h2>

        <Field label="Título">
          <input {...register('title', { required: true })} className="input" />
        </Field>

        <Field label="Slug">
          <input {...register('slug', { required: true })} className="input" />
        </Field>

        <Field label="Objetivo">
          <textarea {...register('objective', { required: true })} rows={2} className="input" />
        </Field>

        <Field label="Área">
          <select {...register('areaId', { required: true })} className="input">
            <option value="">Selecione</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Profissões">
          <div className="flex flex-wrap gap-3">
            {professions.map((profession) => (
              <label key={profession.id} className="flex items-center gap-1">
                <input type="checkbox" value={profession.id} {...register('professionIds')} />
                {profession.name}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Dificuldade">
          <select {...register('difficulty')} className="input">
            {difficultySchema.options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Origem">
          <select {...register('sourceType')} className="input">
            {sourceTypeSchema.options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Idade do paciente">
            <input
              type="number"
              {...register('patient.age', { valueAsNumber: true })}
              className="input"
            />
          </Field>
          <Field label="Sexo do paciente">
            <input {...register('patient.sex')} className="input" />
          </Field>
        </div>
        <Field label="Contexto do paciente (opcional)">
          <input {...register('patient.context')} className="input" />
        </Field>
        <Field label="Informação relevante (opcional)">
          <input {...register('patient.relevantInformation')} className="input" />
        </Field>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--foreground)]">Etapas</h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              stages.append({
                orderIndex: stages.fields.length + 1,
                stageType: 'historia',
                content: '',
                isRequired: true,
              })
            }
          >
            + Etapa
          </button>
        </div>
        {stages.fields.map((field, index) => (
          <div key={field.id} className="card space-y-2">
            <div className="grid grid-cols-[80px_1fr_auto] gap-2">
              <input
                type="number"
                {...register(`stages.${index}.orderIndex`, { valueAsNumber: true })}
                className="input"
              />
              <select {...register(`stages.${index}.stageType`)} className="input">
                {stageTypeSchema.options.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <button type="button" className="btn-danger" onClick={() => stages.remove(index)}>
                Remover
              </button>
            </div>
            <textarea {...register(`stages.${index}.content`)} rows={2} className="input" />
            <label className="flex items-center gap-1">
              <input type="checkbox" {...register(`stages.${index}.isRequired`)} />
              Obrigatória
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--foreground)]">Respostas</h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              answers.append({ canonicalTerm: '', answerType: 'correta', explanation: '', termsText: '' })
            }
          >
            + Resposta
          </button>
        </div>
        {answers.fields.map((field, index) => (
          <div key={field.id} className="card space-y-2">
            <div className="grid grid-cols-[1fr_180px_auto] gap-2">
              <input
                {...register(`answers.${index}.canonicalTerm`)}
                placeholder="Termo canônico"
                className="input"
              />
              <select {...register(`answers.${index}.answerType`)} className="input">
                {answerTypeSchema.options.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <button type="button" className="btn-danger" onClick={() => answers.remove(index)}>
                Remover
              </button>
            </div>
            <textarea
              {...register(`answers.${index}.explanation`)}
              placeholder="Explicação"
              rows={2}
              className="input"
            />
            <Field label="Termos sinônimos aceitos (separados por vírgula)">
              <input {...register(`answers.${index}.termsText`)} className="input" />
            </Field>
          </div>
        ))}
      </section>

      <ListSection
        title="Diferenciais"
        addLabel="+ Diferencial"
        onAdd={() => differentials.append({ name: '', explanation: '', relevance: '' })}
        fields={differentials.fields}
        onRemove={differentials.remove}
        renderItem={(index) => (
          <>
            <input {...register(`differentials.${index}.name`)} placeholder="Nome" className="input" />
            <textarea
              {...register(`differentials.${index}.explanation`)}
              placeholder="Explicação"
              rows={2}
              className="input"
            />
            <input
              {...register(`differentials.${index}.relevance`)}
              placeholder="Relevância (opcional)"
              className="input"
            />
          </>
        )}
      />

      <ListSection
        title="Pontos de aprendizagem"
        addLabel="+ Ponto"
        onAdd={() => learningPoints.append({ content: '' })}
        fields={learningPoints.fields}
        onRemove={learningPoints.remove}
        renderItem={(index) => (
          <input {...register(`learningPoints.${index}.content`)} className="input" />
        )}
      />

      <ListSection
        title="Referências"
        addLabel="+ Referência"
        onAdd={() => references.append({ title: '', url: '', referenceType: '', accessedAt: '' })}
        fields={references.fields}
        onRemove={references.remove}
        renderItem={(index) => (
          <>
            <input {...register(`references.${index}.title`)} placeholder="Título" className="input" />
            <input {...register(`references.${index}.url`)} placeholder="URL (opcional)" className="input" />
          </>
        )}
      />

      {submitError && <p className="text-red-600">{submitError}</p>}

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Salvando...' : 'Salvar caso'}
      </button>
    </form>
  );
}

function ListSection<T extends { id: string }>({
  title,
  addLabel,
  onAdd,
  fields,
  onRemove,
  renderItem,
}: {
  title: string;
  addLabel: string;
  onAdd: () => void;
  fields: T[];
  onRemove: (index: number) => void;
  renderItem: (index: number) => React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--foreground)]">{title}</h2>
        <button type="button" className="btn-secondary" onClick={onAdd}>
          {addLabel}
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="card space-y-2">
          {renderItem(index)}
          <button type="button" className="btn-danger" onClick={() => onRemove(index)}>
            Remover
          </button>
        </div>
      ))}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-[var(--muted)]">{label}</label>
      {children}
    </div>
  );
}
