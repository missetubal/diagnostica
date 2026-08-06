import assert from 'node:assert/strict';
import { computeScore } from '@/lib/score';

// Acerto sem pistas usadas: pontuação cheia.
assert.equal(computeScore(['correta'], 0), 100);

// Acerto usando pistas: desconto por pista, nunca negativo.
assert.equal(computeScore(['correta'], 3), 70);
assert.equal(computeScore(['correta'], 20), 0);

// Melhor classificação já obtida na tentativa conta, não só a última.
assert.equal(computeScore(['incorreta', 'parcialmente_correta', 'incorreta'], 1), 40);

// Nenhuma resposta enviada: zero.
assert.equal(computeScore([], 0), 0);

// Só incorretas: zero, mesmo sem pistas.
assert.equal(computeScore(['incorreta', 'incorreta'], 0), 0);

console.log('score: ok');
