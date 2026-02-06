export type Lang = 'ja' | 'en';

export type FactorKey =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8';

export const FACTOR_LABELS: Record<FactorKey, { ja: string; en: string }> = {
  F1: { ja: '親密回避', en: 'Avoidance' },
  F2: { ja: '不安傾向', en: 'Anxiety' },
  F3: { ja: '追求性', en: 'Chase' },
  F4: { ja: '安定志向', en: 'Stability' },
  F5: { ja: '刺激志向', en: 'Novelty' },
  F6: { ja: 'ケア志向', en: 'Care' },
  F7: { ja: '主導性', en: 'Leadership' },
  F8: { ja: '境界線', en: 'Boundary' }
};

export type TypeId =
  | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9' | 'T10';

export interface CharacterType {
  id: TypeId;
  nameJa: string;
  nameEn: string;
  shortTagline: { ja: string; en: string };
  coreNeed: { ja: string; en: string };
  loveLanguages: { ja: string[]; en: string[] };
  redFlag: { ja: string; en: string };
  growthTip: { ja: string; en: string };
  catchPhrase: { ja: string; en: string };
  vector: Record<FactorKey, number>;
}

export interface Question {
  questionId: string;
  text: { ja: string; en: string };
  weights: Partial<Record<FactorKey, -2 | -1 | 1 | 2>>;
}

export interface QuizAnswer { questionId: string; value: 1 | 2 | 3 | 4 | 5; }

export interface QuizSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  answers: QuizAnswer[];
  computed?: {
    factorScores: Record<FactorKey, number>;
    typeScores: Record<TypeId, number>;
    finalType: TypeId;
    runnerUpTypes: TypeId[];
    topFactors: FactorKey[];
    consistency: number;
  };
  note?: string;
}

export interface Person {
  id: string;
  nickname: string;
  tags?: string[];
  createdAt: string;
}

export interface RelationshipLog {
  id: string;
  personId: string;
  sessionId: string;
  partnerType: TypeId;
  startedAt?: string;
  endedAt?: string;
  memo?: string;
  rating?: number;
}

export interface AppSettings { lang: Lang; theme: 'light'; }

