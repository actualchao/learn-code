/**
 * 实现简单面求交集并集
 */













// 通过保留有效小数实现解决浮点数问题
const ignoreFloatNum = 10;
function _toFixed(num) {
  return num.toFixed(ignoreFloatNum) * 1;
}





/**
 * 校验面数据点位顺逆方向，返回方向后的数据
 * 通过法相和/叉积和判断顺时针还是逆时针
 * @param {Array2} list 点位二维数组
 * @param {Boolean} clockLeft 是否返回逆时针
 */
function clockComputed(list, clockLeft = true) {
  // 面数据不少于三个点
  if (list.length < 3) return;
  // 记录叉积和，即法相Z
  let count = 0;
  const [x0, y0] = list[0]._p;
  for (let i = 1; i < list.length - 2; i++) {
    const [x1, y1] = list[i]._p;
    const [x2, y2] = list[i + 1]._p;
    const res = _toFixed((((x1 - x0) * (y2 - y0)) - ((x2 - x0) * (y1 - y0))));
    count += res;
  }

  // 叉积为0 则点在一条直线上
  if (count === 0) {
    throw Error('所有点在一条直线上');
  }


  if (clockLeft) { //逆时针，面积为正值
    return count > 0 ? list : list.reverse();
  } else { // 顺时针
    return count < 0 ? list : list.reverse();
  }
}

/**
 * 判断点在不在线上
 * @param {Array} point [x,y]
 * @param {Array2} line  [[x,y],[x,y]]
 * @param {Boolean} ignoreStart 忽略起点在起点上的情况
 * @param {Boolean} needOnArea 是否需要必须在线段内
 *
 */
function pointIsOnLine(point, line, ignoreStart = false, needOnArea = true) {

  const [x0, y0] = point;
  const [[x1, y1], [x2, y2]] = line;

  // 点为向量line 的起点时，该计算因x0，x1相等，y0 = y1 所以不能判断在不在线上
  // 计算通过计算点和线段起点的斜率，和线段斜率是否相等
  let onLine = _toFixed((y0 - y1) / (x0 - x1)) === _toFixed((y2 - y1) / (x2 - x1));

  // 实际上在计算时有时候需要起点不算在内，终点算在内，能避免重复取点问题
  // 引入ignoreStart，为true时，起点算在内，为false 时，起点不算在向量上，默认不算，避免重复添加
  if (!ignoreStart && x0 == x1 && y0 == y1) { onLine = true; }

  // 判断在不在区域内，不在的话false
  const onArea = x0 >= Math.min(x1, x2) && x0 <= Math.max(x1, x2) && y0 >= Math.min(y1, y2) && y0 <= Math.max(y1, y2);

  // 如果需要必须在线段上，需同时满足online&&onArea，否则返回在不在直线上
  return needOnArea ? onLine && onArea : onLine;
}


/**
 * 获取法相normal Z
 */
