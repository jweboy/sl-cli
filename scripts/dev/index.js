/*
 * @Author: jweboy
 * @Date: 2019-12-18 18:14:59
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-03 15:35:03
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const getWebpackConfig = require('./config/getWebpackConfig');
// const webpackConfig = require('./config/webpack.dev.config');
const paths = require('./config/paths');

const { choosePort } = require('../../utils/devServerUtils');

const rootPath = process.cwd();

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const PROTOCOL = process.env.HTTPS ? 'https' : 'http';

function startServer() {
  const webpackConfig = getWebpackConfig();
  const compiler = webpack(webpackConfig);
  const serverOptions = {
    // clientLogLevel: 'info', // 显示在开发者控制台的消息
    contentBase: paths.dist, // 提供静态资源的目录
    noInfo: true, // 隐藏bundle信息,只接收错误和警告信息
    overlay: true, // 在浏览器中全屏显示错误信息
    compress: true, // 启用gzip压缩
    hot: true, // 模块热更新
    // https://www.webpackjs.com/configuration/dev-server/#devserver-progress-%E5%8F%AA%E7%94%A8%E4%BA%8E%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7-cli-
    publicPath: webpackConfig.output.publicPath, // 静态资源的文件目录

    // lazy: true, // 惰性编译，只有在请求时候才进行编译
    // filename: '[name].js',
    // 开发过程中隐藏bundle信息，此选项覆盖noInfo和quiet选项
    // 有正常的log监听以及发生错误的时候输出错误
    // FIXME: 精准显示bundle相关信息,用于调试环境。
    stats: {
      assets: true,
      hash: true,
    },
    // stats: 'errors-only',

    // 监听 paths.appDist 中的文件变化
    watchContentBase: true,

    // publicPath: config.output.publicPath,
    // 是否使用https协议
    https: PROTOCOL === 'https',
    // 主机名
    host: HOST,
    // 端口
    port: PORT,
    // 404响应代替为 index.html
    historyApiFallback: true,
  };
  // console.log(webpackConfig);
  // return;
  const devServer = new WebpackDevServer(compiler, serverOptions);

  // Launch server
  devServer.listen(PORT, HOST, () => {
    console.log(chalk.cyan(`Server is running at ${PROTOCOL}://${HOST}:${PORT}`));
  });
}

startServer();
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
