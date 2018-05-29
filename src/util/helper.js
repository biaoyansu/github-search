function find_and_delete(arr, element) {
  var shit_index = arr.indexOf(element); // 找到需要被删除的元素的索引

  /*如果不存在，直接返回*/
  if (shit_index == -1)
    return false;

  /*否则将其删除，从shit_index开始删，删1个*/
  arr.splice(shit_index, 1);
  return true;
}

module.exports = {
  find_and_delete: find_and_delete
}
