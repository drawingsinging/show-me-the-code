# 搭建双协议接口的服务

最近给DXP支持开发的新版api, 需要同时支持HSF和HTTP接口, 其实早在做日历服务端的时候,
我跟@不四 已经总结出一套代码复用并且同时支持双协议的框架, 或者说是代码组织方式.

我将日历服务端的代码, 抽象出了两个模块 [hsf-wrap](http://gitlab.alibaba-inc.com/edp/hsf-wrap/tree/master) 和 [restful-wrap](https://github.com/fengmk2/restful-wrap)

代码复用, 说白了就是将 `controllers` 的逻辑代码复用起来, 不需要单独为 HTTP 或者 HSF 重复写一堆类似的代码.
通常这些代码就是参数验证和参数转换.

## 代码目录结构

```bash
$ tree
.
├── Makefile
├── config
│   └── index.js
├── controllers
│   ├── auth_request.js
│   ├── common.js
│   └── user.js
├── dispatch.js
├── package.json
├── public
│   └── status.taobao
├── routes
│   ├── hsf.js
│   ├── hsf_meta.js
│   └── rest.js
├── servers
│   ├── hsf.js
│   └── web.js
├── test
│   └── routes
│       ├── hsf.test.js
│       └── rest.test.js
└── worker.js

7 directories, 16 files
```

## 运行

```bash
$ node dispatch.js
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2396] #1 new worker start
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2397] #2 new worker start
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [master:2395] com.taobao.demoapi.Service:1.0.0:12200 published
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2396] #1 worker online
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2397] #2 worker online
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2397] #2 Server started, web listen at 7001, hsf listen at 12200 cluster: true
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2396] #1 Server started, web listen at 7001, hsf listen at 12200 cluster: true
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2396] #1 worker listening on 0.0.0.0:7001:4
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2397] #2 worker listening on 0.0.0.0:7001:4
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2396] #1 worker listening on 0.0.0.0:12200:4
[Tue Nov 26 2013 16:56:08 GMT+0800 (CST)] [worker:2397] #2 worker listening on 0.0.0.0:12200:4
```

### RESTful

```bash
$ curl 127.0.0.1:7001/v1/users/1?callsource=devtoken
{"name":"suqian.yf","uid":"1"}

$ curl 127.0.0.1:7001/v1/users/500?callsource=devtoken
{"message":"mock server error"}
```

### HSF

[com.taobao.demoapi.Service:1.0.0](http://ops.jm.taobao.net/service-manager/service_search/search.htm?key=com.taobao.demoapi.Service%3A1.0.0&type=1)

![1](http://nfs.nodeblog.org/c/6/c6df9aa3b78d679d3b42c7461e60195c.png)

## 代码解说

[demoapi/](https://github.com/TBEDP/show-me-the-code/tree/master/2013/1128/demoapi)

## 优势

很难想象使用其他语言会如何实现这类的多协议接口服务.

假设新的接口使用方已有的系统, 只能支持 tair 协议, 使用 hsf 和 restful 接口成本很高,

你会怎么办?

"每个 node 进程就是网络海洋中的小小节点, 它们组成了整个网络."
