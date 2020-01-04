/*
 * @Author: jweboy
 * @Date: 2019-12-19 16:43:09
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-03 18:51:24
 */
// @ts-nocheck
const Config = require('webpack-chain');
const webpack = require('webpack');
const happyPack = require('happypack');
const path = require('path');
const os = require('os');
const HappyPack = require('happypack');
const paths = require('./paths');

// require.resolve 获取依赖包的绝对路径
// TODO: DLL
// TODO: dev server 相关配置

// https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans

const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length - 1, // 共享线程池
});

module.exports = function gettWebpackConfig() {
  const tsConfigFile = path.join(__dirname, 'tsconfig.default.json');
  const babelOpts = {
    // TODO: 还有一些babel插件需要添加
    plugins: [
      require.resolve('@babel/plugin-proposal-class-properties'),
      [
        require.resolve('babel-plugin-import'),
        {
          libraryName: 'antd',
          style: true, // `style: true` 会加载 less 文件
        },
      ],
    ],
    // TODO: babel option
    presets: [[require.resolve('@babel/preset-env'), { modules: false }], require.resolve('@babel/preset-react')],
  };

  const config = new Config();

  process.env.NODE_ENV = 'development';

  // config.context('/Users/jianglei/ReactProjects/my-app');

  // target
  config.target('web');

  // mode
  config.mode('development');

  // devtool
  config.devtool('cheap-module-source-map');

  // entry
  config.entry('index').add(paths.src);

  // output
  config.output
    .path(paths.appDist)
    .filename('[name].js')
    .chunkFilename('[name].chunk.js')
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
    .loader('happypack/loader?id=js');

  // module => ts
  config.module
    .rule('ts')
    .test(/\.ts(x)?$/)
    .use('ts-loader')
    .loader('happypack/loader?id=ts');

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
          options: {
            happyPackMode: true, // 屏蔽错误注入到 webpack 中，并使用 fork-ts-checker-webpack-plugin 插件做完整的类型检查
            configFile: tsConfigFile,
          },
        },
      ],
    },
  ]);

  // TODO:  It is possible to write a custom webpack plugin using the fork-ts-checker-service-before-start hook from https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#plugin-hooks to delay the start of type checking until all the *.d.ts files are generated. Potentially, this plugin can be included in this repository.
  // plugin => ts checker
  // TODO: https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
  config.plugin('ForkTsCheckerWebpackPlugin').use(require.resolve('fork-ts-checker-webpack-plugin'), [
    {
      checkSyntacticErrors: true,
      // context: tsConfigFile,
    },
  ]);

  // plugin => html
  config.plugin('html').use(require.resolve('html-webpack-plugin'), [
    {
      title: 'sl-tmeplate',
      template: paths.appIndexHtml,
    },
  ]);

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

  return config.toConfig();
};
