import { scrollLocker } from "./scrollLocker";
import { isRenderFunction, isText, isVNode } from "./utils";

export default {
  name: "DialogComponent",
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    render: {
      type: [Function, String, Object],
      default: null,
    },
    position: {
      type: String,
      default: "center",
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: false,
    },
    overlayStyle: {
      type: Object,
      default: () => ({}),
    },
    zIndex: {
      type: Number,
      default: 999,
    },
    beforeClose: {
      type: Function,
      default: null,
    },
  },
  directives: {
    locker: {
      inserted: scrollLocker.lock,
      unbind: scrollLocker.unlock,
    },
  },
  methods: {
    action(...args) {
      const [action] = args;

      const close = (...a) => {
        this.clear(...(a.length ? a : args));
      };

      if (this.beforeClose && action !== "close") {
        this.beforeClose(close, ...args);
        return;
      }

      close();
    },
  },
  render(h) {
    const {
      value,
      render: component,
      position,
      closeOnClickOverlay,
      overlayStyle,
      zIndex,
      action,
    } = this;
    const self = this;

    const defaultContent = function (text) {
      return (
        <div class="dialog-content--normal">
          <h1>{text}</h1>
          <button onClick={() => action("close")}>确定</button>
        </div>
      );
    };

    const generateContent = function () {
      if (isText(component)) {
        return defaultContent(component);
      }

      if (isVNode(component)) {
        return component;
      }

      if (isRenderFunction(component)) {
        const context = self.__context__ || self;
        const createElement = context.$createElement;
        return component.call(context, createElement, self);
      }

      return defaultContent("出错了, 获取数据失败");
    };
    return (
      <div class="dialog-container">
        <transition
          name="fade"
          onAfterEnter={() => this.$emit("opened")}
          onAfterLeave={() => this.$emit("closed")}
        >
          {value ? (
            <div
              class="dialog-overlay"
              style={{ zIndex, ...overlayStyle }}
              onClick={() => closeOnClickOverlay && this.action("close")}
            ></div>
          ) : null}
        </transition>
        <transition name={position}>
          {value ? (
            <div
              class={["dialog-content", `dialog-content--${position}`]}
              vLocker
              style={{ zIndex: zIndex + 1 }}
            >
              {generateContent()}
              {this.$slots.default}
            </div>
          ) : null}
        </transition>
      </div>
    );
  },
};
