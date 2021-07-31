var spliceOne = function (arr, index) {
    if (index === void 0) { index = 0; }
    var idx = index;
    var len = arr.length;
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
