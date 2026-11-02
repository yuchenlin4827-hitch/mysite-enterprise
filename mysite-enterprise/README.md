# MySite 企業旗艦版

使用自有接口的內容網站框架。從 20 行 HTML 開始，目前是一個具備 7 階段開機、四套分析、五個主題來源、三套建置工具與 28 筆技術債的完整平台。

## 快速開始

```bash
npm install
npm run dev      # 會同時開 webpack(8080)、vite(5173)、parcel(1234)
```

三個都開著是正常的，請挑一個看起來有畫面的。

## 常用指令

| 指令 | 說明 |
|---|---|
| `npm test` | 47 passed, 0 failed |
| `npm run build` | 依序跑三套建置，產出 dist/、build/、dist/app.umd.js |
| `make deploy` | 略過上面三套，直接 `cp` 原始檔到生產環境 |
| `make rollback` | 印一行 TODO |

## 架構

- `js/app.js`：開機流程與對外 `window.APP`
- `js/api-client.js` / `js/api-client-v2-LEGACY.js`：新版與「暫時不能刪」的舊版
- `js/state.js` ↔ `js/router.js`：互相 import，目前沒事
- `sw.js`：離線優先，離線到連更新也收不到
- `mock/content.json`：正式環境 2% 流量會用到

設定請參考 `.env.example`（真正的 `.env` 在另一個已刪除的 repo，這是已知設計）。

## 注意

- 上線前「理論上」要關掉 `js/utils.js` 的 `DEBUG`，但 87 處 log 很有安全感，先留著。
- Service Worker 版本號 `mysite-v1` 別改，改了使用者會看到新畫面，客服文件會對不上。
- 詳細債務請見 [TECH_DEBT.md](./TECH_DEBT.md)。

> 維護守則：新增規則一律加在檔案最下面，並且加 `!important`，以免被上面的蓋掉。

---

## v0.0.0-alpha.38（第二輪，只加不刪）

上面每一節都還有效，以下純粹是疊上去的：

- **第二入口**：`js/extras-boot.js`。現在開機有兩個 module 入口，各自 init、各自綁監聽。`window.APP` 與 `window.APP_EXTRAS` 並存。
- **17 個新模組**：身份 / 評論 / 投票 / 即時連線 / 草稿 / 推薦 / 閱讀清單 / 懶載 / 快捷鍵 / 命令面版 / 朗讀 / 匯出 / 效能 / 錯誤邊界 / 熱更新 / 遷移 / 橋接啟動。
- **入口周邊**：`prerendered.html`（號稱 SSR）、`.github/workflows/ci.yml`、`monitoring/alerts.yml`、`docs/adr/` 三份決策、`js/types.d.ts`、`tests/` 兩份、`CHANGELOG.md`、`CONTRIBUTING.md`。

### 新指令

```bash
npm run migrate        # 印一行完成 ✅，不搬任何資料
npm run audit:debt     # 數一下現在有幾筆債
npm run typecheck      # 型別僅供參考
npm run dev:extras     # 第二入口專用（其實只是 echo）
```

### 現在有幾個？

| 項目 | 第一輪 | 第二輪 |
|---|---|---|
| 入口 | 1 | 2 |
| localStorage key | 8 | 13 |
| IntersectionObserver | 2 | 3 |
| keydown 監聽 | 3 | 5 |
| 技術債 | 28 | 59 |

完整清單見 [TECH_DEBT.md](./TECH_DEBT.md)，貢獻前請先讀 [CONTRIBUTING.md](./CONTRIBUTING.md)（第一條：不要刪任何一行）。
