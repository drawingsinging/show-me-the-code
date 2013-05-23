
## EventProxy的异步事件触发: emitLater && doneLater

在node中，`emit`方法是同步的，EventProxy中的`emit`，`trigger`等跟node的风格一致，也是同步的。看下面这段代码，可能眼尖的同学一下就发现了隐藏的bug:     
```js
var ep = EventProxy.create();

db.check('key', function (err, permission) {
  if (err) {
    return ep.emit('error', err);
  }
  ep.emit('check', permission);
});

ep.once('check', function (permission) {
  permission && db.get('key', function (err, data) {
    if (err) {
      return ep.emit('error');
    }
    ep.emit('get', data);
  });
});

ep.once('get', function (err, data) {
  if (err) {
    retern ep.emit('error', err);
  }
  render(data);
});

ep.on('error', errorHandler);
```

没错，万一`db.check`的`callback`被同步执行了，在`ep`监听`check`事件之前，它就已经被抛出来了，后续逻辑没办法继续执行。尽管node的约定是所有的`callback`都是需要异步返回的，但是如果这个方法是由第三方提供的，我们没有办法保证`db.check`的`callback`一定会异步执行，所以我们的代码通常就变成了这样:   

```js
var ep = EventProxy.create();

ep.once('check', function (permission) {
  permission && db.get('key', function (err, data) {
    if (err) {
      return ep.emit('error');
    }
    ep.emit('get', data);
  });
});

ep.once('get', function (err, data) {
  if (err) {
    retern ep.emit('error', err);
  }
  render(data);
});

ep.on('error', errorHandler);

db.check('key', function (err, permission) {
  if (err) {
    return ep.emit('error', err);
  }
  ep.emit('check', permission);
});
```
我们被迫把`db.check`挪到最后，保证事件先被监听，再执行`db.check`。`check`->`get`->`render`的逻辑，在代码中看起来变成了`get`->`render`->`check`。如果整个逻辑更加复杂，这种风格将会让代码很难读懂。   

这时候，我们需要的就是 __异步事件触发__：   

```js
var ep = EventProxy.create();

db.check('key', function (err, permission) {
  if (err) {
    return ep.emitLater('error', err);
  }
  ep.emitLater('check', permission);
});

ep.once('check', function (permission) {
  permission && db.get('key', function (err, data) {
    if (err) {
      return ep.emit('error');
    }
    ep.emit('get', data);
  });
});

ep.once('get', function (err, data) {
  if (err) {
    retern ep.emit('error', err);
  }
  render(data);
});

ep.on('error', errorHandler);
```
上面代码中，我们把`db.check`的回调函数中的事件通过`emitLater`触发，这样,就算`db.check`的回调函数被同步执行了，事件的触发也还是异步的，`ep`在当前事件循环中监听了所有的事件，之后的事件循环中才会去触发`check`事件。代码顺序将和逻辑顺序保持一致。   
当然，这么复杂的代码，必须可以像`ep.done()`一样通过`doneLater`来解决：   

```js
var ep = EventProxy.create();

db.check('key', ep.doneLater('check'));

ep.once('check', function (permission) {
  permission && db.get('key', ep.done('get'));
});

ep.once('get', function (data) {
  render(data);
});

ep.fail(errorHandler);
```
最终呈现出来的，是一段简洁且清晰的代码。   
