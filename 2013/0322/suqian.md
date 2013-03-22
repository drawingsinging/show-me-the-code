# Watermark 水印

如果我们需要对大段文本，数据表格打上水印，防止他人截图传播，可以使用Canvas实现一个客户端的水印解决方案。

前人做了一个给图片打水印的方案：[watermark.js basic demo](http://www.patrick-wied.at/static/watermarkjs/demos/demo1.html)

我这次是对页面任意节点打上背景水印。

直接看 [Demo](http://fengmk2.github.com/watermark/demo.html)

![1](http://nfs.nodeblog.org/f/9/f9e67f7c9d6c4e233566453501c121f1.png)

## 实现代码

目前是以 jQuery 插件形式写的:

```js
/*!
 * watermark.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

(function ($) {

  "use strict";

  $.fn.extend({
    watermark: function (opts) {
      var defaults = {
        width: 230,
        height: 100,
        backgroundColor: '#fff',
        startX: 40,
        startY: 50,
        fontSize: 18,
        text: '水印啦',
        textFamily: '"微软雅黑"',
        fillStyle: '#f5f5f5'
      };
      opts = opts || {};
      var options = {};
      for (var k in defaults) {
        options[k] = opts[k] || defaults[k];
      }

      // init global canvas
      var canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:none;';
      canvas.width = options.width;
      canvas.height = options.height;
      var ctx = canvas.getContext('2d');
      // set background color
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, options.width, options.height);
      document.body.appendChild(canvas);
      var x = options.startX;
      var y = options.startY;
      var text = options.text;
      ctx.fillStyle = options.fillStyle;
      ctx.font = options.fontSize + 'px ' + options.textFamily;
      for (var i = 0; i < text.length; i++) {
        var s = text[i];
        ctx.fillText(s, x, y);
        x += options.fontSize;
        y += options.fontSize;
      }
      var background = options.backgroundColor + ' url(' + canvas.toDataURL() + ') repeat';
      document.body.removeChild(canvas);
      return this.each(function () {
        this.style.background = background;
      });
    }
  });
})(jQuery);
```
