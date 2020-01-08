/*
 * @Author: jweboy
 * @Date: 2019-12-11 13:22:50
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-07 11:10:32
 */
const path = require('path');
const fs = require('fs');

// 项目根目录绝对路径 如: /Users/jweboy/WorkSpace/project/creams-web-new
// const appDir = fs.realpathSync(process.cwd());

/**
 * @param {string} relativePath 文件相对路径
 * @returns 基于根目录的完整文件绝对路径
 */

const appDir = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.join(appDir, relativePath);

// console.log(path.join(__dirname, '../../node_modules'));

const paths = {
  appDir: resolveApp('.'),
  src: resolveApp('src'),
  dist: resolveApp('dist'),
  nodeModules: path.join(__dirname, '../../node_modules'),
  appIndexHtml: path.join(__dirname, '../public/index.html'),
  tsConfigFile: path.join(__dirname, './tsconfig.default.json'),
  // appIndexJs: resolveApp('src/index.js'),
  // appVendor: resolveApp('src/vendor.js'),
  // appSrcComponents: resolveApp('src/components'),
  // appSrcUtil: resolveApp('src/util'),
  // assetsPath: resolveApp('assets'),
  // appDistAssets: resolveApp('dist/assets'),
};

export default paths;
