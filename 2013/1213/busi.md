# [webT](http://github.com/dead-horse/webT) - 快速构建 node web 应用

一个快速构建 Node.js web 项目的辅助工具，帮你生成整个web的框架，通过一个简单的命令，生成一个完整的可运行的 web 服务。这个框架从 EDP 现有应用中抽取出来，基于 `connect` 来构建。   

## Install  

```
$ npm install -g webt
#or
$ cnpm install -g webt
```

## Usage

```
$ webt ./example

  input your project name: webt_demo
  input your project description: a webt demo project
  input your name: dead_horse
  input your email: dead_horse@qq.com

choose plugins you want: 
  need mysql(y/n)?y
  need redis(y/n)?y
  need logger(y/n)?y
  need socket.io(y/n)?y
  need restful wrap(y/n)?y
```

```
$ cd example
$ make install

# 开发
$ node dispatch.js
$ node-dev dispatch.js

# 测试  
$ make test
$ make test-cov
$ make test-cov-html

# 线上
$ bin/nodejsctl start
$ bin/nodejsctl stop
$ bin/nodejsctl restart
$ bin/nodejsctl status
```

## Tree  

```
$ tree 
├── Makefile        # install && test 驱动
├── README.md
├── api_routes.js   # restful api 路由 
├── app.js          # web服务
├── bin
│   └── nodejsctl   # 服务启动脚本
├── common
│   ├── logger.js
│   ├── mysql.js
│   └── redis.js
├── config          # 在此文件夹下可自定义config.js文件
│   └── index.js
├── controllers
│   ├── api
│   │   └── test.js
│   ├── common.js
│   └── home.js
├── dispatch.js     # 服务启动入口
├── lib
│   └── utils.js
├── middleware
├── package.json
├── proxy
├── public
│   ├── css
│   ├── image
│   └── js
│       └── socket.js
├── routes.js       # 路由
├── sio_routes.js   # socket.io 路由
├── test
│   └── controllers
│       ├── api
│       │   └── test.test.js
│       └── home.test.js
├── views
│   ├── home.html
│   └── layout.html
└── worker.js
```
