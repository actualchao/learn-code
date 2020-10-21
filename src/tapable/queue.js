const { SyncHook } = require('tapable');

const queue = new SyncHook(['name', 'age'], 'queue');

queue.intercept({
  context: true,
  tap: (context, tapInfo) => {
    // tapInfo = { type: "sync", name: "NoisePlugin", fn: ... }
    console.log(`${tapInfo.name} is doing it's job`);

    // `context` starts as an empty object if at least one plugin uses `context: true`.
    // If no plugins use `context: true`, then `context` is undefined.
    if (context) {
      console.log(context, 'context');
      // Arbitrary properties can be added to `context`, which plugins can then access.
      context.hasMuffler = true;
    }
  },
  call:(...args) => {
    console.log(args);
  },
  register:(tap) => {
    console.log(tap, '---------');
  }
});


queue.tap({
  name: 'NoisePlugin'
}, (newSpeed) => {
  console.log(newSpeed);
});
queue.tap({
  name: 'wrong',
  context: true
}, (context, newSpeed) => {
  if (context && context.hasMuffler) {
    console.log('wrong...');
  } else {
    console.log('Vroom!');
  }
});

queue.call(9);