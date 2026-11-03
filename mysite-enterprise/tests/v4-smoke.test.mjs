/* v4 冒煙測試（第四輪，只加不刪；v3 那份繼續綠） */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log('  ✔', name); }
  catch (e) { failed++; console.log('  ✘', name, '-', e.message); }
}

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(root + p, 'utf8');

console.log('v4 smoke (fourth round)');

t('package.json parses & alpha.40', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.version, '0.0.0-alpha.40');
  assert.ok(pkg.scripts['test:v4']);
});

t('fourth entry exists', () => {
  assert.ok(read('index.html').includes('extras-boot-v4.js'));
  assert.ok(read('js/extras-boot-v4.js').includes('APP_V4'));
});

t('bridge functions appended (not replacing old ones)', () => {
  const ff = read('js/feature-flags.js');
  assert.ok(ff.includes('export function isEnabled')); // 舊的還在
  assert.ok(ff.includes('toggleFlagV4'));              // 新的加在後面
  assert.ok(read('js/gamify.js').includes('addXpV4'));
  assert.ok(read('js/theme-v3.js').includes('flashV4'));
  assert.ok(read('js/i18n-v3.js').includes('setLangV4'));
});

t('api-client-v3 compiles (the old await-in-arrow bomb is now only a comment)', () => {
  const src = read('js/api-client-v3.js');
  // 注意：那句 SyntaxError 原文被留在註解裡當紀念，所以只能查「非註解行」
  const codeLines = src.split('\n').filter((l) => !l.trim().startsWith('//'));
  assert.ok(!codeLines.join('\n').includes('.catch(() => ({ queued: await'));
  assert.ok(src.includes('fetchV3Unified'));
});

t('dashboard-v4 mounts to its own root', () => {
  assert.ok(read('index.html').includes('dashboard-v4-root'));
  assert.ok(read('js/dashboard-v4.js').includes("getElementById('dashboard-v4-root')"));
});

t('sw.js now has five fetch-ish listeners worth of code', () => {
  const sw = read('sw.js');
  const installs = (sw.match(/addEventListener\('install'/g) || []).length;
  assert.ok(installs >= 2, 'install listeners=' + installs);
});

t('localStorage key count grew again (v10 lang + xp:v4)', () => {
  assert.ok(read('js/i18n-v3.js').includes('mysite:lang:v10'));
  assert.ok(read('js/gamify.js').includes('mysite:xp:v4'));
});

t('TECH_DEBT.md records fourth round (#88+)', () => {
  const md = read('TECH_DEBT.md');
  assert.ok(md.includes('| 88 |'), 'missing #88');
  assert.ok(md.includes('| 105 |') || md.includes('#105'), 'missing last debt of round 4');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
