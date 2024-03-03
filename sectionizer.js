import { splitEncapsulated } from "./splitter.js";

export class Section {
  constructor(lines) { // assumes lines[0] is the header
    this.header = lines[0].split(" ", 2).join(" "); // first two spaces indicate header
    this.lines = lines.slice(0); // create copy

    this.ssvHeaderI = lines.findIndex((line) => line.includes("ncalls") ) // first line
    if (this.ssvHeaderI == -1) return;
    this.ssvHeaders = splitEncapsulated(lines[this.ssvHeaderI], [" ", ], 3).map(val => val.trim()).filter(val => val.length > 0);
  }

  get data() {
    if (this.ssvHeaderI == -1) return []; // no data
    
    const data = [];
    for (let i = this.ssvHeaderI+1; i < this.lines.length; i++) {
      const line = splitEncapsulated(this.lines[i], [" "]).map(val => val.trim()).filter(val => val.length > 0);
      const lineData = {};
      for (let i in this.ssvHeaders) {
        lineData[this.ssvHeaders[i]] = (i < line.length) ? line[i] : ""; 
      }
      data.push(lineData);
    }
    return data;
  }

  get length() {
    return this.lines.length - this.ssvHeaderI - 1;
  }
}

export function buildSections(text, isHeaderLineFunc) {
  const lines = text.split("\n");

  const sections = [];

  let header = -1; // index
  const lineBuffer = [];
  
  for (const i in lines) {
    const line = lines[i];
    if (line.trim().length == 0) continue; // ignore line
    if (isHeaderLineFunc(line)) { // header
      if (header !== -1) { // not first header
        sections.push(new Section(lineBuffer))
      }
      header = +i;
      lineBuffer.splice(0); // clear
    }
    lineBuffer.push(line);
  }

  if (lineBuffer.length > 0) sections.push(new Section(lineBuffer)); // empty line buffer
  return sections;
}