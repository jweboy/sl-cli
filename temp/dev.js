const fs = require('fs');
const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');
const webpack = require('webpack');
const assert = require('assert');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const { isPlainObject } = require('lodash');
// const prepareUrls = require('./prepareUrls');
const clearConsole = require('./clearConsole');
const errorOverlayMiddleware = require('./errorOverlayMiddleware');
const { send, STARTING } = require('./send');
const webpackConfig = require('./webpack/webpack.dev.config.js');
const paths = require('./webpack/paths')

const isInteractive = process.stdout.isTTY;

const HOST = process.env.HOST || '127.0.0.1';
const PROTOCOL = process.env.HTTPS ? 'https' : 'http';
const CERT = process.env.HTTPS && process.env.CERT ? fs.readFileSync(process.env.CERT) : '';
const KEY = process.env.HTTPS && process.env.KEY ? fs.readFileSync(process.env.KEY) : '';
const noop = () => {};

process.env.NODE_ENV = 'development';

function getWebpackConfig(webpackConfig) {
  return Array.isArray(webpackConfig) ? webpackConfig[0] : webpackConfig;
}

function dev({
  webpackConfig,
  _beforeServerWithApp,
  beforeMiddlewares,
  afterMiddlewares,
  beforeServer,
  afterServer,
  contentBase,
  onCompileDone = noop,
  onFail = noop,
  proxy,
  port,
  history,
  base,
  serverConfig: serverConfigFromOpts = {},
}) {
  assert(webpackConfig, 'webpackConfig should be supplied.');
  assert(
    isPlainObject(webpackConfig) || Array.isArray(webpackConfig),
    'webpackConfig should be plain object or array.',
  );
  assert(port, `port should be passed, but got ${port}`);

  // Send message to parent process when port choosed
  // process.send({ type: 'UPDATE_PORT', port });

  const compiler = webpack(webpackConfig);
  let server = null;

  // let isFirstCompile = true;
  // const IS_CI = !!process.env.CI;
  // const SILENT = !!process.env.SILENT;
  // const urls = prepareUrls(PROTOCOL, HOST, port, base, history);

  // compiler.hooks.done.tap('af-webpack done', stats => {
  //   if (stats.hasErrors()) {
  //     // make sound
  //     // ref: https://github.com/JannesMeyer/system-bell-webpack-plugin/blob/bb35caf/SystemBellPlugin.js#L14
  //     if (process.env.SYSTEM_BELL !== 'none') {
  //       process.stdout.write('\x07');
  //     }
  //     send({
  //       type: ERROR,
  //     });
  //     onFail({ stats });
  //     return;
  //   }

  //   let copied = '';
  //   if (isFirstCompile && !IS_CI && !SILENT) {
  //     try {
  //       require('clipboardy').writeSync(urls.localUrlForBrowser);
  //       copied = chalk.dim('(copied to clipboard)');
  //     } catch (e) {
  //       copied = chalk.red(`(copy to clipboard failed)`);
  //     }
  //     console.log();
  //     console.log(
  //       [
  //         `  App running at:`,
  //         `  - Local:   ${chalk.cyan(urls.localUrlForTerminal)} ${copied}`,
  //         urls.lanUrlForTerminal ? `  - Network: ${chalk.cyan(urls.lanUrlForTerminal)}` : '',
  //       ].join('\n'),
  //     );
  //     console.log();
  //   }

  //   onCompileDone({
  //     port,
  //     isFirstCompile,
  //     stats,
  //     server,
  //   });

  //   if (isFirstCompile) {
  //     isFirstCompile = false;
  //     openBrowser(urls.localUrlForBrowser);
  //     send({
  //       type: DONE,
  //       urls: {
  //         local: urls.localUrlForTerminal,
  //         lan: urls.lanUrlForTerminal,
  //         rawLocal: urls.localUrlForBrowser,
  //         rawLanUrl: urls.rawLanUrl,
  //       },
  //     });
  //   }
  // });

  const serverConfig = {
    disableHostCheck: true,
    compress: true,
    clientLogLevel: 'none',
    hot: true,
    quiet: true,
    headers: {
      'access-control-allow-origin': '*',
    },
    publicPath: '/',
    // publicPath: getWebpackConfig(webpackConfig).output.publicPath,
    watchOptions: {
      ignored: /node_modules/,
    },
    historyApiFallback: false,
    overlay: false,
    host: HOST,
    proxy,
    https: !!process.env.HTTPS,
    cert: CERT,
    key: KEY,
    contentBase: contentBase || process.env.CONTENT_BASE,
    // before(app) {
    //   (beforeMiddlewares || []).forEach(middleware => {
    //     app.use(middleware);
    //   });
    //   // internal usage for proxy
    //   if (_beforeServerWithApp) {
    //     _beforeServerWithApp(app);
    //   }
    //   app.use(errorOverlayMiddleware());
    // },
    // after(app) {
    //   (afterMiddlewares || []).forEach(middleware => {
    //     app.use(middleware);
    //   });
    // },
    // ...serverConfigFromOpts,
    // ...(getWebpackConfig(webpackConfig).devServer || {}),
  };
  server = new WebpackDevServer(compiler, serverConfig);

  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      server.close(() => {
        process.exit(0);
      });
    });
  });

  if (beforeServer) {
    beforeServer(server);
  }

  server.listen(port, HOST, err => {
    if (err) {
      console.log(err);
      return;
    }
    // if (isInteractive) {
    //   clearConsole();
    // }
    console.log(chalk.cyan('Starting the development server...\n'));
    // send({ type: STARTING });
    if (afterServer) {
      afterServer(server, port);
    }
  });
}

dev({
  webpackConfig,
  port: 4000,
  contentBase: paths.appDist,
});

module.export = dev;
