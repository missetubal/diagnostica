// Ad hoc importer mirroring scripts/import-casos.ts (Prisma engine unavailable
// in this sandbox: binary was built for darwin-arm64, sandbox is linux-arm64).
// Uses the same logic/field mapping as the real script, via raw pg instead of Prisma.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';

const DIAGNOSTICA_DIR = '/sessions/charming-amazing-tesla/mnt/diagnostica';
const DATABASE_URL = fs
  .readFileSync(path.join(DIAGNOSTICA_DIR, '.env'), 'utf8')
  .split('\n')
  .find((l) => l.startsWith('DATABASE_URL='))
  .split('=')
  .slice(1)
  .join('=')
  .trim()
  .replace(/^"|"$/g, '');

function normalizeText(input) {
  return input.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  const dir = path.join(DIAGNOSTICA_DIR, 'content/casos');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));

  let created = 0;
  let skipped = 0;
  let invalid = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));

    const existing = await client.query('select id from cases where slug = $1', [data.id]);
    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    const areaRes = await client.query('select id from areas where slug = $1', [data.area]);
    if (areaRes.rows.length === 0) {
      invalid++;
      console.error(`[invalido] ${file}: area "${data.area}" nao cadastrada.`);
      continue;
    }
    const areaId = areaRes.rows[0].id;

    const profRes = await client.query(
      'select id, slug from professions where slug = any($1::text[])',
      [data.professions],
    );
    if (profRes.rows.length !== data.professions.length) {
      invalid++;
      console.error(
        `[invalido] ${file}: profissao nao cadastrada em [${data.professions.join(', ')}].`,
      );
      continue;
    }

    await client.query('begin');
    try {
      const caseId = crypto.randomUUID();
      await client.query(
        `insert into cases (id, title, slug, objective, area_id, difficulty, source_type, status, version, created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6,'humano','rascunho',1, now(), now())`,
        [caseId, data.title, data.id, data.objective, areaId, data.difficulty],
      );

      await client.query(
        `insert into case_patient_profiles (id, case_id, age, sex) values ($1,$2,$3,$4)`,
        [crypto.randomUUID(), caseId, data.patient.age, data.patient.sex],
      );

      for (const stage of data.stages) {
        await client.query(
          `insert into case_stages (id, case_id, order_index, stage_type, content, is_required, created_at, updated_at)
           values ($1,$2,$3,$4,$5,true, now(), now())`,
          [crypto.randomUUID(), caseId, stage.order, stage.type, stage.content],
        );
      }

      // main answer (correta) + accepted terms
      const mainAnswerId = crypto.randomUUID();
      await client.query(
        `insert into case_answers (id, case_id, canonical_term, answer_type, explanation, created_at, updated_at)
         values ($1,$2,$3,'correta',$4, now(), now())`,
        [mainAnswerId, caseId, data.main_answer.canonical_term, data.explanation],
      );
      for (const term of data.main_answer.accepted_terms) {
        await client.query(
          `insert into accepted_answer_terms (id, answer_id, term, normalized_term) values ($1,$2,$3,$4)`,
          [crypto.randomUUID(), mainAnswerId, term, normalizeText(term)],
        );
      }

      // partial terms as separate answers
      for (const term of data.main_answer.partial_terms) {
        await client.query(
          `insert into case_answers (id, case_id, canonical_term, answer_type, explanation, created_at, updated_at)
           values ($1,$2,$3,'parcialmente_correta',$4, now(), now())`,
          [crypto.randomUUID(), caseId, term, data.explanation],
        );
      }

      for (const d of data.differentials) {
        await client.query(
          `insert into case_differentials (id, case_id, name, explanation) values ($1,$2,$3,$4)`,
          [crypto.randomUUID(), caseId, d.name, d.explanation],
        );
      }

      let lpIndex = 1;
      for (const lp of data.learning_points) {
        await client.query(
          `insert into case_learning_points (id, case_id, content, order_index) values ($1,$2,$3,$4)`,
          [crypto.randomUUID(), caseId, lp, lpIndex++],
        );
      }

      for (const ref of data.references) {
        await client.query(
          `insert into case_references (id, case_id, title, url) values ($1,$2,$3,$4)`,
          [crypto.randomUUID(), caseId, ref.title, ref.url || null],
        );
      }

      for (const prof of profRes.rows) {
        await client.query(`insert into case_professions (case_id, profession_id) values ($1,$2)`, [
          caseId,
          prof.id,
        ]);
      }

      await client.query('commit');
      created++;
    } catch (e) {
      await client.query('rollback');
      invalid++;
      console.error(`[erro] ${file}:`, e.message);
    }
  }

  console.log(
    `Import concluido: ${created} criados, ${skipped} ja existiam, ${invalid} invalidos.`,
  );
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
