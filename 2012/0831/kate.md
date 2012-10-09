# RephaelJS生成v:image元素的Bug

RaphealJS在IE中生成VML元素。其中在IE6-7中，绘制图片生成的v:image存在的一个bug。
在这种情况下，v:image元素的绝大部分属性会变成一个显示为“Attribute only valid on v:image”的非常特殊的值，对该值的任何操作都将导致浏览器严重异常，中断js执行。

附件中，kate.example.zip中为这个Bug的例子，其中with_out_ua.html是不加载ua.js时的情况，页面上的新浪微博的小图标是可以用鼠标拖拽的。而with_ua.html除加载ua.js外和前者无任何区别，但是在IE6-7下如果试图拖拽小图标会爆出‘Attribute only valid on v:image’的错误，中断js执行