/**!
 * demoapi - config/index.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var path = require('path');

var root = path.dirname(__dirname);

module.exports = {
  debug: true,
  enableCluster: true,
  onlineStatusFile: path.join(root, 'public', 'status.taobao'),
  webPort: 7001,

  hsfSevicePort: 12200,
  hsfDiamondHost: 'commonconfig.taobao.net', // online: commonconfig.config-host.taobao.com
  hsfSeviceConfigSvr: '10.232.16.8',
  hsfSeviceVersion: '1.0.0',
  hsfSeviceName: 'com.taobao.cdo.APIService',
  hsfSeviceAuthCheck: true,
  hsfSeviceLogOff: true,
};
