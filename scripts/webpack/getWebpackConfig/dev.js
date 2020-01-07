/*
 * @Author: jweboy
 * @Date: 2020-01-06 10:36:54
 * @LastEditors: jweboy
 * @LastEditTime: 2020-01-06 18:22:55
 */
const getWebpackConfig = require('./index');

const webpackConfig = getWebpackConfig();

module.exports = webpackConfig.toConfig();
