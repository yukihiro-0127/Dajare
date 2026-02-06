import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../data/questions';
import { calculateResult, computeFactorScores } from '../lib/scoring';

describe('scoring', () => {
  it('normalizes factors to 0-100', () => {
    const answers = QUESTIONS.map((q) => ({ questionId: q.questionId, value: 5 as const }));
    const factors = computeFactorScores(answers);
    Object.values(factors).forEach((v) => expect(v).toBeGreaterThanOrEqual(0));
    Object.values(factors).forEach((v) => expect(v).toBeLessThanOrEqual(100));
  });

  it('returns final and runner-up types', () => {
    const answers = QUESTIONS.map((q, i) => ({ questionId: q.questionId, value: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5 }));
    const res = calculateResult(answers);
    expect(res.finalType).toBeDefined();
    expect(res.runnerUpTypes).toHaveLength(2);
    expect(res.topFactors).toHaveLength(3);
  });
});
