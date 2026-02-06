import { CHARACTER_TYPES, type TypeId } from '../types';

export type CompatGrade = 'High' | 'Medium' | 'Low';
export interface CompatEntry {
  grade: CompatGrade;
  reasonJa: string;
  reasonEn: string;
  tipsJa: string;
  tipsEn: string;
}

const byId = Object.fromEntries(CHARACTER_TYPES.map((t) => [t.id, t]));

function gradePair(a: TypeId, b: TypeId): CompatEntry {
  const A = byId[a].vector;
  const B = byId[b].vector;
  const anxietyAvoidRisk = (A.F2 + B.F2) / 2 + (A.F1 + B.F1) / 2;
  const careBoundaryGap = Math.abs((A.F6 + B.F6) / 2 - (A.F8 + B.F8) / 2);
  const stabilitySync = 100 - Math.abs(A.F4 - B.F4);

  let grade: CompatGrade = 'Medium';
  if (stabilitySync > 70 && anxietyAvoidRisk < 95) grade = 'High';
  if (anxietyAvoidRisk > 120 || careBoundaryGap > 35) grade = 'Low';

  if ((a === 'T2' && b === 'T9') || (a === 'T9' && b === 'T2')) grade = 'Medium';
  if ((a === 'T3' && b === 'T7') || (a === 'T7' && b === 'T3')) grade = 'Low';
  if ((a === 'T1' && b === 'T8') || (a === 'T8' && b === 'T1')) grade = 'High';

  return {
    grade,
    reasonJa: `補完は「${Math.round((A.F6 + B.F8) / 2)}点」、衝突リスクは「${Math.round(anxietyAvoidRisk / 2)}点」。良い時は役割分担が明確、悪い時は追う/逃げる構図で疲弊しやすい。`,
    reasonEn: `Complement score is ${Math.round((A.F6 + B.F8) / 2)}, while friction risk is ${Math.round(anxietyAvoidRisk / 2)}. At best, roles are clear; at worst, a pursue-withdraw cycle appears.`,
    tipsJa: '週1回「良かった点/気になった点/次に試す行動」を3分で共有すると安定しやすい。',
    tipsEn: 'Run a 3-minute weekly check-in: wins, tensions, and one experiment for next week.'
  };
}

export const COMPAT_MATRIX: Record<TypeId, Record<TypeId, CompatEntry>> = CHARACTER_TYPES.reduce((acc, t) => {
  acc[t.id] = CHARACTER_TYPES.reduce((inner, o) => {
    inner[o.id] = gradePair(t.id, o.id);
    return inner;
  }, {} as Record<TypeId, CompatEntry>);
  return acc;
}, {} as Record<TypeId, Record<TypeId, CompatEntry>>);

export const getCompatibility = (selfType: TypeId, partnerType: TypeId) => COMPAT_MATRIX[selfType][partnerType];
