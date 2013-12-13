# cnpmjs.org

## 为什么要做

* npm 快挂了
* 目前的内部npm是一个黑盒
* 需要支持水平扩展
* 我们没有钱
* @朴灵 吹了牛逼, 写了书, 需要有人去填坑, 确保诚信价值观.

## 简介

```bash
$ open http://cnpmjs.org/
```

## cnpm cli

```bash
$ npm install -g cnpm
```

## 现在就开始使用 cnpm

### Makefile

```bash
install:
  @npm install --registry=http://registry.cnpmjs.org --cache=${HOME}/.npm/.cache/cnpm
```

### .travis.yml

```yml
# add this config
before_install:
  - 'make install'
```
