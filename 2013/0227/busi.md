# [lreader](http://github.com/dead-horse/reader) 按行遍历大文件  

## 目的  

有些日志文件或者其他需要分析的文件，过于庞大，在用node一次性处理的时候，如果将其全部读入内存，可能会导致内存不足或者是进程运行缓慢。reader中的`BigFileWalker`就是为了解决这个问题而生。通过分批分量读取大文件，来解决大文件读取分析的问题。   

## 用法

```js
var reader = require('lreader');
var walker = reader.createBigFileWalker(logfile, {
  offset: 10000,  //跳过前面的10000行，不传入时不会跳过
  piece: 100000   //控制每次读取的行数，默认为十万行
});

//因为walker需要等待初始化读入完数据才能够开始使用，`ready`方法可以确保在初始化完成之后再执行
walker.ready(function () {
  var result = walker.get(10);  
  //do something whith result
  result = walker.get(100);
  //当所有的数据读取完成之后，walker.finish将被置为true
  //同时walker会触发end事件：
  walker.once('end', function () {//end事件的触发，说明所有的数据都载入过了。如果再get不到就是读完了
    //do something
  });
  //如果获取不到数据，说明读取完内存中载入的数据，没有给walker CPU时间去再次载入数据。
  //一般内存中数据都足够大，除非一直采用同步的方式在处理数据，否则不会出现下面的情况
  if (!walker.finish && !result.length) {
    walker.once('readable', function () {}); //等待载入
  }
});

```

## install  
npm install lreader  

