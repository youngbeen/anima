
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

const TAG = 'use-anima'
const TAG_TIME = 'anima-time'
const TAG_TYPE = 'anima-type'
const DEBOUNCE_TIME = 40 // ms
const WARNING_COUNTS = 100 // 预警侦听数，超过该数字后会警示
let defaultAnimateTime = 300 // ms

let nodes = [
  // {
  //   animateType: 'zoom|fade',
  //   element: <HTMLElement>
  // }
]
let tc = null
let lastVerifyTime = null

const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
}

const fixStyle = (el, animateType) => {
  el.style.opacity = '0'
  animateType === 'zoom' && (el.style.transform = 'scale(0.6)')
}

const resumeStyle = (el, animateType) => {
  el.style.opacity = '1'
  animateType === 'zoom' && (el.style.transform = 'scale(1)')
}

const preVerify = () => {
  let now = (new Date()).getTime()
  if (!lastVerifyTime) {
    verify()
    return
  }
  if (now - lastVerifyTime > 200) {
    // debounce的时间太长，提前consume
    verify()
    return
  }
  clearTimeout(tc)
  tc = setTimeout(() => {
    clearTimeout(tc)
    verify()
  }, DEBOUNCE_TIME)
}

const verify = () => {
  lastVerifyTime = (new Date()).getTime()
  nodes.forEach(n => {
    if (elementIsVisibleInViewport(n.element, true)) {
      resumeStyle(n.element, n.animateType)
    } else {
      fixStyle(n.element, n.animateType)
    }
  })
}

const init = () => {
  revoke()
  document.querySelectorAll(`[${TAG}]`).forEach(n => {
    let animateTime = defaultAnimateTime
    if (n.getAttributeNames().includes(TAG_TIME)) {
      // 配置了动效时间
      let effectTime = parseInt(n.getAttribute(TAG_TIME))
      effectTime > 100 && (animateTime = effectTime)
    }
    let animateType = 'zoom'
    if (n.getAttributeNames().includes(TAG_TYPE)) {
      // 配置了动效类型
      animateType = n.getAttribute(TAG_TYPE)
    }
    fixStyle(n, animateType)
    n.style.transition = `all ${(animateTime - DEBOUNCE_TIME) / 1000}s`
    nodes.push({
      animateType,
      element: n
    })
  })
  if (nodes.length) {
    // console.log('binding')
    if (nodes.length > WARNING_COUNTS) {
      console.warn('Too many anima elements, you should check if it`s necessary')
    }
    window.addEventListener('scroll', preVerify)
    // 为了确保首屏视图内的元素正确应用效果，需要直接执行一次
    verify()
  }
}

const revoke = () => {
  // console.log('revoking')
  window.removeEventListener('scroll', preVerify)
  // 恢复所有元素的原始样式
  nodes.forEach(n => {
    resumeStyle(n.element, n.animateType)
  })
  nodes.length && (nodes = [])
}

export default {
  init,
  revoke
}
