import { useEffect, useMemo, useState } from 'react';
import { dbApi } from '../lib/db';
import { CHARACTER_TYPES, type Lang, type Person, type RelationshipLog, type TypeId } from '../types';

export function PeoplePage({ lang }: { lang: Lang }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [logs, setLogs] = useState<RelationshipLog[]>([]);
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const [partnerType, setPartnerType] = useState<TypeId>('T1');
  const [personId, setPersonId] = useState('');
  const [memo, setMemo] = useState('');

  const reload = () => {
    dbApi.listPeople().then(setPeople);
    dbApi.listRelations().then(setLogs);
  };
  useEffect(reload, []);

  const filtered = useMemo(() => people.filter((p) => p.nickname.toLowerCase().includes(q.toLowerCase())), [people, q]);

  const addPerson = async () => {
    if (!name) return;
    await dbApi.savePerson({ id: crypto.randomUUID(), nickname: name, createdAt: new Date().toISOString(), tags: [] });
    setName(''); reload();
  };

  const addLog = async () => {
    if (!personId) return;
    const latest = JSON.parse(sessionStorage.getItem('latest') || '{}');
    if (!latest.id) return;
    await dbApi.saveRelation({ id: crypto.randomUUID(), personId, sessionId: latest.id, partnerType, memo });
    setMemo(''); reload();
  };

  return <main className="stack"><h2>{lang === 'ja' ? '人物管理' : 'People'}</h2>
    <section className="card"><input placeholder={lang==='ja'?'ニックネーム':'Nickname'} value={name} onChange={(e)=>setName(e.target.value)} /><button onClick={addPerson}>{lang === 'ja' ? '追加' : 'Add'}</button></section>
    <section className="card"><input placeholder={lang==='ja'?'検索':'Search'} value={q} onChange={(e)=>setQ(e.target.value)} />
      {filtered.map((p) => <div key={p.id}>{p.nickname}</div>)}</section>
    <section className="card"><h3>{lang==='ja'?'関係ログ':'Relationship log'}</h3><select value={personId} onChange={(e)=>setPersonId(e.target.value)}><option value="">{lang==='ja'?'相手を選択':'Select person'}</option>{people.map((p)=><option key={p.id} value={p.id}>{p.nickname}</option>)}</select>
      <select value={partnerType} onChange={(e)=>setPartnerType(e.target.value as TypeId)}>{CHARACTER_TYPES.map((t)=><option key={t.id} value={t.id}>{lang==='ja'?t.nameJa:t.nameEn}</option>)}</select>
      <textarea value={memo} onChange={(e)=>setMemo(e.target.value)} placeholder={lang==='ja'?'関係メモ':'Memo'} />
      <button onClick={addLog}>{lang==='ja'?'保存':'Save'}</button>
      {logs.map((l)=><p key={l.id}>{people.find((p)=>p.id===l.personId)?.nickname} - {CHARACTER_TYPES.find((t)=>t.id===l.partnerType)?.nameJa}: {l.memo}</p>)}
    </section></main>;
}
