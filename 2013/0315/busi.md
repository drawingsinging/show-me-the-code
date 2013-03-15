web-camera
==========

网页截图工具 (by phantomjs)。通过phantomjs来打开渲染网页，对网页进行截图。   

## Usage  

```js
var Camera = require('webcamera');
var fs = require('fs');

/**
 * web camera by Node.js and Phantomjs
 * @param {Object} options 
 *   - path          {String}   default picture dir path
 *   - workerNum     {Number}   child_process max num
 *   - timeout       {Number}   child_process timeout.
 *   - phantom       {String}   phantomjs path
 *   - phantomScript {String}   phantomjs script path, use input arguments as default script
 *   - tfsClient     {Object}   tfs client instance
 *   - tfsOpts       {Object}   tfs options. if do not have tfsClient and tfsOpts, shotTFS become invalid
 */
var camera = Camera.create({
  tfsOpts: {    
    appkey: 'tfscom',
    rootServer: '10.232.4.44:3800',
    imageServers: [
      'img01.daily.taobaocdn.net',
      'img02.daily.taobaocdn.net',
      'img03.daily.taobaocdn.net',
      'img04.daily.taobaocdn.net'
    ]    
  }
});

//当处理速度比调用速度低时会触发此事件
camera.on('overload', function (listLength) {
  //listLength为排队等待处理的长度
});

//截图保存到本地
camera.shot('http://www.baidu.com', './baidu.png', function (err, path) {
  console.log(path);
});

//截图作为stream
camera.shotStream('http://www.baidu.com', function (err, s) {
  var datas = [];
  var filePath = './baidu_stream.jpg';
  var file = fs.createWriteStream(filePath, {encoding: 'binary'});
  s.on('data', function (data) {
    file.write(data.toString('binary'), 'binary');          
  });
  s.on('end', function () {
    console.log('get pictrue ok');
  });
});

//截图上传TFS
camera.shotTFS('http://www.baidu.com', {
  viewportSize: {
    width: 640,
    height: 320
  },
  script: function () {
    document.getElementById('kw').value = 'test script';
  }
}, function (err, data) {
  console.log(data);
});

```

所有的调用都可以在`callback`之前传入参数`options`. 

|名字|类型|含义|
|----|----|----|
|clipRect|Object|指定截图的矩形区域。有四个属性:top(0), left(0), height(window), width(window)。height和width可以设置为window或者all,window将会截取当前一屏，all会截取网页全部大小|
|viewportSize|Object|设置网页的分辨率，有两个属性:width(1024), height(768)。|
|renderDelay|Number|网页加载完成之后延迟多少毫秒之后截图，默认为0|
|picPath|String|设置图片保存位置，只在`shot`方法时生效，等效于shot方法的第二个参数|
|mimeType|String|设置截图的保存类型（只有在没设置图片保存路径的情况下生效，否则使用图片保存路径的后缀类型），支持png, jpeg, gif.默认为png|
|script|Function|网页加载完成之后可以在网页中执行这个方法。|


## Install  
`npm install webcamera`

## Dependences  
[`phantomjs`](http://phantomjs.org/)  
[`TFS`](http://github.com/fengmk2/tfs) > 0.1.1

## 淘宝使用   

### 安装依赖  

* phantomjs 和 字体库安装： 

```
yum install phantomjs freetype.x86_64 freetype-devel.x86_64 fontconfig.x86_64 fontconfig-devel.x86_64 fonts-chinese.noarch freetype-devel fontconfig-devel  -b test
```

* 字体存放路径： `/usr/share/fonts/chinese/TrueType/`，将.tff字体文件放入到这个目录。   

### 注意事项  

1. 如果要对自身网站截图，务必通过ip方式直接访问本机，不要通过域名方式访问。  
2. 如果需要对其他淘系网站截图，由于同机房http无法调用，所以需要咨询PE绑定host。   
3. 尽量去除被截图网页的无关资源，减少由于http无法访问导致的错误。   

### 联系人  

旺旺@不四  