# Graceful exit with [cluster] and [pm]

相信大家看完 [@不四](https://github.com/dead-horse) 的 [Node.js 异步异常的处理与domain模块解析](http://deadhorse.me/nodejs/2013/04/13/exception_and_domain.html) 后，已经对[domain](http://nodejs.org/docs/latest/api/domain.html) 模块有了更深一步了解了。

本次分享主要介绍一下使用 [graceful] 配合 [cluster] 和 [pm] 实现当发生 `uncaughtException` 的时候优雅退出(graceful exit)。

## Cluster

官方[cluster]模块的例子原型代码来自: [Warning: Don't Ignore Errors!](http://nodejs.org/docs/latest/api/domain.html#domain_warning_don_t_ignore_errors)

[graceful] 的默认示例是基于 [cluster] 写的: [connect with cluster example](https://github.com/fengmk2/graceful/tree/master/example/connect_with_cluster)

一般地，我会将代码结构分为3个文件: 

* `dispatch.js`: master, 管理worker进程，报警等
* `worker.js`: worker，实际工作进程的容器
* `app.js`: web server, hsf, other services and other logic.

### [dispatch.js](https://github.com/fengmk2/graceful/blob/master/example/connect_with_cluster/dispatch.js)

```js
var cluster = require('cluster');
var path = require('path');

cluster.setupMaster({
  exec: path.join(__dirname, 'worker.js')
});

cluster.fork();
cluster.fork();

cluster.on('disconnect', function (worker) {
  var w = cluster.fork();
  console.error('[%s] [master:%s] wroker:%s disconnect! new worker:%s fork', 
    new Date(), process.pid, worker.process.pid, w.process.pid);
});

cluster.on('exit', function (worker) {
  console.error('[%s] [master:%s] wroker:%s exit!', 
    new Date(), process.pid, worker.process.pid);
});
```

### [app.js](https://github.com/fengmk2/graceful/blob/master/example/connect_with_cluster/app.js)

app.js 不会涉及 [cluster] 和 [graceful] 的代码，让业务逻辑不需要关注系统的基本功能。

```js
var http = require('http');
var connect = require('connect');

var app = connect(
  function (req, res, next) {
    req.on('end', function () {
      if (req.url === '/asycerror') {
        setTimeout(function () {
          foo.bar();
        }, 10);
        return;
      }
      process.nextTick(function () {
        res.setHeader('content-type', 'text/json');
        res.end(JSON.stringify({
          method: req.method,
          url: req.url,
          headers: req.headers,
          Connection: res.getHeader('connection') || 'keep-alive',
          pid: process.pid,
        }));
      });
    });
    req.resume();
  },
  function (err, req, res, next) {
    var domainThrown = err.domain_thrown || err.domainThrown;
    var msg = 'domainThrown: ' + domainThrown + '\n' + err.stack;
    console.error('%s %s\n%s', req.method, req.url, msg);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end(msg + '\n');
  }
);

var server = http.createServer(app);
module.exports = server;
```

### [worker.js](https://github.com/fengmk2/graceful/blob/master/example/connect_with_cluster/worker.js)

```js
var PORT = +process.env.PORT || 1337;
var graceful = require('graceful');
var server = require('./app');
server.listen(PORT);
console.log('[%s] [worker:%s] web server start listen on %s', new Date(), process.pid, PORT);

var restapi = require('http').createServer().listen(1985);
console.log('[%s] [worker:%s] rest api start listen on %s', new Date(), process.pid, 1985);

graceful({
  server: [server, restapi],
  killTimeout: 10000,
  error: function (err, throwErrorCount) {
    // you can do custom log here, send email, call phone and so on...
    if (err.message) {
      err.message += ' (uncaughtException throw ' + throwErrorCount + ' times on pid:' + process.pid + ')';
    }
    // logger.error(err);
  }
});
```

### stdout

```bash
$ node example/connect_with_cluster/dispatch.js 
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10231] web server start listen on 1337
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10231] rest api start listen on 1985
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10232] web server start listen on 1337
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10232] rest api start listen on 1985

$ curl localhost:1337/
{"method":"GET","url":"/","headers":{"user-agent":"curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5","host":"localhost:1337","accept":"*/*"},"Connection":"keep-alive","pid":10232}

$ curl localhost:1337/asycerror
# hang for a while
curl: (52) Empty reply from server

# Master
$ node example/connect_with_cluster/dispatch.js 
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10231] web server start listen on 1337
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10231] rest api start listen on 1985
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10232] web server start listen on 1337
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10232] rest api start listen on 1985
[uncaughtException] throw error 1 times
[ReferenceError: foo is not defined (uncaughtException throw 1 times on pid:10232)]
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10232] close 2 servers!
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10232] worker disconnect!
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [master:10230] wroker:10232 disconnect! new worker:10288 fork
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10288] web server start listen on 1337
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10288] rest api start listen on 1985
[Fri Apr 19 2013 09:34:31 GMT+0800 (CST)] [worker:10232] kill timeout, exit now.
[Fri Apr 19 2013 09:34:31 GMT+0800 (CST)] [master:10230] wroker:10232 exit!

# test again
$ curl localhost:1337/asycerror
# hang for a while
curl: (52) Empty reply from server

# Master
$ node example/connect_with_cluster/dispatch.js 
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10231] web server start listen on 1337
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10231] rest api start listen on 1985
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10232] web server start listen on 1337
[Fri Apr 19 2013 09:32:29 GMT+0800 (CST)] [worker:10232] rest api start listen on 1985
[uncaughtException] throw error 1 times
[ReferenceError: foo is not defined (uncaughtException throw 1 times on pid:10232)]
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10232] close 2 servers!
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10232] worker disconnect!
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [master:10230] wroker:10232 disconnect! new worker:10288 fork
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10288] web server start listen on 1337
[Fri Apr 19 2013 09:34:21 GMT+0800 (CST)] [worker:10288] rest api start listen on 1985
[Fri Apr 19 2013 09:34:31 GMT+0800 (CST)] [worker:10232] kill timeout, exit now.
[Fri Apr 19 2013 09:34:31 GMT+0800 (CST)] [master:10230] wroker:10232 exit!

[uncaughtException] throw error 1 times
[ReferenceError: foo is not defined (uncaughtException throw 1 times on pid:10288)]
[Fri Apr 19 2013 09:36:17 GMT+0800 (CST)] [worker:10288] close 2 servers!
[Fri Apr 19 2013 09:36:17 GMT+0800 (CST)] [worker:10288] worker disconnect!
[Fri Apr 19 2013 09:36:17 GMT+0800 (CST)] [master:10230] wroker:10288 disconnect! new worker:10351 fork
[Fri Apr 19 2013 09:36:17 GMT+0800 (CST)] [worker:10351] web server start listen on 1337
[Fri Apr 19 2013 09:36:17 GMT+0800 (CST)] [worker:10351] rest api start listen on 1985
[Fri Apr 19 2013 09:36:27 GMT+0800 (CST)] [worker:10288] kill timeout, exit now.
[Fri Apr 19 2013 09:36:27 GMT+0800 (CST)] [master:10230] wroker:10288 exit!
```

## Graceful exit with [pm] 

[pm] A graceful node library to contribute a permanent "master-worker" server.

同样，也是按照3文件划分职能。[graceful exit demo](https://github.com/aleafs/pm/tree/master/demo/graceful_exit)

### [dispatch.js](https://github.com/aleafs/pm/blob/master/demo/graceful_exit/dispatch.js)

```js
var master = require('pm').createMaster();

master.on('giveup', function (name, fatals, pause) {
  console.log('[%s] [master:%s] giveup to restart "%s" process after %d times. pm will try after %d ms.', 
    new Date(), process.pid, name, fatals, pause);
});

master.on('disconnect', function (name, pid) {
  // console.log('%s %s disconnect', name, pid)
  var w = master.fork(name);
  console.error('[%s] [master:%s] worker:%s disconnect! new worker:%s fork', 
    new Date(), process.pid, pid, w.process.pid);
});

master.on('fork', function (name, pid) {
  console.log('[%s] [master:%s] new %s:worker:%s fork',
    new Date(), process.pid, name, pid);
});

master.on('quit', function (name, pid, code, signal) {
  console.log('[%s] [master:%s] %s:worker:%s quit, code: %s, signal: %s',
    new Date(), process.pid, name, pid, code, signal);
});

master.register('web', __dirname + '/worker.js', {
  listen: 1984,
  children: 2
});

master.dispatch();
```

### [app.js]()

```js
var http = require('http');

var server = http.createServer(function (req, res) {
  if (req.url === '/asyncerror') {
    setTimeout(function () {
      asyncError();
    }, 10);
    return;
  }
  res.end(JSON.stringify({
    url: req.url,
    pid: process.pid,
  }));
});

module.exports = server;
```

### [worker.js](https://github.com/aleafs/pm/blob/master/demo/graceful_exit/worker.js)

```js
var graceful = require('graceful');
var worker = require('pm').createWorker();
var server = require('./app');

// hack for pm, because server._handle is empty.
server.close = function () {};

graceful({
  server: server,
  worker: worker,
  error: function (err) {
    console.log('[%s] [worker:%s] error: %s', new Date(), process.pid, err.stack);
  },
  killTimeout: 10000,
});

worker.ready(function (socket, port) {
  server.emit('connection', socket);
});
```

### stdout

```bash
$ node demo/graceful_exit/dispatch.js 
[Fri Apr 19 2013 09:28:38 GMT+0800 (CST)] [master:9773] new web:worker:9774 fork
[Fri Apr 19 2013 09:28:38 GMT+0800 (CST)] [master:9773] new web:worker:9775 fork

$ curl localhost:1984/
{"url":"/","pid":9775}

$ curl localhost:1984/asyncerror
# hang for a while
curl: (52) Empty reply from server

# Master
$ node demo/graceful_exit/dispatch.js 
[Fri Apr 19 2013 09:28:38 GMT+0800 (CST)] [master:9773] new web:worker:9774 fork
[Fri Apr 19 2013 09:28:38 GMT+0800 (CST)] [master:9773] new web:worker:9775 fork
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [worker:9775] error: ReferenceError: asyncError is not defined
    at Object._onTimeout (/Users/mk2/git/pm/demo/graceful_exit/app.js:18:7)
    at Timer.list.ontimeout (timers.js:101:19)
[uncaughtException] throw error 1 times
[ReferenceError: asyncError is not defined]
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [worker:9775] close 1 servers!
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [worker:9775] worker disconnect!
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [master:9773] new web:worker:10089 fork
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [master:9773] worker:9775 disconnect! new worker:10089 fork
[Fri Apr 19 2013 09:29:45 GMT+0800 (CST)] [worker:9775] kill timeout, exit now.
[Fri Apr 19 2013 09:29:45 GMT+0800 (CST)] [master:9773] web:worker:9775 quit, code: 1, signal: null

# test again
$ curl localhost:1984/asyncerror
# hang for a while
curl: (52) Empty reply from server

# Master
$ node demo/graceful_exit/dispatch.js 
[Fri Apr 19 2013 09:28:38 GMT+0800 (CST)] [master:9773] new web:worker:9774 fork
[Fri Apr 19 2013 09:28:38 GMT+0800 (CST)] [master:9773] new web:worker:9775 fork
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [worker:9775] error: ReferenceError: asyncError is not defined
    at Object._onTimeout (/Users/mk2/git/pm/demo/graceful_exit/app.js:18:7)
    at Timer.list.ontimeout (timers.js:101:19)
[uncaughtException] throw error 1 times
[ReferenceError: asyncError is not defined]
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [worker:9775] close 1 servers!
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [worker:9775] worker disconnect!
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [master:9773] new web:worker:10089 fork
[Fri Apr 19 2013 09:29:35 GMT+0800 (CST)] [master:9773] worker:9775 disconnect! new worker:10089 fork
[Fri Apr 19 2013 09:29:45 GMT+0800 (CST)] [worker:9775] kill timeout, exit now.
[Fri Apr 19 2013 09:29:45 GMT+0800 (CST)] [master:9773] web:worker:9775 quit, code: 1, signal: null

[Fri Apr 19 2013 09:30:29 GMT+0800 (CST)] [worker:9774] error: ReferenceError: asyncError is not defined
    at Object._onTimeout (/Users/mk2/git/pm/demo/graceful_exit/app.js:18:7)
    at Timer.list.ontimeout (timers.js:101:19)
[uncaughtException] throw error 1 times
[ReferenceError: asyncError is not defined]
[Fri Apr 19 2013 09:30:29 GMT+0800 (CST)] [worker:9774] close 1 servers!
[Fri Apr 19 2013 09:30:29 GMT+0800 (CST)] [worker:9774] worker disconnect!
[Fri Apr 19 2013 09:30:29 GMT+0800 (CST)] [master:9773] new web:worker:10119 fork
[Fri Apr 19 2013 09:30:29 GMT+0800 (CST)] [master:9773] worker:9774 disconnect! new worker:10119 fork
[Fri Apr 19 2013 09:30:39 GMT+0800 (CST)] [worker:9774] kill timeout, exit now.
[Fri Apr 19 2013 09:30:39 GMT+0800 (CST)] [master:9773] web:worker:9774 quit, code: 1, signal: null
```

## 展望

之前想依赖 [domain] 实现 `uncaughtException` 发生的时候，给当前请求响应友好的500错误，现在看来是无法100%实现的。

而且引入 [domain] 会造成一定的性能损耗 [nodejs domain module hello world and benchmark](http://fengmk2.github.io/blog/2013/03/domain-helloworld-benchmark.html):

* normal: `7624.59 trans/sec`
* domain: `7068.83 trans/sec`

所以，按目前的情况还是不使用 [domain] ，然后优雅退出解决未捕获异常发生后可能出现的一切问题。


  [cluster]: http://nodejs.org/docs/latest/api/cluster.html
  [pm]: https://github.com/aleafs/pm
  [graceful]: https://github.com/fengmk2/graceful