# 技術債盤點（2026-11-02，只加不刪版）

> 方針：本輪不移除任何既有程式、註解或設定；有衝突就再疊一層。
> 因此下列每一筆都「還在」，而且有幾筆互相保障彼此不會被修好。

| # | 位置 | 狀況 |
|---|---|---|
| 1 | `index.html` | `#splash` 用 `!important` 蓋在最上層，開機後只加 `.hidden` 不移除 |
| 2 | `index.html` / `config.js` | live token 寫在 inline script，`.env` 據說在被刪掉的 repo |
| 3 | `utils.js` / `nginx.conf` | `safeParse` 失敗後用 `eval`；inline onclick 需要 `unsafe-inline`，所以不能上 CSP |
| 4 | `sw.js` | `mysite-v1` cache-first 且不清舊快取，連 `/api/` 回應也快取，任何失敗都回首頁 |
| 5 | `api-client.js` | `Map` 只增不減；5 次重試不 await，實際上一起飞；`TIMEOUT=0` |
| 6 | `api-client-v2-LEGACY.js` | 棄用過五次，封存頁 / footer / 客服仍在用；包裝新版但轉成舊格式 |
| 7 | `config.js` | 四個 API base，A/B/C 還會分流，2% 流量落到 `./mock/` |
| 8 | `feature-flags.js` | 同一份同時被 classic 與 module 載入；export 加回來了但三行舊註解沒改 |
| 9 | `feature-flags.js` / `legacy-bridge.js` | 為了解決雙載入又包一層，現在有三個來源可取 FF，數值不保證一致 |
| 10 | `event-bus.js` | `off()` 是空的；`once` 等同 `on`；訂閱只增不減 |
| 11 | `event-bus.js` | `emit` 會再廣播 `*:twice`；`emitLoud` 再廣播三次；`replayAll` 開機又重播一次 |
| 12 | `event-bus.js` | `default export` 忘了加入新加的四個函式，import default 的人用不到 |
| 13 | `state.js` ↔ `router.js` | 循環依賴，目前沒炸，因為兩邊都沒在頂層呼叫對方 |
| 14 | `state.js` | Proxy 每次 set 都寫 localStorage；`reset()` 不清 localStorage，重整就復活 |
| 15 | `vite.config.js` / `webpack.config.js` / `rollup.config.js` | 三套建置輸出到三個目錄，`Makefile` 一個都不用 |
| 16 | `package.json` | `jquery` 重複宣告兩次；47 個依賴含 express、cypress、left-pad、is-even |
| 17 | `package.json` | `npm test` 永遠印 47 passed；`lint` 後面接 `|| true` |
| 18 | `nginx.conf` ↔ `sw.js` | 一邊 `no-cache`，一邊永久 cache；版本號從 2021 沒改過 |
| 19 | `theme.js` / `style.css` | 五個來源投票、`prefers-color-scheme` 與 `data-theme` 打架，40 行未使用主題 |
| 20 | `renderer.js` | `escapeHtml` 直通、字串拼 `innerHTML`、inline onclick、`document.write` 後援 |
| 21 | `Dockerfile` | `node:8` 裝不了需要 `node>=20` 的套件，build 失敗後照樣 COPY 原始檔 |
| 22 | `docker-compose.yml` | `environment` 那行不是合法 YAML，compose 警告後繼續 |
| 23 | `search.js` | 三份 debounce、4 個監聽器、1 個永不停的 `setInterval`、注音中也照搜 |
| 24 | `infinite-scroll.js` | Observer + scroll + 定時共 3 個觸發者，`hasMore` 永遠 true |
| 25 | `offline-queue.js` | `flush()` 只把 `tries+1` 原樣放回；v1~v3 舊資料沒遷移 |
| 26 | `analytics.js` | 三套 SDK + sw 第四套；同一份被 classic 載入會靜默 SyntaxError |
| 27 | `Makefile` | `deploy` 先 `rm -rf /var/www/mysite/*`，`rollback` 是空的 |
| 28 | `app.js` | `boot()` 與 `onLoad()` 各綁一次，`render:please` 因此渲染兩次 |

## 本輪新增（沒有移除任何東西）
- 7 階段開機流程、雙掛載、快捷鍵、離線/可見性追蹤
- 主題五來源投票、三語 i18n（翻譯 2/48）
- 樂觀更新不回滾、無限捲動三觸發、AI 摘要 stub、Web3 徽章 stub
- `emitLoud` / `emitAsync` / `replayAll` / `snapshot`
- 三套建置設定、Docker / compose / nginx、mock 資料、本清單

## 下次會議預計結論
「先不要動，再加一層 abstraction。」

---

# 第二輪追加（2026-11-02，依 ADR-011：只加不刪）

> 本輪沒有移除、改寫或重排上面任何一行。所有新功能都是新檔案或檔案尾端追加區。
> `app.js` 完全沒動；改用「第二入口」`extras-boot.js` 疊上去。

