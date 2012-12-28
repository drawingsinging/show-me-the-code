# node-hsf介绍  

## 什么是HSF  

* HSF： 淘宝的高性能服务框架，java应用基本都是通过它来做的分布式服务。  
* node-hsf是为了node调用java的hsf服务，以及向java提供服务而实现的一个hsf的node.js SDK。同时可以作为一个高性能的node.js分布式服务框架使用。     

## node-hsf的特点  

* 与java hsf服务基本无缝对接。   
* 服务负载均衡，通过配置管理中心进行地址管理。  
* 服务、方法级别的超时设置。   
* 服务、方法级别的流量限制（令牌桶算法）。  
* 序列化方式可选，与java通讯使用hessian，与node通讯使用json。  
* 高性能：node之间通讯比HTTP高70%。  
* 支持中间件，使用简单。   
* 兼容centOS, mac, ubuntu。   
* 提供性能测试工具。   

## 地址  
[hsf](http://npm.taobao.org/guide/detail?name=hsf)