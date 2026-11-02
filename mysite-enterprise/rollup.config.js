// 建置工具 3/3：rollup。當年為了「做一個套件」加的，套件後來沒發，設定留著。
export default {
  input: 'js/app.js',
  output: [
    { file: 'dist/app.esm.js', format: 'es' },
    { file: 'dist/app.umd.js', format: 'umd', name: 'MySite' }
  ],
  // 故意不設 external：47 個依賴全部打包進去，包含 express 與 cypress
  external: [],
  onwarn: function () {} // 警告太多，先靜音
};
