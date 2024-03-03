import * as sectionizer from "./sectionizer.js"
import * as grapher from "./grapher.js"

const $ = document.querySelector.bind(document);

var dragging = null;

$("#container").addEventListener("mouseup", () => {
  dragging = null;
});

$("#container").addEventListener("mousemove", (e) => {
  if (dragging === null) return;

  if (dragging == "separator") {
    e.preventDefault();

    const totalWidth = $("#container").offsetWidth;
    const barWidth = $("#separator").offsetWidth;

    const vw = Math.min(Math.max(100 * (e.pageX - barWidth/2) / totalWidth, 0), 100); // get distance from left in terms of vw; // min/max clamp within bounds of screen
    
    $("#input").style.width = `${vw}vw`;
  }
});

$("#separator").addEventListener("mousedown", () => {
  dragging = "separator";
});

$("#input-tab-holder").addEventListener("click", (e) => {
  if (!e.target.classList.contains("input-tabs")) return; // didn't click on tab
  
  const oldTab = $("#input-tab-holder").querySelector(".selected");

  oldTab?.classList.remove("selected");
  e.target.classList.add("selected");

  const oldValue = oldTab.getAttribute("data-value");
  const newValue = e.target.getAttribute("data-value");

  $(`#input > [data-value="${oldValue}"]`).classList.remove("selected"); // hide old
  $(`#input > [data-value="${newValue}"]`).classList.add("selected"); // show new
});


var sections = [];
$("#input-text").addEventListener("input", () => {
  sections = sectionizer.buildSections($("#input-text").value, isHeaderLineFunc);
  rebuildSections();
});

function isHeaderLineFunc(line) {
  return line.includes("profiling - INFO - Profiling output:");
}

function rebuildSections() {
  $("#input-parsed").innerHTML = "";

  try {
    const els = [];
    for (const section of sections) {
      // get part of first (non-header) line
      const time = parseFloat(section.lines[1].split(" ").slice(-2,-1));
      
      const el = document.createElement("div");
      el.textContent = `${section.header} (${section.length}) : ${time}s`;
      el.classList.add("sections");

      els.push({ el, time });
    }

    // sort
    els.sort((a,b) => b.time - a.time);
    for (const el of els) {
      $("#input-parsed").append(el.el);
    }

    if (els.length > 0) {
      els[0].el.classList.add("selected");
      loadSection(0);
    }

    $("#input-warning").innerHTML = ""; // get rid of warning
  }
  catch(err) {
    $("#input-warning").textContent = err.toString();
  }
}

$("#input-parsed").addEventListener("click", (e) => {
  if (!e.target.classList.contains("sections") || e.target.classList.contains("selected")) return;

  $(`#input-parsed > .selected`).classList.remove("selected");
  e.target.classList.add("selected");
  
  const index = Array.from(e.target.parentNode.children).indexOf(e.target);
  loadSection(index);
});

function loadSection(index) {
  grapher.clear();

  const data = sections[index].data;
  for (const prop of data) {
    grapher.build(prop, $("#graph-viewer"))
  }

  // fill out height-prop-select
  if (data.length > 0) {
    const props = Object.keys(data[0]).sort((a,b) => a < b ? -1 : 1);
    $("#height-prop-select").innerHTML = "";
    
    for (const prop of props) {
      const el = document.createElement("option");
      el.value = prop;
      el.textContent = prop;
      $("#height-prop-select").append(el);
    }

    if(props.length > 0) grapher.setHeightProp(props[0]);
  }
}

$("#height-prop-select").addEventListener("change", () => {
  grapher.setHeightProp($("#height-prop-select").value);
})
