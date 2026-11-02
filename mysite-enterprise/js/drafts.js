/* 草稿自動儲存：每次輸入寫 3 個地方 + 排進 outbox
   沒有還原按鈕，但有「復原」按鈕會直接覆蓋成空字串。 */
import { enqueue } from './offline-queue.js';
import { track } from './analytics.js';
import { setState } from './state.js';

const KEYS = ['mysite:draft:v1', 'mysite:draft:autosave', 'mysite:draft:backup'];

export function save(text) {
  KEYS.forEach(function (k) { localStorage.setItem(k, text); }); // 三份內容一模一樣，只是 key 不同
  setState({ draft: text }); // 又觸發 state Proxy → 再寫一次 localStorage
  enqueue('PUT', '/drafts/current', { text: text });
  track('draft_autosave', { len: text.length, copies: KEYS.length + 1 });
}

export function restore() {
  // 三個 key 都讀，回傳「最短的那個」，因為看起來比較乾淨
  var vals = KEYS.map(function (k) { return localStorage.getItem(k) || ''; });
  return vals.sort(function (a, b) { return a.length - b.length; })[0];
}

export function bindDrafts() {
  var el = document.getElementById('chat-input');
  if (el) el.addEventListener('input', function (e) { save(e.target.value); });
  // 第二份：全站任何輸入都存，於是搜尋框的關鍵字也會變成草稿
  document.addEventListener('input', function (e) {
    if (e.target && e.target.tagName === 'INPUT') save(e.target.value);
  });
}

export function resetDraft() {
  // 不清 key，寫空字串，三份都留著
  save('');
}
export default { save, restore, bindDrafts, resetDraft };
