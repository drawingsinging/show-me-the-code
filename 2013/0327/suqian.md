# gitlab hooks and API

结合 gitlab hooks 和 API，可以实现很多研发相关的自动化功能。

[hooks](http://gitlab.alibaba-inc.com/edp/alimovie/hooks)

![1](http://nfs.nodeblog.org/a/c/ac2f13eaafa590684a90966159eaa2dd.png)

[API](http://gitlab.alibaba-inc.com/help/api)

![2](http://nfs.nodeblog.org/1/4/1467f4065439c66381e21a9c122fe457.png)

## commit 自动关联 issues

需求说明: http://gitlab.alibaba-inc.com/edp/alimovie/issues/1084

* 自动将commit关联对应的issue；

```bash
$ git commit -am '#123 尝试修复'
```

* 自动关闭issue: 支持 fix #123 , fixed #123, Fixed #123 , fixes #123

```bash
$ git commit -am 'fix #123 修复了xxx严重bug'
```

效果

![3](http://nfs.nodeblog.org/c/8/c851b08c971755fb905b651aa8bc11f3.png)

## node-gitlab

![logo](https://raw.github.com/fengmk2/gitlab/master/logo.png)

Github: https://github.com/fengmk2/gitlab

Gitlab API nodejs client.

* [Gitlab API document](https://github.com/gitlabhq/gitlabhq/tree/master/doc/api)
* jscoverage: [98%](http://fengmk2.github.com/coverage/gitlab.html)

## Install

```bash
$ npm install node-gitlab
```

## Usage

```js
var gitlab = require('node-gitlab');

var client = gitlab.create({
  api: 'https://gitlab.com/api/v3',
  privateToken: 'your private token'
});
client.milestone.list({id: 1}, function (err, milestones) {
  console.log(milestones);
});
```

## Document

@see [Gitlab API document](https://github.com/gitlabhq/gitlabhq/tree/master/doc/api).

### Milestones

```js
/**
 * Get a project's milestone.
 * 
 * @param {Object} params
 *  - {Number} id, project's id
 *  - {Number} milestone_id, milestone's id.
 * @param {Function(err, row)} callback
 */
Milestone.prototype.get = function (params, callback);

/**
 * List a project's all milestones.
 * 
 * @param {Object} params
 *  - {Number} id, project's id.
 *  - {Number} [page=1], page number, default is `1`.
 *  - {Number} [perPage=20], number of items to list per page, max is `100`.
 * @param {Function(err, rows)} callback
 */
Milestone.prototype.list = function (params, callback);

/**
 * Create a milestone.
 * 
 * @param {Object} params
 *  - {Number} id (required) - The ID of a project
 *  - {String} title (required) - The title of an milestone
 *  - {String} [description] (optional) - The description of the milestone
 *  - {String} [due_date] (optional) - The due date of the milestone
 * @param {Function(err, row)} callback
 */
Milestone.prototype.create = function (params, callback);

/**
 * Update a milestone.
 * @param {Object} params
 *  - {Number} id (required) - The ID of a project
 *  - {Number} milestone_id (required) - The ID of a project milestone
 *  - {String} title (required) - The title of an milestone
 *  - {String} [description] (optional) - The description of the milestone
 *  - {String} [due_date] (optional) - The due date of the milestone
 *  - {String} [closed] (optional) - The status of the milestone
 * @param {Function(err, row)} callback
 */
Milestone.prototype.update = function (params, callback);
```
