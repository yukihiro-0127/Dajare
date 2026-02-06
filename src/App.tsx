import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { PeoplePage } from './pages/PeoplePage';
import { useEffect, useState } from 'react';
import type { AppSettings, Lang } from './types';
import { dbApi } from './lib/db';
import { t, ui } from './lib/copy';
import './styles.css';

export function App() {
  const [lang, setLang] = useState<Lang>('ja');

  useEffect(() => {
    dbApi.getSettings().then((s) => s && setLang(s.lang));
  }, []);

  const onLang = (next: Lang) => {
    setLang(next);
    dbApi.saveSettings({ lang: next, theme: 'light' } as AppSettings);
  };

  return (
    <div className="container">
      <header className="top">
        <h1>{t(lang, ui.appTitle)}</h1>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/quiz">Quiz</Link>
          <Link to="/history">History</Link>
          <Link to="/people">People</Link>
        </nav>
        <div>
          <button onClick={() => onLang('ja')} className={lang === 'ja' ? 'active' : ''}>日本語</button>
          <button onClick={() => onLang('en')} className={lang === 'en' ? 'active' : ''}>EN</button>
        </div>
      </header>
      <p className="disclaimer">{t(lang, ui.disclaimer)}</p>
      <Routes>
        <Route path="/home" element={<HomePage lang={lang} />} />
        <Route path="/quiz" element={<QuizPage lang={lang} />} />
        <Route path="/result" element={<ResultPage lang={lang} />} />
        <Route path="/history" element={<HistoryPage lang={lang} />} />
        <Route path="/people" element={<PeoplePage lang={lang} />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}
