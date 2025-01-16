import { scrollLocker } from "./scrollLocker";

export default {
  name: "DialogComponent",
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    content: {
      type: [Function, String, Object],
      default: null,
    },
    props: {
      type: [Object],
      default: () => ({}),
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
      content,
      props,
      position,
      closeOnClickOverlay,
      overlayStyle,
      zIndex,
    } = this;

    const stringContent = () => {
      return (
        <div class="dialog-content--normal">
          <h1>{content}</h1>
          <button onClick={() => this.action("close")}>确定</button>
        </div>
      );
    };

    const errorContent = () => {
      return (
        <div class="dialog-content--normal">
          <h1>出错了, 获取数据失败</h1>
          <button onClick={() => this.action("close")}>确定</button>
        </div>
      );
    };

    const generateContent = () => {
      if (!content) {
        return errorContent();
      }

      if (typeof content === "string") {
        return stringContent();
      }

      if (typeof content === "object") {
        return content;
      }

      const isDynamicImport =
        content && content.toString().indexOf("__webpack_require__") > -1;

      if (isDynamicImport) {
        try {
          const dynamicContent = h(content, {
            props: props,
            on: { action: this.action },
          });

          return dynamicContent;
        } catch (error) {
          return errorContent();
        }
      }

      return content(h, this);
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
