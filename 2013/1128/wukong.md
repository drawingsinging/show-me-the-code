# Sass 与 Emmet 介绍

[Sass](http://sass-lang.com/)

[Emmet](http://docs.emmet.io/)

主要介绍 Sass 的嵌套写法 和
Sublime Emmet 的基本使用。


## Sass

摘自 industry_index.css From taobaoindex

```css
.main {
  width: 990px;
  margin: 0 auto;
  position: relative;
}
.main .nav {
  height: 58px;
  line-height: 58px;
}
.main .nav li {
  float: left;
  padding-left: 54px;
}
.main .nav li a {
  color: #9f9f9f;
  font-size: 12px;
}
.main .nav a.active {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
}
```

如果是 BEM 命名法

```css
.main{}
.main--nav{}
.main--nav--li{}
.main--nav--li--a{}
.main--nav--a.active{}
```

如果用 Sass 来写的话，可以使用嵌套的语法来写。可以很不损手指地达到限定 CSS 作用域的效果。

```sass
.main {
  width: 990px;
  margin: 0 auto;
  position: relative;

  .nav {
    height: 58px;
    line-height: 58px;

    li {
      float: left;
      padding-left: 54px;

      a {
        color: #9f9f9f;
        font-size: 12px;
      }
    }
    a.active {
      font-size: 14px;
      font-weight: bold;
      color: #000000;
    }
  }
}
```

且 Sass 完全兼容 CSS，可以无缝引入旧项目。

我有试着帮 Loader.js 加入 Sass 的支持。生产环境那部分已经成功，但是测试环境部分 Loader.js 无法方便获取项目代码目录，所以停止了。


## Emmet(previously known as Zen Coding)

用 CSS selector 来写 HTML。或者说，用 Jade 的语法来写 HTML：Jade 写起来方便，HTML 调整细节方便。

在 Sublime 中安装：`Run “Package Control: Install Package” command, find and install Emmet plugin.`

有 HTML:

```html
  <div class="prop-section">
    <h3>年龄</h3>
    <div class="prop-drag-bar prop-section-content">
      <div class="age-drag-bar drag-bar-container" data-key="tag_age_level_id" data-value=""></div>
    </div>
  </div>

  <div class="prop-section">
    <h3>年代</h3>
    <div class="prop-drag-bar prop-section-content">
      <div class="period-drag-bar drag-bar-container" data-key="tag_age" data-value=""></div>
    </div>
  </div>
```

Emmet 语句:

`.prop-section>h3{年龄}+.prop-drag-bar.prop-section-content>.age-drag-bar.drag-bar-container[data-key=tag_age_level_id][data-value]^^.prop-section>h3{年代}`