function getNormal(lineA, lineB) {
  const [[x1, y1], [x2, y2]] = lineA;
  const [[x3, y3], [x4, y4]] = lineB;

  return (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
}

/**
 * 求两个向量是否有交点有则返回点和点的法向量z，没有返回null
 * @param {Array} lineA 向量A
 * @param {Array} lineB 向量B
 */
function getPoint(lineA, lineB) {

  const [[x1, y1], [x2, y2]] = lineA;
  const [[x3, y3], [x4, y4]] = lineB;


  // 求解两条直线的交点
  const x0 = _toFixed(((x1 * y2 - y1 * x2) * (x3 - x4)) - ((x3 * y4 - y3 * x4) * (x1 - x2))) / ((x1 - x2) * (y3 - y4) - (x3 - x4) * (y1 - y2));
  const y0 = _toFixed(((x1 * y2 - y1 * x2) * (y3 - y4)) - ((x3 * y4 - y3 * x4) * (y1 - y2))) / ((x1 - x2) * (y3 - y4) - (x3 - x4) * (y1 - y2));

  // console.log(x0,y0);

  let res = null;

  // 判断点在不在线上第三个参数固定了线段起点不可能设置为和其他线段交点，实际上排除了同一个点作为起点和终点被多次添加交点
  if (pointIsOnLine([x0, y0], lineA, true) && pointIsOnLine([x0, y0], lineB, true)) {
    const normal = getNormal(lineA, lineB);
    res = { _p: [x0, y0], normal };
  }

  // console.log(res);


  return res;


}




/**
 * 求实心面A 和实心面B 的交点并生成该交点的法向量Z,标记了出口还是入口，负值为入口（进入内部），正值为出口（从内部出去）
 * @param {Array} listA 实心面A
 * @param {Array} listB 实心面B
 */
function insertPointOfTwoFace(listA, listB) {

  // 生成可记录对象
  listA = listA.map(item => { return { _p: item, normal: null }; });
  listB = listB.map(item => { return { _p: item, normal: null }; });

  // 把点转换为逆时针数组
  listA = clockComputed(listA);
  listB = clockComputed(listB);

  // 遍历面A，拿到索引为i和i++点的线段，超出则闭环连接到起始点
  for (let i = 0; i < listA.length; i++) {
    const m = (i + 1) % listA.length;
    const lineA = [listA[i]._p, listA[m]._p];

    // 记录点在最后生成的带交点的面中的索引index
    listA[i]._aIndex = i;

    // 遍历面B，生成线段，记录索引
    for (let j = 0; j < listB.length; j++) {
      const n = (j + 1) % listB.length;
      const lineB = [listB[j]._p, listB[n]._p];

      listB[j]._bIndex = j;

      // 获得线段与线段交点，null 为不想交
      const point = getPoint(lineA, lineB);

      if (point) {

        // 入口判断下个向量是不是马上出去，是的话忽略
        if (point.normal < 0) {
          const lineC = [listB[n]._p, listB[(n + 1) % lineB.length]._p];
          const lastNormal = getNormal(lineA, lineC);
          console.log(lineA);
          console.log(lineB);
          console.log(lineC);
          console.log(point.normal);
          console.log('-----------');
          console.log(lastNormal);
        }

        // 用于记录插入交点的索引
        let aIndex = m;
        let bIndex = n;

        if (
          (listA[i]._p[0] === point._p[0]) && (listA[i]._p[1] === point._p[1])
        ) {
          // 这里不进，因为获取交点时排除了起点为交点

          // 如果交点是起点，直接记录法相，交点索引不需要更新
          listA[i].normal = point.normal;
        } else if ((listA[m]._p[0] === point._p[0]) && (listA[m]._p[1] === point._p[1])) {

          // 交点是终点，记录法相，更新交点索引
          listA[m].normal = point.normal;
          aIndex = m;
        } else {
          // 否则在线段之间插入交点，更新记录的索引
          // ++i 之后 i就是新的索引
          listA.splice(m, 0, { ...point, _aIndex: m });
          i++;
        }

        if ((listB[j]._p[0] === point._p[0]) && (listB[j]._p[1] === point._p[1])
        ) {
          // 这里不进，因为获取交点时排除了起点为交点

          listB[j].normal = -1 * point.normal;
        } else if ((listB[n]._p[0] === point._p[0]) && (listB[n]._p[1] === point._p[1])) {
          listB[n].normal = -1 * point.normal;
          bIndex = n;
        } else {
          listB.splice(n, 0, { ...point, normal: -1 * point.normal, _bIndex: n });
          j++;
        }


        // 双向记录交点对应另外一个面的起点索引
        listA[aIndex].bIndex = bIndex;
        listB[bIndex].aIndex = aIndex;

      }
    }

  }

  return [listA, listB];

}



/**
 *
 * @param {Array} listA 实心面A
 * @param {Array} listB 实心面B
 */
function Intersection() {

  // const faceA = [[0, 0], [5, 0], [5, 5], [0, 5]]
  // const faceB = [[2.5, 2.5], [10, 2.5], [10, 10], [2.5, 5]]

  // const faceA = [[0, 0], [1, 0], [2, 2], [1, 3], [0, 3]]
  // const faceB = [[3, 0], [1, 0], [1, 2], [1, 3], [3, 3]]

  // const faceA = [[0, 0], [5, 0], [5, 10], [0, 10]]
  // const faceB = [[5, 0], [10, 0], [10, 10], [5, 10], [8, 5]]

  // const faceA = [[0, 0], [3, 0], [3, 3], [0, 3]]
  // const faceB = [[2, 0], [6, 0], [6, 6], [2, 3]]

  const faceA = [[0, 0], [3, 0], [3, 3], [0, 3]];
  const faceB = [[6, 0], [6, 3], [2, 2], [4, 2], [2, 1]];


  // 生成记录交点信息的数据
  const [_faceA, _faceB] = insertPointOfTwoFace(faceA, faceB);

  console.log(_faceA);
  console.log('--------');
  console.log(_faceB);

  // 查找可以开始的第一个点
  // 正值开始，求并，对应循环里的判断正值，实际上循环是一个 正 ==> 负/正 ==> 负
  // 负值开始，求交，对应循环里的判断为负值，实际上循环是一个 fu ==> 正/负 ==> 正
  const _aIdx = _faceA.findIndex(item => { return item.normal < 0; });

  const res = [];

  function getRes(aIdx) {
    for (let i = aIdx; i < _faceA.length * 2; i++) {
      // 拿到交点
      const pA = _faceA[i % _faceA.length];
      // 如果遇到反向值，开始循环面B，并打断A循环，否则添加数据
      if (pA.normal ? pA.normal > 0 : false) {
        const bIdx = pA.bIndex;
        for (let j = bIdx; j < _faceB.length * 2; j++) {
          const pB = _faceB[j % _faceB.length];
          // 再次远到反向值，获取对应A 的索引，判断是否是开始索引，不是开始下一循环，直到到起点，
          // 否则添加数据
          if (pB.normal ? pB.normal > 0 : false) {
            const aIdx2 = pB.aIndex;
            if (aIdx2 !== _aIdx) {
              getRes(aIdx2);
            }
            break;
          } else {
            res.push(pB);
          }
        }
        break;
      } else {
        res.push(pA);
      }
    }
  }

  getRes(_aIdx);


  console.log('-----------');
  console.log(res);

}


Intersection();



// getPoint([[0, 0], [3, 0]], [[5, 0], [2, 0]])