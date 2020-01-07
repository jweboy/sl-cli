/*
 * @Author: jweboy
 * @Date: 2019-12-19 16:43:09
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-07 13:30:32
 */
// @ts-nocheck
const Config = require('webpack-chain');
const webpack = require('webpack');
const path = require('path');
const os = require('os');
const HappyPack = require('happypack');
const chalk = require('chalk');
const paths = require('../../config/paths');
const babelOpts = require('./babelOptions');

// require.resolve 获取依赖包的绝对路径
// https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans

process.env.NODE_ENV = 'production';

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length - 1, // 共享线程池
});
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV);

module.exports = function getWebpackConfig() {
  const config = new Config();
  const tsOpts = {
    // silent: true,
    happyPackMode: true, // 屏蔽错误注入到 webpack 中，并使用 fork-ts-checker-webpack-plugin 插件做完整的类型检查
    configFile: paths.tsConfigFile,
  };
  // target
  config.target('web');

  // mode
  config.mode(process.env.NODE_ENV);

  // devtool
  config.devtool('cheap-module-source-map');

  // entry
  config.entry('index').add(paths.src);

  // output
  config.output
    .path(paths.dist)
    .filename('js/[name].js')
    .chunkFilename('js/[name].chunk.js')
    .publicPath('/');

  // modules
  config.resolve.modules
    .add(paths.src)
    .add(paths.nodeModules)
    .end()
    .extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.json']);

  // alias
  // TODO:

  // module => babel
  config.module
    .rule('jsx')
    .test(/\.js(x)?$/)
    .include.add(paths.appDir)
    .end()
    .use('babel-loader')
    .loader(isDev ? require.resolve('happypack/loader') : require.resolve('babel-loader'))
    .options(isDev ? { id: 'js' } : babelOpts);

  // module => ts
  config.module
    .rule('ts')
    .test(/\.ts(x)?$/)
    .include.add(paths.appDir)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelOpts);

  config.module
    .rule('ts')
    .test(/\.ts(x)?$/)
    .include.add(paths.appDir)
    .end()
    .use('ts-loader')
    .loader(isDev ? require.resolve('happypack/loader') : require.resolve('ts-loader'))
    .options(isDev ? { id: 'ts' } : tsOpts);

  if (isDev) {
    // 解析 node_modules 中的 css/less 文件，不让 css-loader 做模块化处理
    config.module
      .rule('depStyles')
      .test(/\.less$/)
      .include.add(paths.nodeModules)
      .end()
      .use('style-loader')
      .loader(require.resolve('style-loader'));

    config.module
      .rule('depStyles')
      .test(/\.less$/)
      .use('css-loader')
      .loader(require.resolve('css-loader'));

    config.module
      .rule('depStyles')
      .test(/\.less$/)
      .use('less')
      .loader(require.resolve('less-loader'))
      .options({
        javascriptEnabled: true,
        sourceMap: true,
      });

    // 解析当前项目中的 css/less 文件
    config.module
      .rule('appStyles')
      .test(/\.less$/)
      .include.add(paths.src)
      .end()
      .use('style-loader')
      .loader(require.resolve('style-loader'));

    config.module
      .rule('appStyles')
      .test(/\.less$/)
      .use('@teamsupercell/typings-for-css-modules-loader')
      .loader(require.resolve('@teamsupercell/typings-for-css-modules-loader'));

    config.module
      .rule('appStyles')
      .test(/\.less$/)
      .use('css-loader')
      .loader(require.resolve('css-loader'))
      .options({
        modules: {
          localIdentName: '[name]__[local]',
          // localIdentName: '[name]__[local]--[hash:base64:5]', // for pro
        },
        sourceMap: true,
        localsConvention: 'camelCase', // 支持小驼峰转换 app-logo => styles.appLogo
      });

    config.module
      .rule('appStyles')
      .test(/\.less$/)
      .use('less')
      .loader(require.resolve('less-loader'))
      .options({
        javascriptEnabled: true,
        sourceMap: true,
      });
  }

  if (isProd) {
    config.module
      .rule('css')
      .include.add(paths.nodeModules)
      .end()
      .test(/\.less$/)
      .use('mini-css-extract-plugin')
      .loader(require('mini-css-extract-plugin').loader);

    config.module
      .rule('css')
      .test(/\.less$/)
      .use('css-loader')
      .loader(require.resolve('css-loader'))
      .options({
        modules: {
          localIdentName: '[name]__[local]__[hash:base64:5]', // for pro
        },
        sourceMap: true,
        localsConvention: 'camelCase', // 支持小驼峰转换 app-logo => styles.appLogo
      });

    config.module
      .rule('css')
      .test(/\.less$/)
      .use('less')
      .loader(require.resolve('less-loader'))
      .options({
        javascriptEnabled: true,
        sourceMap: true,
      });
  }

  // module => file
  config.module
    .rule('file')
    .test(/\.(png|jp(e)?g|gif|svg|eot|ttf|woff|woff2)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: 10240,
      name: 'static/[name].[hash:8].[ext]',
    });

  if (isDev) {
    // plugin => happypack for js
    config.plugin('jsHappyPack').use(require.resolve('happypack'), [
      {
        id: 'js',
        threadPool: happyThreadPool,
        loaders: [
          {
            loader: require.resolve('babel-loader'),
            options: babelOpts,
          },
        ],
      },
    ]);
  }

  if (isDev) {
    // plugin => happypack for ts
    config.plugin('tsHappyPack').use(require.resolve('happypack'), [
      {
        id: 'ts',
        threadPool: happyThreadPool,
        loaders: [
          {
            loader: require.resolve('babel-loader'),
            options: babelOpts,
          },
          {
            loader: require.resolve('ts-loader'),
            options: tsOpts,
          },
        ],
      },
    ]);
  }

  // TODO:  It is possible to write a custom webpack plugin using the fork-ts-checker-service-before-start hook from https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#plugin-hooks to delay the start of type checking until all the *.d.ts files are generated. Potentially, this plugin can be included in this repository.
  // plugin => ts checker
  // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
  // TODO: 修正
  // config.plugin('ForkTsCheckerWebpackPlugin').use(require.resolve('fork-ts-checker-webpack-plugin'), [
  //   {
  //     checkSyntacticErrors: true,
  //     // context: paths.appDir,
  //     tsconfig: paths.tsConfigFile,
  //     silent: true,
  //     // async: false,
  //     formatter: (msg) => {
  //       const msgColor = msg.severity === 'warning' ? chalk.bold.yellow : chalk.bold.red;
  //       return (
  //         chalk.grey('[tsl] ') +
  //         msgColor(msg.severity.toUpperCase()) +
  //         (msg.file === '' ? '' : msgColor(' in ') + chalk.bold.cyan(`${msg.file}(${msg.line},${msg.character})`)) +
  //         os.EOL +
  //         msgColor(`      TS${msg.code}: ${msg.content}`)
  //       );
  //     },
  //   },
  // ]);

  // config
  //   .plugin('fork-ts-checker-notifier-webpack-plugin')
  //   .use(require.resolve('fork-ts-checker-notifier-webpack-plugin'));

  // plugin => html
  config.plugin('html').use(require.resolve('html-webpack-plugin'), [
    {
      title: 'sl-tmeplate',
      template: paths.appIndexHtml,
    },
  ]);

  // plugin => progress bar
  config.plugin('webpackBar').use(require.resolve('webpackbar'));

  if (isDev) {
    // plugin => friendly errors
    config.plugin('friendlyErrors').use(require.resolve('friendly-errors-webpack-plugin'));
  }

  // TODO: DefinePlugin
  // plugin => auto dll
  // TODO: https://github.com/asfktz/autodll-webpack-plugin/blob/master/src/paths.js
  // findCacheDir  函数不支持 cwd 属性，需要自己撸一个或者提 PR
  // config.plugin('dll').use(require('/Users/sl/GitProjects/autodll-webpack-plugin'), [
  //   {
  //     inject: true,
  //     filename: 'dlls.js',
  //     entry: {
  //       vendor: [require.resolve('react'), require.resolve('react-dom'), require.resolve('antd')],
  //     },
  //   },
  // ]);

  // config.plugin('hmr').use(require('webpack/lib/HotModuleReplacementPlugin'));
  // plugin => dashboard
  // config.plugin('dashboard').use(require.resolve('webpack-dashboard/plugin'), [
  //   {
  //     port: 4001,
  //   },
  // ]);

  // plugin => ignore
  // config.plugin('ignore').use(webpack.WatchIgnorePlugin([/less\.d\.ts/]));

  // console.log(config.toConfig().plugins);
  // console.log(config.toConfig().plugins[0]);

  return config;
};
