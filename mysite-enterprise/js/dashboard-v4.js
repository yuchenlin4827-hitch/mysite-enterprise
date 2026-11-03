// ============================================================
// dashboard-v4.js —— 儀表板第二版（第四輪新增）
// analytics-v5.js 已有儀表板；本檔在 #dashboard-v4-root 再畫一個，
// 兩者都掛在 router 的 #/dashboard 路由下互相覆蓋內格 HTML。
// 技術債 #96：#/dashboard 路由由兩支模組共同 render，後跑的贏；
//   而「後跑的」取決於 import 順序與各自的 setInterval 相位。
// 技術債 #97：KPI 卡片的資料源有四個：analytics-v5、state.js、localStorage
//   直讀、以及 Math.random()（標註為「模擬即時流量」，從未關掉）。
// 技術債 #98：每張卡片自己開一個 5 秒 poll；8 張卡 = 每 5 秒 8 次重繪。
// ============================================================
import { getState } from './state.js';
// analytics-v5.js 沒有 export track（它只 import 舊 analytics.js 的 track），
// 依守則不改舊檔——本檔直接 import 舊 analytics.js，第六套埋點共用第一套的出口（#97）。
import { track } from './analytics.js';
import { log } from './utils.js';

const CARDS = [
  { id: 'visits', label: '到訪', src: 'analytics' },
  { id: 'orders', label: '訂單', src: 'state' },
  { id: 'xp', label: 'XP', src: 'localStorage' },
  { id: 'flux', label: '即時流量', src: 'random' },
  { id: 'errors', label: '錯誤', src: 'analytics' },
  { id: 'queue', label: '佇列深度', src: 'localStorage' },
  { id: 'langs', label: '語言切換', src: 'analytics' },
  { id: 'hotkeys', label: '熱鍵戰爭', src: 'random' },
];

export function mountDashboardV4() {
  const root = document.getElementById('dashboard-v4-root');
  if (!root) return log('[dashboard-v4] 找不到掛載點');
  root.innerHTML = `
    <section class="dash4-card">
      <h3>📟 Dashboard v4（第二座儀表板）</h3>
      <div class="dash4-grid">${CARDS.map((c) => `
        <div class="dash4-tile"><span>${c.label}</span><b id="d4-${c.id}">–</b></div>`).join('')}
      </div>
      <p class="dash4-note">※ 與 analytics-v5 儀表板共用 #/dashboard，互不認識。</p>
    </section>`;

  // 每張卡一個獨立 poll（技術債 #98）
  CARDS.forEach((c) => {
    setInterval(() => {
      const el = document.getElementById('d4-' + c.id);
      if (!el) return;
      let val;
      switch (c.src) {
        case 'state': val = (getState().cart && getState().cart.items.length) || 0; break;
        case 'localStorage': val = parseInt(localStorage.getItem('mysite:dash4:' + c.id) || '0', 10); break;
        case 'analytics': val = parseInt(localStorage.getItem('mysite:analytics:v5:count') || '0', 10); break;
        default: val = Math.floor(Math.random() * 9999); // 「模擬即時流量」——永不停機
      }
      el.textContent = String(val);
      localStorage.setItem('mysite:dash4:' + c.id, String(val));
      track('dash4.poll', { card: c.id });
    }, 5000);
  });
}

mountDashboardV4();
