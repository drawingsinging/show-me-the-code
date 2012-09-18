# Browser Desktop Notifications API

W3C的文档看这里：http://dvcs.w3.org/hg/notifications/raw-file/tip/Overview.html

目前还是个草案状态，不过chrome已经实现了，并且好多应用已经使用上了，可以实时的提醒到用户，很方便。

## 如何使用
  
### API

  Notification对象停放在window对象下，并提供一组方法供调用：

    window.webkitNotifications = {
      createNotification: function(icon,title,content){},
      createHTMLNotification: function(url){}
      checkPermission: function(){},
      requestPermission: function(callback){}
    }

  创建一个notification：

    notification = widnow.webkitNotifications.createNotification(icon.title,content);

  notification对象提供一组api:

    notification = {
      ondisplay: function(){},
      onerror: function(){},
      onclick: function(){},
      onclose: function(){},
      show: function(){},
      cancel: function(){}
    }

  简单的封装起来，就变成这样子：

    var Notification = {
      /** **/
      show:function (obj){
        var self = this;
        if( ! window.webkitNotifications ){
          return;
        }
        if(webkitNotifications.checkPermission() === 0){
          var notify = window.webkitNotifications.createNotification( obj.icon, obj.title, obj.content);
  
          notify.ondisplay = function(){
            console.log('display');
          };
          notify.onerror = function(){
            console.log('error');
          };
          notify.onclick = function(){
            console.log('click');
          };
          notify.onclose = function(){
            console.log('close');
          };
          notify.show();
  
        }else{
          this.getPermission(function(){
            self.show(obj);
          });
        }
      },
      /** get permission **/
      getPermission:function(cb){
        if( ! window.webkitNotifications ){
          return;
        }
        webkitNotifications.requestPermission(function(){
            cb&&cb();
        });
      }
    };

    Notification.show({
      icon: "img-url",
      title: "hello",
      content: "world"
    });