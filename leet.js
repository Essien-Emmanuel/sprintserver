const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];

const groupAnagrams = function (strs) {
  const map = {};
  for (let s of strs) {
    const sorted_s = s.split("").sort().join("");
    if (map[sorted_s]) {
      map[sorted_s].push(s);
      continue;
    }
    map[sorted_s] = [s];
  }
  return Object.values(map);
};

// console.log(groupAnagrams(strs));

// const lengthOfLongestSubstring = function (s) {
//   const str = s;
//   if (str.length < 1) {
//     return 0;
//   }
//   let ls = str[0];
//   const map = {};
//   const strLen = str.length;
//   for (let i = 1; i < strLen; i++) {
//     if (ls[ls.length - 1] === str[i]) {
//       map[ls] = ls.length;
//       ls = str[i];
//       console.log(map);
//       continue;
//     }
//     if (ls.includes(str[i])) {
//       map[ls] = ls.length;
//       ls = ls.slice(ls.lastIndexOf(str[i]) + 1) + str[i];
//       continue;
//     }
//     ls += str[i];
//   }
//   map[ls] = ls.length;
//   console.log(map);
//   let max = 0;
//   for (let k in map) {
//     if (map[k] > max) {
//       max = map[k];
//     }
//   }
//   return max;
// };
const r = "pwwkew";
const w = "abcabcbb";
const c = "dvdf";

const lengthOfLongestSubstring = function (s) {
  let maxLen = 0;
  let start = 0;
  const map = {};

  for (let end = 0; end < s.length; end++) {
    const char = s[end];

    if (map[char] >= start) {
      start = map[char] + 1;
    }
    map[char] = end;

    maxLen = Math.max(maxLen, end - start + 1);
  }
  return maxLen;
};
// console.log(lengthOfLongestSubstring(c));

var repeatedNTimes = function (nums) {
  const numsLen = nums.length;
  const map = {};
  for (let i = 0; i < numsLen; i++) {
    const num = nums[i];
    if (num in map) {
      map[num] += 1;
      continue;
    }
    map[num] = 1;
  }
  const maxNum = Math.max(...Object.values(map));
  for (const k in map) {
    if (map[k] === maxNum) {
      return +k;
    }
  }
};
// console.log(repeatedNTimes([1, 2, 3, 3]));

class EListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function isCycle(head) {
  let fast = head;
  let slow = head;

  while (fast !== null || fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (fast === slow) return true;
  }
  return false;
}

/**
 * Input: n = 19
Output: true
Explanation:
1^2 + 9^2 = 82
8^2 + 2^2 = 68
6^2 + 8^2 = 100
1^2 + 0^2 + 0^2 = 1
 */

const n = 19;

class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function isHappy(n) {
  const sumOfSquares = (num) => {
    let sum = 0;
    while (num > 0) {
      const digit = num % 10;
      sum += digit ** 2;
      num = Math.floor(num / 10);
    }
    return sum;
  };

  let slow = n;
  let fast = sumOfSquares(n);

  while (fast !== 1 && fast !== slow) {
    slow = sumOfSquares(slow);
    fast = sumOfSquares(sumOfSquares(fast));
  }

  return fast === 1;
}
console.log(isHappy(4));
// console.log(isHappy(7));
