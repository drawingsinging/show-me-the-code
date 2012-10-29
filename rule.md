# 无规则，不成方圆

## 代码规范

* [Node代码规范](https://github.com/windyrobin/iFrame/blob/master/style.md)

## 单元测试

所有代码必须包含相对于的单元测试，代码文件与测试文件一一对应。

如 `lib/utils.js` => `test/lib/utils.test.js`

无特殊情况，努力做到代码覆盖率 **100%** 

### Makefile

使用 `Makefile` , `make test` 及 `make test-cov` 启动测试

一个web应用的 `Makefile` 示例:

```bash
NAME = nodeblog
TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)
TIMEOUT = 5000
REPORTER = tap
JSCOVERAGE = ./node_modules/visionmedia-jscoverage/jscoverage
PROJECT_DIR = $(shell pwd)
NPM_INSTALL_PRODUCTION = PYTHON=`which python2.6` NODE_ENV=production \
  npm --registry=http://registry.npm.tbdata.org --production install
NPM_INSTALL_TEST = PYTHON=`which python2.6` NODE_ENV=test \
  npm --registry=http://registry.npm.tbdata.org install 

install:
  @$(NPM_INSTALL_PRODUCTION)

test:
  @$(MAKE) install
  @$(NPM_INSTALL_TEST)
  @NODE_ENV=test node_modules/mocha/bin/mocha \
    --reporter $(REPORTER) --timeout $(TIMEOUT) $(TESTS)

cov:
  @rm -rf ../$(NAME)-cov
  @$(JSCOVERAGE) --encoding=utf-8 --exclude=node_modules --exclude=test --exclude=public \
    --exclude=bin --exclude=client --exclude=benchmarks --exclude=conf \
    ./ ../$(NAME)-cov
  @cp -rf ./node_modules ./bin ./test ./public ./conf ./dispatch.js ./hsf.js ../$(NAME)-cov

test-cov: cov
  @$(MAKE) -C $(PROJECT_DIR)/../$(NAME)-cov test REPORTER=dot
  @$(MAKE) -C $(PROJECT_DIR)/../$(NAME)-cov test REPORTER=html-cov > $(PROJECT_DIR)/coverage.html

.PHONY: install test test-cov cov
```

### 单元测试参考 

[实战Nodejs单元测试](http://fengmk2.github.com/ppt/unittest-and-bdd-in-nodejs-with-mocha.html)

