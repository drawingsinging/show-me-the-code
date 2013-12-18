# CISE, 阿里内部的 Travis ci

在 git 群看到@李福 发了一个 [CISE](http://gitlab.alibaba-inc.com/cise/engine/wikis/user_home) 的新玩意,
说是跟 [Travis-ci](https://travis-ci.org) 一样的东西, 甚至比它有更多的自定义和控制权力.

于是我尝试将 nodejs 的单元测试集成进去.

## node-buc 示例

最终效果: http://toast.corp.taobao.com/task/4423

![1](http://nfs.nodeblog.org/8/8/88689067fb327b55dd53dc2179487260.png)

## 如何实现?

* 先到 Toast 创建 [基于CISE的单元测试](http://toast.corp.taobao.com/task/create)

![1](http://nfs.nodeblog.org/c/a/ca0f308f027da73ffcd938d1569f409c.png)

* 添加 web hook, 跟普通的 Toast 一致

* package.json 增加 [alicov](https://github.com/fengmk2/alicov) 的配置

```json
"scripts": {
  "test": "make test-all",
  "blanket": {
    "pattern": "//^((?!(node_modules|test)).)*$/"
  }
},
"config": {
  "alicov": {
    "threshold": 95
  }
}
```

* 修改 Makefile, 使用 [alicov](https://github.com/fengmk2/alicov) 做代码覆盖率解析工具

`Makefile` 示例:

```bash
TESTS = test/*.test.js
REPORTER = tap
TIMEOUT = 10000
MOCHA_OPTS =
MOCHA = ./node_modules/mocha/bin/mocha
NPM_REGISTRY = --registry=http://registry.npm.taobao.net --disturl=http://dist.u.qiniudn.com
NPM_INSTALL_PRODUCTION = PYTHON=`which python2.6` NODE_ENV=production npm $(NPM_REGISTRY) install --silent
NPM_INSTALL_TEST = PYTHON=`which python2.6` NODE_ENV=test npm $(NPM_REGISTRY) install --silent

install:
  @$(NPM_INSTALL_PRODUCTION)

install-test:
  @$(NPM_INSTALL_TEST)

test: install-test
  @NODE_ENV=test $(MOCHA) \
    --reporter $(REPORTER) \
    --timeout $(TIMEOUT) \
    $(MOCHA_OPTS) \
    $(TESTS)

test-cov:
  @$(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov | ./node_modules/alicov/bin/alicov

test-all: test test-cov

.PHONY: test
```

* 编辑 `.cise.yml`

```
default:
  prepare:
    exec:
      - yum install -b current nodejs -y && chown root:root -R $source_root
      - echo "export PATH=/opt/taobao/install/node.js/bin:$PATH" >> ~/.bashrc
  unit_test:
    exec:
      - echo "node `node -v`" && echo "npm `npm -v`"
      - make install
      - make test
      - make test-cov
    parser:
      - mocha
```

* push你的代码吧

Toast 任务会比自动触发, 然后你就看到结果了.

## CISE 还有 web 终端

在测试出错的时候, 可以直接上去调试

![2](http://nfs.nodeblog.org/f/3/f3565b706c0a928a8f8e9c38efb4e029.png)

## 有爱

还等什么? 马上来玩吧!

