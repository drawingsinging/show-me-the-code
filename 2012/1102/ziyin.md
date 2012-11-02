# HTML5扩展history对象实现无刷新改变url

## 传统ajax

  可以无刷新改变页面内容，但无法改变url

  为了保持状态，主流方式是通过改变hash记录当前状态

  为确保浏览器前进、后退功能有效，需监听hashchange事件，做相应处理

  简单的情况下使用hash已能达到需要。但针对复杂点的情况，如某个页面打开时，需要做一些初始化处理，然后要把这个状态记录下来。这时若通过改变hash，会导致浏览器里多一条历史记录，前进的时候会返回到未初始化的页面状态；

## 未来的曙光

  history对象新增pushState和replaceState方法，可以更新url而不导致页面刷新；（即使修改的不是hash值，也不会刷新页面）

  在浏览器中增加一条新的历史记录：
  ```js
  window.history.pushState(state, title, url);
  ```

  替换当前的历史记录：
  ```js
  window.history.replaceState(state, title, url);
  ```

  浏览器前进、后退事件：
  ```js
  window.addEventListener('popstate', function(e){
      var state = e.state;
      if(state){
	//do something(state);
      }
    }
  }, false);
  ```

  注意：打开或刷新页面时，chrome也会触发popstate事件，firefox不会。可以判断event中state对象是否为null判断是否是打开或刷新页面触发的popstate

  demo：http://10.232.132.165:22222

### demo.html
```js
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>demo</title>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
  <script>
    $(document).ready(function(){

      if(window.history.pushState){
        $(window).bind('popstate',function(e){
          //chrome第一次打开页面也会触发popstate，但没state对象
          var state = e.originalEvent.state;
          if(state && state.num){
            $('#txt').html(state.num);
          }
        });
      }

      $('#btn').click(function(){
        $.ajax({
          url : './getNum',
          success : function(data){
            $('#txt').html(data);
            var url = window.location.href.split('#')[0] + '#' + data;
            var obj = {num : data};
            //替换初始化之后的url
            window.history.pushState(obj, 'new', url);
            //window.location.hash = data;
          }
        });
      });
      //初次加载，做初始化操作
      if(!window.location.hash){
        $.ajax({
          url : './getNum',
          success : function(data){
            $('#txt').html(data);
            var url = window.location.href + '#' + data;
            var obj = {num : data};
            //替换初始化之后的url
            window.history.replaceState(obj, 'first', url);
            //直接改变hash，会导致多出一条历史记录
            //window.location.hash = data;
          }
        });
      }
    });
  </script>
</head>
<body>
  <div id="link">
    <a href="javascript:void(0);" id="btn">Get Random Num</a>
  </div>
  <div id="content"><h1 id="txt"><h1></div>
</body>
</html>

```

### demo.js
```js
var http = require('http');
var url = require('url');
var fs = require('fs');
var tpl = fs.readFileSync('./demo.html','utf-8'); 

var server = http.createServer(function(req, res){
  var urlObj = url.parse(req.url);
  var path = urlObj.pathname;

  res.setHeader('Expires', '0');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  if(path === '/favicon.ico'){
    res.end('');
  }else if(path === '/getNum'){
    res.end(Math.floor(Math.random()*100) + '');
  }else{
    res.end(tpl);
  }
}).listen(22222);
```
