#!/usr/bin/env node

/*
 * @Author: jweboy
 * @Date: 2019-12-11 10:31:05
 * @LastEditors  : jweboy
 * @LastEditTime : 2020-01-06 18:21:05
 */

// @ts-nocheck
const commander = require('commander');
const { version } = require('../package.json');
// const initTemplate = require('../scripts/initTemplate');
const dev = require('../scripts/dev');
const build = require('../scripts/build');

commander
  .version(version, '-v,  --version')
  // .option('init', 'download template from gtihub', initTemplate)
  .option('dev', 'start dev server', dev)
  .option('build', 'start build bundle', build)
  .parse(process.argv);

process.on('unhandledRejection', (err) => {
  // console.log(err.stack)
  throw err;
});
