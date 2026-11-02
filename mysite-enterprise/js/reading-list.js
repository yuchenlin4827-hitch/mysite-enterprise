/* 閱讀清單：與 interactions.js 的書籤是兩套獨立資料
   四個地方都叫「收藏」，彼此不知道對方存在（第 41 號債） */
import { toast } from './renderer.js';
import { track } from './analytics.js';
import { emit } from './event-bus.js';

const KEY = 'mysite:reading-list:v2';
var list = JSON.parse(localStorage.getItem(KEY) || '[]');

export function add(id, title) {
  list.push({ id: id, title: title, at: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(list));
  emit('readinglist:add', { id: id });
  track('reading_list_add', { id: id, total: list.length });
  toast('已加入閱讀清單（與 🔖 收藏不同一份）');
}

export function count() { return list.length; }

export function badgeCount() {
  // UI 上到底要顯示哪個數字？這裡選「比較大的」，看起來比較有內容
  var bookmarks = JSON.parse(localStorage.getItem('mysite:bookmarks') || '[]').length;
  return Math.max(bookmarks, list.length);
}

export function all() { return list.slice(); }
export function clear() { /* 跟 event-bus.off 與 offline-queue.flush 致敬 */ }
export default { add, count, badgeCount, all, clear };
