import { useEffect, useMemo, useState } from 'react';
import { dbApi } from '../lib/db';
import { CHARACTER_TYPES, FACTOR_LABELS, type Lang, type QuizSession } from '../types';

export function HistoryPage({ lang }: { lang: Lang }) {
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  useEffect(() => { dbApi.listSessions().then((s) => setSessions(s.sort((a,b) => b.startedAt.localeCompare(a.startedAt)))); }, []);
  const latestTwo = useMemo(() => sessions.slice(0, 2), [sessions]);

  const diff = latestTwo.length === 2 ? Object.keys(latestTwo[0].computed!.factorScores).map((k) => {
    const a = latestTwo[0].computed!.factorScores[k as keyof typeof latestTwo[0]['computed']['factorScores']];
    const b = latestTwo[1].computed!.factorScores[k as keyof typeof latestTwo[1]['computed']['factorScores']];
    return [k, Math.round(a - b)];
  }) : [];

  return <main className="stack"><h2>{lang === 'ja' ? '履歴' : 'History'}</h2>
    {sessions.map((s) => { const type = CHARACTER_TYPES.find((c) => c.id === s.computed?.finalType); return <article key={s.id} className="card"><strong>{lang === 'ja' ? type?.nameJa : type?.nameEn}</strong><small>{new Date(s.startedAt).toLocaleString()}</small><p>{s.note}</p></article>; })}
    <section className="card"><h3>{lang === 'ja' ? '前回との差分' : 'Diff from previous'}</h3>{diff.map(([k,v]) => <div key={k}><label>{FACTOR_LABELS[k as keyof typeof FACTOR_LABELS][lang]} {v > 0 ? '+' : ''}{v}</label><progress max={40} value={Math.abs(v)} /></div>)}</section>
  </main>;
}
