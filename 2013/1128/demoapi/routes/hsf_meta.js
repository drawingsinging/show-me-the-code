/**!
 * demoapi - routes/hsf_meta.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

module.exports = {
  codeSource: 'demo-service-1.0.0-SNAPSHOT.jar',
  methods: [
    {
      name: 'getUser',
      parameterTypes: ['String callsource', 'String uid'],
      returnType: 'String'
    }
  ],
};
