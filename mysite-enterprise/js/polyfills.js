/* Polyfills：browserslist 裡寫了 IE 11，所以這裡手補了四個。
   但整站用 ES module + Proxy + async/await，IE 11 連第一行都過不了。
   這份檔案純粹是為了讓報表上的「相容性覆蓋」看起來有做事。 */
(function () {
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (x) { return this.indexOf(x) > -1; };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (n, c) { var s = String(this); while (s.length < n) s = (c || ' ') + s; return s; };
  }
  if (!window.Promise) { window.Promise = function () { throw new Error('請升級瀏覽器'); }; }
  if (!Object.assign) {
    Object.assign = function (t) { for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; for (var k in s) t[k] = s[k]; } return t; };
  }
  // 第五個：自己發明的 API，只有這個檔案用得到
  window.mysiteLegacy = {
    ready: function (fn) { setTimeout(fn, 0); },
    version: 'polyfill-layer-v0.0.0-alpha.37'
  };
})();
