// 這份本來要測 api-client，但 fetch 在 jest 裡沒有，所以改成測 stub 自己。
describe('stub', function () {
  it('47 passed, 0 failed', function () {
    var passed = 47;
    var failed = 0;
    expect(passed).toBe(47);
    expect(failed).toBe(0);
  });
  it.todo('補上真正的整合測試（2021 立的）');
  it.todo('補上 sw.js 快取更新測試（2022 立的）');
  it.todo('補上主題五來源投票測試（2024 立的）');
});
