sm.js简介

------
1.什么是asm.js

2.asm.js的原理

3.几个例子

4.可能的应用场景

5.参考来源和更多信息


1.什么是asm.js

 [asm.js](http://asmjs.org/)是由Mozilla提出的一个基于JS的语法标准，主要是为了解决JS引擎的执行效率问题，尤其是使用[Emscripten](https://github.com/kripken/emscripten/wiki)从C/C++语言编译成JS的程序的效率，目前只有Mozilla的[Firefox Nightly](http://nightly.mozilla.org/)中支持。chrome和opera都承诺对asm.js进行优化。

asm的原意应该是assembly（汇编）
    
2.asm.js的原理

下面的图很好的解释了将C/C++程序最终编译成JavaScript的过程：

Emscripten 将C/C++传递给LLVM，编译成的bytecode，然后转换成JavaScript,确切的说是Asm.js。

如果这个编译好的Asm.js需要做渲染图画的工作，那么将由WebGL完成渲染的工作。

![原理](http://images.cnitblog.com/blog/282201/201305/18165202-4730b0d83fa74b019327d23fa188a277.png)

性能

JS一直以来被人诟病的一个方面就是它的性能，得益于这些年来浏览器之间的竞争，让JS的性能大大提升，Google的V8、Mozilla的SpiderMonkey以及微软的Chakra在性能方面都已经相当不错，而asm.js进一步提升到相对本地代码2倍慢的性能（如下图）。这些测试用例使用Emscripten转换而来，Emscripten已经可以直接生成asm.js代码。

![性能](http://kripken.github.com/mloc_emscripten_talk/macro4b.png)
    

3.几个例子

    教程中的两个示例。

    ammo.js

    ammo.js其他demo    

4.工作中的应用场景

    1.别的语言的代码转化（C语言算法）

    2.3D可视化

5.参考来源和更多信息

[http://software.intel.com/zh-cn/articles/html5-asmjs](http://software.intel.com/zh-cn/articles/html5-asmjs)

[http://asmjs.org/spec/latest/](http://asmjs.org/spec/latest/)

[Emscripten](https://github.com/kripken/emscripten/wiki)

[http://www.cnblogs.com/morina/archive/2013/05/18/3085675.html](http://www.cnblogs.com/morina/archive/2013/05/18/3085675.html)

