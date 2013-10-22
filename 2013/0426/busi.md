# weekee  

[weekee](https://github.com/dead-horse/weekee): 一个基于Node.js + socket.io + git + markdown 的网页wiki系统。   
### 可以单独使用   

```js
var weekee = require('weekee');
var options = {
  directory: __dirname + '/wiki',
  git: {
    url: 'git@gitlab.alibaba-inc.com:busi.hyy/npmweb-wiki.git'
  }
};

weekee.create(options);
```

### 可以结合到现有的web server   

```js
var weekee = require('weekee');

var http = require('http');
var path = require('path');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  if (req.url === '/') {
    return fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', function (err, data) {
      if (err) {
        return res.end(err.message);
      }
      return res.end(data);
    });
  }
  res.statusCode = 404;
  res.end('can not get ' + req.url);
});


weekee.create({
  server: server,
  directory: __dirname + '/wiki',
  git: {
    url: 'git@gitlab.alibaba-inc.com:busi.hyy/npmweb-wiki.git'
  },
  enableStatic: true
});

server.listen(8080);
```

前端代码：   
前端需要有两个`div`:  

```
<div id="weekee-folder-container">
<div id="weekee-file-container">
```

同时可以引入`weekee`提供的几个js文件：   
 * weekee.js: 提供前端的交互逻辑，需要有上述两个`div`  
 * weekee-bootstrap.js: 提供默认的样式   
 * weekee-ace.js: 提供一个网页版的ace编辑器  

```
<script src="/weekee/js/weekee.js"></script>
<script src="/weekee/js/weekee-bootstrap.js"></script>
<script src="/weekee/js/weekee-ace.js"></script>    
```

一个简单的demo代码：  
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>node-weekee</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/weekee/js/weekee.js"></script>
    <script src="/weekee/js/weekee-bootstrap.js"></script>
    <script src="/weekee/js/weekee-ace.js"></script>    
  </head>
  <body>
  <body>
    <div class="container-fluid" style="padding:60px;">
      <div class="row-fluid">
        <div class="span3" id="sidebar-container">
          <div id="weekee-folder-container">
          </div>
        </div>
        <div class="span9" style="min-height:500px;">
          <div class="row-fluid" id="weekee-file-container">
          </div>
          </div><!--/row-->
        </div><!--/span-->
      </div><!--/row-->
    </div>    
  </body>
</html>
```

### 其他完整介绍  
[weekee](https://github.com/dead-horse/weekee)   

### To Be Continue  
