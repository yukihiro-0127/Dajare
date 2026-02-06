import { CHARACTER_TYPES, type FactorKey, type QuizAnswer, type TypeId } from '../types';
import { QUESTIONS } from '../data/questions';

const FACTORS: FactorKey[] = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'];

export function computeFactorScores(answers: QuizAnswer[]): Record<FactorKey, number> {
  const raw = Object.fromEntries(FACTORS.map((f) => [f, 0])) as Record<FactorKey, number>;
  const maxAbs = Object.fromEntries(FACTORS.map((f) => [f, 0])) as Record<FactorKey, number>;

  QUESTIONS.forEach((q) => {
    const ans = answers.find((a) => a.questionId === q.questionId);
    const x = (ans?.value ?? 3) - 3;
    FACTORS.forEach((f) => {
      const w = q.weights[f] ?? 0;
      raw[f] += w * x;
      maxAbs[f] += Math.abs(w) * 2;
    });
  });

  return FACTORS.reduce((acc, f) => {
    const normalized = ((raw[f] + maxAbs[f]) / (2 * maxAbs[f])) * 100;
    acc[f] = Math.max(0, Math.min(100, Number.isFinite(normalized) ? Number(normalized.toFixed(1)) : 50));
    return acc;
  }, {} as Record<FactorKey, number>);
}

export function computeTypeScores(factors: Record<FactorKey, number>): Record<TypeId, number> {
  const entries = CHARACTER_TYPES.map((t) => {
    const dist = Math.sqrt(
      FACTORS.reduce((sum, f) => sum + ((factors[f] - t.vector[f]) / 100) ** 2, 0)
    );
    const score = Number((100 - Math.min(100, dist * 42)).toFixed(1));
    return [t.id, score] as const;
  });
  return Object.fromEntries(entries) as Record<TypeId, number>;
}

export function topFactors(factors: Record<FactorKey, number>): FactorKey[] {
  return [...FACTORS].sort((a, b) => factors[b] - factors[a]).slice(0, 3);
}

export function evaluateConsistency(answers: QuizAnswer[]): number {
  const get = (id: string) => answers.find((a) => a.questionId === id)?.value ?? 3;
  const pairs: Array<[string, string]> = [['Q1', 'Q15'], ['Q4', 'Q28'], ['Q8', 'Q14'], ['Q6', 'Q22']];
  const mismatch = pairs.reduce((acc, [a, b]) => acc + Math.abs(get(a) - get(b)), 0);
  return Math.max(0, 100 - mismatch * 10);
}

export function calculateResult(answers: QuizAnswer[]) {
  const factorScores = computeFactorScores(answers);
  const typeScores = computeTypeScores(factorScores);
  const sorted = Object.entries(typeScores).sort((a, b) => b[1] - a[1]) as [TypeId, number][];

  return {
    factorScores,
    typeScores,
    finalType: sorted[0][0],
    runnerUpTypes: [sorted[1][0], sorted[2][0]],
    topFactors: topFactors(factorScores),
    consistency: evaluateConsistency(answers)
  };
}
