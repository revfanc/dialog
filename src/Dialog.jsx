import { scrollLocker } from "./scrollLocker";
import { isFunction, isText, isVNode } from "./utils";

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
      const close = (...a) => {
        const params = a.length ? a : args;
        this.$emit("action", ...params);
      };

      if (typeof this.beforeClose === "function") {
        this.beforeClose(close, ...args);
        return;
      }

      close();
    },
  },
  render(h) {
    const self = this;
    const {
      value,
      render: component,
      position,
      closeOnClickOverlay,
      overlayStyle,
      zIndex,
      action,
    } = self;

    const generateContent = function () {
      if (isText(component)) {
        return (
          <div class="dialog-content--normal">
            <h1>{text}</h1>
            <button onClick={() => action("confirm")}>确定</button>
          </div>
        );
      }

      if (isVNode(component)) {
        return component;
      }

      if (isFunction(component)) {
        const Content = component(h, self);

        if (!isVNode(Content)) {
          throw new Error("render function must return a VNode");
        }

        return Content;
      }

      throw new Error(
        "render prop must be a function or a VNode or a string"
      )
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
              onClick={() => closeOnClickOverlay && action("close")}
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
            </div>
          ) : null}
        </transition>
      </div>
    );
  },
};
