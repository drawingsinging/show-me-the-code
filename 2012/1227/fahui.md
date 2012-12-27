googleMap 大数据交互方案尝试
====

大数据生成了大图片用googleMap显示，并加上交互。交互的方案实现原理：  

获取鼠标位置，换算成在原始大图中的位置。然后判断原始大图中在该位置是什么图形（如判断点击了那个圆），得到与之相关的数据，并调整相应的显示。  

主要的技术难点在于根据位置判断图形。算法由具体的可视化方式决定。数据量大时计算放后端执行，数据量较小时可以放前端执行。  

[demo地址](http://datavlab.org/tmp/googleMapZoom/new.html)  
[git readme地址](https://github.com/jdk137/large-svg-GoogleMap-Zoom)

