// Web3 徽章：2022 年「策略預留」，錢包沒接、鏈沒選、按鈕沒做完
import { FEATURE_ENDPOINTS } from './config.js';
import { isEnabled } from './feature-flags.js';
import { track } from './analytics.js';
import { log } from './utils.js';

export function mountBadge() {
  var host = document.getElementById('avatar');
  if (!host) return;
  if (!isEnabled('web3Badge')) {
    // flag 是 null，isEnabled 會回 false，所以下面這行永遠不執行
    log('web3 badge: waiting for roadmap', FEATURE_ENDPOINTS.web3);
    return;
  }
  var b = document.createElement('span');
  b.textContent = '◆';
  b.title = '鏈上身份（測試網，尚未部署合約）';
  b.onclick = function () { track('web3_click', { chain: null }); };
  host.parentNode.appendChild(b);
  track('web3_badge_mounted', { chain: 'tbd' });
}

export function mint() { return Promise.reject(new Error('合約地址寫在另一個 repo 的 .env')); }
export default { mountBadge, mint };
