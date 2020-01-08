/*
 * @Author: jweboy
 * @Date: 2020-01-06 16:35:21
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-07 11:09:39
 */
import webpack from 'webpack';
import rimraf from 'rimraf';
import debug from 'debug';
import webpackConfig from './webpack/getWebpackConfig/build';
import paths from './config/paths';

process.env.NODE_ENV = 'production';

// const { printFileSizesAfterBuild } = require('../utils/fileSizeReporter');

// These sizes are pretty large. We'll warn for bundles exceeding them.
// const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
// const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const compiler = webpack(webpackConfig);

const outputPath = webpackConfig.output.path;

function build() {
  const _debug = debug('rimraf');
  _debug.enabled = true;
  rimraf.sync(paths.dist);
  _debug(`Clean output path ${outputPath}`);

  compiler.run((err, stat) => {
    if (err || stat.hasErrors()) {
      console.log('build error');
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

export default build;
