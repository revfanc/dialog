<script>
import { scrollLocker } from './scrollLocker'

export default {
  name: 'DialogComponent',
  directives: {
    'popup-fixed': {
      inserted (el) {
        scrollLocker.lock(el)
      },
      unbind () {
        scrollLocker.unlock()
      }
    }
  },
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
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
    },
    callback: {
      type: Function,
      default: null
    },
    dialogComponent: {
      type: Function,
      default: null
    }
  },
  methods: {
    handleAction (action = 'close', params = null) {
      this.$emit('input', false)
      if (this.callback) {
        this.callback(action, params)
      }
    },
    onAction (action = 'close', params = null) {
      if (this.beforeClose && action !== 'close') {
        this.beforeClose({
          params,
          action,
          close: () => {
            this.handleAction(action, params)
          }
        })
        return
      }
      this.handleAction(action, params)
    }
  },
  render () {
    return (
      <div>
        <transition name="fade" onAfterEnter={() => this.$emit('opened')} onAfterLeave={() => this.$emit('closed')}>
          <div
            class="dialog-overlay"
            style={{ zIndex: this.zIndex, ...this.overlayStyle }}
            vShow={this.value}
            onClick={() => this.closeOnClickOverlay && this.onAction('clickOverlay', null)}></div>
        </transition>
        <transition name={this.position}>
          {this.value ? (
            <div class={['dialog-content', `dialog-content--${this.position}`]} vPopupFixed style={{ zIndex: this.zIndex + 1 }}>
              <this.dialogComponent
                params={this.params}
                position={this.position}
                onAction={this.onAction}
              />
            </div>
          ) : null}
        </transition>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 999;
}
.dialog-content {
  width: 375px;
  //height: 100vh;
  position: fixed;
  transform-origin: center center;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.dialog-content--center {
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.dialog-content--bottom {
  justify-content: flex-end;
  bottom: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.dialog-content--top {
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.center-enter-active,
.center-leave-active {
  transition: all 0.3s;
}
.center-enter,
.center-leave-to {
  opacity: 0.1;
  transform: translate3d(-50%, -50%, 0) scale(0.7);
}
.bottom-enter-active,
.bottom-leave-active {
  transition: all 0.3s;
}
.bottom-enter,
.bottom-leave-to {
  opacity: 0.1;
  transform: translate3d(-50%, 100%, 0);
}

.top-enter-active,
.top-leave-active {
  transition: all 0.3s;
}
.top-enter,
.top-leave-to {
  opacity: 0.1;
  transform: translate3d(-50%, -100%, 0);
}
</style>
