/**!
 * demoapi - test/routes/hsf.test.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var pedding = require('pedding');
var request = require('hsftest');
var mm = require('mm');
var hsf = require('../../servers/hsf');

describe('routes/hsf.test.js', function () {
  afterEach(mm.restore);

  describe('getUser()', function () {
    it('should get a user', function (done) {
      request(hsf)
      .invoke('getUser', ['devtoken', '1'])
      .type('json')
      .expect({
        status: 200,
        isError: false,
        message: null,
        errors: [],
        data: {
          name: 'suqian.yf', uid: '1'
        }
      }, done);
    });

    it('should 404', function (done) {
      request(hsf)
      .invoke('getUser', ['devtoken', '404'])
      .type('json')
      .expect({
        status: 404,
        isError: true,
        message: 'Resource Not Found',
        errors: [],
        data: {}
      }, done);
    });

    it('should 500', function (done) {
      request(hsf)
      .invoke('getUser', ['devtoken', '500'])
      .type('json')
      .expect({
        status: 500,
        isError: true,
        message: 'mock server error',
        errors: [],
        data: {}
      }, done);
    });

    it('should 403 when callsource wrong', function (done) {
      request(hsf)
      .invoke('getUser', ['wrong', 1])
      .type('json')
      .expect({
        status: 403,
        isError: true,
        message: 'callsource no perms',
        errors: [],
        data: {}
      }, done);
    });
  });
});