export const CHARACTER_TYPES: CharacterType[] = [
  { id: 'T1', nameJa: '安定ドライブ', nameEn: 'Anchor', shortTagline: { ja: '続く関係を丁寧に作る。', en: 'Builds lasting love with consistency.' }, coreNeed: { ja: '予測可能性と信頼', en: 'Predictability and trust' }, loveLanguages: { ja: ['行動', '時間'], en: ['Acts', 'Quality time'] }, redFlag: { ja: '安全志向が強すぎて停滞する', en: 'Over-optimizes for safety and stagnates' }, growthTip: { ja: '月1回は新しい体験を入れる', en: 'Schedule one novel date each month' }, catchPhrase: { ja: '継続は愛なり。', en: 'Consistency is my love language.' }, vector: { F1: 30, F2: 25, F3: 35, F4: 88, F5: 20, F6: 58, F7: 62, F8: 80 } },
  { id: 'T2', nameJa: '情熱ハンター', nameEn: 'Chaser', shortTagline: { ja: '熱量で関係を前進させる。', en: 'Moves love forward with momentum.' }, coreNeed: { ja: '手応えと高揚感', en: 'Momentum and excitement' }, loveLanguages: { ja: ['言葉', '時間'], en: ['Words', 'Quality time'] }, redFlag: { ja: '追いすぎて相手の余白を奪う', en: 'Pushes too hard, leaving no space' }, growthTip: { ja: '返信を待つルールを自分に作る', en: 'Set a delay rule before follow-ups' }, catchPhrase: { ja: '動かなきゃ始まらない。', en: 'No move, no story.' }, vector: { F1: 35, F2: 48, F3: 90, F4: 25, F5: 84, F6: 44, F7: 60, F8: 52 } },
  { id: 'T3', nameJa: 'ケア職人', nameEn: 'Caretaker', shortTagline: { ja: '相手の日常を整える達人。', en: 'Nurtures through thoughtful support.' }, coreNeed: { ja: '必要とされる実感', en: 'Feeling needed and appreciated' }, loveLanguages: { ja: ['行動', '言葉'], en: ['Acts', 'Words'] }, redFlag: { ja: '自己犠牲で疲弊しやすい', en: 'Self-sacrifices and burns out' }, growthTip: { ja: '先に自分の限界を共有する', en: 'Name your limits before helping' }, catchPhrase: { ja: '大丈夫？手伝おうか。', en: 'Let me take care of that.' }, vector: { F1: 28, F2: 58, F3: 35, F4: 62, F5: 38, F6: 90, F7: 48, F8: 35 } },
  { id: 'T4', nameJa: '合理設計者', nameEn: 'Architect', shortTagline: { ja: '関係の運用設計が得意。', en: 'Designs relationships like systems.' }, coreNeed: { ja: '明確な合意と効率', en: 'Clear agreements and efficiency' }, loveLanguages: { ja: ['時間', '行動'], en: ['Quality time', 'Acts'] }, redFlag: { ja: '正しさ優先で温度を落とす', en: 'Lets correctness kill warmth' }, growthTip: { ja: '結論の前に感情を1文添える', en: 'Validate feelings before solutions' }, catchPhrase: { ja: '設計すれば続く。', en: 'Structure creates freedom.' }, vector: { F1: 45, F2: 25, F3: 40, F4: 70, F5: 30, F6: 35, F7: 90, F8: 90 } },
  { id: 'T5', nameJa: 'ロマン共鳴', nameEn: 'Resonator', shortTagline: { ja: '感情の共鳴を最優先する。', en: 'Leads with emotional resonance.' }, coreNeed: { ja: '心の同期', en: 'Emotional synchronization' }, loveLanguages: { ja: ['言葉', 'スキンシップ'], en: ['Words', 'Touch'] }, redFlag: { ja: '不安から確認が増える', en: 'Seeks reassurance too often' }, growthTip: { ja: '確認の前に事実を3つ書く', en: 'List three facts before checking' }, catchPhrase: { ja: '同じ気持ちでいたい。', en: 'Feel with me, not just for me.' }, vector: { F1: 25, F2: 72, F3: 52, F4: 40, F5: 58, F6: 82, F7: 42, F8: 28 } },
  { id: 'T6', nameJa: '自由航海', nameEn: 'Explorer', shortTagline: { ja: '自由と変化で愛を育てる。', en: 'Thrives on autonomy and novelty.' }, coreNeed: { ja: '自由と発見', en: 'Autonomy and discovery' }, loveLanguages: { ja: ['時間', '体験'], en: ['Quality time', 'Experiences'] }, redFlag: { ja: '責任分担が曖昧になりやすい', en: 'Avoids commitments and logistics' }, growthTip: { ja: '最低限の約束事を明文化', en: 'Define a minimal commitment baseline' }, catchPhrase: { ja: 'まずやってみよう。', en: 'Let’s see where this goes.' }, vector: { F1: 68, F2: 35, F3: 55, F4: 22, F5: 92, F6: 40, F7: 52, F8: 58 } },
  { id: 'T7', nameJa: '壁厚ガード', nameEn: 'Fortress', shortTagline: { ja: '守りを固めて信頼を選ぶ。', en: 'Protects peace with strong boundaries.' }, coreNeed: { ja: '心理的安全性', en: 'Psychological safety' }, loveLanguages: { ja: ['行動', '時間'], en: ['Acts', 'Quality time'] }, redFlag: { ja: '距離を取りすぎて誤解される', en: 'Comes off distant or cold' }, growthTip: { ja: '週1回は感情を言語化する', en: 'Share one feeling weekly' }, catchPhrase: { ja: '急がず見極める。', en: 'Trust is earned slowly.' }, vector: { F1: 90, F2: 18, F3: 32, F4: 58, F5: 28, F6: 20, F7: 55, F8: 92 } },
  { id: 'T8', nameJa: '共闘パートナー', nameEn: 'Teammate', shortTagline: { ja: '二人で課題を解く実務派。', en: 'Treats love as a cooperative project.' }, coreNeed: { ja: '公平さと連携', en: 'Fairness and teamwork' }, loveLanguages: { ja: ['行動', '時間'], en: ['Acts', 'Quality time'] }, redFlag: { ja: 'ロマン不足と言われる', en: 'Can feel practical over romantic' }, growthTip: { ja: '達成だけでなく感謝も言う', en: 'Celebrate emotion, not only outcomes' }, catchPhrase: { ja: '一緒に作戦立てよう。', en: 'Same team, same map.' }, vector: { F1: 38, F2: 25, F3: 45, F4: 80, F5: 35, F6: 58, F7: 66, F8: 78 } },
  { id: 'T9', nameJa: '火花トリックスター', nameEn: 'Spark', shortTagline: { ja: '瞬発力で空気を変える。', en: 'Creates chemistry with playful surprise.' }, coreNeed: { ja: '刺激と反応', en: 'Excitement and feedback' }, loveLanguages: { ja: ['言葉', '体験'], en: ['Words', 'Experiences'] }, redFlag: { ja: '安定フェーズが苦手', en: 'Struggles with routine maintenance' }, growthTip: { ja: '週次で関係の振り返りをする', en: 'Run a weekly relationship check-in' }, catchPhrase: { ja: '退屈は敵。', en: 'Keep it electric.' }, vector: { F1: 20, F2: 45, F3: 84, F4: 20, F5: 95, F6: 42, F7: 58, F8: 32 } },
  { id: 'T10', nameJa: '再起動フェニックス', nameEn: 'Phoenix', shortTagline: { ja: '変化を糧に再設計できる。', en: 'Rebuilds love through adaptive growth.' }, coreNeed: { ja: '再挑戦できる余地', en: 'Room to reset and grow' }, loveLanguages: { ja: ['言葉', '行動'], en: ['Words', 'Acts'] }, redFlag: { ja: '過去反省が自己批判に寄る', en: 'Turns reflection into self-criticism' }, growthTip: { ja: '進捗を小さく祝う習慣を作る', en: 'Reward small progress consistently' }, catchPhrase: { ja: '何度でも更新できる。', en: 'Version up, not give up.' }, vector: { F1: 42, F2: 55, F3: 52, F4: 55, F5: 55, F6: 62, F7: 60, F8: 82 } }
];
