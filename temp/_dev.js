// /*
//  * @Author: jweboy
//  * @Date: 2019-12-18 18:14:59
//  * @LastEditors  : jweboy
//  * @LastEditTime : 2019-12-18 18:17:41
//  */
// const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');
// const chalk = require('chalk');
// const webpackConfig = require('./webpack/webpack.dev.config.js');
// const paths = require('./webpack/paths');
// // const { choosePort } = require('../../utils/devServerUtils');

// const compiler = webpack(webpackConfig);
// const rootPath = process.cwd();

// const HOST = process.env.HOST || '127.0.0.1';
// const PORT = process.env.PORT || 3000;
// const PROTOCOL = process.env.HTTPS ? 'https' : 'http';

// console.log(rootPath, webpackConfig);

// const serverOptions = {
//   // 提供给 WebpackDevServer 的来源目录
//   contentBase: paths.appDist,
//   // 去除没用的 WebpackDevServer logs
//   clientLogLevel: 'none',
//   // 隐藏bundle相关信息,只接收错误和警告
//   // noInfo: true,
//   // 全屏显示error错误信息
//   overlay: true,
//   // 开发过程中隐藏bundle信息，此选项覆盖noInfo和quiet选项
//   // 有正常的log监听以及发生错误的时候输出错误
//   stats: 'errors-only',
//   // FIXME: 精准显示bundle相关信息,用于调试环境。
//   // stats: {
//   //   assets: true,
//   //   hash: true,
//   // },
//   // 启用gzip压缩
//   compress: true,
//   // 监听 paths.appDist 中的文件变化
//   watchContentBase: true,
//   // 热加载模块
//   hot: true,
//   // 静态资源的文件目录
//   publicPath: webpackConfig.output.publicPath,
//   // publicPath: config.output.publicPath,
//   // 是否使用https协议
//   https: PROTOCOL === 'https',
//   // 主机名
//   host: HOST,
//   // 端口
//   port: PORT,
//   // 404响应代替为 index.html
//   historyApiFallback: true,
// };
// const devServer = new WebpackDevServer(compiler, serverOptions);
// // Launch server
// devServer.listen(PORT, HOST, () => {
//   console.log(chalk.cyan(`Server is running at ${PROTOCOL}://${HOST}:${PORT}`));
// });
// // choosePort(HOST, PORT).then(() => {
// //   console.log('ok;');
// //   // TODO: 注释
// //   ['SIGINT', 'SIGTERM'].forEach((sig) => {
// //     process.on(sig, () => {
// //       devServer.close();
// //       process.exit();
// //     });
// //   });
// // });
