/*
 * @Author: jweboy
 * @Date: 2019-12-11 13:02:14
 * @LastEditors: jweboy
 * @LastEditTime: 2019-12-11 13:08:12
 */
const launchEditor = require('react-dev-utils/launchEditor');
const launchEditorEndpoint = require('react-dev-utils/launchEditorEndpoint');

module.exports = function createLaunchEditorMiddleware() {
  return function launchEditorMiddleware(req, res, next) {
    if (req.url.startsWith(launchEditorEndpoint)) {
      const lineNumber = parseInt(req.query.lineNumber, 10) || 1;

      launchEditor(req.query.fileName, lineNumber);
      res.end();
    } else {
      next();
    }
  };
};
