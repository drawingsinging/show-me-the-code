# 对称加密算法

  源于魔方小二版迁移项目。

  由用户名、类目等信息生成token，由浏览器get请求后验证并解析。

  各浏览器对url长度有限制，IE稍短，因此在保证安全性的同时，时间代价要小、加密结果要足够短： AES && RC4

  两者都是比较流行的加密算法

## AES

  优秀，非常安全。加密结果稍长，随着加密字符串的增长，加密结果迅速增大。
  
## RC4

  也是很优秀的算法，在安全性上虽略逊AES一筹，但在该应用场景里已经非常足够了。

  加密结果的长度适中，可以接受

## 坑

  RC4对中文的加密解密不太健全，要注意


```js
var crypto = require('crypto');
var password = 'cube_xiaoer';
var str = '紫胤';
console.log('明文：' + str);
//str = encodeURIComponent(str);

var cipher = crypto.createCipher("rc4", password);
//var cipher = crypto.createCipher("aes256", password);
var ciphered = cipher.update(str, "utf8", "hex");
ciphered += cipher.final("hex");
console.log('加密：' + ciphered);

var decipher = crypto.createDecipher("rc4", password);
//var decipher = crypto.createDecipher("aes256", password);
var deciphered = decipher.update(ciphered, "hex", "utf8");
deciphered += decipher.final("utf8");
//deciphered = decodeURIComponent(deciphered);
console.log('解密：' + deciphered);
```
