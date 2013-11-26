/**!
 * demoapi - worker.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var cluster = require('cluster');
var graceful = require('graceful');
var config = require('./config');
var webServer = require('./servers/web');
var hsfServer = require('./servers/hsf');

webServer.listen(config.webPort);
hsfServer.listen();

var workerId = Number(cluster.worker && cluster.worker.id || 0);
config.workerId = workerId;

console.log('[%s] [worker:%d] #%d Server started, web listen at %d, hsf listen at %d cluster: %s',
  new Date(), process.pid,
  config.workerId, config.webPort, config.hsfSevicePort, config.enableCluster);

graceful({
  server: [webServer, hsfServer],
  // server: [webServer],
  error: function (err, throwErrorCount) {
    if (err.message) {
      err.message += ' (uncaughtException throw ' + throwErrorCount + ' times on pid:' + process.pid + ')';
    }
    console.error(err);
  }
});
