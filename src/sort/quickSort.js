
// 交换位置
function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

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

function quickSort(arr, left = 0, right = arr.length) {
  if (left < right - 1) {
    const partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex);
    quickSort(arr, partitionIndex - 1, right);
  }
  return arr;

}


console.log(quickSort([1, 5, 3, 4, 7, 2, 3]));