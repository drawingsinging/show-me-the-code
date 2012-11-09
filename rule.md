# 无规则，不成方圆

## Gitlab

统一使用内部的 [gitlab](http://gitlab.alibaba-inc.com) 进行代码托管。

如没有 gitlab 账号的同学，请联系 @渐本 或 @唐容 开通权限。

### 基于git的分支命名原则与分支开发步骤

git 通常是走分支开发，一般来说，master 的写权限只有很少人拥有，
开发者通常都是针对自己需要实现的功能，创建对应的分支，然后开发，然后提交合并请求。
进行 code review 之后，决定是否合并到 master 。

分支开发一般步骤：

1. 新功能或者bug fixed提交到issues；
2. 创建 `issue$ID-featureName` 或者 `issue$ID-somebugHotfix` 分支，进行新功能开发或者修复bug，$ID就是对应的issue生成的id；
3. coding，unit test 通过后，提交 Merge request，指定 code review 人；
4. code review 人进行review，如果觉得没问题，可以合并，就添加一个 `+1` 的评论；项目组其他人员也可以参与review，同样以 `+1` 代表review通过；如果review不通过，请对有问题的代码进行评论说明，有理有据。
5. review通过，最终通过web的auto merge 功能进行自动合并，到处，这次快速迭代开发完毕。
6. 继续按 1. 循环进行下一次迭代。

### git rebase

如果在提交合并请求之前，发现已经落后master很多个版本，并且无法自动解决冲突，
需要先将分支在master上rebase一下，然后手动解决完冲突，再提交到一个xxx-rebase分支。

然后在提交合并请求。

也就是说，**冲突解决由分支提交者来处理**。

请按照 [交互式rebase](http://gitbook.liuhui998.com/4_3.html) 将多个commit合并成一个。

```bash
$ git rebase master -i
```

git rebase 相关的一篇图文并茂：[Git-rebase 小筆記](http://blog.yorkxin.org/2011/07/29/git-rebase)

### 设定你的git身份

为了不污染全局的git身份标示，建议对每个git项目单独设置内部的身份标示，如

```bash
$ git config user.name 苏千
$ git config user.email suqian.yf@taobao.com
```

### 从 svn 迁移到 gitlab

可以参考TCIF的迁移过程: [从 svn 迁移到 gitlab](http://work.taobao.org/projects/tcif/wiki/Svn_%E8%BF%81%E7%A7%BB%E5%88%B0_git)

## 代码规范

必要严格参照 [Node代码规范](https://github.com/windyrobin/iFrame/blob/master/style.md)

## 单元测试

所有代码必须包含相对于的单元测试，代码文件与测试文件一一对应。

如 `lib/utils.js` => `test/lib/utils.test.js`

无特殊情况，努力做到代码覆盖率 **100%** 

### Makefile

使用 `Makefile` , `make test` 及 `make test-cov` 启动测试

一个web应用的 `Makefile` 示例:

```bash
TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)
TIMEOUT = 30000
MOCHA_OPTS =
REPORTER = tap
JSCOVERAGE = ./node_modules/jscover/bin/jscover
PROJECT_DIR = $(shell pwd)
NPM_REGISTRY = --registry=http://registry.npm.taobao.net
NPM_INSTALL_PRODUCTION = PYTHON=`which python2.6` NODE_ENV=production npm install $(NPM_REGISTRY)
NPM_INSTALL_TEST = PYTHON=`which python2.6` NODE_ENV=test npm install $(NPM_REGISTRY)

check:
  @curl -s http://npm.taobao.org/version/check.sh | sh

install: check
  @$(NPM_INSTALL_PRODUCTION)

install-test: check
  @$(NPM_INSTALL_TEST)

test: install-test
  @NODE_ENV=test node_modules/mocha/bin/mocha \
    --reporter $(REPORTER) --timeout $(TIMEOUT) $(MOCHA_OPTS) $(TESTS)

cov:
  @rm -rf cov
  @$(JSCOVERAGE) --exclude=test --exclude=public \
    --exclude=bin --exclude=conf --exclude=tmp --exclude=lib . cov
  @cp -rf ./node_modules ./test ./public ./conf ./dispatch.js ./lib ./bin cov

test-cov: cov
  @$(MAKE) -C ./cov test REPORTER=dot
  @$(MAKE) -C ./cov test REPORTER=html-cov > $(PROJECT_DIR)/coverage.html

toast:
  @curl http://toast.corp.taobao.com/api/runtaskbyid?id=$TASK_ID
  @open http://toast.corp.taobao.com/task/view/id/$TASK_ID

.PHONY: check install install-test test test-cov cov toast
```

### 单元测试参考 

[实战Nodejs单元测试](http://fengmk2.github.com/ppt/unittest-and-bdd-in-nodejs-with-mocha.html)

## 服务器申请、环境、路径及监听端口约定

请查看 [服务器申请、环境、路径及监听端口约定](http://baike.corp.taobao.com/index.php/ServerENV#.E4.B8.80.E6.AC.A1.E6.80.A7.E5.AE.89.E8.A3.85.E6.89.80.E6.9C.89.E4.BE.9D.E8.B5.96.E5.8F.8A.E7.8E.AF.E5.A2.83) 文档
