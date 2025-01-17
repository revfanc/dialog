export function merge(target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    let source = arguments[i] || {};
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        let value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }

  return target;
}

export const removeNode = (el) =>
  el.parentNode && el.parentNode.removeChild(el);

export const isInDocument = (el) => document.body.contains(el);

export function isVNode(node) {
  return (
    node !== null &&
    typeof node === "object" &&
    Object.prototype.hasOwnProperty.call(node, "componentOptions")
  );
}

export function isText(val) {
  return val && typeof val === "string";
}

export function isFunction(val) {
  return typeof val === "function";
}

export function isRenderFunction(fn) {
  if (typeof fn !== 'function') return false;

  // 检查是否是 Vue 组件
  if (fn._isVue || fn.cid) {
    return true;
  }

  // 检查函数名是否是 render
  if (fn.name === 'render') {
    return true;
  }

  // 检查是否接收 h/createElement 参数
  const fnString = fn.toString().trim();
  return /^function\s*\(\s*(h|createElement)\s*[,)]/
    .test(fnString) || // 普通函数
    /^\(\s*(h|createElement)\s*[,)]/.test(fnString); // 箭头函数
}
