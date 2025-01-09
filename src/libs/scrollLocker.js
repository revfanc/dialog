// 常量
const DIRECTION_UP = '01'
const DIRECTION_DOWN = '10'

// 工具函数
const preventDefault = (event, isStopPropagation) => {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault()
  }
  if (isStopPropagation) {
    event.stopPropagation()
  }
}

const getScrollParent = (el, root = window) => {
  let node = el

  while (node && node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === 1 && node !== root) {
    const { overflowY } = window.getComputedStyle(node)
    if (/scroll|auto|overlay/i.test(overflowY)) {
      return node
    }
    node = node.parentNode
  }

  return root
}

// 创建滚动锁定器
const createScrollLocker = () => {
  const rootElements = []
  let lockCount = 0
  let startY = 0
  let deltaY = 0
  let direction = ''

  const resetTouchStatus = () => {
    direction = ''
    deltaY = 0
    startY = 0
  }

  const touchStart = event => {
    resetTouchStatus()
    startY = event.touches[0].clientY
  }

  const touchMove = event => {
    const touch = event.touches[0]
    deltaY = touch.clientY - startY

    if (!direction) {
      direction = Math.abs(deltaY) > 0 ? 'vertical' : ''
    }
  }

  const isVertical = () => direction === 'vertical'

  const onTouchMove = event => {
    touchMove(event)

    const moveDirection = deltaY > 0 ? DIRECTION_DOWN : DIRECTION_UP
    const el = getScrollParent(event.target, rootElements[rootElements.length - 1])

    const { scrollHeight, offsetHeight, scrollTop } = el

    let status = '11'

    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? '00' : '01'
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = '10'
    }

    if (status !== '11' && isVertical() && !(parseInt(status, 2) & parseInt(moveDirection, 2))) {
      preventDefault(event, true)
    }
  }

  const lock = root => {
    rootElements.push(root)
    document.addEventListener('touchstart', touchStart)
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    if (!lockCount) {
      document.body.style.overflow = 'hidden'
    }

    lockCount++

    console.log('lockCount :>> ', lockCount)
  }

  const unlock = el => {
    if (lockCount) {
      rootElements.pop()
      lockCount--

      if (!lockCount) {
        document.removeEventListener('touchstart', touchStart)
        document.removeEventListener('touchmove', onTouchMove)
        document.body.style.overflow = ''
        document.body.style.getPropertyValue('overflow') === 'hidden' &&
                    document.body.style.setProperty('overflow', '', 'important')
      }
    }

    console.log('lockCount :>> ', lockCount)
  }

  return {
    lock,
    unlock
  }
}

// 导出单例
export const scrollLocker = createScrollLocker()
