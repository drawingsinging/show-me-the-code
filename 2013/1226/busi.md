# [autod](https://github.com/dead-horse/autod) - 自动分析项目生成依赖的工具

1. 每次代码里面新增一个模块，我们就需要`npm info name`查出模块现在的最新版本，然后去编辑`package.json`文件，增加这个模块。 
2. 当修改代码去掉了一些模块的时候，需要删除依赖。
3. 不指定特定版本号，可能会有包不同的安装环境下安装到不同版本的包。指定特定版本号，又不能即使更新到模块的最新版本。

*上面这些都不是问题！*

## 通过 autod 自动生成依赖

```
npm install -g autod
```

```bash
$ autod -h

  Usage: autod [options]

  Options:

    -h, --help                           output usage information
    -p, --path [folder path]             the folder path to be parse
    -t, --test <test folder path>        the test folder path to be parse
    -e, --exclude <exclude folder path>  exclude parse folder, split by `,`
    -r, --registry <remote registry>     get latest version from which registry
    -f, --prefix [version prefix]        version prefix, can be `~` or `>=`
    -w, --write                          write dependencies into package.json
    -i, --ignore                         ignore errors, display the dependencies or write the 
    -m, --map                            display all the dependencies require by which file
    dependencies.

```

[cnpmjs.org](http://github.com/fengmk2/cnpmjs.org)的依赖：

```
  "dependencies": {
    "forward": ">=0.0.4",
    "humanize-number": ">=0.0.2",
    "gravatar": "1.0.6",
    "urllib": ">=0.5.5",
    "connect-markdown": "0.0.3",
    "qn": ">=0.2.0",
    "microtime": "0.5.1",
    "debug": ">=0.7.4",
    "utility": ">=0.1.9",
    "ready": "0.1.1",
    "connect": "2.12.0",
    "connect-rt": "0.0.2",
    "connect-redis": "1.4.6",
    "connect-render": "0.3.2",
    "urlrouter": ">=0.5.4",
    "graceful": ">=0.0.5",
    "moment": "2.4.0",
    "logfilestream": ">=0.1.0",
    "ms": "0.6.2",
    "mkdirp": "0.3.5",
    "mysql": "2.0.0-rc2",
    "response-patch": "0.1.1",
    "response-cookie": "0.0.2",
    "bagpipe": "0.3.5",
    "semver": "2.2.1",
    "marked": "0.2.10",
    "nodemailer": "0.5.15",
    "eventproxy": ">=0.2.6"
  },
  "devDependencies": {
    "supertest": "*",
    "should": "*",
    "blanket": "*",
    "travis-cov": "*",
    "coveralls": "*",
    "mocha-lcov-reporter": "*",
    "mocha": "*",
    "mm": "*",
    "pedding": "*"
  }
```

```
$ autod

[DEPENDENCIES]

  "dependencies": {
    "bagpipe": "0.3.5",
    "cnpmjs.org": "0.1.4",
    "connect": "2.12.0",
    "connect-markdown": "0.0.3",
    "connect-redis": "1.4.6",
    "connect-render": "0.3.2",
    "connect-rt": "0.0.2",
    "debug": "0.7.4",
    "eventproxy": "0.2.6",
    "forward": "0.0.4",
    "graceful": "0.0.5",
    "gravatar": "1.0.6",
    "humanize-number": "0.0.2",
    "logfilestream": "0.1.0",
    "marked": "0.3.0",
    "microtime": "0.5.1",
    "mkdirp": "0.3.5",
    "moment": "2.5.0",
    "ms": "0.6.2",
    "mysql": "2.0.0-rc2",
    "nodemailer": "0.5.15",
    "qn": "0.2.0",
    "ready": "0.1.1",
    "response-cookie": "0.0.2",
    "response-patch": "0.1.1",
    "semver": "2.2.1",
    "urllib": "0.5.5",
    "urlrouter": "0.5.4",
    "utility": "0.1.9"
  },
  "devDependencies": {
    "he": "0.3.6",
    "mm": "0.1.7",
    "pedding": "0.0.3",
    "should": "2.1.1",
    "supertest": "0.8.2"
  }
```
`devDependencies`中有部分模块没有被解析出来？因为有些辅助的模块没有在代码里面`require`，但是却是执行测试时候必须的工具。没关系，通过`autod`自动写入package.json的时候，会保留`devDependencies`中未解析到的模块。`-m, --map`选项可以把所有第三方模块应用的文件打印出来。

```
$ autod -w -m

[DEPENDENCIES]

  "dependencies": {
    "bagpipe": "0.3.5",
    "cnpmjs.org": "0.1.4",
    "connect": "2.12.0",
    "connect-markdown": "0.0.3",
    "connect-redis": "1.4.6",
    "connect-render": "0.3.2",
    "connect-rt": "0.0.2",
    "debug": "0.7.4",
    "eventproxy": "0.2.6",
    "forward": "0.0.4",
    "graceful": "0.0.5",
    "gravatar": "1.0.6",
    "humanize-number": "0.0.2",
    "logfilestream": "0.1.0",
    "marked": "0.3.0",
    "microtime": "0.5.1",
    "mkdirp": "0.3.5",
    "moment": "2.5.0",
    "ms": "0.6.2",
    "mysql": "2.0.0-rc2",
    "nodemailer": "0.5.15",
    "qn": "0.2.0",
    "ready": "0.1.1",
    "response-cookie": "0.0.2",
    "response-patch": "0.1.1",
    "semver": "2.2.1",
    "urllib": "0.5.5",
    "urlrouter": "0.5.4",
    "utility": "0.1.9"
  },
  "devDependencies": {
    "blanket": "*",
    "coveralls": "*",
    "he": "0.3.6",
    "mm": "0.1.7",
    "mocha": "*",
    "mocha-lcov-reporter": "*",
    "pedding": "0.0.3",
    "should": "2.1.1",
    "supertest": "0.8.2",
    "travis-cov": "*"
  }
[INFO] Write dependencies into package.json.

[DEPENDENCY MAP]

{ graceful: [ '/Users/deadhorse/git/cnpmjs.org/worker.js' ],
  ms: 
   [ '/Users/deadhorse/git/cnpmjs.org/sync/index.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/sync_all.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/sync_exist.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/sync_module_worker.js',
     '/Users/deadhorse/git/cnpmjs.org/common/logger.js' ],
  utility: 
   [ '/Users/deadhorse/git/cnpmjs.org/sync/index.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/status.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/sync_all.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/sync_exist.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/module.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/sync_module_worker.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/user.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/registry/module.js',
     '/Users/deadhorse/git/cnpmjs.org/common/mail.js' ],
  debug: 
   [ '/Users/deadhorse/git/cnpmjs.org/sync/index.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/status.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/sync_all.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/sync_exist.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/sync_module_worker.js',
     '/Users/deadhorse/git/cnpmjs.org/middleware/auth.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/registry/module.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/registry/user.js' ],
  eventproxy: 
   [ '/Users/deadhorse/git/cnpmjs.org/sync/sync_all.js',
     '/Users/deadhorse/git/cnpmjs.org/sync/sync_exist.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/module.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/sync_module_worker.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/total.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/total.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/web/package.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/web/user.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/registry/module.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/registry/user.js',
     '/Users/deadhorse/git/cnpmjs.org/backup/dump.js' ],
  'response-patch': 
   [ '/Users/deadhorse/git/cnpmjs.org/servers/registry.js',
     '/Users/deadhorse/git/cnpmjs.org/servers/web.js' ],
  connect: 
   [ '/Users/deadhorse/git/cnpmjs.org/servers/registry.js',
     '/Users/deadhorse/git/cnpmjs.org/servers/web.js',
     '/Users/deadhorse/git/cnpmjs.org/common/session.js' ],
  'connect-rt': 
   [ '/Users/deadhorse/git/cnpmjs.org/servers/registry.js',
     '/Users/deadhorse/git/cnpmjs.org/servers/web.js' ],
  'response-cookie': [ '/Users/deadhorse/git/cnpmjs.org/servers/registry.js' ],
  urlrouter: 
   [ '/Users/deadhorse/git/cnpmjs.org/servers/registry.js',
     '/Users/deadhorse/git/cnpmjs.org/servers/web.js' ],
  forward: [ '/Users/deadhorse/git/cnpmjs.org/servers/registry.js' ],
  'connect-markdown': [ '/Users/deadhorse/git/cnpmjs.org/servers/web.js' ],
  'connect-render': [ '/Users/deadhorse/git/cnpmjs.org/servers/web.js' ],
  urllib: 
   [ '/Users/deadhorse/git/cnpmjs.org/proxy/npm.js',
     '/Users/deadhorse/git/cnpmjs.org/proxy/sync_module_worker.js' ],
  moment: 
   [ '/Users/deadhorse/git/cnpmjs.org/controllers/download.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/web/package.js',
     '/Users/deadhorse/git/cnpmjs.org/common/logger.js',
     '/Users/deadhorse/git/cnpmjs.org/backup/dump.js' ],
  microtime: [ '/Users/deadhorse/git/cnpmjs.org/controllers/total.js' ],
  semver: 
   [ '/Users/deadhorse/git/cnpmjs.org/controllers/web/package.js',
     '/Users/deadhorse/git/cnpmjs.org/controllers/registry/module.js' ],
  marked: [ '/Users/deadhorse/git/cnpmjs.org/controllers/web/package.js' ],
  gravatar: [ '/Users/deadhorse/git/cnpmjs.org/controllers/web/package.js' ],
  'humanize-number': [ '/Users/deadhorse/git/cnpmjs.org/controllers/web/package.js' ],
  bagpipe: [ '/Users/deadhorse/git/cnpmjs.org/controllers/registry/module.js' ],
  mkdirp: [ '/Users/deadhorse/git/cnpmjs.org/config/index.js' ],
  logfilestream: [ '/Users/deadhorse/git/cnpmjs.org/common/logger.js' ],
  nodemailer: [ '/Users/deadhorse/git/cnpmjs.org/common/mail.js' ],
  ready: [ '/Users/deadhorse/git/cnpmjs.org/common/mysql.js' ],
  mysql: [ '/Users/deadhorse/git/cnpmjs.org/common/mysql.js' ],
  qn: [ '/Users/deadhorse/git/cnpmjs.org/common/qnfs.js' ],
  'connect-redis': [ '/Users/deadhorse/git/cnpmjs.org/common/session.js' ],
  mm: 
   [ '/Users/deadhorse/git/cnpmjs.org/test/sync/sync_all.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/sync/sync_exist.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/module.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/module_log.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/npm.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/user.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/middleware/auth.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/sync.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/web/package.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/registry/module.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/registry/user.test.js' ],
  should: 
   [ '/Users/deadhorse/git/cnpmjs.org/test/sync/sync_all.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/sync/sync_exist.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/module.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/module_log.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/npm.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/sync_module_worker.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/proxy/user.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/middleware/auth.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/middleware/opensearch.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/sync.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/total.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/web/package.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/web/user.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/registry/module.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/registry/user.test.js' ],
  supertest: 
   [ '/Users/deadhorse/git/cnpmjs.org/test/middleware/auth.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/middleware/opensearch.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/sync.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/total.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/web/package.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/web/user.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/registry/module.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/registry/user.test.js' ],
  pedding: 
   [ '/Users/deadhorse/git/cnpmjs.org/test/controllers/sync.test.js',
     '/Users/deadhorse/git/cnpmjs.org/test/controllers/total.test.js' ] }
```

*赶快用`autod`来快捷的生成漂亮的依赖列表吧！*
