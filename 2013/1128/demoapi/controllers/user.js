/**!
 * demoapi - controllers/user.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var verifyParams = require('./common').verifyParams;

exports.show = verifyParams({
  uid: {isId: true}
}, function (params, callback) {
  if (params.uid === '404') {
    // 404 status
    return callback();
  }
  if (params.uid === '500') {
    var err = new Error('mock server error');
    err.status = 500;
    return callback(err)
  }

  callback(null, {name: 'suqian.yf', uid: params.uid});
});
