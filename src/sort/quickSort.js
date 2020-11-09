

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


console.log(quickSort([1, 1, 5, 3, 4, 7, 2, 3]));