import { pipe, scan, map, forEach } from "callbag-basics";
import { interpolate } from "flubber";

import start from "../images/goku-start.svg";
import end from "../images/goku-end.svg";

const probe = document.createElement("svg");
probe.innerHTML = end;
main.innerHTML = start;

const from = main.querySelector("path").getAttribute("d");
const to = probe.querySelector("path").getAttribute("d");

const destination = main.querySelector("path");

const interpolator = interpolate(from, to);

pipe(
  raf,
  scan(frame => frame + 1, 0),
  map(frame => {
    const step =  Math.abs(Math.sin(frame / 100));
    return {
      path: interpolator(step),
      color: lerpColor("000000", "05bbcb", step)
    };
  }),
  forEach(stepDef => {
    destination.setAttribute("d", stepDef.path);
    destination.style.fill = stepDef.color;
  })
)

function raf(type, data) {
  let stop = false;
  if (type === 0) {
    const sink = data;
    const frame = () => {
      if (stop) { return; }
      sink(1, null);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame)
    sink(0, (t, d) => {
      if (t === 2) { stop = true; }
    });
  }
}

// copied from https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
function lerpColor(a, b, amount) {

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}
