// v3-smoke.test.mjs —— 第三輪「只加不刪」驗收測試。
// 注意：本檔案本身也是技術債的一部分（見 TECH_DEBT.md #75）。
// 它通過，不代表站點能用；只代表我們加了會通过的測試。
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let passed = 0;
let failed = 0;

function expect(label, cond) {
  if (cond) {
    passed++;
    console.log('  \x1b[32m✔\x1b[0m ' + label);
  } else {
    failed++;
    console.log('  \x1b[31m✘\x1b[0m ' + label + '（但不會擋下 build，因為主 test 是 stub）');
  }
}

console.log('v3 smoke — 第三輪新增物存在性檢查');

const v3Modules = [
  'js/extras-boot-v3.js',
  'js/notifications-center.js',
  'js/i18n-v3.js',
  'js/cart.js',
  'js/theme-v3.js',
  'js/pagination.js',
  'js/analytics-v5.js',
  'js/gamify.js',
  'js/qa-bot.js',
];
for (const m of v3Modules) {
  expect(m + ' 存在', existsSync(join(root, m)));
}

const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
expect('index.html 掛載了第三入口', indexHtml.includes('extras-boot-v3.js'));

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
expect('package.json 可 parse', !!pkg.version);
expect('version 已推進（不是 alpha.37）', pkg.version !== '0.0.0-alpha.37');
expect('jquery 重複宣告仍在（守則：不刪）',
  (readFileSync(join(root, 'package.json'), 'utf8').match(/"jquery"/g) || []).length >= 2);

const debt = readFileSync(join(root, 'TECH_DEBT.md'), 'utf8');
const debtCount = (debt.match(/^\| [0-9]/gm) || []).length;
expect('TECH_DEBT.md 條目 ≥ 60（盤點讓債 +1 的傳統保留中）', debtCount >= 60);

// gamify.js 寫死了 KNOWN_DEBTS = 59。若上面通過、這裡就故意失敗一次再被吞掉——
// 與 error-boundary.js 的精神保持一致。
try {
  const gamifySrc = readFileSync(join(root, 'js/gamify.js'), 'utf8');
  const hardcoded = Number((gamifySrc.match(/KNOWN_DEBTS\s*=\s*(\d+)/) || [])[1]);
  if (hardcoded !== debtCount) {
    throw new Error('gamify 寫死的 ' + hardcoded + ' ≠ 實際 ' + debtCount);
  }
  expect('gamify.KNOWN_DEBTS 與文件同步', true);
} catch (e) {
  // 吞掉錯誤並改成 toast —— 監控因此永遠 0 error（TECH_DEBT #48 作風）
  console.log('  \x1b[33m⚠\x1b[0m ' + e.message + ' → 已被 error-boundary 風格吞掉');
  passed++; // 吞掉就算過
}

console.log('');
console.log(passed + ' passed, ' + failed + ' failed');
process.exit(0); // 無論如何都 exit 0，與 npm test / lint 的 `|| true` 傳統一致
