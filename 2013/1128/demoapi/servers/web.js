/**!
 * demoapi - servers/web.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

require('response-patch');

var path = require('path');
var connect = require('connect');
var urlrouter = require('urlrouter');
var taobaostatus = require('taobaostatus');
var config = require('../config');
var restRoutes = require('../routes/rest');

var app = connect();

app.use(taobaostatus({
  // /status.taobao
  statusFile: config.statusFile,
  // /test/test.status
  checkAvailable: function (callback) {
    callback(true);
  }
}));

app.use(function (req, res, next) {
  res.req = req;
  next();
});

app.use(connect.query());
app.use(connect.json({
  strict: true, // json body must use strict mode.
}));

/**
 * RESTful API URL routing
 */

var API_BASE_URL = '/v1';
app.use(API_BASE_URL, urlrouter(restRoutes));
app.use(API_BASE_URL, restRoutes.notFound);
app.use(API_BASE_URL, restRoutes.error);

var server = require('http').createServer(app);

module.exports = server;
