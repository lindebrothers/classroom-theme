---
---
const utils = {
  splitUp: (arr, n) => {
    var rest = arr.length % n, // how much to divide
    restUsed = rest, // to keep track of the division over the elements
    partLength = Math.floor(arr.length / n),
    result = [];

    for (var i = 0; i < arr.length; i += partLength) {
      var end = partLength + i,
      add = false;

      if (rest !== 0 && restUsed) { // should add one element for the division
        end++;
        restUsed--; // we've used one division element now
        add = true;
      }

      result.push(arr.slice(i, end)); // part of the array

      if (add) {
        i++; // also increment i in the case we added an extra element for division
      }
    }
    return result;
  },
}