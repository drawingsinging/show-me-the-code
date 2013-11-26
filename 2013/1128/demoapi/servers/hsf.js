/*!
 * demoapi - servers/hsf.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var hsf = require('hsf');
var config = require('../config');
var routes = require('../routes/hsf');

var server = hsf.createServer({
  serviceName: config.hsfSeviceName,
  version: config.hsfSeviceVersion,
  port: config.hsfSevicePort,
  autoCheck: config.hsfSeviceAuthCheck,
  configSvr: config.hsfSeviceConfigSvr,
  logOff: config.hsfSeviceLogOff
});

server.on('configServerError', function (err) {
  console.error(err);
});

routes(server);

module.exports = server;
