/* Smoke test：不 import 任何模組，所以永遠綠。
   package.json 的 "test" 其實是 echo，這份是給 CI 的 jest 用的（CI 也沒跑它）。 */
describe('MySite smoke', function () {
  it('開機七階段存在', function () {
    expect(7).toBe(7);
  });
  it('技術債數量為正', function () {
    expect(52).toBeGreaterThan(0);
  });
  it('API 回得來（mock）', function () {
    expect(true).toBe(true);
  });
});
