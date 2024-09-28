function _isHappy(n) {
  if (n === 1) return true;

  let num = n + "";
  let result = 0;
  let idx = 0;

  while (num.length - 1 > 0) {
    result += Number(num[idx]) ** 2;

    if (idx === num.length - 1) {
      if (result === 1) {
        return true;
      }

      idx = 0;
      num = result + "";
      result = 0;
      continue;
    }
    num.replace(num[idx], "");
    idx++;
  }

  return false;
}
