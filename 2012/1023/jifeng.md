MongoDB中query当key时的错误
====

具体数据：

    { "_id" : ObjectId("4fe955021219143f31b9d2b9"), "query" : 1, "test" : [ 1, 2, 3 ] }
    { "_id" : ObjectId("4fe9557b1219143f31b9d2ba"), "q" : 1, "r" : 2 }
    { "_id" : ObjectId("4fe955b11219143f31b9d2bb"), "query1" : 1, "r" : 2 }
 

在正常的key value查找时没有任何问题：

    PRIMARY> db.testin.find({query: 1})
    { "_id" : ObjectId("4fe955021219143f31b9d2b9"), "query" : 1, "test" : [ 1, 2, 3 ] }
    PRIMARY> db.testin.find({q: 1})
    { "_id" : ObjectId("4fe9557b1219143f31b9d2ba"), "q" : 1, "r" : 2 }
    PRIMARY> db.testin.find({quer1: 1})
  

用or逻辑查找也没有问题：

    PRIMARY> db.testin.find({$or:[{query: 1}]})
    { "_id" : ObjectId("4fe955021219143f31b9d2b9"), "query" : 1, "test" : [ 1, 2, 3 ] }
    PRIMARY> db.testin.find({$or:[{q: 1}]})
    { "_id" : ObjectId("4fe9557b1219143f31b9d2ba"), "q" : 1, "r" : 2 }
    PRIMARY> db.testin.find({$or:[{query1: 1}]})
    { "_id" : ObjectId("4fe955b11219143f31b9d2bb"), "query1" : 1, "r" : 2 }

 

但用in逻辑查找时，就出现query作为key的文档找不到，具体如下：

    PRIMARY> db.testin.find({query: {$in: [1]}})
    PRIMARY> db.testin.find({query1: {$in: [1]}})
    { "_id" : ObjectId("4fe955b11219143f31b9d2bb"), "query1" : 1, "r" : 2 }
    PRIMARY> db.testin.find({q: {$in: [1]}})
    { "_id" : ObjectId("4fe9557b1219143f31b9d2ba"), "q" : 1, "r" : 2 }

在mongodb 最新版本2.2.0 依然存在这个问题

mongodb中的join操作
====

在自己代码中实现：http://www.cnblogs.com/lengyuhong/archive/2012/04/14/2446442.html

mapreduce：http://tebros.com/2011/07/using-mongodb-mapreduce-to-join-2-collections/