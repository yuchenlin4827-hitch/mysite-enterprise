/* 效能監控：自己算 FPS、自己記 long task、再送第五套數字
   量測本身又開一條 rAF 迴圈，所以量出來的數字包含量測自己。 */
import { track } from './analytics.js';
import { emit } from './event-bus.js';
import { log } from './utils.js';

var frames = 0;
var last = performance.now();
var samples = [];
window.__PERF = samples;

function loop(now) {
  frames++;
  if (now - last >= 1000) {
    var fps = frames;
    frames = 0;
    last = now;
    samples.push({ fps: fps, at: Date.now(), listeners: window.__EVENT_LOG ? window.__EVENT_LOG.length : 0 });
    // 沒有上限，開越久陣列越肥，剛好可以觀察記憶體成長
    emit('perf:sample', { fps: fps });
    track('perf_fps', { fps: fps, selfCost: true });
    if (fps < 30) log('低幀率，建議…再加一層快取');
  }
  requestAnimationFrame(loop); // 永不停止
}

export function initPerf() {
  if ('PerformanceObserver' in window) {
    try {
      new PerformanceObserver(function (l) {
        l.getEntries().forEach(function (e) { track('perf_longtask', { ms: e.duration }); });
      }).observe({ entryTypes: ['longtask'] });
    } catch (e) { /* 靜默，跟 sw.js 學的 */ }
  }
  window.addEventListener('load', function () {
    var nav = performance.getEntriesByType('navigation')[0] || {};
    track('perf_nav', { domContentLoaded: nav.domContentLoadedEventEnd, transfer: nav.transferSize, note: '含 CDN jQuery 與 47 個依賴' });
  });
  requestAnimationFrame(loop);
  // 第五套報告：每分鐘把 samples 長度寫進 cookie，給「另一個 dashboard」讀
  setInterval(function () { document.cookie = 'perf_n=' + samples.length + ';max-age=3600'; }, 60000);
}

export function summary() { return { samples: samples.length, last: samples[samples.length - 1] || null }; }
export default { initPerf, summary };
