# jQuery .attr() vs .prop()

对于jQuery的attr函数大家都很熟悉，用来获取或设置匹配的第一个元素的属性值，比较常用。
而prop函数用的会少一些，但是官网api对它的描述也是用来获取或设置第一个元素的属性值。

[`源码`](https://github.com/jquery/jquery/blob/master/src/attributes.js)

### .attr()

```js
attr: function( elem, name, value ) {
  ...
  // Fallback to prop when attributes are not supported
  // 如果没有getAttribute方法，调用prop
  if ( typeof elem.getAttribute === core_strundefined ) {
    return jQuery.prop( elem, name, value );
  }
  ...
  //get
  elem.getAttribute
  //set
  elem.setAttribute
}
```
### .prop()

```js
prop: function( elem, name, value ) {
  ...
  //get
  elem[ name ];
  //set
  elem[ name ] = value;
}
```

[`attribute和property的区别`](http://stylechen.com/attribute-property.html)
[`JavaScript中的property和attribute`](http://omiga.org/blog/archives/2055)

### .attr()对于boolean attributes

> autofocus, autoplay, async, checked, controls, defer, disabled, hidden, loop, multiple, open, readonly, required, scoped, selected

attr()方法返回 `attributes name` or `undefined`
prop()方法返回 `true` or `false`
例如

```js
<input type="checkbox" checked="aaa" />
var input = $('input'); 

input.attr('checked', true);
//input.attr('checked', '');
//input.attr('checked', undefined);
var a = input.attr('checked'); // string checked
var b = input.prop('checked'); // boolean true

//remove attribute
input.attr('checked', null);
//input.attr('checked', false);
var a = input.attr('checked'); // undefined 
var b = input.prop('checked'); // boolean false

var c = input.attr('disabled'); // undefined
var d = input.prop('disabled'); // boolean false
````

### tips

1. 通过attr()删除boolean属性值，value只能为`null` ,`false` 
2. 只能通过prop()处理的属性，`selectedIndex`, `tagName`, `nodeName`, `nodeType`, `ownerDocument`, `defaultChecked`, `defaultSelected`
3. 一般attr()方法处理在html中可见的属性，prop()处理不可见的属性
