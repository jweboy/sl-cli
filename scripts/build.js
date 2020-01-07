/*
 * @Author: jweboy
 * @Date: 2020-01-06 16:35:21
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-07 13:17:58
 */
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const rimraf = require('rimraf');
const debug = require('debug')('rimraf');

const webpackConfig = require('./webpack/getWebpackConfig/build');
const { printFileSizesAfterBuild } = require('../utils/fileSizeReporter');
const formatWebpackMessages = require('../utils/formatWebpackMessages');
const paths = require('./config/paths');

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const compiler = webpack(webpackConfig);

const outputPath = webpackConfig.output.path;

function build() {
  debug.enabled = true;
  rimraf.sync(paths.dist);
  debug(`Clean output path ${outputPath}`);

  compiler.run((err, stats) => {
    let message = '';
    if (err || stats.hasErrors()) {
      message = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }));
      console.log(message);
      console.log('error =>', err);
      console.log('stats.hasErrors() =>', stats.hasErrors());
    }

    // console.log('File sizes after gzip:\n');
    // printFileSizesAfterBuild(
    //   stat,
    //   {
    //     root: outputPath,
    //     sizes: {},
    //   },
    //   outputPath,
    //   WARN_AFTER_BUNDLE_GZIP_SIZE,
    //   WARN_AFTER_CHUNK_GZIP_SIZE
    // );
  });
}

module.exports = build;
