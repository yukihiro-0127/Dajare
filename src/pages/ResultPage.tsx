import { useMemo, useState } from 'react';
import { CHARACTER_TYPES, FACTOR_LABELS, type Lang, type QuizSession, type TypeId } from '../types';
import { getCompatibility } from '../lib/compatibility';
import { dbApi } from '../lib/db';

export function ResultPage({ lang }: { lang: Lang }) {
  const [note, setNote] = useState('');
  const latest = sessionStorage.getItem('latest');
  if (!latest) return <main className="card">No result yet.</main>;
  const session = JSON.parse(latest) as QuizSession;
  const me = CHARACTER_TYPES.find((t) => t.id === session.computed?.finalType)!;
  const [partner, setPartner] = useState<TypeId>('T1');
  const compat = getCompatibility(me.id, partner);

  const top = useMemo(() => session.computed?.topFactors ?? [], [session]);

  const saveNote = async () => {
    const next = { ...session, note };
    await dbApi.saveSession(next);
    sessionStorage.setItem('latest', JSON.stringify(next));
  };

  const shareCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720; canvas.height = 380;
    const c = canvas.getContext('2d')!;
    c.fillStyle = '#fff6ef'; c.fillRect(0,0,720,380);
    c.fillStyle = '#222'; c.font = 'bold 34px sans-serif'; c.fillText(me.nameJa + ' / ' + me.nameEn, 24, 80);
    c.font = '20px sans-serif'; c.fillText(me.catchPhrase[lang], 24, 130);
    c.fillText(`Top: ${top.map((f) => FACTOR_LABELS[f].en).join(', ')}`, 24, 180);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href = url; a.download = 'love-type-card.png'; a.click();
  };

  return <main className="stack">
    <section className="card"><h2>{lang === 'ja' ? me.nameJa : me.nameEn}</h2><p>{me.shortTagline[lang]}</p><p>{lang === 'ja' ? '主要因子TOP3' : 'Top 3 factors'}: {top.map((f) => FACTOR_LABELS[f][lang]).join(', ')}</p>
    <p>{lang === 'ja' ? `強み: ${me.coreNeed.ja}。注意点: ${me.redFlag.ja}` : `Strength: ${me.coreNeed.en}. Risk: ${me.redFlag.en}`}</p>
    <p>{lang === 'ja' ? `一貫性チェック: ${session.computed?.consistency}点` : `Consistency check: ${session.computed?.consistency}`}</p>
    <button onClick={shareCard}>{lang === 'ja' ? '結果カード画像を保存' : 'Save share card'}</button></section>
    <section className="card"><h3>{lang === 'ja' ? '因子スコア' : 'Factor scores'}</h3>{Object.entries(session.computed?.factorScores ?? {}).map(([k, v]) => <div key={k}><label>{FACTOR_LABELS[k as keyof typeof FACTOR_LABELS][lang]} {v}</label><progress max={100} value={v} /></div>)}</section>
    <section className="card"><h3>{lang === 'ja' ? '相性診断' : 'Compatibility'}</h3><select value={partner} onChange={(e) => setPartner(e.target.value as TypeId)}>{CHARACTER_TYPES.map((t) => <option key={t.id} value={t.id}>{lang === 'ja' ? t.nameJa : t.nameEn}</option>)}</select><p>{compat.grade}</p><p>{lang === 'ja' ? compat.reasonJa : compat.reasonEn}</p><small>{lang === 'ja' ? compat.tipsJa : compat.tipsEn}</small></section>
    <section className="card"><h3>{lang === 'ja' ? '今回のメモ' : 'Session note'}</h3><textarea value={note} onChange={(e) => setNote(e.target.value)} /><button onClick={saveNote}>{lang === 'ja' ? '保存' : 'Save'}</button></section>
  </main>;
}
