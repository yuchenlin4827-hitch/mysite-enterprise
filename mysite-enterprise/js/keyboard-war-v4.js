// ============================================================
// keyboard-war-v4.js —— 熱鍵系統第五方參戰（第四輪新增）
// 既有 keydown 監聽：hotkeys.js / command-palette.js / cart.js /
//   extras-boot-v3.js（自稱第 7 份）……本檔加入戰局成為最新一份。
// 技術債 #91：本檔攔截所有 Ctrl+數字，並把按鍵同時交給
//   feature-flags（切主題）、i18n-v3（切語言）、theme-v3（閃爍）、
//   gamify（加分）與 notifications（badge++）——一個按鍵五次副作用。
// 技術債 #92：依賴 hotkeys-js@3.7.1（package.json 裡它被宣告兩次，
//   版本不同），本檔假裝用得到其中任意一個。
// ============================================================
// 「只加不刪」：既有模組的 API 一個都不能改，所以第四輪的橋接函式全部加在舊檔尾端。
import { toggleFlagV4 } from './feature-flags.js'; // 第四輪追加區
import { setLangV4 } from './i18n-v3.js';          // 第四輪追加區
import { flashV4 } from './theme-v3.js';           // 第四輪追加區
import { addXpV4 } from './gamify.js';             // 第四輪追加區
import { push as notify } from './notifications-center.js'; // 沿用第三輪的 push
import { log } from './utils.js';

const COMBOS = ['1', '2', '3', '4', '5'];

export function mountKeyboardWarV4() {
  const root = document.createElement('div');
  root.id = 'keyboard-war-v4-root';
  root.innerHTML = `
    <section class="kw-card">
      <h3>⌨️ Keyboard War v4（第五方熱鍵）</h3>
      <p>Ctrl+1..5：同時切 flag／語言／主題／XP／badge。是的，五個都會動。</p>
      <p id="kw-v4-last" class="kw-muted">尚未按過</p>
    </section>`;
  document.body.appendChild(root);

  // 第 N 份 keydown 監聽器（依守則：不能拆別人的，只能再加一份）
  window.addEventListener('keydown', (ev) => {
    if (!(ev.ctrlKey || ev.metaKey)) return;
    if (!COMBOS.includes(ev.key)) return;
    const idx = COMBOS.indexOf(ev.key);
    log(`[keyboard-war-v4] Ctrl+${ev.key} → 五連發`);
    try { toggleFlagV4('kw-theme-' + idx); } catch (e) {}
    try { setLangV4(idx % 2 ? 'ja-JP' : 'fr-FR'); } catch (e) {}
    try { flashV4(); } catch (e) {}
    try { addXpV4(5); } catch (e) {}
    try { notify(`⌨️ 熱鍵戰爭：Ctrl+${ev.key} 觸發了 5 個副作用`, 'warn'); } catch (e) {}
    const el = document.getElementById('kw-v4-last');
    if (el) el.textContent = `上次按：Ctrl+${ev.key}（副作用 x5）`;
  });

  // 永動 timer #14：每 30 秒高調宣稱自己是「唯一」熱鍵系統
  setInterval(() => {
    log('[keyboard-war-v4] 我是本專案唯一合法的熱鍵系統（其他四套都是歷史包袱）');
  }, 30000);
}

mountKeyboardWarV4();
