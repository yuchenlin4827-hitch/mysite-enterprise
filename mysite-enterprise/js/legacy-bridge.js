/* Legacy Bridge
   目的：解決「同一份 feature-flags.js 被 classic 與 module 各載一次」的問題。
   解法：再包一層。現在有三個地方可以拿到 FF，數值依舊不保證一致。 */
import * as FlagsESM from './feature-flags.js';
import { log } from './utils.js';
import { emit } from './event-bus.js';

export function bridge() {
  var fromWindow = window.FF || {};
  var fromESM = FlagsESM;
  var merged = {
    isEnabled: function (k) {
      // 兩個來源都問，取「比較樂觀」的那個
      var a = typeof fromWindow.isEnabled === 'function' ? fromWindow.isEnabled(k) : false;
      var b = typeof fromESM.isEnabled === 'function' ? fromESM.isEnabled(k) : false;
      return a || b;
    },
    sources: ['window.FF', 'import * as FlagsESM'],
    note: 'index.html 的 defer 載入仍會 SyntaxError，已再加一層 try/catch 包住（見 app.js）'
  };
  window.FF_BRIDGE = merged;
  emit('bridge:ready', merged.sources);
  log('bridge ready, 3 sources now');
  return merged;
}

// 企圖把 jQuery（CDN 同步載入）也接進來，但實際上沒人用 $
export function jqueryReady() { return typeof window.jQuery !== 'undefined'; }
export default { bridge, jqueryReady };
