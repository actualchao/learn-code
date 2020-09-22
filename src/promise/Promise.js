class Promise {
  constructor(executor) {
    this.PENDING = 'pending';//初始态
    this.FULFILLED = 'fulfilled';//初始态
    this.REJECTED = 'rejected';//初始态
    //PromiseA+ 2.1.1.1
    this.status = this.PENDING;

    // PromiseA+ 2.1
    this.onResolveCallbacks = [];
    this.onRejectCallbacks = [];


    const self = this;
    function reject(resone) {
      // PromiseA+ 2.2.4
      setTimeout(() => {
        //PromiseA+ 2.1.3
        if (self.status === self.PENDING) {
          self.status = self.REJECTED;
          self.value = resone;
          // console.dir(self);
          // console.log('------self--------------------------------');
          self.onRejectCallbacks.forEach(item => item(self.value));
        }
      });

    }
    function resolve(value) {
      // PromiseA+ 2.2.4
      setTimeout(() => {
        //PromiseA+ 2.1.2
        if (self.status === self.PENDING) {
          self.status = self.FULFILLED;
          self.value = value;
          self.onResolveCallbacks.forEach(item => item(self.value));
        }
      });
    }
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }


  }


  resolvePromise(promise2, x, resolve, reject) {
    const self = this;
    // PromiseA+ 2.3.1
    if (promise2 === x) { return reject(new TypeError('循环引用')); }


    // PromiseA+ 2.3.2
    if (x instanceof Promise) {
      // console.log('-----------------------------------------------------------');
      // console.dir(x);
      // console.log('-----------------------------------------------------------');
      if (x.status === self.PENDING) {
        // PromiseA+ 2.3.2.1
        x.then(function(y) { self.resolvePromise(promise2, y, resolve, reject); }, reject);
      } else {
        // PromiseA+ 2.3.2.2  /PromiseA+ 2.3.2.3
        x.then(resolve, reject);


      }
      // PromiseA+ 2.3.3
    } else if (x && ((typeof x === 'object') || (typeof x === 'function'))) {

      // PromiseA+ 2.3.3.3.3  / PromiseA+ 2.3.3.3.4.1
      let called = false;
      try {
        // PromiseA+ 2.3.3.1
        // eslint-disable-next-line prefer-destructuring
        const then = x.then;
        // PromiseA+ 2.3.3.3

        if (typeof then === 'function') {
          try {
            then.call(
              x,
              function(y) {
                if (called) return;
                called = true;
                // PromiseA+ 2.3.3.3.1
                self.resolvePromise(promise2, y, resolve, reject);
              },
              function(e) {
                if (called) return;
                called = true;
                // PromiseA+ 2.3.3.3.2
                reject(e);
              }
            );
          } catch (e) {
            if (called) return;
            called = true;
            // PromiseA+ 2.3.3.3.2
            reject(e);

          }

        } else {
          // PromiseA+ 2.3.3.4
          resolve(x);
        }

      } catch (error) {
        if (called) return;
        called = true;

        // PromiseA+ 2.3.3.2 /PromiseA+ 2.3.3.4.2
        reject(error);
      }


    } else {
      // PromiseA+ 2.3.4
      resolve(x);
    }

  }


  // PromiseA+ 2.2 // PromiseA+ 2.2.6
  then(onFulfilled, onRejected) {
    const self = this;
    //PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : v => { throw v; };

    let promise2;


    // PromiseA+ 2.2.2
    if (self.status === self.FULFILLED) {
      //PromiseA+ 2.2.7
      return promise2 = new Promise((resolve, reject) => {
        // PromiseA+ 2.2.4
        setTimeout(() => {
          try {
            const x = onFulfilled(self.value);
            //PromiseA+ 2.2.7.1
            self.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            //PromiseA+ 2.2.7.2
            reject(error);
          }
        });
      });

    }
    // PromiseA+ 2.2.3
    if (self.status === self.REJECTED) {
      //PromiseA+ 2.2.7
      return promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const x = onRejected(self.value);
            //PromiseA+ 2.2.7.1
            self.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            //PromiseA+ 2.2.7.2
            reject(error);
          }
        });
      });
    }
    if (self.status === self.PENDING) {
      //PromiseA+ 2.2.7
      return promise2 = new Promise((resolve, reject) => {
        self.onResolveCallbacks.push(() => {
          // setTimeout(() => {
          try {
            const x = onFulfilled(self.value);



            //PromiseA+ 2.2.7.1
            self.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            //PromiseA+ 2.2.7.2
            reject(error);
          }
          // });
        });

        self.onRejectCallbacks.push(() => {
          // setTimeout(() => {
          try {
            const x = onRejected(self.value);
            //PromiseA+ 2.2.7.1
            self.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            //PromiseA+ 2.2.7.2
            reject(error);
          }
          // });
        });
      });
    }
  }
  catch(onRejected) {
    self.then(null, onRejected);
  }
}


Promise.deferred = Promise.defer = function () {
  const defer = {};
  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};

module.exports = Promise;