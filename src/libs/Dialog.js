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
      inserted (el) {
        scrollLocker.lock(el)
      },
      unbind () {
        scrollLocker.unlock()
      }
    }
  },
  methods: {
    action (...args) {
      const [action] = args

      const close = (...a) => {
        this.$emit('input', false)
        this.clear(...(a.length ? a : args))
      }

      if (this.beforeClose && action !== 'close') {
        this.beforeClose(close, ...args)
        return
      }

      close()
    },

    generate (h) {
      if (typeof this.content === 'function') {
        const isDynamicImport = this.content.toString().includes('__webpack_require__')

        if (isDynamicImport) {
          return h(this.content, { props: this.props, on: { action: this.action, ...this.$listeners } })
        }
        return this.content(h, this)
      }

      return this.content
    }
  },
  render (h) {
    return (
      <div class="dialog-container">
        <transition
          name="fade"
          onAfterEnter={() => this.$emit('opened')}
          onAfterLeave={() => this.$emit('closed')}
        >
          <div
            class="dialog-overlay"
            style={{ zIndex: this.zIndex, ...this.overlayStyle }}
            vShow={this.value}
            onClick={() =>
              this.closeOnClickOverlay && this.action('close')
            }
          ></div>
        </transition>
        <transition name={this.position}>
          {this.value ? (
            <div
              class={['dialog-content', `dialog-content--${this.position}`]}
              vLocker
              style={{ zIndex: this.zIndex + 1 }}
            >
              {this.generate(h)}
            </div>
          ) : null}
        </transition>
      </div>
    )
  }
}
