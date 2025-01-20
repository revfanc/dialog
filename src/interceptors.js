export function Interceptor() {
  this.interceptors = [];
}

Interceptor.prototype.use = function (resolved, rejected) {
  this.interceptors.push({
    resolved,
    rejected,
  });
  return this.interceptors.length - 1;
};

Interceptor.prototype.forEach = function (fn) {
  this.interceptors.forEach((interceptor) => {
    if (interceptor !== null) {
      fn(interceptor);
    }
  });
};

Interceptor.prototype.eject = function (id) {
  if (this.interceptors[id]) {
    this.interceptors[id] = null;
  }
};

Interceptor.prototype.clear = function () {
  this.interceptors = [];
};

export default function Interceptors() {
  this.before = new Interceptor();
  this.after = new Interceptor();
}

Interceptors.prototype._execute = function (fn, config = {}) {
  const chain = [{ resolved: fn, rejected: undefined }];

  this.before.forEach((interceptor) => {
    chain.unshift(interceptor);
  });

  this.after.forEach((interceptor) => {
    chain.push(interceptor);
  });

  let promise = Promise.resolve(config);

  while (chain.length) {
    const { resolved, rejected } = chain.shift();
    promise = promise.then(resolved, rejected);
  }

  return promise;
};
