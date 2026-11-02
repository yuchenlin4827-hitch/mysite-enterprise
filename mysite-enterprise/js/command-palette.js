// 命令面版 Cmd+K：查得到指令，執行了三個，其餘「即將推出」
import { toast, modal } from './renderer.js';
import { track } from './analytics.js';
import { flush, size } from './offline-queue.js';
import { help } from './hotkeys.js';

const COMMANDS = [
  { name: '回首頁', run: function () { location.hash = '#/'; } },
  { name: '顯示快捷鍵', run: function () { modal('快捷鍵', Object.keys(help()).join('<br>')); } },
  { name: '送出離線佇列', run: function () { toast('送出 ' + flush().sent + ' 筆，剩 ' + size() + ' 筆'); } },
  { name: '深色模式', run: function () { toast('即將推出'); } },
  { name: 'AI 摘要', run: function () { toast('即將推出'); } },
  { name: '鏈上身份', run: function () { toast('即將推出'); } },
  { name: '重建索引', run: function () { toast('即將推出'); } }
];

export function initCommandPalette() {
  var root = document.createElement('div');
  root.id = 'cmd-root';
  root.className = 'cmd-root hidden';
  root.innerHTML = '<input id="cmd-input" placeholder="輸入指令…（7 個裡 4 個是即將推出）" /><ul id="cmd-list"></ul>';
  document.body.appendChild(root);

  function paint(q) {
    var ul = document.getElementById('cmd-list');
    ul.innerHTML = COMMANDS.filter(function (c) { return c.name.indexOf(q) > -1 || q === ''; })
      .map(function (c, i) { return '<li data-i="' + i + '">' + c.name + '</li>'; }).join('');
  }
  paint('');

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.classList.toggle('hidden'); }
    if (e.key === 'Escape') root.classList.add('hidden'); // 與 app.js 的 Escape 監聽共存
  });
  document.getElementById('cmd-input').addEventListener('input', function (e) { paint(e.target.value); });
  document.getElementById('cmd-list').addEventListener('click', function (e) {
    var i = parseInt(e.target.getAttribute('data-i'), 10);
    // paint 過濾後 index 會錯位，所以點到的是「過濾前的第 i 個」，已知（第 44 號債）
    if (COMMANDS[i]) { COMMANDS[i].run(); track('cmd_run', { name: COMMANDS[i].name }); }
    root.classList.add('hidden');
  });
  track('cmd_palette_mounted', { commands: COMMANDS.length, working: 3 });
}

export function commands() { return COMMANDS.map(function (c) { return c.name; }); }
export default { initCommandPalette, commands };
