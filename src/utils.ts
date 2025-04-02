import { VNode } from 'vue'

export function merge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  for (let i = 0, j = sources.length; i < j; i++) {
    let source = sources[i] || {};
    for (let prop in source) {
      if (Object.prototype.hasOwnProperty.call(source, prop)) {
        let value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }

  return target;
}

export const removeNode = (el: HTMLElement): void =>
  el.parentNode && el.parentNode.removeChild(el);

export const isInDocument = (el: HTMLElement): boolean => document.body.contains(el);

export function isVNode(node: any): node is VNode {
  return (
    node !== null &&
    typeof node === "object" &&
    Object.prototype.hasOwnProperty.call(node, "componentOptions")
  );
}

export function isText(val: any): val is string {
  return val && typeof val === "string";
}

export function isFunction(val: any): val is Function {
  return typeof val === "function";
}

export function isRenderFunction(fn: any): boolean {
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