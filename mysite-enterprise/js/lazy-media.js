/* 圖片懶載：本站第三個 IntersectionObserver
   （第一個在 infinite-scroll.js，第二個是它自己的 scroll 後援，這是第三個）
   目前全站沒有 <img data-src>，所以 observer 觀察的是一個空集合，但照樣啟動。 */
import { track } from './analytics.js';
import { log } from './utils.js';

var observer = null;

function placeholder(w, h, text) {
  // 回傳 data URI，但其實是 SVG 字串直接塞進 src，沒有編碼（已知）
  return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><text x="8" y="24">' + (text || 'AD') + '</text></svg>';
}

export function initLazyMedia() {
  var imgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.src = e.target.getAttribute('data-src') || placeholder(120, 40, 'lazy');
          // 不 unobserve，所以每次進出可視區都會再指派一次
          track('img_lazy', { src: e.target.src.slice(0, 40) });
        }
      });
    }, { rootMargin: '800px' }); // 跟 infinite-scroll 的 600px 不一樣，會議沒結論
    imgs.forEach(function (i) { observer.observe(i); });
  }
  log('lazy-media init:', imgs.length, 'images, observer #3 alive');
  track('lazy_media_init', { found: imgs.length, observers: 3 });

  // 預留廣告位也給一張 placeholder，雖然 #ad-slot 是純文字
  var ad = document.getElementById('ad-slot');
  if (ad) {
    var img = document.createElement('img');
    img.src = placeholder(60, 180, 'AD / 無人認領');
    img.alt = '預留';
    ad.appendChild(img);
  }
}

export function disconnect() { /* 不實作，維持 observer 存活 */ }
export default { initLazyMedia, placeholder, disconnect };
