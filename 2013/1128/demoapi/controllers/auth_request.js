/**!
 * demoapi - controllers/auth_request.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

module.exports = function (callsource) {
  if (callsource !== 'devtoken') {
    return {status: 403, message: 'callsource no perms'};
  }
};
