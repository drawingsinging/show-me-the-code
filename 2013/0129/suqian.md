# 内部模块

## ali-cache

http://gitlab.alibaba-inc.com/ali-cache/tree/master

```js
var cache = require('ali-cache');

var options = {
  servers: [
    '10.232.132.165:6379',
    '10.232.102.134:59595'// stg env
  ],
  enable: true,
  logger: {
    error: function () {},
  },
  maxAge: 60000, 60 seconds
};

cache.init(options);

cache.getObject('foo', function (obj) {
  console.log(obj);
});

cache.setObject('foo', {foo: 'bar'}, function (err, reply) {
  console.log(arguments);
});

cache.del('foo', function (err, count) {
  console.log(err, count);
});

// if you want to disable all exists cache values, change `cache.keyPadding`.
cache.keyPadding = 'newPadding';

cache.getObject('foo', function (obj) {
  console.log(obj); // should be `null`
});
```

## itierskin

http://gitlab.alibaba-inc.com/itierskin/tree/master

```js
var iservice = require('iservice-client');
iservice.init({
  host: '10.232.13.90',
  cache: path.join(__dirname, '.iservice'),
});

var itier = itierskin.create({
  appname: config.itier.appname,   // itier app name
  password: config.itier.password, // itier app password
  timeout: config.itier.timeout,  // timeout
  heartbeat: config.itier.heartbeat, // heartbeat
  hosts: config.ITierHosts,       // itier hosts
  nocache: true,   // query的header.nocache设置。 true为noread and write, false为read and write。
  blackhole: false, // garuda的blackhole
  iservice: iservice, // iservice 客户端，动态获取itier列表
});

itier.on('ready', function () {
  itier.query(sql, function () {
    // do something...
  });
});
```

## ali-logger

http://gitlab.alibaba-inc.com/logger/tree/master

```js
var logger = require('ali-logger');
logger.init({
  logdir: '/tmp/logs',
  // duration: 3600000 * 24,
  // nameformat: '[{{level}}.]YYYY-MM-DD[.log]',
  // stderr: false, // show error stack in stderr or not
});

logger.info('hello world');
logger.warn('hello warn');

var err = new Error('test error');
err.url = '/foo';
err.data = { foo: 'bar' };
logger.error(err);
logger.warn(err);
```