| # | 位置 | 狀況 |
|---|---|---|
| 29 | `index.html` / `extras-boot.js` | 兩個 module 入口各自 boot、各自綁事件；`app:ready` 在第二入口註冊時已發過，永遠收不到 |
| 30 | `extras-boot.js` | 開機自動以管理員登入，沒有登入畫面也沒有登出入口 |
| 31 | `auth.js` | `can()` 一律回 `true`，包含 `deploy:prod`、`refund:all` |
| 32 | `auth.js` | 一份身份寫進 localStorage、sessionStorage、cookie、state Proxy、追蹤事件共 5 處，格式各異 |
| 33 | `auth.js` | `logout()` 只清 sessionStorage，重整自動登入 |
| 34 | `comments.js` | 樂觀插入 DOM、只存本機、進 outbox 永不送出；容器被 renderer 重繪就消失 |
| 35 | `comments.js` | `autoReply()` 開機自動回覆，重整再回覆一次，留言數無限成長 |
| 36 | `polls.js` | 投票結果寫死百分比、只存記憶體、重整可再投，但 toast 說「已同步 ✅」 |
| 37 | `realtime.js` | WS 服務已下線，降級成自己每 4 秒發假訊息給自己，`status()` 仍回 connected |
| 38 | `realtime.js` | 重連無上限無 backoff；`disconnect()` 不清 heartbeat 也不清重連佇列 |
| 39 | `drafts.js` | 每次輸入寫 3 個 key + state Proxy 再寫 1 次 + outbox 1 筆 |
| 40 | `drafts.js` | 全站 `input` 事件都存草稿，所以搜尋關鍵字會覆蓋客服輸入；`restore()` 回傳最短那份（通常是空） |
| 41 | `reading-list.js` / `interactions.js` | 四個 localStorage key 都叫「收藏」，彼此不知道對方；badge 由三個模組輪流寫 |
| 42 | `lazy-media.js` | 第三個 IntersectionObserver，觀察目標 0 個；不 `unobserve`，重複指派 |
| 43 | `hotkeys.js` | 第四份 keydown；`t` 直接改 `data-theme`，繞過 theme.js 五來源投票，下次投票又翻回來 |
| 44 | `command-palette.js` | 過濾後 `data-i` 錯位，點到的不是看到的；7 個指令有 4 個「即將推出」 |
| 45 | `tts.js` | `en` 沒有語系對應，用 `zh-TW` 唸英文；不 `cancel()` 前一次，連點會疊著念 |
| 46 | `export-card.js` | 匯出整頁 `innerHTML`（含 inline onclick、token 的 img、DOM 快照），不 revokeObjectURL |
| 47 | `perf.js` | rAF 迴圈量測自己，樣本陣列無上限；數字包含量測成本 |
| 48 | `error-boundary.js` | 吞掉所有錯誤並改成 toast，監控因此永遠 0 error；又接進 event-bus 被重播三次 |
| 49 | `config-hot-reload.js` → `sw.js` | 輪詢不存在的 json → sw 把 404 換成 index.html → `JSON.parse` 必炸 → catch 後照樣廣播「設定已更新」 |
| 50 | `migrations/v1-to-v5.js` | 號稱遷移，`written=0 deleted=0`，還回報 success；每次開機跑一次 |
| 51 | `extras-boot.js` | scroll / keydown / visibilitychange 各再加一份；進度條公式與 app.js 不同，兩邊輪流設 width |
| 52 | `js/types.d.ts` | 2023 手寫，漏 9 個 state 欄位與 18 個新模組，還宣告 3 個從未存在的函式 |
| 53 | `prerendered.html` | 號稱 SSR，實為 2024 手貼快照，無建置更新、nginx 未指向、與 index.html 差 19 處 |
| 54 | `.github/workflows/ci.yml` ↔ `Dockerfile` | CI 用 node:20、Docker 用 node:8；三套 build 全 `|| true`；artifact 找不到也 ignore |
| 55 | `.editorconfig` ↔ `.eslintrc.json` | 縮排規則自相矛盾；eslint 8 條規則全 off，`lint` 後面還接 `|| true` |
| 56 | `docs/adr/` | ADR-003「停用 v2」與 ADR-007「續用 v2」都標「已接受」，無取代關係 |
| 57 | `package.json` | 第二輪又加了 `hotkeys-js`（原本已有，跟 `jquery` 一樣重複宣告）；依賴從 47 個變 60 個 |
| 58 | `monitoring/alerts.yml` | 8 條告警有 5 條資料來源沒在收集，接收人是 2022 解散的頻道 |
| 59 | `TECH_DEBT.md` | 盤點檔案本身讓債 +1；本列又讓它 +1 |

## 第二輪新增功能（都還在，沒有一個被移除）
身份、評論、投票、即時連線、草稿、推薦、閱讀清單、懶載、快捷鍵中心、命令面版、語音朗讀、快照匯出、效能監控、錯誤邊界、設定熱更新、遷移腳本、SSR 快照頁、CI、告警、3 份 ADR、型別定義、2 份測試、貢獻指南。

## 下次會議實際結論（已記錄）
「先不要動，再加一層 abstraction。另外盤點一下技術債。」（盤點後 +4 筆）
