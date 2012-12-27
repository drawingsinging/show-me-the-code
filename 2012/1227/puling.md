## Twitter 持续集成
- #velocity#twitter做前端性能监测用了好多node来当工具。yslow的持续集成蛮好
- node出来后，前端小工具也多出来不少#velocity#
- #velocity#YSlow for phantomjs。phantomjs是个好东东
- #velocity#围绕性能优化，今天来自twitter的主题展现了，Node.js和PhantomJS是如何填补前端生态圈的空白。 服务端JS潜力无限丫。

## SPDY
- #velocity#第一次听spdy，不知道可以自动翻墙不
- #velocity#spdy fix them all。好霸气。
- Node的spdy模块都有了 indutny/node-spdy http://t.cn/zWz9Xlb
- tcp slow start在google的大牛们改成初始化增成三倍的情况下得到了很好的效果，只是一行改动，他们写了25页的报告去证明它。#velocity#

## 持续部署
- #velocity#连续部署这样的主题～@Python发烧友 羡慕不。

## PageSpeed
- 现场用PageSpeed分析O'Reily的的页面。嘉宾其实是个安全宝高级黑丫。#velocity#

## MySQL
- 原来MySQL我们过去的发音多错了 - - #velocity#
- 买斯科落 不是 买爱斯QL 记得跟我念 #velocity#

## OmniTi
- #velocity# OmniTi分享的主题，在Node中我们也有做一些尝试，发部分流量到开发环境中。 http://t.cn/zlrUKW8

## Yahoo! Node.js
- #velocity# Yahoo Node.js应用性能优化 ~ 我来直播吧。
- #velocity# Yahoo!的Node.js应用处，搜索Web前端 Search Direct。部分媒体站点。部分移动应用。部分内部平台/工具。and more ...
- #velocity# Yahoo!应用程序框架 Mojito～应用托管环境 Manhattan 开发工具支持有自动化测试框架和托管的持续集成环境～ 赞。
- #velocity#Yahoo!系比较喜欢BSD License。Mojito也用BSD。Mojito的一个优势就是客户端与服务端均可执行，前后端切换蛮容易～代码重用：module + widget = mojits 利用NPM打包，重用～
- #velocity#通过NPM来重用模块，看来是社区的一个共识～（俺们阿里也有企业级NPM服务丫！)
- #velocity#Manhattan听起来有点像社区的NAE。不过竟然支持多CPU，还支持多环境 dev -> test -> performance -> stg -> prod。cc @q3boy
- #velocity#Node性能优化三条大原则：1. 充分利用硬件，多核CPU2. 总使用异步函数3. native module，封装常用module为二进制形式
- Cookie之类的处理，就用二进制，C++速度快一些
- #velocity#性能分析工具 v8-profiler + node-inspector nodetime。
- #velocity#其余性能优化 combo静态资源文件，俺们用loader。静态文件上CDN，这部分俺们也有实践。

## Pomelo
- #velocity#游戏服务器与Web服务器的区别，游戏服务器的交互要求是实时的。Web服务器某些场景不需要那么高实时。
- #velocity# V8的GC只要没出现内存泄漏，GC并不造成问题。内存中不适宜放太多东西。
- #velocity#pemolo 的设计中，分前端服务器和后端服务器，以及各种各样的服务器。看起来就是分布式架构，如何管理？RPC如何简化？进程如何管理？
- #velocity#pomelo如何做扩展？1. 搭好大架子，逐步替换局部 2. DSL做应用抽象 3. 模块化
- #velocity# 1600 onlines 35%的CPU，闲置场景。打斗场景800 onlines CPU 80% 。

## 新浪计数器
- #velocity#multi get。
- PDD，蛋疼驱动开发#velocity#
- #velocity#把存指针的地方拿来存数据，节省内存

