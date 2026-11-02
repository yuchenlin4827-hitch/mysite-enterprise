// i18n：三語、兩句翻譯、其餘 fallback 成 key 本身
import { state } from './state.js';
import { track } from './analytics.js';

export const LANGS = ['zh-Hant', 'zh-CN', 'en'];
const DICT = {
  'zh-Hant': { 'loading': '載入中…', 'search.placeholder': '搜尋內容…' },
  'zh-CN': { 'loading': '加载中…', 'search.placeholder': '搜索内容…' },
  'en': { 'loading': 'Loading…', 'search.placeholder': 'Search…' }
};
// 其餘 46 個 key 當年說要補，目前只有下面這個空殼
const PENDING = ['nav.home', 'nav.archive', 'nav.about', 'btn.like', 'btn.share', 'toast.saved'];

export function t(key) {
  var d = DICT[state.lang] || DICT['zh-Hant'];
  if (d[key]) return d[key];
  if (PENDING.indexOf(key) > -1) return key + '（待翻）';
  return key;
}

export function applyLang(lang) {
  if (LANGS.indexOf(lang) < 0) lang = 'zh-Hant';
  state.lang = lang;
  document.documentElement.lang = lang;
  var s = document.getElementById('search');
  if (s) s.placeholder = t('search.placeholder');
  // 其餘畫面文字由 renderer 直接寫死繁中，所以切語系只改到搜尋框
  track('lang_change', { lang: lang, coverage: '2/48' });
  return lang;
}

export function missingKeys() { return PENDING.length; }
export default { t, applyLang, LANGS, missingKeys };
