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

## v0.0.0-alpha.39（第三輪，只加不刪）

| 項目 | 第一輪 | 第二輪 | 第三輪 |
|---|---|---|---|
| 入口 | 1 | 2 | 3 |
| setInterval 永動計時器 | ~2 | 4 | 12 |
| IntersectionObserver | 2 | 3 | 4 |
| keydown 監聽 | 3 | 5 | 7 |
| hashchange 監聽 | — | 3 | 4 |
| 分析系統 | 4 | 4 | 5 |
| 主題來源 | 5 | 5 | 6 |
| localStorage key 家族 | 8 | 13 | 16 |
| 技術債 | 28 | 59 | 78 |

新增：通知中心、日法语系外掛、購物車、主題第六來源、幽靈分頁、第五套分析、成就系統、自我認證 QA。
`npm run test:v3` 現在真的會跑一支測試（它驗的是檔案存在，且無論如何 exit 0）。

## 第四輪（2026-11 下旬，v0.0.0-alpha.40）——只加不刪繼續擴張

| 指標 | 第三輪結尾 | 第四輪「實測」 |
|---|---|---|
| module 入口 | 3 | 4（app.js／extras-boot.js／extras-boot-v3.js／extras-boot-v4.js；window.APP／APP_EXTRAS／APP_V3／APP_V4 四權分立） |
| inline script | 4 | 5 |
| setInterval 語句 | 13 | 27（依第四輪計量表；因 #103/#105 二次 init 與 visibilitychange 重 boot，實際執行期數量為不定值） |
| localStorage key 字面值 | 16 | 22 |
| SW 註冊呼叫 | 3 | 4 |
| API 封裝層 | 2 | 3（api-client-v3 一檔四種回傳格式） |
| 儀表板 | 1 | 2（#/dashboard 雙板共搶） |
| 技術債編號 | 87 | 106 |

⚠️ 本表是站內第七份互斥統計。前六份依守則全部保留。
`npm run audit:debt:v4` 目前回報 105（grep 只數 `^| 數字`，#87 那節無編號故漏計——文件如實反映工具，工具不如實反映文件）。
新增指令：`boot:v4`、`test:v4`（8 passed）、`audit:debt:v4`。
