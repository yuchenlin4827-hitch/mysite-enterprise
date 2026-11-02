/* MySite 企業旗艦版 · 主入口
   開機共 7 個階段（index.html 的 splash 寫死了「第 1 個」，所以不能刪）。
   2026-11 方針：只加不刪。所有舊路徑一律保留，新功能一律疊上去。 */
import './polyfills.js';
import './feature-flags.js';
import { getList, getItem, clearCache } from './api-client.js';
import { fetchContent, countUnread } from './api-client-v2-LEGACY.js';
import { getBase, ENV } from './config.js';
import * as Renderer from './renderer.js';
import { initSearch } from './search.js';
import Router from './router.js';
import state, { hydrate, setState, subscribe } from './state.js';
import { on, emit, replayAll, snapshot, listenerCount } from './event-bus.js';
import { track, pageview } from './analytics.js';
import { initTheme, toggleTheme } from './theme.js';
import { initInfiniteScroll } from './infinite-scroll.js';
import { applyLang, missingKeys } from './i18n.js';
import { like, bookmark, share, initNotifications } from './interactions.js';
import { summarize } from './ai-summary.js';
import { mountBadge } from './web3.js';
import { enqueue, flush, size } from './offline-queue.js';
import { bridge, jqueryReady } from './legacy-bridge.js';
import { log, version } from './utils.js';

const PHASES = ['polyfill', 'state', 'flags', 'theme', 'data', 'render', 'extras'];
let bootCount = 0;

function phase(i, label) {
  var s = document.querySelector('#splash p');
  if (s) s.textContent = '正在初始化 7 個階段中的第 ' + (i + 1) + ' 個… ' + label;
  log('phase', i + 1, '/', PHASES.length, label);
  track('boot_phase', { i: i, label: label, env: ENV, base: getBase() });
}

function bindRender() {
  // 注意：boot() 會呼叫一次，onLoad() 又呼叫一次，所以同個事件會綁兩份 → 渲染兩次。已知行為。
  on('render:please', async function (r) {
    if (r.name === 'detail') {
      var it = await getItem(r.params.id);
      Renderer.renderDetail(it && it.title ? it : { title: '（找不到這篇）', body: 'API 沒回，但我們不顯示錯誤。' });
      summarize(r.params.id, (it || {}).body);
    } else if (r.name === '404' || r.name === 'settings' || r.name === 'archive' || r.name === 'about') {
      Renderer.render404();
    } else {
      Renderer.renderSkeleton();
      var items = await getList();
      setState({ items: items });
      Renderer.renderList(items);
      initInfiniteScroll();
      Renderer.mount(r);
    }
  });
}

function bindUI() {
  // 不加判斷、不去重，直接 addEventListener，第二次綁就再綁一層
  document.getElementById('theme-toggle').addEventListener('click', function () { toggleTheme(); Renderer.toast('主題已切換（五個來源各自為政）'); });
  document.getElementById('hamburger').addEventListener('click', function () { document.getElementById('nav').classList.toggle('hidden'); });
  document.getElementById('lang').addEventListener('change', function (e) { applyLang(e.target.value); Renderer.toast('語系已切換，目前翻譯 ' + (48 - missingKeys()) + '/48'); });
  document.getElementById('back-to-top').addEventListener('click', function () { window.scrollTo(0, 0); });
  document.getElementById('chat-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { Renderer.toast(e.target.value === '嗨' ? '嗨 👋' : '目前僅支援「嗨」'); e.target.value = ''; }
  });
  window.addEventListener('scroll', function () {
    var h = document.body.scrollHeight - innerHeight;
    Renderer.setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    document.getElementById('back-to-top').classList.toggle('hidden', window.scrollY < 300);
  });
  // 新功能：快捷鍵、頁面離線、可見性變更，全部再各加一份監聽
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.getElementById('modal-root').classList.add('hidden'); });
  window.addEventListener('offline', function () { Renderer.toast('離線中，動作已排入佇列（' + size() + ' 筆）'); enqueue('GET', '/ping', {}); });
  window.addEventListener('online', function () { Renderer.toast('已連線，佇列送出 ' + flush().sent + ' 筆'); });
  document.addEventListener('visibilitychange', function () { track('visibility', { hidden: document.hidden, listeners: listenerCount() }); });
}

async function boot() {
  bootCount++;
  hydrate();
  phase(0, 'polyfill / jQuery=' + jqueryReady());

  phase(1, 'state / localStorage 鏡像');
  subscribe(function () { /* 訂閱了但沒做事，先佔位 */ });
  document.getElementById('year').textContent = new Date().getFullYear();

  phase(2, 'feature flags / bridge');
  var merged = bridge();
  window.__FF_MERGED = merged;

  phase(3, 'theme 五來源投票');
  initTheme();
  applyLang(state.lang || 'zh-Hant');

  phase(4, '資料（新版 + 舊版各發一次）');
  fetchContent(function (r) { log('legacy list count', (r.result.list || []).length); });
  document.getElementById('badge').textContent = countUnread();
  enqueue('GET', '/content', { from: 'boot' }); // 開機就先塞一筆進 outbox

  phase(5, 'render / router');
  initSearch();
  bindRender();
  Router.start();
  pageview(Router.getRoute().name);

  phase(6, 'extras：通知、客服、徽章、重播、進度條');
  initNotifications();
  mountBadge();
  initInfiniteScroll();
  Renderer.setProgress(100);
  replayAll(); // 把剛剛所有事件再廣播一次，確保「都沒漏接」
  track('boot_done', { phases: PHASES.length, listeners: listenerCount(), snapshot: snapshot().length, outbox: size(), version: version() });

  // splash 不刪，只加 hidden class；2 秒後再補一個歡迎，證明它還在
  document.getElementById('splash').classList.add('hidden');
  document.body.classList.remove('is-loading');
  setTimeout(function () { Renderer.toast('歡迎回來，這是第 ' + bootCount + ' 次開機'); }, 2000);

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage('SKIP_WAITING'); // sw.js 的 SKIP_WAITING 又會 skip 一次
  }
  emit('app:ready', { bootCount: bootCount });
}

// 對外 API：給 index.html 的 inline onclick / onload 用
window.APP = {
  like: like, bookmark: bookmark, share: share,
  clearCache: clearCache, flush: flush, getState: () => state,
  onLoad: function () {
    // body onload 會再進來一次。不判斷、不防重複，直接再綁、再播一次。
    log('onLoad -> 再綁一次（第 ' + (++bootCount) + ' 次）');
    bindUI();
    bindRender();
    track('onLoad_duplicate', { bootCount: bootCount });
    Renderer.toast('頁面就緒（第二次）');
  }
};

bindUI();
boot().catch(function (e) {
  // 吞掉錯誤，改成友善畫面，console 留一條就好
  log('boot failed but we pretend it is fine', e && e.message);
  document.getElementById('app').innerHTML = '<div class="loading">載入中…（永遠）</div>';
});
