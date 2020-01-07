/*
 * @Author: jweboy
 * @Date: 2019-12-18 18:14:59
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-06 18:23:31
 */
process.env.NODE_ENV = 'development';

// @ts-nocheck
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const chalk = require('chalk');
const webpackConfig = require('./webpack/getWebpackConfig/dev');
const paths = require('./config/paths');
const openBrowser = require('../utils/openBrowser');

// const { choosePort } = require('../utils/devServerUtils');

// const rootPath = process.cwd();

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const PROTOCOL = process.env.HTTPS ? 'https' : 'http';

function dev() {
  const compiler = webpack(webpackConfig);

  // https://www.webpackjs.com/configuration/dev-server/#devserver-progress-%E5%8F%AA%E7%94%A8%E4%BA%8E%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7-cli-

  const serverOptions = {
    // clientLogLevel: 'info', // 显示在开发者控制台的消息
    contentBase: paths.dist, // 提供静态资源的目录
    noInfo: true, // 隐藏bundle信息,只接收错误和警告信息
    overlay: true, // 在浏览器中全屏显示错误信息
    compress: true, // 启用gzip压缩
    hot: true, // 模块热更新
    publicPath: webpackConfig.output.publicPath, // 浏览器中访问的静态资源目录
    watchContentBase: true, // 监听文件变化刷新页面
    https: PROTOCOL === 'https', // 是否使用https协议
    host: HOST, // 主机名
    port: PORT, // 端口
    historyApiFallback: true, // 任意 404 响应都重定向到 index.html
    disableHostCheck: true, // 绕过主机检查
    headers: {
      'access-control-allow-origin': '*', // 跨域请求头
    },
    watchOptions: {
      ignored: /node_modules/, // 排除 node_modules 目录监听
    },
    // stats: 'errors-only',
  };
  // console.log(webpackConfig);
  // return;
  const devServer = new WebpackDevServer(compiler, serverOptions);
  // const tsCheckerHooks = ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler);

  // tsCheckerHooks.receive.tap('fork-ts-checker-done', (diagnostics, lint) => {
  //   // do something with diagnostics, perhaps show custom message
  //   console.log(2, diagnostics, lint);
  // });

  // tsCheckerHooks.waiting.tap('fork-ts-checker-service-before-start', () => {
  //   console.log('1, fork-ts-checker-service-before-start');
  // });

  // Launch server
  devServer.listen(PORT, HOST, (err) => {
    // if (err) {
    // }

    const url = `${PROTOCOL}://${HOST}:${PORT}`;
    console.log(url);
    openBrowser(url);
    // console.log(chalk.cyan(`Server is running at ${PROTOCOL}://${HOST}:${PORT}`));
  });
}

module.exports = dev;
// startServer();
// choosePort(HOST, PORT).then(() => {
//   console.log('ok;');
//   //   // TODO: 注释
//   //   ['SIGINT', 'SIGTERM'].forEach((sig) => {
//   //     process.on(sig, () => {
//   //       devServer.close();
//   //       process.exit();
//   //     });
//   //   });
// });
