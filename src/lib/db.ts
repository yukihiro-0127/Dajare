import { openDB } from 'idb';
import type { AppSettings, Person, QuizSession, RelationshipLog } from '../types';

const DB_NAME = 'love-diagnosis-db';

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore('sessions', { keyPath: 'id' });
    db.createObjectStore('people', { keyPath: 'id' });
    db.createObjectStore('relations', { keyPath: 'id' });
    db.createObjectStore('settings', { keyPath: 'key' });
    db.createObjectStore('drafts', { keyPath: 'key' });
  }
});

export const dbApi = {
  async saveSession(session: QuizSession) { return (await dbPromise).put('sessions', session); },
  async listSessions(): Promise<QuizSession[]> { return (await dbPromise).getAll('sessions'); },
  async savePerson(person: Person) { return (await dbPromise).put('people', person); },
  async listPeople(): Promise<Person[]> { return (await dbPromise).getAll('people'); },
  async saveRelation(log: RelationshipLog) { return (await dbPromise).put('relations', log); },
  async listRelations(): Promise<RelationshipLog[]> { return (await dbPromise).getAll('relations'); },
  async saveSettings(settings: AppSettings) { return (await dbPromise).put('settings', { key: 'app', ...settings }); },
  async getSettings(): Promise<AppSettings | undefined> {
    const v = await (await dbPromise).get('settings', 'app');
    return v ? { lang: v.lang, theme: 'light' } : undefined;
  },
  async saveDraft(answers: QuizSession['answers']) { return (await dbPromise).put('drafts', { key: 'quiz', answers }); },
  async getDraft(): Promise<QuizSession['answers']> {
    const v = await (await dbPromise).get('drafts', 'quiz');
    return v?.answers ?? [];
  },
  async clearDraft() { return (await dbPromise).delete('drafts', 'quiz'); }
};
