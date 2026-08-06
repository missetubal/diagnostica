import assert from 'node:assert/strict';
import { matchAnswer, type CaseAnswerForMatching } from '@/lib/classify-answer';
import { normalizeText } from '@/lib/utils/normalize-text';

const answers: CaseAnswerForMatching[] = [
  {
    answerType: 'correta',
    canonicalTerm: 'infarto agudo do miocárdio com supradesnivelamento do segmento ST',
    explanation: 'Explicação completa do diagnóstico.',
    terms: [
      { normalizedTerm: normalizeText('iam com supra') },
      { normalizedTerm: normalizeText('infarto com supradesnivelamento do st') },
    ],
  },
  {
    answerType: 'parcialmente_correta',
    canonicalTerm: 'síndrome coronariana aguda',
    explanation: 'Explicação completa do diagnóstico.',
    terms: [],
  },
  {
    answerType: 'parcialmente_correta',
    canonicalTerm: 'infarto agudo do miocárdio',
    explanation: 'Explicação completa do diagnóstico.',
    terms: [],
  },
];

// Sinônimo aceito classifica como correta e devolve a explicação.
const bySynonym = matchAnswer(answers, 'IAM com supra');
assert.equal(bySynonym.classification, 'correta');
assert.equal(bySynonym.feedback, 'Explicação completa do diagnóstico.');

// Termo canônico em si também conta como correta.
const byCanonical = matchAnswer(answers, 'Infarto Agudo do Miocárdio com Supradesnivelamento do Segmento ST');
assert.equal(byCanonical.classification, 'correta');

// Termo parcial nunca revela a explicação completa (critério de aceite da tarefa 04).
const partial = matchAnswer(answers, 'síndrome coronariana aguda');
assert.equal(partial.classification, 'parcialmente_correta');
assert.notEqual(partial.feedback, 'Explicação completa do diagnóstico.');

// Termo de outra área cai em incorreta, sem falso positivo.
const wrong = matchAnswer(answers, 'refluxo gastroesofágico');
assert.equal(wrong.classification, 'incorreta');
assert.notEqual(wrong.feedback, 'Explicação completa do diagnóstico.');

console.log('classify-answer: ok');
