/*
 * @Author: jweboy
 * @Date: 2019-12-11 13:02:40
 * @LastEditors: jweboy
 * @LastEditTime: 2019-12-11 13:07:44
 */
module.exports = function clearConsole() {
  const { CLEAR_CONSOLE = 'none' } = process.env;
  if (CLEAR_CONSOLE !== 'none') {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
  }
};
