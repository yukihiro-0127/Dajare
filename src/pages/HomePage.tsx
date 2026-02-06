import { Link } from 'react-router-dom';
import { CHARACTER_TYPES, type Lang } from '../types';

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <main>
      <div className="card">
        <h2>{lang === 'ja' ? '診断を開始' : 'Start diagnosis'}</h2>
        <p>{lang === 'ja' ? '30問、約5分。結果は根拠付きで表示されます。' : '30 questions, about 5 minutes, with transparent rationale.'}</p>
        <Link to="/quiz" className="cta">{lang === 'ja' ? 'はじめる' : 'Start'}</Link>
      </div>
      <h3>{lang === 'ja' ? '10タイプ一覧' : 'All 10 types'}</h3>
      <div className="grid">{CHARACTER_TYPES.map((c) => <article key={c.id} className="card"><strong>{lang === 'ja' ? c.nameJa : c.nameEn}</strong><p>{lang === 'ja' ? c.shortTagline.ja : c.shortTagline.en}</p><small>{lang === 'ja' ? c.catchPhrase.ja : c.catchPhrase.en}</small></article>)}</div>
    </main>
  );
}
