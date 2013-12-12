# webT - 快速构建 node web 应用

一个快速构建 Node.js web 项目的辅助工具，帮你生成整个web的框架，通过一个简单的命令，生成一个完整的可运行的 web 服务。这个框架从 EDP 现有应用中抽取出来，基于 `connect` 来构建。   

## Install  

```
$ npm install -g webt
#or
$ cnpm install -g webt
```

## Usage  

```
webt targetfolder
```

## Tree  

```
$ tree 
├── Makefile
├── README.md
├── api_routes.js
├── app.js
├── bin
│   └── nodejsctl
├── common
│   ├── logger.js
│   ├── mysql.js
│   └── redis.js
├── config
│   └── index.js
├── controllers
│   ├── api
│   │   └── test.js
│   ├── common.js
│   └── home.js
├── dispatch.js
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
├── routes.js
├── sio_routes.js
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

## To be continue  
