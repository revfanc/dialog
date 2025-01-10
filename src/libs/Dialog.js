import { scrollLocker } from './scrollLocker'

export default {
  name: 'DialogComponent',
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      default: false
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
    handleAction (...args) {
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
    }
  },
  render () {
    return (
      <div>
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
              this.closeOnClickOverlay && this.onAction('clickOverlay', null)
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
              <slot {...this.$attrs} onAction={this.handleAction}></slot>
            </div>
          ) : null}
        </transition>
      </div>
    )
  }
}
