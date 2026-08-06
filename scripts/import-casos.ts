import fs from 'node:fs';
import path from 'node:path';
import { CaseStatus, SourceType } from '@prisma/client';
import { db } from '@/lib/db';
import { normalizeText } from '@/lib/utils/normalize-text';
import { caseSchema } from '@/lib/validations/case';

/**
 * Importa content/casos/*.json para o banco como rascunhos, prontos para a
 * fila de revisão do painel admin (docs/tasks/03-admin-panel-revisao-casos.md).
 * Idempotente: usa o campo `id` do JSON como Case.slug e pula o que já existe
 * — reimportar não duplica.
 */

async function main() {
  const dir = path.join(process.cwd(), 'content/casos');
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json'));

  let created = 0;
  let skipped = 0;
  let invalid = 0;

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const parsed = caseSchema.safeParse(raw);
    if (!parsed.success) {
      invalid++;
      console.error(`[inválido] ${file}:`, JSON.stringify(parsed.error.flatten()));
      continue;
    }
    const data = parsed.data;

    const existing = await db.case.findUnique({ where: { slug: data.id } });
    if (existing) {
      skipped++;
      continue;
    }

    const area = await db.area.findUnique({ where: { slug: data.area } });
    if (!area) {
      invalid++;
      console.error(`[inválido] ${file}: área "${data.area}" não cadastrada.`);
      continue;
    }

    const professions = await db.profession.findMany({ where: { slug: { in: data.professions } } });
    if (professions.length !== data.professions.length) {
      invalid++;
      console.error(
        `[inválido] ${file}: profissão não cadastrada em [${data.professions.join(', ')}].`,
      );
      continue;
    }

    await db.case.create({
      data: {
        title: data.title,
        slug: data.id,
        objective: data.objective,
        areaId: area.id,
        difficulty: data.difficulty,
        // Forçados independente do JSON — importação manual entra sempre
        // como rascunho humano, revisão decide o destino (ver escopo da tarefa 03).
        sourceType: SourceType.humano,
        status: CaseStatus.rascunho,
        patientProfile: {
          create: { age: data.patient.age, sex: data.patient.sex },
        },
        stages: {
          create: data.stages.map((stage) => ({
            orderIndex: stage.order,
            stageType: stage.type,
            content: stage.content,
          })),
        },
        answers: {
          create: [
            {
              canonicalTerm: data.main_answer.canonical_term,
              answerType: 'correta',
              explanation: data.explanation,
              terms: {
                create: data.main_answer.accepted_terms.map((term) => ({
                  term,
                  normalizedTerm: normalizeText(term),
                })),
              },
            },
            ...data.main_answer.partial_terms.map((term) => ({
              canonicalTerm: term,
              answerType: 'parcialmente_correta' as const,
              explanation: data.explanation,
            })),
          ],
        },
        differentials: { create: data.differentials },
        learningPoints: {
          create: data.learning_points.map((content, index) => ({
            content,
            orderIndex: index + 1,
          })),
        },
        references: {
          create: data.references.map((reference) => ({
            title: reference.title,
            url: reference.url || null,
          })),
        },
        professions: {
          create: professions.map((profession) => ({ professionId: profession.id })),
        },
      },
    });
    created++;
  }

  console.log(
    `Import concluído: ${created} criados, ${skipped} já existiam, ${invalid} inválidos.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
