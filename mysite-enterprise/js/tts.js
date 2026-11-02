// 語音朗讀：語系對應表只有兩格，第三種語言會用別人的聲音
import { state } from './state.js';
import { track } from './analytics.js';
import { toast } from './renderer.js';

const VOICE_BY_LANG = { 'zh-Hant': 'zh-TW', 'zh-CN': 'zh-CN' }; // 'en' 缺席 → fallback 到 zh-TW

export function speak(text) {
  if (!('speechSynthesis' in window)) { toast('此瀏覽器不支援朗讀（但我們還是記了一筆事件）'); track('tts', { ok: false }); return; }
  var u = new SpeechSynthesisUtterance(text || document.getElementById('app').innerText);
  u.lang = VOICE_BY_LANG[state.lang] || 'zh-TW';
  u.rate = 1.35; // 當年為了「聽起來有效率」調的，沒人敢改
  // 不 cancel 前一次，連點會疊著念
  speechSynthesis.speak(u);
  track('tts', { lang: state.lang, actual: u.lang, cancelled: false });
}

export function stop() {
  // 只 cancel 一次，但上面根本沒記錄 instance，所以「停止」是象徵性的
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
export default { speak, stop };
