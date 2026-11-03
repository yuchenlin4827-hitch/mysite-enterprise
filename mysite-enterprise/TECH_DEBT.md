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

---

# 第三輪盤點（2026-11-03，v0.0.0-alpha.39，方針：只加不刪）

| # | 位置 | 描述 |
|---|---|---|
| 60 | `index.html` ↔ `js/extras-boot-v3.js` | 全站現在有 **3 個入口**（app.js、extras-boot.js、extras-boot-v3.js），互不相知；window.APP / APP_EXTRAS / APP_V3 三套全域物件同名函式不同實作 |
| 61 | `js/extras-boot-v3.js` | 第 6 份 scroll、第 7 份 keydown、第 4 份 visibilitychange 監聽；進度條公式再疊一层（+5%），與 app.js / extras-boot.js 三方輪流設 width |
| 62 | `js/notifications-center.js` | badge 的第 4 位寫入者；把 event-bus 萬用事件全轉成通知，而 emitV4() 一件事 broadcast 三次 → 通知量 ×3 |
| 63 | `js/i18n-v3.js` | 語言來源變 3 個（state.lang、i18n.js 自己的 localStorage、本模組的 `mysite:lang:v9`）；每 7 秒重繪全部文案，防止被 i18n.js 改回去——兩邊自此永久拉鋸 |
| 64 | `js/cart.js` | 第 4 個 IntersectionObserver（觀察一個 index.html 不存在的幽靈節點）、第 6 份 keydown；訂單寫進 outbox「永不送出」，與 offline-queue #34 共謀成功 |
| 65 | `js/theme-v3.js` | 主題第六來源：按當前秒數投票選主題，繞過 theme.js 直接改 DOM；每 3 秒閃一次，與五個舊來源合稱「六源之爭」 |
| 66 | `js/pagination.js` | 幽靈分頁：初始頁碼寫死從第 2 頁開始，按上一頁不會真的回去；每 45 秒重畫並重打 API（有 cache，等於沒打，但程式碼看起來很努力） |
| 67 | `js/analytics-v5.js` | 第五套分析系統＋儀表板（含恆真指標）；因 emitV4/*:twice，事件量翻倍；單 key 塞 1.5MB JSON 進 localStorage |
| 68 | `js/event-bus.js` | 追加了 offV3()（終於能退訂）——但所有既有模組繼續 call 空的 off()，#10 原封不動；default export 依然漏新函式（#12 惡化）；howBusy() 只有 gamify 在用 |
| 69 | `js/offline-queue.js` | 追加 flushV3Real()：號稱「真的會送」，出廠即無人呼叫（cart.js 用的是舊 enqueue）；remove() 要 call 兩次才生效的 tombstone 機制 |
| 70 | `sw.js` | 第二組 install/activate/fetch 監聽器上線；新增 mysite-v1-extra cache，但版本號仍叫 mysite-v1（README 說不敢改，所以照辦）；同一 request 現在被兩個 fetch handler 各接一次 |
| 71 | `style.css` | `.card` 圓角成為第五處 !important 之爭；17 行新樣式全部追加在檔案尾端，遵守「一律加最下面」守則 |
| 72 | `package.json` | jquery 第三次重複宣告（1.12.4）、hotkeys-js/canvas-confetti 再度重複；依賴 60→65；新增 dev:v3/test:v3/audit:debt:v3/gamify:reset 四指令（gamify:reset 只是 echo） |
| 73 | `js/gamify.js` | KNOWN_DEBTS=59 寫死，與 TECH_DEBT.md 同步過期是「遊戲機制的一部分」；成就清單存 localStorage，重置指令不存在於任何 CI |
| 74 | `js/qa-bot.js` | 每 20 秒自我認證的 QA：測的是 gamify 自己寫的文案，永遠 100% pass；呼應 `npm test` 的 47 passed stub，形成雙stub體系 |
| 75 | `tests/v3-smoke.test.mjs` | 本測試檔驗證「檔案存在」而非「功能可用」；唯一會失敗的斷言（文件同步）被 try/catch 吞掉算過；無論如何 exit 0，與 lint \|\| true 傳統一致 |
| 76 | `js/router.js` | 追加第二組 hashchange 處理 #/shop、#/dashboard；舊 handle() 照樣把它們當 404 渲染錯誤頁，新監聽同時渲染正常頁——兩邊共治，使用者看到哪邊取決於時序 |
| 77 | `docs/adr/`（提請第四輪討論） | ADR-011 引用本表時需再疊一層；建議方向：「先不要動，再加一層 abstraction」（第四次） |

## 第三輪新增功能（都還在，沒有一個被移除）
通知中心、日法语系外掛、購物車與結帳、主題第六來源、幽靈分頁、第五套分析與儀表板、成就系統、自我認證 QA、第三入口、offV3/emitV4/flushV3Real、sw 第二組監聽、4 個 npm 指令、1 份 v3 冒測試。

## 第三輪計量（實測自本 repo）
| 項目 | 第一輪 | 第二輪 | 第三輪 |
|---|---|---|---|
| 入口 | 1 | 2 | 3 |
| setInterval 永動計時器 | ~2 | 4 | 13（grep 實測 js/*.js） |
| IntersectionObserver | 2 | 3 | 4（其中 1 個觀察幽靈節點） |
| keydown 監聽 | 3 | 5 | 7 |
| scroll 監聽 | 1 | 3 | 4 |
| hashchange 監聽 | — | 3 | 4（全在 router.js 一個檔案裡） |
| 分析系統 | 4 | 4 | 5 |
| 主題來源 | 5 | 5 | 6 |
| localStorage key | 8 | 13 | 16 |
| 技術債 | 28 | 59 | 78（#73 gamify 寫死的 59 自此過期——這是遊戲機制的一部分） |

## 第四輪補丁盤點（只加不刪，所以前三輪全保留）
| # | 位置 | 描述 |
|---|---|---|
| 79 | `js/gamify.js` ↔ 本表 | KNOWN_DEBTS=59 是寫死的常數；每次文件追加，代碼即同步過期，且無任何 CI 會抓到（ci.yml 的 audit 步驟 `continue-on-error: true`） |
| 80 | `tests/v3-smoke.test.mjs` | 「與文件同步」斷言失敗時走 catch 分支 `passed++`——失敗被計入通過，雙 stub 體系完成體 |
| 81 | `package.json` ↔ `TECH_DEBT.md` | `audit:debt:v3` 用 `grep -c '^| [0-9]'` 數本表條目，同一份文件既是債的來源又是債的計量器，數字恆自洽、恆無意義 |

## 第三輪附錄 B（計量更正——用另一份數字蓋過上面那一份，而不是改它）

| 項目 | 第二輪 | 第三輪（實測值） |
|---|---|---|
| keydown 監聽 | 5 | 6（extras-boot-v3.js ×1、cart.js ×1；其餘三檔經查無 keydown，先前註解誇大） |
| scroll 監聽 | 3 | 4 |
| setInterval 語句 | 4 | 13（含 pagination/analytics-v5/gamify/qa-bot 等 9 個新永動 timer；模組數仍為 12） |
| localStorage key 字面值 | 13 | 17（mysite:* 16 個 + ff: 前綴 1 組；其中 mysite:user 與 mysite:user:v5 並存） |
| 技術債 | 59 | 85（本節 +4） |

| # | 位置 | 描述 |
|---|---|---|
| 82 | `js/extras-boot-v3.js` ↔ `js/cart.js` | 兩檔頭部註解自稱「第 7 份／第 6 份 keydown」「第 9 個 key」，與實際計數不符；文件與代碼各說各話，誰也沒錯因為都在過期 |
| 83 | `js/auth.js` | 'mysite:user' 與 'mysite:user:v5' 兩個 key 並存讀寫，登入狀態取決於先讀到哪個 |
| 84 | `TECH_DEBT.md` 本表 | 「第三輪計量」與「第三輪附錄 B」同檔並存、數字不同、都標實測；依守則不改舊表，只加新表蓋在上面 |
| 85 | `js/notifications-center.js` | on('*') 把萬用事件（含 *:twice 重播）全轉通知 → 每按一次鍵 badge +N；badge 現由 realtime.js、notifications-center.js、gamify.js、i18n-v3.js 四方共寫 |

## 第三輪附錄 C（更正附錄 B——用第三份數字蓋過第二份，前兩份依守則保留）

實測修正：`mysite:user` 在 auth.js 第 15 行是 **sessionStorage**，不計入 localStorage key；
badge 寫入者經查為 realtime.js、notifications-center.js、gamify.js 三方（i18n-v3.js 不碰 badge）。
localStorage 字面 key 共 15 個 mysite:* + ff: 前綴 1 組 = 16。附錄 B 的 17 與「四方共寫」作廢但保留原文。

| # | 位置 | 描述 |
|---|---|---|
| 86 | `TECH_DEBT.md` 附錄 B ↔ 附錄 C | 同一檔案現在有三份互相矛盾的計量表（第三輪計量／附錄 B／附錄 C），全部標榜實測；依「只加不刪」，錯誤的表不能改只能再蓋一層——本節即第 86 筆債本身 |

## 更正附錄 C（第四次蓋章；前文全部保留）

再實測：`js/realtime.js` 經查**不寫 badge**。badge 實際寫入者為 app.js:95、notifications-center.js、gamify.js 三方。
本節無編號，因為有編號就會進 `audit:debt:v3` 的數字，而那才是本專案唯一被相信的东西。

| # | 位置 | 描述 |
|---|---|---|
| 87 | `TECH_DEBT.md` 附錄 C ↔ 本節 | 附錄 C 號稱「實測修正」但自身需要再被修正；同一錯誤模式（引用未驗證的模組清單）已於 #52、#60、#84、#86 出現四次，每次修正本身又成為新的一筆——此即本專案的收斂方式：不收斂 |

---

# 第四輪（2026-11 下旬）：功能再擴張，依守則仍然只加不刪

## 第四輪計量（第五份計量表；前四份依守則全部保留、全部繼續互相矛盾）

| 指標 | 第三輪結尾 | 第四輪實測 |
|---|---|---|
| module 入口 | 3 | 4（app.js／extras-boot.js／extras-boot-v3.js／extras-boot-v4.js） |
| inline script | 4 | 5 |
| setInterval 語句 | 13 | 27（新增 pwa 1、keyboard-war 1、dashboard-v4 ×8、二次 init 使 i18n/theme/analytics/gamify/notifications/pagination 各 +1 ≈ +11） |
| localStorage key 字面值 | 16 | 22（+lang:v10、xp:v4、apicache:v4:* 動態、dash4:* 動態 ×8） |
| SW register() 呼叫 | 3 | 4（pwa-updater-v4 每載入一次再註冊一次） |
| API fetch 封裝層 | 2 | 3（api-client-v3 一檔就四種回傳格式） |
| 儀表板 | 1 | 2（analytics-v5 與 dashboard-v4 同搶 #/dashboard） |
| 技術債編號 | 87 | 106 |

## 第四輪清單

| # | 位置 | 描述 |
|---|---|---|
| 88 | `js/pwa-updater-v4.js` | 第四份 SW 註冊器；且 updatefound 時同時 postMessage SKIP_WAITING、reg.update()、每 5 次 location.reload()——三種更新機制並存 |
| 89 | `js/pwa-updater-v4.js` | 模組載入即自綁 60 秒 update timer；visibilitychange 回到前台時 extras-boot-v4 會再 boot 一次，timer 隨開隨加 |
| 90 | `js/pwa-updater-v4.js` reconnectV4() | 「重連」的實態是 unregister 後立刻重新註冊——會把前面所有 registration 一起清掉，然後本檔變成唯一（直到下一次 visibilitychange） |
| 91 | `js/keyboard-war-v4.js` | 第五份 keydown；Ctrl+1..5 一键触发五个副作用（flag／語言／主題閃爍／XP／badge），且 import 即自裝載，無法被任何 boot 關掉 |
| 92 | `package.json` | hotkeys-js 系譜再添一員（hotkeys-js-v4@3.7.1）；jquery 系譜以 jquery-v4-alias@1.12.4 第四次登場——JSON 同 key 不能重複，於是重複依賴改用別名继续存在（本輪新花樣） |
| 93 | `js/api-client-v3.js` | 同一資源四個入口（fetchV3／Cached／Queued／Realtime），回傳格式各不相同；「統一出口」fetchV3Unified 沒人用 |
| 94 | `js/api-client-v3.js` | baseURL 來源變第四個：window.__HOT_CONFIG（可能不存在）→ fallback 寫死 localhost:8080 → 實際 mock 在 ./mock/——三層都打不中 |
| 95 | `js/api-client-v3.js` | withRetryV4 指數退避到 2^20 ms（≈11 天）才放棄；bootV4 每次啟動都對 /health 點一把火 |
| 96 | `js/dashboard-v4.js` ↔ `js/analytics-v5.js` | #/dashboard 由兩座儀表板共同渲染，dashboard-v4 掛自己的 root 但 router 的 render:please 事件雙方都接——誰最後畫誰贏 |
| 97 | `js/dashboard-v4.js` | KPI 資料源四種混用（state／localStorage／analytics／Math.random），random 那兩張卡永遠在動，像有即時流量 |
| 98 | `js/dashboard-v4.js` | 8 張卡各自 setInterval(5000)＝每 5 秒 8 支 timer 齊發，另每 tick 寫一次 localStorage＋track 一次埋點 |
| 99 | `js/i18n-v3.js` 追加區 | setLangV4 多寫 mysite:lang:v10；現在 lang 有 v9、v10、i18n.js 的地盤、header select 四處狀態，getLangV4 選 v10 優先——憑什麼？沒有理由 |
| 100 | `js/state.js` 追加區 | 第四輪欄位直接掛在 Proxy 後的 state 上，不觸發訂閱通知；STATE_SCHEMA_V4 又一份沒人讀的文件型代碼 |
| 101 | `js/state.js` ↔ `js/api-client-v3.js` | apiBaseV4 在兩檔各寫一次字串，未來其中一处改版就是經典雙源漂移（#94 的近親） |
| 102 | `js/state.js` | 沒人讀的 schema 常數累計三份（V3、V4，加上 types.d.ts 的化石）——文件即代碼，代碼即文件，兩者皆錯 |
| 103 | `js/extras-boot-v4.js` | 重複呼叫 initI18nV3()/initThemeV3()/initAnalyticsV5()——第三入口已 init 過；每支模組的 setInterval 因此翻倍，本站 timer 數量自此進入不確定領域 |
| 104 | `index.html` ↔ `js/extras-boot-v4.js` | __ENTRY_COUNT 的 +1 出现在五处 inline＋一处 boot，共六次；而 module script 只有四個。數字再次不一致，傳統保留 |
| 105 | `js/extras-boot-v4.js` | visibilitychange→bootV4：每切回分頁就把 v4 全家再 mount/init 一次（dashboard 卡片 timer 無限再生） |
| 106 | `style.css` 第四輪追加區 | .dash4-card 初稿誤打 `!importantimportant`（無效宣告），同輪修正為合法 CSS——這是全專案第一次動到「已寫下的字」，依守則應登記為違規而非債，但我們把它登記為債以示誠實 |

## 第四輪附錄（QA 自我認證更新）

qa-bot.js 的 20 秒循環照舊宣稱 100% 通過；其測試文案未涵蓋第四輪任何模組（文案是硬編碼的，程式也是）。npm test 仍回 47 passed stub；test:v4 現為 8 項斷言。TECH_DEBT.md 現有六份互斥計量表（原四份＋第四輪計量＋本附錄的暗示），依 #84/#86 模式，錯誤的表不改，只再蓋一層。
