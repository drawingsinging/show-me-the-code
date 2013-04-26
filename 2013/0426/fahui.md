# 在svg中嵌入div

很多前端人员对svg不够熟悉，svg在文字排版、节点方面没有div + css强大、方便，事件的支持也没有html5全面。但svg在不规则图形绘制以及动画方面更有优势。

如果能将两者结合，就能实现更强大的布局效果。同时可以将可视化布局算法与实际内容展现分离，促进不熟悉svg的前端开发者与可视化开发者的分工合作。

[foreignObject](http://www.w3.org/TR/SVG/extend.html#ForeignObjectElement)是svg提供的一种节点类型，其中可以嵌套常见的html的DOM节点。如果其中嵌套div节点，则不要忘了加上命名空间 xmlns="http://www.w3.org/1999/xhtml"


```html
<g class="node" param="pk" transform="translate(261.86682571648635,520)">
  <foreignObject height="40" width="160">
    <div xmlns="http://www.w3.org/1999/xhtml" class="foreignNode" style="background: none repeat scroll 0% 0% green;">
      <div>
        <div class="node-content">
          <div class="node-icon">&nbsp;</div>
          <div class="node-name">pagek</div>
        </div>
        <div class="node-bar">
          <div class="node-type">virtualNode</div>
        </div>
      </div>
    </div>
  </foreignObject>
</g>
```

绘制以上节点嵌入的js接口代码: (其中的绘制代码和事件绑定代码对前端人员应该是非常熟悉的。)
```js
  drawNode: function (d) {
    var c = $('<div xmlns="http://www.w3.org/1999/xhtml"></div>')
        .attr("class", "foreignNode")
        .css({
          'width': d.width,
          'height': d.height,
          'background-color': "green"
        });
    var top = $('<div class="node-content">'
        + '<div class="node-icon">&nbsp;</div>'
        + '<div class="node-name">' + d.name + '</div>'
        + '</div>'
        );
    var bottom = $('<div class="node-bar">'
        + '<div class="node-type">' + 'virtualNode' + '</div>'
        + '</div>'
        );
    $('<div/>').append(top).append(bottom).appendTo(c);
    $(this).append(c);
    c.mouseenter(function () {
      $(this).css('background', 'red');
    });
    c.mouseleave(function () {
      $(this).css('background', 'green');
    });
  }
```

以上代码来自一个节点连线布局算法项目（https://github.com/jdk137/dag）。
