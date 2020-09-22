

/**
 * 生成器函数，
 * 命名在gunction 和name 之间添加*区分生成器函数
 * 用于生成一个迭代器，
 * 每次调用next，返回yeild 返回的值，
 * 调用next 中传入参数，提供给下一阶段参数    !! 第一次调用next 传入参数没有意义
 *
 */
function *go() {
  // 第一次调用next ,执行到 yeild ‘start’  ,    ===>  返回值是（{value: 'start', done: false} 相当于
  console.log(1);
  const b = yield 'start';
  //第二次调用next，传入的参数相当于执行 let b = 参数，然后执行到下一个yeild   ===> 返回值是（{value: b的值, done: false}）
  console.log(b);
  const c = yield b;
  //第三次调用next 返回值是（{value: c的值, done: true}）
  // 遇到return   会把返回值的done 设置为true
  // 后面在调用next 始终返回的是值undefined done 为true
  console.log(c);
  return c;
}