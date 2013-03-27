# redis 设置无效值
[node_redis](https://github.com/mranney/node_redis)

## case

```js
client.set('key', undefined, function (err) {
  console.log(err);
  client.get('key', function (err, item) {
    console.log(typeof item, item);
  });
});

```

打印结果
```
null
string undefined
```

undefined 和 null 都存在这样的问题

## 解决方案
https://github.com/mranney/node_redis/pull/403 

代码已经合并进去，但还没有npm模块中依然还是存在这个问题，
