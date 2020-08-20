"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// features:
// 1. 使用`use-anima`标签属性即可激活默认的动效支持
// 2. 可选使用`anima-time=""`配置某个标签的动效时间，单位ms。
// 3. 可选使用`anima-type=""`配置动效类型 'zoom'（默认）, 'fade'
// EX1. 懒触发（优化性能）
// EX2. 销毁失效的node侦听（优化性能）
// EX3. 侦听节点过多给予警示
// TODOs:
// 增加其他常用动效？
// 动效自定义
var TAG = 'use-anima';
var TAG_TIME = 'anima-time';
var TAG_TYPE = 'anima-type';
var DEBOUNCE_TIME = 40; // ms

var WARNING_COUNTS = 100; // 预警侦听数，超过该数字后会警示

var defaultAnimateTime = 300; // ms

var nodes = [// {
  //   animateType: 'zoom|fade',
  //   element: <HTMLElement>
  // }
];
var tc = null;
var lastVerifyTime = null;

var elementIsVisibleInViewport = function elementIsVisibleInViewport(el) {
  var partiallyVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _el$getBoundingClient = el.getBoundingClientRect(),
      top = _el$getBoundingClient.top,
      left = _el$getBoundingClient.left,
      bottom = _el$getBoundingClient.bottom,
      right = _el$getBoundingClient.right;

  var _window = window,
      innerHeight = _window.innerHeight,
      innerWidth = _window.innerWidth;
  return partiallyVisible ? (top > 0 && top < innerHeight || bottom > 0 && bottom < innerHeight) && (left > 0 && left < innerWidth || right > 0 && right < innerWidth) : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

var fixStyle = function fixStyle(el, animateType) {
  el.style.opacity = '0';
  animateType === 'zoom' && (el.style.transform = 'scale(0.6)');
};

var resumeStyle = function resumeStyle(el, animateType) {
  el.style.opacity = '1';
  animateType === 'zoom' && (el.style.transform = 'scale(1)');
};

var preVerify = function preVerify() {
  var now = new Date().getTime();

  if (!lastVerifyTime) {
    verify();
    return;
  }

  if (now - lastVerifyTime > 200) {
    // debounce的时间太长，提前consume
    verify();
    return;
  }

  clearTimeout(tc);
  tc = setTimeout(function () {
    clearTimeout(tc);
    verify();
  }, DEBOUNCE_TIME);
};

var verify = function verify() {
  lastVerifyTime = new Date().getTime();
  nodes.forEach(function (n) {
    if (elementIsVisibleInViewport(n.element, true)) {
      resumeStyle(n.element, n.animateType);
    } else {
      fixStyle(n.element, n.animateType);
    }
  });
};

var init = function init() {
  revoke();
  document.querySelectorAll("[".concat(TAG, "]")).forEach(function (n) {
    var animateTime = defaultAnimateTime;

    if (n.getAttributeNames().includes(TAG_TIME)) {
      // 配置了动效时间
      var effectTime = parseInt(n.getAttribute(TAG_TIME));
      effectTime > 100 && (animateTime = effectTime);
    }

    var animateType = 'zoom';

    if (n.getAttributeNames().includes(TAG_TYPE)) {
      // 配置了动效类型
      animateType = n.getAttribute(TAG_TYPE);
    }

    fixStyle(n, animateType);
    n.style.transition = "all ".concat((animateTime - DEBOUNCE_TIME) / 1000, "s");
    nodes.push({
      animateType: animateType,
      element: n
    });
  });

  if (nodes.length) {
    // console.log('binding')
    if (nodes.length > WARNING_COUNTS) {
      console.warn('Too many anima elements, you should check if it`s necessary');
    }

    window.addEventListener('scroll', preVerify); // 为了确保首屏视图内的元素正确应用效果，需要直接执行一次

    verify();
  }
};

var revoke = function revoke() {
  // console.log('revoking')
  window.removeEventListener('scroll', preVerify); // 恢复所有元素的原始样式

  nodes.forEach(function (n) {
    resumeStyle(n.element, n.animateType);
  });
  nodes.length && (nodes = []);
};

var _default = {
  init: init,
  revoke: revoke
};
exports["default"] = _default;