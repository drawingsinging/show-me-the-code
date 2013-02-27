# 不要Try/Catch回调函数的异常

[xml2js](https://npmjs.org/package/xml2js)是一个基于sax的xml解析模块，日均下载量在600+。它的用法非常简单：
```
var xml2js = require('xml2js');
var xml = "<root>Hello xml2js!</root>"
xml2js.parseString(xml, function (err, result) {
  console.dir(result);
});
```

解析过程中出现的异常都会通过回调函数第一个参数进行传递。

正常情况下这个方法都很ok，问题出现在

```
xml2js.parseString(xml, function (err, result) {
  throw new Error('custom exception');
});
```
期望的结果是：

```
/path/to/test.js:6
    throw new Error('This is an error message');
          ^
Error: This is an error message
    at /Users/slajax/repos/appla.bz/test.js:6:11
    at Object.<anonymous> (/path/to/test.js:7:5)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
```

实际的结果是：
```
events.js:73
        throw new Error("Uncaught, unspecified 'error' event.");
              ^
Error: Uncaught, unspecified 'error' event.
    at Parser.EventEmitter.emit (events.js:73:15)
    at Parser.exports.Parser.Parser.parseString (/path/to/node_modules/xml2js/lib/xml2js.js:223:21)
    at Parser.__bind [as parseString] (/path/to/node_modules/xml2js/lib/xml2js.js:6:61)
    at exports.parseString (/path/to/node_modules/xml2js/lib/xml2js.js:247:19)
    at Object.<anonymous> (/path/to/test.js:5:3)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
```
我们的异常丢了。这个问题在[issue69](https://github.com/Leonidas-from-XIV/node-xml2js/issues/69)有详细描述。

其问题发生在：

```
Parser.prototype.parseString = function(str, cb) {
  if ((cb != null) && typeof cb === "function") {
    this.on("end", function(result) {
      this.reset();
      return cb(null, result);
    });
    this.on("error", function(err) {
      this.reset();
      return cb(err);
    });
  }
  if (str.toString().trim() === '') {
    this.emit("end", null);
    return true;
  }
  try {
    return this.saxParser.write(str.toString());
  } catch (ex) {
    return this.emit("error", ex.message);
  }
};
```
由于`end`事件是同步执行的，回调函数中抛出了异常。所以try/catch捕获`return this.saxParser.write(str.toString());`就能捕获到`end`回调函数里的异常。

需要注意的是`end`事件里有`reset`操作。这个操作中移除了所有的listeners。然后代码进入了catch分支，`error`事件抛出。但是listeners已经移除，得到如下异常：

```
throw new Error("Uncaught, unspecified 'error' event.");
```

于是第一个fix来了：

```
try {
  return this.saxParser.write(str.toString());
} catch (ex) {
  if ((cb != null) && typeof cb === "function") {
    return cb(ex.message);
  } else {
    return this.emit("error", ex.message);
  }
}
```
尽管不再触发`error`事件，但是回调函数被再次执行了 - -。

以下测试用例无法通过:

```
'test error throwing': (test) ->
  xml = '<?xml version="1.0" encoding="utf-8"?><test>test</test>'
  i = 0;
  try
    xml2js.parseString xml, (err, parsed) ->
      i = i + 1
      # throw something custom
      throw new Error 'Custom error message'
  catch e
    equ i, 1
    equ e.message, 'Custom error message'
    test.finish()
```

## 结局
总结一下，这两个问题的根源问题是回调函数中的异常不应该被API内部捕获。调用方自己的异常不应该跟API传递的异常混淆。所以解决问题的方法很简单，不再捕获用户异常即可。将用户的回调函数通过`process.nextTick`异步执行。

```
this.on("end", function(result) {
  this.reset();
  process.nextTick(function () {
    cb(null, result);
  });
});
this.on("error", function(err) {
  this.reset();
  process.nextTick(function () {
    cb(err);
  });
});
```

另外我详细的调研了下sax的write方法，其实它自身是不会抛出异常的，它的异常都会通过`onerror`事件传递。xml2js其实已经侦听了该事件。所以将try/catch直接丢掉就可以了。

详细请见：<https://github.com/Leonidas-from-XIV/node-xml2js/pull/72>

## 结论
完全不要考虑捕获用户回调函数中的异常。API的责任是将自身的异常正确传递给调用方即可。
