# firefox window.location.hash decode

如果window.location.hash中包含encode的字符，firefox会返回decode之后的结果，而其他浏览器不做该处理。

不了解这个特性可能会产生的bug，firefox下hash值两次decode，如果字符中包含%，就会报error了。