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
