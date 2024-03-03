const $ = document.querySelector.bind(document);
const viewerEl = $("#prop-viewer");
const selecteds = {};

const colors = [ "#ffd0d0", "#ffd995", "#cfffb2", "#bbc0ff" ];

export function setProps(propObj) {
  viewerEl.innerHTML = "";
  const props = Object.keys(propObj).map(key => ({ key, val: propObj[key] })).sort((a,b) => b.key > a.key ? -1 : 1);

  for (const { key, val } of props) {
    const pair = document.createElement("div");
    pair.classList.add("prop-pairs");

    const kEl = document.createElement("div");
    kEl.textContent = key;
    
    const vEl = document.createElement("div");
    vEl.textContent = val;
    vEl.classList.add("vals");

    const copyEl = document.createElement("div");
    copyEl.classList.add("copy");
    
    pair.append(kEl, vEl, copyEl);
    viewerEl.append(pair)

    if (selecteds.hasOwnProperty(key)) {
      const color = selecteds[key] < colors.length ? colors[selecteds[key]] : "";
      vEl.style.background = color;
      kEl.style.background = color;
    }

    pair.addEventListener("click", () => {
      if (!selecteds.hasOwnProperty(key)) selecteds[key] = 0;
      else selecteds[key] = (selecteds[key] + 1) % (colors.length+1);
      
      const color = selecteds[key] < colors.length ? colors[selecteds[key]] : "";
      kEl.style.background = color;
      vEl.style.background = color;
    });

    copyEl.addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(val).catch(err => { console.error(err); });
    });
  }
}
