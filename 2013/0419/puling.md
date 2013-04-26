手势(Gesture)
==================

## 基本事件
一般的触屏设备都支持最基本的手势，这在触屏的编程环境中都存在：

- `touchstart`，手指接触屏幕时触发
- `touchmove`，手指在屏幕上移动时触发
- `touchend`，手指离开屏幕时触发

## 高级事件
一般的环境仅支持上述三个事件，一切高级的手势基于上述三个事件完成

- `tap`，手指触摸屏幕并离开。手指接触屏幕，**在500ms内离开，且无距离移动**
- `press`，手指触摸屏幕超过500ms，没有距离移动时触发。触发press后，再离开屏幕时会触发`pressend`事件
- `pan`，手指触摸屏幕，移动超过10px后触发`panstart`事件，之后的移动都会触发`pan`事件。离开屏幕时触发`panend`事件
- `flick`，手指快速扫过屏幕，手指在屏幕上移动，如果离开时，在300ms内，触发`flick`事件
- `doubletap`，如果前后两次`tap`事件时间相差在500ms内，后一次tap触发时，同时会触发一次`doubletap`事件

## 代码实现

[具体代码](https://github.com/JacksonTian/gesture/blob/master/src/gesture.js)
