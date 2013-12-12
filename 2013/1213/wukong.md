# JS 高阶函数实例

## pedding && _.after

```js
// Returns a function that will only be executed after being called N times.
_.after = function(times, func) {
  return function() {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
};
```

在我们的项目中，为了更好地捕捉错误，推荐使用 @fengmk2 的 pedding。

```
function pedding(n, fn) {
  var called = false;
  var times = 0;
  return function (err) {
    if (called) {
      return;
    }
    if (err) { // 关键部分
      called = true;
      return fn(err);
    }
    times++;
    if (times === n) {
      fn();
    } else if (times > n) {
      throw new Error('Expect to call ' + n + ' times, but got ' + times);
    }
  };
}
```

## should.keys

```js
var obj = { foo: 'bar', baz: 'raz' };
obj.should.have.keys('foo', 'baz');
obj.should.have.keys(['foo', 'baz']);

// 新语法
({foo: 1, bar: 2, str: 'hello'})
.should.have.keys({
  foo: 1,
  bar: function (bar) {bar.should.equal(2);},
  str: /^h.*/
});
```

```js
// block could be Function, RegExp or others
var blockify = function (block) {
  if (typeof block === 'function') {
    return function (obj) {
      if (typeof obj === 'function') {
        return obj === block ? '' : 'expected equal ' + i(block);
      }
      try {
        block(obj);
      } catch (err) {
        if (err instanceof AssertionError) {
          return err.message;
        }
        throw err;
      }
    };
  } else if (block instanceof RegExp) {
    return function (obj) {
      if (!block.test(obj)) {
        return 'expected match ' + i(block);
      }
    };
  } else {
    return function (obj) {
      if (!eql(block, obj)) {
        return 'expected eql ' + i(block);
      }
    };
  }
};
```

## debug

```js
var debughttp = require('debug')('http')
var debugtcp = require('debug')('mysql')
```

使用

```shell
DEBUG=http node app.js
```

## sinon.js

```js
var query = sinon.stub(mysql, "query");

// call mysql.query 3 times
var callback = noop
mysql.query('SELECT 1')
mysql.query('SELECT ?', 2)
mysql.query('SELECT ?', 3, noop)

query.should.equal(mysql.query)
query.callCount.should.equal(3)
mysql.query.callCount.should.equal(3)

// 记录下了每次被调用的参数
query.args.should.eql(
  [
    ['SELECT 1'],
    ['SELECT ?', 2],
    ['SELECT ?', 3, noop]
  ]
)

// unstub
query.restore() or mysql.query.restore()

```