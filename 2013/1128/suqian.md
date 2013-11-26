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

## 代码解说

[demoapi/](https://github.com/TBEDP/show-me-the-code/tree/master/2013/1128/demoapi)

