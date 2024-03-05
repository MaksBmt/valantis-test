import md5 from "blueimp-md5";

export function correctMarginMain() {
  const headerHeight = document.querySelector('header').offsetHeight;
  document.querySelector('main').style.marginTop = headerHeight + 'px';
}

function addZero(num) {
  if (num >= 0 && num <= 9) {
    return '0' + num;
  } else {
    return num;
  }
}

export function getHach() {
  const date = new Date();
  const passwordDate = date.getFullYear() + addZero(date.getMonth() + 1) + addZero(date.getDate());
  return md5(`Valantis_${passwordDate}`);
}

export function getUniqueArray(arr) {
  if (typeof arr[0] === 'string') return Array.from(new Set(arr));

  let array = [];
  arr.forEach(element => {
    array.push(element.id);
  });

  const noneUniqueIndex = [];
  array.forEach((current, index) => {

    for (let comparisonIndex = index + 1; comparisonIndex < array.length; comparisonIndex++) {

      if (current === array[comparisonIndex]) {
        noneUniqueIndex.push(comparisonIndex);
      }
    }
  });

  const unigue = [];
  arr.forEach((el, index) => {
    if (!noneUniqueIndex.includes(index)) {
      unigue.push(el)
    }
  });
  return unigue;
}