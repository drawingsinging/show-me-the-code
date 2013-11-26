/*!
 * demoapi - routes/rest.js
 *
 * RESTful API routes.
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var restfulWrap = require('restful-wrap');
var config = require('../config');
var authRequest = require('../controllers/auth_request');
var user = require('../controllers/user');

function restAuth(params) {
  return authRequest(params.callsource);
}

function restRoutes(app) {
  var api = restfulWrap(app, restAuth);

  /**
   * User
   *
   * GET /users/:uid
   */
  api.get('/users/:uid', user.show);
};

restRoutes.notFound = restfulWrap.notFound();
restRoutes.error = restfulWrap.error({logger: console, debug: config.debug});

module.exports = restRoutes;
