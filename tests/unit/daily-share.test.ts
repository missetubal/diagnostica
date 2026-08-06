import assert from 'node:assert/strict';
import { buildShareText } from '@/lib/daily-share';

const base = { dateLabel: '05/08', areaName: 'Cardiologia', totalStages: 4 };

// Acerto com 2 pistas: 3 quadrados revelados (etapa 1 + 2 pistas), resto vazio.
const correct = buildShareText({ ...base, hintsUsed: 2, classification: 'correta' });
assert.equal(correct.includes('🟩🟩🟩⬜'), true);
assert.equal(correct.includes('✅ Resolvido'), true);
assert.equal(correct.includes('2 pistas usadas'), true);

// Nunca menciona diagnóstico/explicação — a função nem recebe esse dado.
assert.equal(/refluxo|infarto|diagnóstico esperado/i.test(correct), false);

// Uma pista usada: singular correto ("pista usada", não "pistas usadas").
const oneHint = buildShareText({ ...base, hintsUsed: 1, classification: 'correta' });
assert.equal(oneHint.includes('🟩🟩⬜⬜'), true);
assert.equal(oneHint.includes('1 pista usada'), true);

// Zero pistas: só a etapa inicial revelada, plural ("0 pistas usadas").
const noHints = buildShareText({ ...base, hintsUsed: 0, classification: 'correta' });
assert.equal(noHints.includes('🟩⬜⬜⬜'), true);
assert.equal(noHints.includes('0 pistas usadas'), true);

// Incorreto e parcial usam rótulos distintos.
assert.equal(
  buildShareText({ ...base, hintsUsed: 3, classification: 'incorreta' }).includes(
    '❌ Não resolvido',
  ),
  true,
);
assert.equal(
  buildShareText({ ...base, hintsUsed: 3, classification: 'parcialmente_correta' }).includes(
    '🟨 Quase lá',
  ),
  true,
);

console.log('daily-share: ok');
