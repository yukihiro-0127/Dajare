import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data/questions';
import { dbApi } from '../lib/db';
import { calculateResult } from '../lib/scoring';
import type { Lang, QuizAnswer, QuizSession } from '../types';

export function QuizPage({ lang }: { lang: Lang }) {
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  useEffect(() => { dbApi.getDraft().then(setAnswers); }, []);
  const q = QUESTIONS[idx];
  const current = answers.find((a) => a.questionId === q.questionId)?.value;

  const progress = useMemo(() => Math.round((answers.length / QUESTIONS.length) * 100), [answers.length]);

  const setValue = (value: 1 | 2 | 3 | 4 | 5) => {
    const next = [...answers.filter((a) => a.questionId !== q.questionId), { questionId: q.questionId, value }];
    setAnswers(next);
    dbApi.saveDraft(next);
  };

  const submit = async () => {
    const computed = calculateResult(answers);
    const session: QuizSession = {
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      answers,
      computed
    };
    await dbApi.saveSession(session);
    await dbApi.clearDraft();
    sessionStorage.setItem('latest', JSON.stringify(session));
    nav('/result');
  };

  return <main className="card"><p>{lang === 'ja' ? `進捗 ${progress}%` : `Progress ${progress}%`}</p><progress max={100} value={progress} /><h3>{idx + 1}. {q.text[lang]}</h3>
    <div className="likert">{[1,2,3,4,5].map((v) => <button key={v} className={current===v?'active':''} onClick={() => setValue(v as 1|2|3|4|5)}>{v}</button>)}</div>
    <div className="row"><button onClick={() => setIdx((i) => Math.max(0, i - 1))}>{lang === 'ja' ? '戻る' : 'Back'}</button>{idx < QUESTIONS.length - 1 ? <button onClick={() => setIdx((i) => i + 1)}>{lang === 'ja' ? '次へ' : 'Next'}</button> : <button onClick={submit}>{lang === 'ja' ? '結果を見る' : 'View result'}</button>}</div>
  </main>;
}
