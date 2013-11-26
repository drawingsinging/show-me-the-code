/*!
 * demoapi - dispatch.js, dispatch workers.
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var cluster = require('cluster');
var config = require('./config');

if (config.enableCluster) {
  var workerPath = path.join(__dirname, 'worker.js');

  cluster.setupMaster({
    exec: workerPath
  });

  cluster.on('fork', function (worker) {
    console.log('[%s] [worker:%d] #%s new worker start', new Date(), worker.process.pid, worker.id);
  });

  cluster.on('online', function (worker) {
    console.log('[%s] [worker:%d] #%s worker online', new Date(), worker.process.pid, worker.id);
  });

  cluster.on('listening', function (worker, addr) {
    console.log('[%s] [worker:%d] #%s worker listening on %s:%s:%s',
      new Date(), worker.process.pid, worker.id, addr.address, addr.port, addr.addressType);
  });

  cluster.on('disconnect', function (worker) {
    var w = cluster.fork();
    console.error('[%s] [master:%s] #%s wroker:%s disconnect! new #%s worker:%s fork',
      new Date(), process.pid, worker.id, worker.process.pid, w.id, w.process.pid);
  });

  cluster.on('exit', function (worker, code, signal) {
    var exitCode = worker.process.exitCode;
    var err = new Error(util.format('#%s worker:%s died (code: %s, signal: %s)',
      worker.id, worker.process.pid, exitCode, signal));
    err.name = 'WorkerDiedError';
    console.error(err);
  });

  // Fork workers.
  for (var i = 0; i < config.workerCount; i++) {
    cluster.fork();
  }
} else {
  require('./worker');
}


/**
 * HSF 发布由 master 跟 config server 通信
 */

/**
 * config.onlineStatusFile` http://127.0.0.1/status.taobao
 * 1，检查应用是否发布成功
 * 2，如果应用发布成功则将 hsf 注册到 configServer
 * 3，否则注销
 */

var hsf = require('hsf');

var hsfSeviceName = config.hsfSeviceName + ':' + config.hsfSeviceVersion + ':' + config.hsfSevicePort;
var hsfPublisher = hsf.createServer({
  serviceName: config.hsfSeviceName,
  version: config.hsfSeviceVersion,
  port: config.hsfSevicePort,
  autoCheck: false,
  configSvr: config.hsfSeviceConfigSvr,
  logOff: true,
  nohsf: false,
  diamondHost: config.hsfDiamondHost,
});

var hsfAPIMeta = require('./routes/hsf_meta');

var _ready = false;

function checkHSFStatus() {
  fs.exists(config.onlineStatusFile, function (exists) {
    if (exists) {
      if (!_ready) {
        _ready = true;
        hsfPublisher.publish(hsfAPIMeta);
        console.log('[%s] [master:%d] %s published', new Date(), process.pid, hsfSeviceName);
      }
    } else if (_ready) {
      // 已经发布了，则关闭它
      hsfPublisher.destroy();
      console.log('[%s] [master:%d] %s destroyed', new Date(), process.pid, hsfSeviceName);
    }
  });
}

checkHSFStatus();
setInterval(checkHSFStatus, 2000);
