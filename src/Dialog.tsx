import { defineComponent, h, isVNode, Transition } from 'vue'
import type { PropType } from 'vue'
import { scrollLocker } from "./scrollLocker"

export default defineComponent({
  name: "DialogComponent",
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    render: {
      type: [Function, Object] as PropType<Function | string | object | null>,
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

    const generateContent = () => {
      if (!props.render) {
        throw new Error('The "render" property is required and cannot be empty')
      }

      if (isVNode(props.render)) {
        return props.render
      }

      if (typeof props.render === 'function') {
        return props.render()
      }

      return props.render
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