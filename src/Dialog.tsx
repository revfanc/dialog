import { defineComponent, PropType, h, Transition } from 'vue'
import { scrollLocker } from "./scrollLocker"
import { isRenderFunction, isText, isVNode } from "./utils"

interface DialogProps {
  value: boolean
  render: Function | string | object | null
  position: string
  closeOnClickOverlay: boolean
  overlayStyle: Record<string, any>
  zIndex: number
  beforeClose: ((done: (...args: any[]) => void, ...args: any[]) => void) | null
}

export default defineComponent({
  name: "DialogComponent",
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    render: {
      type: [Function, String, Object] as PropType<Function | string | object | null>,
      default: null,
    },
    position: {
      type: String as PropType<string>,
      default: "center",
    },
    closeOnClickOverlay: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    overlayStyle: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    zIndex: {
      type: Number as PropType<number>,
      default: 999,
    },
    beforeClose: {
      type: Function as PropType<(done: (...args: any[]) => void, ...args: any[]) => void>,
      default: null,
    },
  },
  directives: {
    locker: {
      mounted: scrollLocker.lock,
      unmounted: scrollLocker.unlock,
    },
  },
  emits: ['action', 'opened', 'closed'],
  setup(props, { emit }) {
    const action = (...args: any[]) => {
      const close = (...a: any[]) => {
        const params = a.length ? a : args
        emit('action', ...params)
      }

      if (typeof props.beforeClose === 'function') {
        props.beforeClose(close, ...args)
        return
      }

      close()
    }

    const defaultContent = (text: string) => {
      return h('div', { class: 'dialog-content--normal' }, [
        h('h1', text),
        h('button', { onClick: () => action('confirm') }, '确定')
      ])
    }

    const generateContent = () => {
      if (isText(props.render)) {
        return defaultContent(props.render)
      }

      if (isVNode(props.render)) {
        return props.render
      }

      if (isRenderFunction(props.render)) {
        const Content = props.render.call(null, h, props)

        if (!isVNode(Content)) {
          return defaultContent('出错了, 渲染内容错误，请稍后再试！')
        }

        return Content
      }

      return defaultContent('出错了, 请稍后再试！')
    }

    return () => h('div', { class: 'dialog-container' }, [
      h(Transition, {
        name: 'fade',
        onAfterEnter: () => emit('opened'),
        onAfterLeave: () => emit('closed')
      }, () => props.value ? h('div', {
        class: 'dialog-overlay',
        style: { zIndex: props.zIndex, ...props.overlayStyle },
        onClick: () => props.closeOnClickOverlay && action('close')
      }) : null),
      h(Transition, {
        name: props.position
      }, () => props.value ? h('div', {
        class: ['dialog-content', `dialog-content--${props.position}`],
        vLocker: true,
        style: { zIndex: props.zIndex + 1 }
      }, generateContent()) : null)
    ])
  }
}) 