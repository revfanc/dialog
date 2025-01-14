import { scrollLocker } from './scrollLocker'

export default {
  name: 'DialogComponent',
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      default: false
    },
    content: {
      type: [Function, String, Object],
      default: null
    },
    props: {
      type: [Object],
      default: () => ({})
    },
    position: {
      type: String,
      default: 'center'
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: false
    },
    overlayStyle: {
      type: Object,
      default: () => ({})
    },
    zIndex: {
      type: Number,
      default: 999
    },
    beforeClose: {
      type: Function,
      default: null
    }
  },
  directives: {
    locker: {
      inserted: scrollLocker.lock,
      unbind: scrollLocker.unlock
    }
  },
  methods: {
    action (...args) {
      const [action] = args

      const close = (...a) => {
        this.clear(...(a.length ? a : args))
      }

      if (this.beforeClose && action !== 'close') {
        this.beforeClose(close, ...args)
        return
      }

      close()
    },

    generate (h) {
      if (typeof this.content !== 'function') {
        return this.content
      }

      const isDynamicImport = this.content.toString().includes('__webpack_require__')

      if (isDynamicImport) {
        return h(this.content, { props: this.props, on: { action: this.action } })
      }

      return this.content(h, this)
    }
  },
  render (h) {
    const { value, zIndex, overlayStyle, closeOnClickOverlay, position } = this
    return (
      <div class="dialog-container">
        <transition
          name="fade"
          onAfterEnter={() => this.$emit('opened')}
          onAfterLeave={() => this.$emit('closed')}
        >
          {value ? <div
            class="dialog-overlay"
            style={{ zIndex, ...overlayStyle }}
            onClick={() =>
              closeOnClickOverlay && this.action('close')
            }
          ></div> : null}
        </transition>
        <transition name={position}>
          {value ? (
            <div
              class={['dialog-content', `dialog-content--${position}`]}
              vLocker
              style={{ zIndex: zIndex + 1 }}
            >
              {this.generate(h)}
            </div>
          ) : null}
        </transition>
      </div>
    )
  }
}
