import Vue from "vue";
import Interceptors from "./interceptors";
import DialogComponent from "./Dialog.jsx";
import "./style.css";

import { merge, removeNode, isInDocument } from "./utils";

let queue = [];

const interceptors = new Interceptors();

function createInstance() {
  queue = queue.filter(
    (item) => !item.$el.parentNode || isInDocument(item.$el)
  );

  const instance = new (Vue.extend(DialogComponent))({
    el: document.createElement("div"),
  });
  document.body.appendChild(instance.$el);

  queue.push(instance);

  return queue[queue.length - 1];
}

function Dialog(options) {
  if (!options || typeof options !== "object") {
    throw new TypeError("Options must be an object");
  }

  if (!options.render) {
    throw new TypeError('The "render" property is required in options');
  }

  const promise = (options) => {
    return new Promise((resolve, reject) => {
      const instance = createInstance();

      instance.__context__ = this;

      instance.$on("action", (action, data) => {
        instance.$on("closed", () => {
          queue = queue.filter((item) => item !== instance);
          removeNode(instance.$el);
          instance.$destroy();
          Dialog.currentOptions.zIndex -= 10;
        });

        instance.value = false;
        instance.resolve({ action, data, options });
      });

      instance.$on("opened", () => {
        Dialog.currentOptions.zIndex += 10;
      });

      merge(instance, Dialog.currentOptions, options, {
        resolve,
        reject,
      });
    });
  };

  return interceptors._execute(promise, options);
}

Dialog.defaultOptions = {
  value: true,
  render: null,
  position: "center",
  closeOnClickOverlay: false,
  overlayStyle: {},
  zIndex: 999,
  beforeClose: null,
};

Dialog.close = (all) => {
  if (!queue.length) {
    return;
  }
  if (all) {
    queue.forEach((instance) => instance.$emit("action", "close"));
  } else {
    queue[queue.length - 1].$emit("action", "close");
  }
};

Dialog.getInstances = () => {
  return queue;
};

Dialog.interceptors = interceptors;

Dialog.resetOptions = () => {
  Dialog.currentOptions = merge({}, Dialog.defaultOptions);
};

Dialog.setOptions = (options) => {
  Dialog.currentOptions = merge({}, Dialog.currentOptions, options);
};

Dialog.resetOptions();

Dialog.install = (Vue) => {
  Vue.prototype.$dialog = Dialog;
};

export default Dialog;

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(Dialog);
}
