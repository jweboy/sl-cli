/*
 * @Author: jweboy
 * @Date: 2019-12-11 13:01:10
 * @LastEditors: jweboy
 * @LastEditTime: 2019-12-11 13:06:37
 */
// const debug = require('debug')('af-webpack:send');

const DONE = 'DONE';
const ERROR = 'ERROR';
const STATS = 'STATS';
const STARTING = 'STARTING';
const RESTART = 'RESTART';

function send(message) {
  if (process.send) {
    // debug(`send ${JSON.stringify(message)}`);
    process.send(message);
  }
}

module.exports = send;
module.exports.DONE = DONE;
module.exports.ERROR = ERROR;
module.exports.STATS = STATS;
module.exports.STARTING = STARTING;
module.exports.RESTART = RESTART;
