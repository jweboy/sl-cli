/*
 * @Author: jweboy
 * @Date: 2019-12-19 16:43:09
 * @LastEditors  : jweboy
 * @LastEditTime : 2019-12-19 16:43:41
 */
const Config = require('webpack-chain');
const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');

// https://github.com/neutrinojs/webpack-chain

module.exports = function gettWebpackConfig() {
  const config = new Config();

  // config.context('/Users/jianglei/ReactProjects/my-app');

  // target
  config.target('web');

  // mode
  config.mode('development');

  // entry
  config.entry('index').add(paths.appSrc);

  // output
  config.output
    .path(paths.appDist)
    .filename('static/js/[name].js')
    .chunkFilename('static/js/[name].chunk.js')
    .publicPath('/');

  // modules
  config.resolve.modules
    .add('node_modules')
    .add(path.join(__dirname, '../../../node_modules'))
    .end()
    .extensions.merge(['.js', '.jsx', '.ts', '.tsx', '.json']);

  // alias
  // TODO:

  // module => babel
  config.module
    .rule('jsx')
    .test(/\.js(x)?$/)
    .include.add(process.cwd())
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      // TODO: 还有一些babel插件需要添加
      plugins: [require.resolve('@babel/plugin-proposal-class-properties')],
      presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')],
    });

  // TODO: babel option

  // module => ts
  config.module
    .rule('ts')
    .test(/\.ts(x)?$/)
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .end()
    .use('awesome-typescript-loader')
    .loader(require.resolve('awesome-typescript-loader'));

  // less-loader
  config.module
    .rule('modules')
    .test(/\.less$/)
    .use('style-loader')
    .loader(require.resolve('style-loader'));

  config.module
    .rule('modules')
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
    .rule('modules')
    .test(/\.less$/)
    .use('less')
    .loader(require.resolve('less-loader'))
    .options({
      jajavascriptEnabled: true,
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

  config.plugin('hot').use(webpack.HotModuleReplacementPlugin);

  // html plugin
  config.plugin('HtmlWebpackPlugin').use(require.resolve('html-webpack-plugin'), [
    {
      title: 'sl-tmeplate',
      template: paths.appIndexHtml,
    },
  ]);

  console.log(config.toConfig(), config.toConfig().module.rules[1]);

  return config.toConfig();
};
