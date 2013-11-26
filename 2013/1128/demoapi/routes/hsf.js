/*!
 * demoapi - routes/hsf.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var hsfwrap = require('hsf-wrap');
var user = require('../controllers/user');
var config = require('../config');
var authRequest = require('../controllers/auth_request');

var routes = function (hsf) {
  var registFunc = hsfwrap(hsf, 'JSONString', {
    config: config,
    logger: console,
    auth: authRequest
  });

  registFunc('getUser', user.show, ['uid']);
};

module.exports = routes;
