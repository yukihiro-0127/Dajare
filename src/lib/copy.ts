import type { Lang } from '../types';

export const ui = {
  appTitle: { ja: '恋愛タイプ診断（10タイプ）', en: 'Love Type Diagnosis (10 Types)' },
  disclaimer: {
    ja: '※これは医療・心理の正式診断ではありません。傾向把握のためのセルフリフレクションツールです。データは端末内のみ保存されます。',
    en: 'Disclaimer: This is not a medical or clinical diagnosis. It is a self-reflection tool. Data stays on your device only.'
  }
};

export const t = (lang: Lang, x: { ja: string; en: string }) => x[lang];
