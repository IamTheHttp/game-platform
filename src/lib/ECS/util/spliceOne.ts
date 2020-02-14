let spliceOne = function(arr, index = 0) {
  let idx = index;
  let len = arr.length;
  if (!len || idx >= len) {
    return;
  }

  while (idx < len) {
    arr[idx] = arr[idx + 1];
    idx++;
  }
  arr.length--;
};

export default spliceOne;