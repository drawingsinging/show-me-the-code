# RESTful URL router

## What is RESTful

[rest](http://milnk.com/t/rest)

> Fielding将他对互联网软件的架构原则，定名为REST，即Representational State Transfer的缩写。我对这个词组的翻译是"表现层状态转化"。
如果一个架构符合REST原则，就称它为RESTful架构。

> HTTP协议里面，四个表示操作方式的动词：GET、POST、PUT、DELETE。它们分别对应四种基本操作：GET用来获取资源，POST用来新建资源（也可以用于更新资源），PUT用来更新资源，DELETE用来删除资源。

RESTful架构：

1. 每一个URI代表一种资源；
2. 客户端和服务器之间，传递这种资源的某种表现层；
3. 客户端通过四个HTTP动词，对服务器端资源进行操作，实现"表现层状态转化"。

> 最常见的一种设计错误，就是URI包含动词。因为"资源"表示一种实体，所以应该是名词，URI不应该有动词，动词应该放在HTTP协议中。

> 举例来说，某个URI是 `/posts/show/1`，其中show是动词，这个URI就设计错了，正确的写法应该是`/posts/1`，然后用GET方法表示show。

## restful-router

![1](https://raw.github.com/fengmk2/restful-router/master/logo.png)

[restful-router](https://github.com/fengmk2/restful-router): Simple RESTful url router. 

## RESTful routes

```js
/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /users           => user.list()
 *  GET    /users/new       => user.new()
 *  GET    /users/:id       => user.show()
 *  GET    /users/:id/edit  => user.edit()
 *  POST   /users           => user.create()
 *  PUT    /users/:id       => user.update()
 *  DELETE /users/:id       => user.destroy()
 *
 * @param {Object} app, must impl `app.get(), app.post(), app.put(), app.delete()`.
 * @param {String} name, resource's name. like `users, posts, tweets`.
 * @param {Object} mod, module contains `CRUD List` methods.
 */
function restfulRouter(app, name, mod);
```

## Usage

```js
var restful = require('restful-router');
var connect = require('connect');
var urlrouter = require('urlrouter');
var user = require('./controllers/user');
var foo = require('./controllers/foo');

var server = connect(
  connect.query(),
  connect.bodyParser(),
  urlrouter(function (app) {

    app.get('/', function (req, res) {
      res.end('hello world');
    });

    restful(app, 'users', user);
    restful(app, 'foos', foo);

  })
).listen(3000);
```

## Rails-like routing for Express 3.x

如果你在用 Express 3.x，这个模块也是一个不错的选择： https://github.com/jsw0528/railstyle-router#readme
