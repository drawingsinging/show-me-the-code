# eventproxy 神奇的 `done` 和 `fail`

[eventproxy](https://github.com/JacksonTian/eventproxy) 我们已经大量使用来处理各种简单和复杂的异步调用逻辑。

## 之前写的代码

```js
exports.getContent = function (callback) {
 var ep = new EventProxy();
  ep.all('tpl', 'data', function (tpl, data) {
    // 成功回调
    callback(null, {
      template: tpl,
      data: data
    });
  });
  // 侦听error事件
  ep.bind('error', function (err) {
    // 卸载掉所有handler
    ep.unbind();
    // 异常回调
    callback(err);
  });
  fs.readFile('template.tpl', 'utf-8', function (err, content) {
    if (err) {
      // 一旦发生异常，一律交给error事件的handler处理
      return ep.emit('error', err);
    }
    ep.emit('tpl', content);
  });
  db.get('some sql', function (err, result) {
    if (err) {
      // 一旦发生异常，一律交给error事件的handler处理
      return ep.emit('error', err);
    }
    ep.emit('data', result);
  });
};
```

我们在实际过程中，发现有大量类似的代码，

```js
ep.bind('error', function (err) {
  ep.unbind();
  callback(err);
});

if (err) {
  return ep.emit('error', err);
}
```

于是，某天我突然想到，很自然地就将这些重复性代码提取出来。

## 使用了 fail 和 done 之后

```js
exports.getContent = function (callback) {
 var ep = new EventProxy();
  ep.all('tpl', 'data', function (tpl, data) {
    // 成功回调
    callback(null, {
      template: tpl,
      data: data
    });
  });
  // 添加error handler
  ep.fail(callback);

  fs.readFile('template.tpl', 'utf-8', ep.done('tpl'));
  db.get('some sql', ep.done('data'));
};
```

### 神奇的 `fail`

```js
ep.fail(callback);
// 由于参数位相同，它实际是
ep.fail(function (err) {
  callback(err);
});

// 等价于

ep.bind('error', function (err) {
  // 卸载掉所有handler
  ep.unbind();
  // 异常回调
  callback(err);
});
```

`fail` 方法侦听了 `error` 事件，默认处理卸载掉所有 `handler`，并调用回调函数。

### 神奇的done

```js
ep.done('tpl');

// 等价于

function (err, content) {
  if (err) {
    // 一旦发生异常，一律交给error事件的handler处理
    return ep.emit('error', err);
  }
  ep.emit('tpl', content);
}
```

在Node的最佳实践中，回调函数第一个参数一定会是一个 `error` 对象。

检测到异常后，将会触发 `error` 事件。剩下的参数，将触发事件，传递给对应 `handler` 处理。

#### `done` 也接受回调函数

`done` 方法除了接受事件名外，还接受回调函数。如果是函数时，它将剔除第一个 `error` 对象(此时为null)后剩余的参数，传递给该回调函数作为参数。该回调函数无需考虑异常处理。

```js
ep.done(function (content) {
  // 这里无需考虑异常
});
```

## 结论

其实这就是一种 `Promises` ，更多可以查看 http://blog.coolaj86.com/futures/
