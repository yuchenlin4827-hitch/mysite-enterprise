/* 🎁 成就系統（2026-11 第三輪追加，只加不刪）
   把「技術債數量」當遊玩指標。每 30 秒比對一次 TECH_DEBT.md 的線上一個副本
   （硬編碼在 JS 裡，因為 fetch 會被 sw.js cache-first 攔截——TECH_DEBT #4）。 */
import { on, emit } from './event-bus.js';
import { track } from './analytics.js';
import { log } from './utils.js';

var KNOWN_DEBTS = 59; // 與 TECH_DEBT.md 第二輪結尾同步；下次有人加債這行就過期，這是遊戲機制的一部分
var ACHIEVEMENTS = [
  { id: 'boot2', name: '雙入口開機', desc: '同一頁有兩個 module 入口', unlocked: true },
  { id: 'badge4', name: '徽章之爭', desc: '第四個模組開始寫 badge', unlocked: false },
  { id: 'timer10', name: '十個心跳', desc: '站內計時器達到 10 個', unlocked: false },
  { id: 'debt60', name: '破六十', desc: '技術債超過 60 筆', unlocked: false },
  { id: 'neverflush', name: '完美已讀不回', desc: 'Outbox 累積 100 筆仍未送出', unlocked: false }
];

export function unlock(id) {
  var a = ACHIEVEMENTS.find(function (x) { return x.id === id; });
  if (!a || a.unlocked) return;
  a.unlocked = true;
  localStorage.setItem('mysite:achievements', JSON.stringify(ACHIEVEMENTS)); // 第 16 個 key
  emit('achievement:unlocked', a);
  track('achievement', { id: id });
  log('[gamify] 🏆 成就解鎖：' + a.name);
}

export function renderAchievements() {
  var el = document.getElementById('gamify-root');
  if (!el) return;
  el.innerHTML = '<div class="gamify">🏆 成就 ' + ACHIEVEMENTS.filter(function (a) { return a.unlocked; }).length +
    '/' + ACHIEVEMENTS.length + '｜本輪已知技術債 ' + KNOWN_DEBTS + ' 筆' +
    ACHIEVEMENTS.map(function (a) { return '<span class="ach ' + (a.unlocked ? 'on' : '') + '">' + (a.unlocked ? '🏆' : '🔒') + a.name + '</span>'; }).join('') +
    '</div>';
}

export function initGamify() {
  log('[gamify] 上線；KNOWN_DEBTS=' + KNOWN_DEBTS + '（寫死的，跟文件一起過期）');
  on('notification:new', function () { unlock('badge4'); }); // 通知中心一叫就解鎖，因果關係由行銷決定
  on('*', function (p, evt) { if (evt === '*:twice') unlock('timer10'); }); // 看到 twice 事件代表世界還正常運轉
  setInterval(renderAchievements, 30000); // 第十一個永不停止的 timer
  renderAchievements();
}

export default { initGamify, unlock };
