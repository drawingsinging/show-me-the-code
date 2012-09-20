# ejs的escape

## [ejs/lib/utils.js](https://github.com/visionmedia/ejs/blob/master/lib/utils.js)

```js
function escape(html) {
  return String(html).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

var url = "http://shu.taobao.com/assets/images/logo.png' onload='alert(123);";
var html = "<img src='" + escape(url) + "' />";
console.log(html);
html = '<img src="' + escape(url) + '" />';
console.log(html);
```

```
<img src='http://shu.taobao.com/assets/images/logo.png' onload='alert(123);' />

<img src="http://shu.taobao.com/assets/images/logo.png' onload='alert(123);" />
```

```bash
$ open 2012/0920/xss.html
```

## 原因

> html标签的属性值使用了单引号，因为ejs的escape默认认为我们写html都是按标准规范来写的，所以只对双引号进行了转义。

**html必须使用双引号!**

# pedding

Just pedding for callback.

https://github.com/fengmk2/pedding

```bash
$ npm install pedding
```

```js
var pedding = require('pedding');

it('should request two resources', function (done) {
  done = pedding(2, done);
  http.get('http://fengmk2.github.com', function (res) {
    done();
  });
  http.get('http://www.taobao.com', function (res) {
    done();
  });
});
```
