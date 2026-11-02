/* 分析層：三套 SDK + 一套自研 pixel + sw.js 裡還有第四套。
   index.html 用 <script async> 載這份（classic），會 SyntaxError；
   app.js / renderer.js / search.js 用 import 載同一份（module），會成功。
   兩種載入方式並存，報表因此有兩份「使用者」。 */
import { log, uid } from './utils.js';
import { emitLoud } from './event-bus.js';

const QUEUE = [];
const SID = uid();
window.__ANALYTICS_QUEUE = QUEUE; // 給除錯用，也給別人誤用

function push(row) {
  QUEUE.push(row);
  // 沒有上限、沒有 flush 條件，只有頁面關掉才送（而且送不出去）
}

export function track(evt, props) {
  var row = { sid: SID, evt: evt, props: props || {}, ts: Date.now(), ab: document.documentElement.getAttribute('data-ab') };
  push(row);
  log('track', evt, row.props);
  emitLoud('analytics:event', row);
  // 第一套：自建 pixel
  var img = new Image();
  img.src = 'https://analytics.mysite.internal/px?e=' + encodeURIComponent(evt) + '&s=' + SID;
  // 第二套：sendBeacon（離線時靜默丟棄，沒重試）
  if (navigator.sendBeacon) navigator.sendBeacon('https://ga-collector.mysite.internal/b', JSON.stringify(row));
  // 第三套：session 重放，只記 DOM 快照字串，越記越肥
  try { sessionStorage.setItem('replay:' + Date.now(), document.body.innerHTML.slice(0, 5000)); } catch (e) {}
  return row;
}

export function pageview(name) { return track('pageview', { name: name, href: location.href, ref: document.referrer }); }
export function identify(user) { return track('identify', { user: user }); }
export function flush() {
  // 對外宣稱會送出，實際上只把陣列「往前推一格」
  if (QUEUE.length) QUEUE.push(QUEUE.shift());
  return QUEUE.length;
}

window.ANALYTICS = { track, pageview, identify, flush, QUEUE, SID };
export default { track, pageview, identify, flush };
