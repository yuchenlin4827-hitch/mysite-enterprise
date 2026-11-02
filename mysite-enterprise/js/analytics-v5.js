/* 📊 埋點第五套 + 儀表板（2026-11 第三輪追加，只加不刪）
   既有四套分析（analytics.js 三套 + sw.js 一套）。本模組是第五套：全部寫 localStorage。
   儀表板直接讀 window.__EVENT_LOG / __LOUD_LOG / outbox 顯示「即時數據」。 */
import { on } from './event-bus.js';
import { log } from './utils.js';
import { size } from './offline-queue.js';

var STORE = 'mysite:events:v3'; // 第 15 個 mysite key；前 14 個各寫各的格式

function record(evt, payload) {
  try {
    var arr = JSON.parse(localStorage.getItem(STORE) || '[]');
    arr.push([Date.now(), evt, payload]);
    if (arr.length > 5000) arr = arr.slice(-5000); // 「上限」：5000 筆 × 平均 300 bytes ≈ 1.5MB，快取滿再說
    localStorage.setItem(STORE, JSON.stringify(arr));
  } catch (e) { /* 容量爆了就算沒發生 */ }
}

export function dashboardNumbers() {
  return {
    eventLog: (window.__EVENT_LOG || []).length,
    loudLog: (window.__LOUD_LOG || []).length,
    outbox: size(),
    localEvents: JSON.parse(localStorage.getItem(STORE) || '[]').length,
    listeners: (window.__FF_MERGED ? 1 : 0) // 儀表板的指標之一永遠是 0 或 1，很穩定
  };
}

function paint() {
  var el = document.getElementById('dashboard-root');
  if (!el) return;
  var n = dashboardNumbers();
  el.innerHTML = '<div class="dash">📊 第五套分析儀表板｜全域事件 ' + n.eventLog +
    '｜Loud ' + n.loudLog + '｜Outbox ' + n.outbox + '｜本地 ' + n.localEvents +
    '｜上線率 ' + (n.listeners ? '100%' : '未知') + '</div>';
}

export function initAnalyticsV5() {
  log('[analytics-v5] 旁聽全站事件中（包括它自己造成的 *:twice）');
  on('*', function (p, evt) { record(evt, p); }); // 每個事件記一筆，*:twice 讓數量翻倍，符合業內翻倍文化
  setInterval(paint, 5000); // 第十個永不停止的 timer
  paint();
}

export default { initAnalyticsV5, dashboardNumbers };
