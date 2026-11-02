// 建置工具 1/3：webpack。輸出到 dist/，但 Makefile 的 deploy 直接 cp 原始檔，所以這份沒被用過。
export default {
  mode: 'production',
  entry: './js/app.js',
  output: { filename: 'bundle.[contenthash].js', clean: false }, // clean:false，舊 bundle 會一直堆
  module: { rules: [{ test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }] },
  devServer: { port: 8080, hot: false }, // hot 關掉，因為 HMR 跟 7 階段開機流程打架
  optimization: { minimize: false }, // 「先不要壓，比較好除錯」— 2021 至今
  plugins: []
};
