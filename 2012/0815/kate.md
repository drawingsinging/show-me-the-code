# Node.JS 中Buffer的各种坑

## 1、操作时必须传入position
Node.JS的buffer的操作函数与Java等的不同，没有内建指针的nextInt nextBoolean 等方法，在使用readInt16BE等方法操作bffer时，必须传入参数
position，不传或传入值超出buffer范围，则会导致严重异常，传错position，则可能会导致得到的结果不对。

## 2、奇怪的浮点字节序
我们都知道，因为较长的整数在不同系统的内存中的高低位排布顺序可能不同，我们称这种现象叫做字节序。而浮点数，由于目前绝大多数语言均遵循[IEEE754]
(http://www.docin.com/p-337018007.html)的浮点规范，在内存中，浮点数的物理高位和低位的逻辑意义并不是简单的字节序关系，可是在Node.js中
Buffer却存在readDoubleLE这样奇怪的方法。经研究，readDoubleLE的功能便是在生成IEEE754 Double(Float)之后，直接将其的字节顺序反转，这是
没有任何意义的工作。所以在读写浮点数时，尽量使用read(write)Double(Float)BE这对函数。

## 3、zlib的两个标准
gzip、deflate等压缩/封装形式，可能有若干个有细微差异的规范版本，不同语言可能会遵循不同的版本。Node.js使用的zlib位于deps/zlib中，
遵循rfc1950-rfc1952三个文件规定的标准，若是需要解压不同的规范下的编码/封装格式，则需要使用各种第三方的zip库。

