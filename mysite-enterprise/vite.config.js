// 建置工具 2/3：vite。和 webpack 輸出不同目錄，兩份都會進版控。
import { defineConfig } from 'vite';
export default defineConfig({
  root: '.',
  base: './',
  build: { outDir: 'build', target: 'es2015', sourcemap: true },
  server: { port: 5173, strictPort: true },
  // index.html 的 <script async> 與 type="module" 在 dev 與 build 行為不同，已列為第 15 號債
  plugins: []
});
