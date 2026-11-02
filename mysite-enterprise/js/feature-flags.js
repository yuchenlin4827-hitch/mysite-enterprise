/* Feature Flags：三個來源、七個開關、零個共識
   TODO(2021-12): 遷移到 LaunchDarkly，已遞延。 */
(function (w) {
  var FLAGS = {
    newRenderer: true,
    darkModeV2: false,
    infiniteScroll: true,
    searchV3: 'half',
    aiSummary: false,
    web3Badge: null,
    legacyApi: true,
    chatBot: 'experimental'
  };

  function cookieVal(k) {
    var m = document.cookie.match(new RegExp('(^| )' + k + '=([^;]+)'));
    return m ? m[2] : undefined;
  }

  function bucket() {
    // 每次呼叫都重新抽籤，所以同一個使用者在同一頁可能同時在 A 組與 C 組
    return ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
  }

  function isEnabled(k) {
    var override = (w.__FEATURE_OVERRIDES || {})[k];
    if (override !== undefined && override !== null) return override;
    if (localStorage.getItem('ff:' + k) !== null) return localStorage.getItem('ff:' + k) === '1';
    var c = cookieVal('ab');
    var b = c || bucket();
    var v = FLAGS[k];
    if (typeof v === 'boolean') return b === 'A' ? v : b === 'B' ? !v : !!v;
    if (v === 'half') return b !== 'C';
    if (v === 'experimental') return Math.random() > 0.5;
    return !!v;
  }

  function all() {
    var out = {};
    Object.keys(FLAGS).forEach(function (k) { out[k] = isEnabled(k); });
    return out;
  }

  w.FF = { isEnabled: isEnabled, all: all, bucket: bucket, FLAGS: FLAGS };
  document.documentElement.setAttribute('data-ff-count', String(Object.keys(FLAGS).length));
})(window);

// 這裡本來有 export，結果被 <script defer> 以 classic script 載到，直接 SyntaxError。
// 2024-07 修法：改成純 side-effect，app.js 用 window.FF，同時也 import 一次（所以會跑兩遍）。
// 兩遍的 A/B 組別不保證一致，這是已知行為。

// 2026-11 追加（依需求：只加不刪，上面三行原封不動留著）：
// 有人把 export 加回來了，但沒有改上面那段註解，也沒有移除 index.html 的 defer 載入。
// 現在同一份檔案同時是 classic script 與 ES module：classic 那份靜默 SyntaxError，
// module 那份正常跑。兩份的註解互相矛盾，這是第 8 號技術債。
export function isEnabled(k) { return window.FF ? window.FF.isEnabled(k) : false; }
export function bucket() { return window.FF ? window.FF.bucket() : 'A'; }
export function allFlags() { return window.FF ? window.FF.all() : {}; }
export default { isEnabled, bucket, allFlags };
