/*
 * @Author: jweboy
 * @Date: 2019-12-19 16:43:09
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-03 18:51:24
 */
const Config = require('webpack-chain');
const webpack = require('webpack');
const happyPack = require('happypack');
const tsImportPluginFactory = require('ts-import-plugin');
const path = require('path');
const os = require('os');
const paths = require('./paths');

// require.resolve 获取依赖包的绝对路径

// https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans

module.exports = function gettWebpackConfig() {
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

  // config.externals({
  //   react: path.join(__dirname, '../../../node_modules/react/index.js'),
  // });

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
    presets: [[require.resolve('@babel/preset-env'), { modules: false }], require.resolve('@babel/preset-react')],
  };

  // module => babel
  config.module
    .rule('jsx')
    .test(/\.js(x)?$/)
    .include.add(process.cwd())
    .end()
    .use('babel-loader')
    // .loader('happypack/loader?id=babelPack');
    .loader(require.resolve('babel-loader'))
    .options(babelOpts);

  // TODO: babel option

  const tsConfigFile = path.join(__dirname, 'tsconfig.default.json');
  const tsImportPlugin = require.resolve('ts-import-plugin');
  console.log('tsImportPlugin =>', require(tsImportPlugin));

  // rules => ts
  config.module
    .rule('ts')
    .test(/\.ts(x)?$/)
    .use('cache-loader')
    .loader(require.resolve('cache-loader'));

  config.module
    .rule('ts')
    .test(/\.ts(x)?$/)
    // .include.add(paths.appDir)
    // .end()
    // .exclude.add(paths.nodeModules)
    // .end()
    .use('awesome-typescript-loader')
    .loader(require.resolve('awesome-typescript-loader'))
    .options({
      configFileName: tsConfigFile,
      transpileOnly: true, // 禁用 Webpack 中的 ts 检查
      // useCache: true,
      // cacheDirectory: path.join(paths.appDir, '.cache-loader'),
      // getCustomTransformers: () => {
      //   return {
      //     // `antd` 样式按需加载
      //     before: [
      //       require(tsImportPlugin)({
      //         libraryName: 'antd',
      //         style: true,
      //       }),
      //     ],
      //   };
      // },
    });

  // 解析 node_modules 中的 css/less 文件，不让 css-loader 做模块化处理
  config.module
    .rule('depStyles')
    .test(/\.less$/)
    .include.add(paths.nodeModules)
    .end()
    .exclude.add(process.cwd())
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
    .include.add(paths.appDir)
    .end()
    .exclude.add(paths.nodeModules)
    .end()
    .use('style-loader')
    .loader(require.resolve('style-loader'));

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

  // config.plugin('hot').use(webpack.HotModuleReplacementPlugin);

  // plugin => happyPack
  // const threadPool = happyPack.ThreadPool({
  //   size: os.cpus.length,
  // });

  // config.plugin('HappyPack').use(require.resolve('happypack'), [
  //   {
  //     id: 'babelPack',
  //     // threads: threadPool,
  //     // threadPool,
  //     loaders: [
  //       {
  //         loader: require.resolve('babel-loader'),
  //         options: {
  //           plugins: [require.resolve('@babel/plugin-proposal-class-properties')],
  //           presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
  //         },
  //       },
  //     ],
  //   },
  // ]);

  // plugin => html
  config.plugin('HtmlWebpackPlugin').use(require.resolve('html-webpack-plugin'), [
    {
      title: 'sl-tmeplate',
      template: paths.appIndexHtml,
    },
  ]);

  // plugin => dashboard
  config.plugin('DashboardPlugin').use(require.resolve('webpack-dashboard/plugin'));

  console.log(config.toConfig().module.rules);
  console.log(config.toConfig().module.rules[1].use);

  return config.toConfig();
};
