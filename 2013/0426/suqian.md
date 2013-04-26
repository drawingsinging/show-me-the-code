# HBase client, Readable, Zookeeper

## HBase client

[hbase-client](https://github.com/TBEDP/node-hbase-client), pure javascript Hbase client.

Get a row from a table

```js
var HBase = require('hbase-client');

var client = HBase.create({
  zookeeperHosts: [
    '127.0.0.1:2181', '127.0.0.1:2182',
  ],
  zookeeperRoot: '/hbase-0.94',
});

// Get `f1:name, f2:age` from `user` table.
var param = new HBase.Get('foo');
param.addColumn('f1', 'name');
param.addColumn('f1', 'age');

client.get('user', param, function (err, result) {
  console.log(err);
  var kvs = result.raw();
  for (var i = 0; i < kvs.length; i++) {
    var kv = kvs[i];
    console.log('key: `%s`, value: `%s`', kv.toString(), kv.getValue().toString());
  }
});
```

## Readable

node 0.10+ 引入了 [stream2](http://blog.nodejs.org/2012/12/20/streams2/) ，相信有做过通信协议开发的同学，
在没有 stream2 之前会觉得异步读取数据是一件可怕的事情。

```js
stream.on('data', function (data) {
  // 处理获取的数据，解析协议头等等
});
```

[stream2](http://blog.nodejs.org/2012/12/20/streams2/) 的 Readable :

```js
readBytes: function (size, callback) {
  var buf = this.in.read(size);
  debug('readBytes: %d size, Got %s', size, buf ? 'Buffer' : null);
  if (buf === null) {
    return this.in.once('readable', this.readBytes.bind(this, size, callback));
  }
  callback(null, buf);
}
```

在 node 0.10 一下版本使用 Readable，只需要引入 [readable-stream](https://github.com/isaacs/readable-stream) 模块.

```js
this.socketReadable = this.socket;
// 兼容新版本，如果是 0.10+ ，则不需要 wrap 了
if (typeof this.socketReadable.read !== 'function') {
  this.socketReadable = new Readable();
  this.socketReadable.wrap(this.socket);
}
```

## Zookeeper

[zkjs](https://github.com/dannycoates/zkjs): A js node client for ZooKeeper.

有了它，就不需要任何c模块依赖了。

```js
var ZK = require('zkjs')

var zk = new ZK({
    hosts: ['localhost:2181', 'localhost:2182', 'localhost:2183'],
    root: '/myapp/root'
});

zk.start(function (err) {

    zk.create(
        '/foo',
        'some ephemeral data',
        ZK.create.EPHEMERAL,
        function (err, path) {
            if (!err) {
                console.log(path, 'was created')
            }
        }
    )

    zk.getChildren(
        '/',
        function (err, children, zstat) {
            if (!err) {
                console.log('/', 'has', children.length, 'children')
            }
        }
    )

    zk.get(
        '/some/known/node',
        function (watch) {
            console.log(watch.path, 'was', watch.type)
        },
        function (err, value, zstat) {
            console.log('the current value is ', value.toString())

            zk.set(
                '/some/known/node',
                'some new data',
                zstat.version,
                function (err, zstat) {
                    if (!err) {
                        console.log('the new version number is', zstat.version)
                    }
                }
            )
        }
    )
})
```
