import * as prop from "./prop.js"

const bars = [];
var heightProp = null;

class Bar {
  constructor(props) {
    this.el = document.createElement("div");
    this.el.classList.add("bars");

    this.props = props;

    this.el.addEventListener("click", () => {
      const oldEl = this.el.parentNode?.querySelector(".selected");
      if (oldEl === this.el) return;
      oldEl?.classList.remove("selected");
      this.el.classList.add("selected");

      prop.setProps(this.props);
    });

    this.bar = document.createElement("div");
    this.el.append(this.bar);
  }

  build(parent) {
    parent.append(this.el);
    if (!parent.querySelector(".selected")) this.el.click();
  }
  remove() {
    this.el.remove();
  }

  get(prop, fallback=null) {
    return this.props.hasOwnProperty(prop) ? this.props[prop] : fallback;
  }

  set height(value) {
    this.bar.style.height = `calc(${value}% - 5px)`;
  }
}

export function clear() {
  for (const bar of bars) {
    bar.remove();
  }
  bars.splice(0);
}

var isWaitingToReheight = false;
export function build(props, parent) {
  const bar = new Bar(props);
  bars.push(bar);
  bar.build(parent);

  if (isWaitingToReheight) return;
  isWaitingToReheight = true;
  setTimeout(() => {
    isWaitingToReheight = false;
    reheight();
  }, 10);
}

export function setHeightProp(property) {
  heightProp = property;
  reheight();
}

function reheight() {
  let maxHeight = 0;

  for (const bar of bars) {
    const height = parseFloat(bar.get(heightProp, 0), 10);
    if (height > maxHeight) maxHeight = height;
  }

  for (const bar of bars) {
    const height = bar.get(heightProp, 0);
    bar.height = ((maxHeight == 0) ? 100 : 100 * height / maxHeight);
  }
}

