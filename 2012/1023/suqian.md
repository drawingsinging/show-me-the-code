# 以表单方式上传文件

现在，有许多API都是支持文件上传的，但是都不是简单的字节流方式。
一般都会按照标准的 [multipart/form-data](http://tools.ietf.org/html/rfc2388) 方式提交。

http://upload.cnodejs.net/

![upload](http://ww2.sinaimg.cn/large/6cfc7910jw1dy4y2tr4efj.jpg)

于是就有了Stream版本的 [formstream](https://github.com/fengmk2/formstream)

就如使用 `http.request` post请求一样简单。

```js
var formstream = require('formstream');
var http = require('http');

var form = formstream();
form.file('file', './logo.png');

var options = {
  method: 'POST',
  host: 'upload.cnodejs.net',
  path: '/store',
  headers: form.headers()
};
var req = http.request(options, function (res) {
  console.log('Status: %s', res.statusCode);
  res.on('data', function (data) {
    console.log(data.toString());
  });
});

form.pipe(req);
```

如果你的后端云存储，是支持Stream模式的，那么整个上传过程是非常高效的。