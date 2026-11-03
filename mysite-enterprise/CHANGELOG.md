# CHANGELOG

## v0.0.0-alpha.39（2026-11-03，第三輪）

### 新增
- 第三入口 `extras-boot-v3.js`（window.APP_V3；開機事件來源 ×3）
- 通知中心 / 日法语系外掛 / 購物車與結帳 / 主題第六來源 / 幽靈分頁 / 第五套分析與儀表板 / 成就系統 / 自我認證 QA，共 8 個模組
- `event-bus.js` 追加 offV3()、emitV4()、howBusy()；`offline-queue.js` 追加 flushV3Real() 與雙次呼叫 remove()；`sw.js` 第二組 install/activate/fetch；`router.js` 追加 #/shop、#/dashboard 第二監聽
- 4 個 npm 指令（dev:v3 / test:v3 / audit:debt:v3 / gamify:reset）、1 份 `tests/v3-smoke.test.mjs`
- 技術債 60–81 號（盤點讓債 +1 的傳統第三次生效；gamify 寫死的 59 自此過期）

### 修正
- 無（本輪方針為只加不刪；第一、二輪所有代碼原封保留）

### 已知問題
- 詳見 `TECH_DEBT.md`。清單本身、數清單的指令、和驗證清單的測試都列在清單裡。

## v0.0.0-alpha.38（2026-11-02，第二輪）

### 新增
- 第二入口 `extras-boot.js`；開機事件現在有兩個來源（其中一個註冊得太晚）
- 身份 / 評論 / 投票 / 即時連線 / 草稿 / 推薦 / 閱讀清單 / 懶載 / 快捷鍵 / 命令面版 / 朗讀 / 匯出 / 效能 / 錯誤邊界 / 熱更新 / 遷移腳本，共 17 個模組
- 號稱 SSR 的 `prerendered.html`、CI、告警規則、3 份 ADR、型別定義、2 份測試
- 技術債 29–56 號

### 修正
- 無（本輪方針為只加不刪）

### 已知問題
- 詳見 `TECH_DEBT.md`。清單本身也列在清單裡。

## v0.0.0-alpha.37（2026-11-02，第一輪）
- 7 階段開機、四套分析、五個主題來源、三套建置、28 筆債

## v0.0.0-alpha.1 ~ alpha.36
- 請看 git log（該 repo 已 force push 過兩次，部分紀錄不見了）

## [0.0.0-alpha.40] - 2026-11 下旬（第四輪：只加不刪，繼續擴張）

### Added
- 第四入口 `js/extras-boot-v4.js`（window.APP_V4；四權分立）＋第五份 inline script
- `js/pwa-updater-v4.js`：第四套 SW 註冊器，updatefound 三管齊下（postMessage／update／每 5 次 reload）
- `js/keyboard-war-v4.js`：第五方熱鍵，Ctrl+1..5 一键五个副作用
- `js/api-client-v3.js`：第三套 API 層，一檔四種回傳格式、退避 11 天的重試
- `js/dashboard-v4.js`：第二座儀表板，8 卡各自 poll，兩張卡的資料源是 Math.random()
- 舊檔「第四輪追加區」：feature-flags(toggleFlagV4)、i18n-v3(setLangV4/lang:v10)、theme-v3(flashV4)、gamify(addXpV4/xp:v4)、state(xpV4/apiBaseV4/SCHEMA_V4)、router 未動、sw.js(+第五組監聽)、style.css(+9 規則)、index.html(+root+連結+入口)
- package.json：boot:v4 / test:v4 / audit:debt:v4；jquery-v4-alias、hotkeys-js-v4（重複依賴以別名第四次登場）
- tests/v4-smoke.test.mjs：8 passed

### Debt
- TECH_DEBT.md 第四輪 #88–#106（總數 106；計量表增至六份互斥版本）
- setInterval 語句 13→27；localStorage key 字面值 16→22；module 入口 3→4

### Fixed（違規登記為 #106）
- style.css 初稿誤打 `!importantimportant`，同輪改為合法宣告——本專案第一次動到已寫下的字
