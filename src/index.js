
// features:
// 1. 使用`use-anima`标签属性即可激活默认的动效支持
// 2. 可选使用`anima-time=""`配置某个标签的动效时间，单位ms。
// EX1. 懒触发（优化性能）
// EX2. 销毁失效的node侦听（优化性能）
// EX3. 侦听节点过多给予警示

// TODOs:
// 内置多种常用动效
// 动效自定义
// node过多时的提醒

const TAG = 'use-anima'
const TAG_TIME = 'anima-time'
const DEBOUNCE_TIME = 40 // ms
let defaultAnimateTime = 300 // ms

let nodes = []
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

const fixStyle = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'scale(0.6)'
}

const resumeStyle = (el) => {
  el.style.opacity = '1'
  el.style.transform = 'scale(1)'
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
  nodes.forEach(el => {
    if (elementIsVisibleInViewport(el, true)) {
      resumeStyle(el)
    } else {
      fixStyle(el)
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
    fixStyle(n)
    n.style.transition = `all ${(animateTime - DEBOUNCE_TIME) / 1000}s`
    nodes.push(n)
  })
  if (nodes.length) {
    // console.log('binding')
    window.addEventListener('scroll', preVerify)
    // 为了确保首屏视图内的元素正确应用效果，需要直接执行一次
    verify()
  }
}

const revoke = () => {
  // console.log('revoking')
  window.removeEventListener('scroll', preVerify)
  // 恢复所有元素的原始样式
  nodes.forEach(el => {
    resumeStyle(el)
  })
  nodes.length && (nodes = [])
}

export default {
  init,
  revoke
}
