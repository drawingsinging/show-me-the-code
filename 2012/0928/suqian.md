# browserify

![browserify!](http://substack.net/images/browserify/browserify.png)

让你在浏览器的环境下，都能像nodejs一样直接使用 require() 加载模块。

## 示例

使用 domready 模块

```js
// use relative requires
var foo = require('./foo');
var bar = require('../lib/bar');

// or use modules installed by npm in node_modules/
var domready = require('domready');

domready(function () {
  var elem = document.getElementById('result');
  elem.textContent = foo(100) + bar('baz');
});
```

```js
$ browserify entry.js -o bundle.js
```

生成的代码预览

```js
(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
```

## 吓尿了

竟然还有许多内置模块的browserify 的封装:

* events
* path
* vm
* http
* crypto
* assert
* url
* buffer
* buffer_ieee754
* util
* querystring
* stream

## process, 竟然还封装了一个假的进程对象

* nextTick(fn) - uses [the postMessage trick](http://dbaron.org/log/20100309-faster-timeouts) for a faster setTimeout(fn, 0) if it can (这是亮点)
* title - set to 'browser' for browser code, 'node' in regular node code
* browser - true, good for testing if you're in a browser or in node

## 然后呢？然后我们能干嘛？

还用说吗？！有了 browserify ，你就可以是无忌惮地使用nodejs的require()模块组织方式，写浏览器端代码了。

而且有庞大的第三方模块支持。

当然，浏览器兼容性你还是要去考虑的。




