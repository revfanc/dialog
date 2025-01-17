import Vue from "vue";
import Interceptors from "./interceptors";
import DialogComponent from "./Dialog.jsx";
import "./style.css";

import { merge, removeNode, isInDocument } from "./utils";

let queue = [];

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

  return new Promise((resolve, reject) => {
    const instance = createInstance();

    instance.__context__ = this;

    instance.clear = (action, data) => {
      instance.$on("closed", () => {
        queue = queue.filter((item) => item !== instance);
        removeNode(instance.$el);
        instance.$destroy();
      });

      instance.value = false;
      instance.resolve({ action, data, options });
    };

    Dialog.currentOptions.zIndex += 10;

    merge(instance, Dialog.currentOptions, options, {
      resolve,
      reject,
    });
  });
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
    queue.forEach((instance) => instance.clear("close"));
  } else {
    queue[queue.length - 1].instance.clear("close");
  }
};

Dialog.getInstances = () => {
  return queue;
};

Dialog.interceptors = new Interceptors();

Dialog.alert = function (options) {
  return Dialog.interceptors.execute(Dialog, options);
};

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
