

/**
 * https://www.runoob.com/w3cnote/quick-sort.html
 * 快速排序算法
 * @param {*} arr
 * @param {*} left
 * @param {*} right
 */

function quickSort(arr, left = 0, right = arr.length - 1) {

  function partition(arr, left, right) {
    const povit = arr[left];
    while (left < right) {
      while (left < right && arr[right] >= povit) {
        right--;
      }
      if (left < right) {
        arr[left] = arr[right]; //将s[right]填到s[left]中，s[right]就形成了一个新的坑
        left++;
      }

      while (left < right && arr[left] < povit) {
        left++;
      }

      if (left < right) {
        arr[right] = arr[left]; //将s[right]填到s[left]中，s[right]就形成了一个新的坑
        right--;
      }
    }

    arr[left] = povit;

    return left;

  }


  if (left < right) {
    const partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex);
    quickSort(arr, partitionIndex + 1, right);
  }
  return arr;

}


function quickSort1(arr) {
  // 交换
  function swap(arr, a, b) {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

  // 分区
  function partition(arr, left, right) {
    /**
       * 开始时不知最终pivot的存放位置，可以先将pivot交换到后面去
       * 这里直接定义最右边的元素为基准
       */
    const pivot = arr[right];
    /**
       * 存放小于pivot的元素时，是紧挨着上一元素的，否则空隙里存放的可能是大于pivot的元素，
       * 故声明一个storeIndex变量，并初始化为left来依次紧挨着存放小于pivot的元素。
       */
    let storeIndex = left;
    for (let i = left; i < right; i++) {
      if (arr[i] < pivot) {
        /**
               * 遍历数组，找到小于的pivot的元素，（大于pivot的元素会跳过）
               * 将循环i次时得到的元素，通过swap交换放到storeIndex处，
               * 并对storeIndex递增1，表示下一个可能要交换的位置
               */
        swap(arr, storeIndex, i);
        storeIndex++;
      }
    }
    // 最后： 将pivot交换到storeIndex处，基准元素放置到最终正确位置上
    swap(arr, right, storeIndex);
    return storeIndex;
  }

  function sort(arr, left, right) {
    if (left > right) return;

    const storeIndex = partition(arr, left, right);
    sort(arr, left, storeIndex - 1);
    sort(arr, storeIndex + 1, right);
  }

  sort(arr, 0, arr.length - 1);
  return arr;
}



const aa = (new Array(10000)).fill(0).map(item => { return parseInt(Math.random() * 20000); });


const bb = [...aa];
const cc = [...aa];
console.time('sort');
quickSort(bb);
console.timeEnd('sort');

console.time('sort1');
quickSort1(cc);
console.timeEnd('sort1');