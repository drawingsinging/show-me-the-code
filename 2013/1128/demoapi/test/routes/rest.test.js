/**!
 * demoapi - test/routes/rest.test.js
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
var request = require('supertest');
var mm = require('mm');
var app = require('../../servers/web');

describe('routes/rest.test.js', function () {
  afterEach(mm.restore);

  describe('GET /v1/users/:uid', function () {
    it('should 200', function (done) {
      request(app)
      .get('/v1/users/1?callsource=devtoken')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({
        name: 'suqian.yf', uid: '1'
      })
      .expect(200, done);
    });

    it('should 403 when callsource wrong', function (done) {
      request(app)
      .get('/v1/users/1?callsource=foo')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({
        message: 'callsource no perms'
      })
      .expect(403, done);
    });

    it('should 404', function (done) {
      request(app)
      .get('/v1/users/404?callsource=devtoken')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({
        message: 'not found'
      })
      .expect(404, done);
    });

    it('should 500', function (done) {
      request(app)
      .get('/v1/users/500?callsource=devtoken')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({
        message: 'mock server error'
      })
      .expect(500, done);
    });
  });
});
