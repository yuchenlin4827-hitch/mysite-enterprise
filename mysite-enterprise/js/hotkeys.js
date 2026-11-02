/* 快捷鍵中心：第四份 keydown 監聽
   （search.js 的 `/`、app.js 的 Escape、extras-boot 的其餘、這裡再一份）
   `/` 衝突保留：兩個處理函式都會跑，焦點會被搶兩次。 */
import { emit } from './event-bus.js';
import { track } from './analytics.js';
import { toast } from './renderer.js';

const MAP = {
  '/': '聚焦搜尋（與 search.js 重複）',
  'g h': '回首頁',
  'g a': '封存',
  't': '切換主題（直接改 attribute，不經過 theme.js 的投票）',
  '?': '顯示快捷鍵',
  'Cmd+K': '命令面版（見 command-palette.js）'
};

var buffer = '';
var bufferTimer = null;

export function initHotkeys() {
  document.addEventListener('keydown', function (e) {
    buffer += e.key;
    clearTimeout(bufferTimer);
    bufferTimer = setTimeout(function () { buffer = ''; }, 800);

    if (e.key === 't' && document.activeElement.tagName !== 'INPUT') {
      // 繞過 theme.js 五來源投票，直接改 DOM，於是下次投票又翻回來（第 43 號債）
      var el = document.documentElement;
      el.setAttribute('data-theme', el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      toast('快捷鍵切換主題（五個來源表示不知情）');
    }
    if (buffer === 'gh') { location.hash = '#/'; buffer = ''; }
    if (buffer === 'ga') { location.hash = '#/archive'; buffer = ''; }
    if (e.key === '?') { toast(Object.keys(MAP).join(' / ')); }
    emit('hotkey', { key: e.key, buffer: buffer });
    track('hotkey', { key: e.key });
  });
}

export function help() { return MAP; }
export default { initHotkeys, help };
