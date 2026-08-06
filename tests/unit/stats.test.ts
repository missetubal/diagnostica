import assert from 'node:assert/strict';
import { computeStreaks } from '@/lib/stats';

// Sem tentativas: sequência zerada.
assert.deepEqual(computeStreaks([], '2026-08-05'), { current: 0, best: 0 });

// Dias consecutivos terminando hoje: sequência atual = recorde.
assert.deepEqual(computeStreaks(['2026-08-03', '2026-08-04', '2026-08-05'], '2026-08-05'), {
  current: 3,
  best: 3,
});

// Última tentativa foi ontem: sequência atual ainda conta (não quebrou hoje).
assert.deepEqual(computeStreaks(['2026-08-03', '2026-08-04'], '2026-08-05'), {
  current: 2,
  best: 2,
});

// Última tentativa foi anteontem: sequência atual zera, recorde permanece.
assert.deepEqual(computeStreaks(['2026-08-02', '2026-08-03'], '2026-08-05'), {
  current: 0,
  best: 2,
});

// Sequência quebrada no meio: recorde é o maior trecho, atual só conta o final.
assert.deepEqual(
  computeStreaks(['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-05'], '2026-08-05'),
  { current: 1, best: 3 },
);

console.log('stats: ok');
