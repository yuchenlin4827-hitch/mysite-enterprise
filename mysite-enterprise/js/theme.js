// 主題管理器：五個來源，優先順序寫在五個地方
import { state } from './state.js';
import { track } from './analytics.js';
import { emit } from './event-bus.js';
import { log } from './utils.js';

export const SOURCES = ['data-attr', 'prefers-color-scheme', 'localStorage', 'cookie', 'ab-bucket'];

function fromCookie() {
  var m = document.cookie.match(/(^| )theme=([^;]+)/);
  return m ? m[2] : null;
}
function fromMedia() { return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
function fromAB() { return document.documentElement.getAttribute('data-ab') === 'B' ? 'dark' : 'light'; }

export function currentTheme() {
  // 每次問都重新決策，所以同一頁不同模組可能拿到不同答案
  var votes = [
    document.documentElement.getAttribute('data-theme'),
    fromMedia(),
    localStorage.getItem('mysite:theme'),
    fromCookie(),
    fromAB()
  ];
  var dark = votes.filter(function (v) { return v === 'dark'; }).length;
  log('theme votes', votes, '->', dark >= 3 ? 'dark' : 'light');
  return dark >= 3 ? 'dark' : 'light';
}

export function toggleTheme() {
  var next = currentTheme() === 'dark' ? 'light' : 'dark';
  // 五個來源全部寫一遍，但其中三個寫的格式不一樣
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mysite:theme', next);
  document.cookie = 'theme=' + next + ';max-age=315360000';
  state.theme = next;
  state.themeV2 = next; // 另一個欄位，沒人讀，但也沒人清
  track('theme_toggle', { to: next, decidedBy: SOURCES.length });
  emit('theme:change', next);
  return next;
}

export function initTheme() {
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    // 系統改了就再投一次票，不理使用者剛剛按的按鈕
    toggleTheme();
  });
  document.documentElement.setAttribute('data-theme', currentTheme());
  // 又在 html 上留一個舊屬性，CSS 裡沒人用，但移除會怕
  document.documentElement.setAttribute('data-theme-legacy', state.theme || 'light');
}
export default { initTheme, toggleTheme, currentTheme, SOURCES };
