export function Interceptor() {
  this.interceptors = [];
}

Interceptor.prototype.use = function use(resolved, rejected) {
  this.interceptors.push({
    resolved,
    rejected,
  });
  return this.interceptors.length - 1;
};

Interceptor.prototype.forEach = function forEach(fn) {
  this.interceptors.forEach((interceptor) => {
    if (interceptor !== null) {
      fn(interceptor);
    }
  });
};

Interceptor.prototype.eject = function eject(id) {
  if (this.interceptors[id]) {
    this.interceptors[id] = null;
  }
};

Interceptor.prototype.clear = function clear() {
  this.interceptors = [];
};

export default function Chain() {
  this.interceptors = {
    before: new Interceptor(),
    after: new Interceptor(),
  };
}

Chain.prototype.execute = function handler(fn, config = {}) {
  const chain = [{ resolved: fn, rejected: undefined }];

  this.interceptors.before.forEach((interceptor) => {
    chain.unshift(interceptor);
  });

  this.interceptors.after.forEach((interceptor) => {
    chain.push(interceptor);
  });

  let promise = Promise.resolve(config);

  while (chain.length) {
    const { resolved, rejected } = chain.shift();
    promise = promise.then(resolved, rejected);
  }

  return promise;
};
