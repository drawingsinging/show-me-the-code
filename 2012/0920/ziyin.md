# nodejs文件下载服务

## 踩到的几个坑：

  1.Excel2007 打开utf-8编码的csv文件默认乱码

  相关信息：http://www.docin.com/p-31710590.html

  2.文件名中含中文，下载会乱码。各浏览器表现不同

  相关信息：http://www.phpv.net/html/1675.html

## 解决方法：

  iconv转码，utf-8 -> gbk

  转完后为buffer对象，内容直接res.end(buffer), header中的filename则由buffer.toString('binary');

  http://10.232.132.165:22222/down


```js
var http = require('http');
var url = require('url');
var Iconv = require('iconv').Iconv;
var crypto = require('crypto');
var server = http.createServer(function(req, res){
  var path = url.parse(req.url).pathname;

  if(path == '/favicon.ico'){
    res.end('');
  }else{
    var filename = '2012-06-01 至 2012-06-01 (女装行业概况) 数据报表.csv';
    var content = "序号,日期,成交商品数,客单价,关注次数,搜索次数,收藏人数\n1, 2012-06-01, 5061106, 162, 13463027, 5388282, 144738\n1, 2012-06-02, 5011106, 262, 3463027, 538282, 644738";
    //excel2007默认不支持utf-8编码的csv文件
    var iconv = new Iconv('UTF-8', 'GBK//IGNORE');
    content = iconv.convert(content);
    res.setHeader('Pragma', 'public');
    res.setHeader('Expires', '0');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
//    res.setHeader('Cache-Control', 'pre-check=0, post-check=0, max-age=0');
//    res.setHeader('Content-Transfer-Encoding', 'none');
    res.setHeader('Content-Type', 'text/csv; charset=GBK');
    filename = iconv.convert(filename).toString('binary');
    res.setHeader('Content-Disposition', 'attachment;filename="'+ filename +'"');
    res.setHeader('Content-Length', content.length);
    res.end(content);
  }
}).listen(22222);
```
