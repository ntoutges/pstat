
// maps from opener to closer
const encapsulators = {
  "\"": "\"",
  "'": "'",
  "`": "`",
  "{": "}",
  "[": "]",
  "<": ">"
}
export function splitEncapsulated(str, splitters=[" "], minLen=1) {
  let encapsulations = [];
  let sections = [];

  let startI = 0;
  for (let i in str) {
    if (encapsulations.length > 0) {
      if (encapsulations[encapsulations.length] == str[i]) { // check if able to close encapsulation
        encapsulators.pop();
      }
      continue; // if encapsulators exist, don't split
    }

    

    if (encapsulators.hasOwnProperty(str[i])) { // char is encapsulator, add to list
      encapsulations.push(encapsulators[str[i]]);
      continue;
    }

    // normal char, check if splitable
    if (splitters.includes(str[i]) && +i - startI > minLen) {
      // splitable: split
      sections.push(str.substring(startI, i));
      startI = +i + 1;
    }
  }

  // finish
  sections.push(str.substring(startI));
  return sections;
}