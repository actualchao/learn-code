const { SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook } = require('tapable');


const queue = new SyncWaterfallHook(['num'], 'queue');

queue.tap({name:'tap1'}, num => {
  console.log(num);
  num--;
  return num;
});
queue.tap({name:'tap1'}, num => {
  console.log(num);
  return --num;
});
queue.tap({name:'tap1'}, num => {
  console.log(num);
  num--;
});



queue.callAsync(3, res => {
  console.log(res, '-----------res');
});