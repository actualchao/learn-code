const Promise = require('./Promise');

const promise = new Promise((resolve, reject) => {
  console.log('start');
  setTimeout(() => {
    (Math.random() > 0.5) ? resolve('resolve') : reject('reject');
  });
});


console.dir(promise.then);

promise.then(
  v => {
    console.log(v + '12');
    return 'resolve2';
  },
  e => {
    console.log(e + '34');
    return 'rejectResolve2';
  }
);

promise.then(v => {
  console.log(v);
}, v => {
  console.log(v);
});

