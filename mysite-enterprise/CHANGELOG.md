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
