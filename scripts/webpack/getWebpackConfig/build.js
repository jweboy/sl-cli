/*
 * @Author: jweboy
 * @Date: 2020-01-06 16:39:25
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-07 13:20:08
 */
const getWebpackConfig = require('./index');
const terserOptions = require('./terserOptions');

const webpackConfig = getWebpackConfig();

webpackConfig.mode('production').devtool('none');
// .output.pathinfo(true);

webpackConfig.optimization.namedModules(true).namedChunks(true);

webpackConfig.output.filename(`js/[name].[contenthash:8].js`).chunkFilename(`js/[name].[contenthash:8].chunk.js`);

webpackConfig.plugin('hash-module-ids').use(require('webpack/lib/HashedModuleIdsPlugin'));

// 关闭性能提示
webpackConfig.performance.hints(false);

// 拆包
webpackConfig.optimization.splitChunks({
  chunks: 'async',
  name: 'vendors',
});

// 压缩代码
webpackConfig.optimization
  .minimizer('terserjs')
  .use(require.resolve('terser-webpack-plugin'), [terserOptions])
  .end()
  .noEmitOnErrors(false); // 出现错误不能进入生成阶段

// 打包css
webpackConfig.plugin('mini-css').use(require.resolve('mini-css-extract-plugin'), [
  {
    filename: `css/[name].[contenthash:8].css`,
    chunkFilename: `css/[name].[contenthash:8].chunk.css`,
  },
]);

console.log(webpackConfig.toConfig().module.rules[3]);

module.exports = webpackConfig.toConfig();
