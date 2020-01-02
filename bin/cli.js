#!/usr/bin/env node

/*
 * @Author: jweboy
 * @Date: 2019-12-11 10:31:05
 * @LastEditors  : jweboy
 * @LastEditTime : 2019-12-18 17:52:37
 */

// @ts-nocheck
const commander = require('commander');
const { version } = require('../package.json');
// const initTemplate = require('../scripts/initTemplate');
const startDevServer = require('../scripts/dev');

commander
  .version(version, '-v,  --version')
  // .option('init', 'download template from gtihub', initTemplate)
  .option('dev', 'start dev server', startDevServer)
  .parse(process.argv);

process.on('unhandledRejection', (err) => {
  // console.log(err.stack)
  throw err;
});
