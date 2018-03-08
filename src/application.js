import { pipe, scan, take, map, forEach } from "callbag-basics";
import { interpolate } from "flubber";
import { interpolate as interpolateColor } from "./colorInterpolator";
import raf from "callbag-animation-frames";

import goku from "./goku.svg";

const container = document.createElement("svg");
container.innerHTML = goku;

const saiyanIds = [
  { name: "Saiyan", id: "saiyan", color: "000000" },
  { name: "Super Saiyan 1", id: "super-saiyan-1", color: "ffbd31" },
  { name: "Super Saiyan 2", id: "super-saiyan-2", color: "d5cf2b" },
  { name: "Super Saiyan 3", id: "super-saiyan-3", color: "ebb700" },
  { name: "Super Saiyan God", id: "super-saiyan-god", color: "d70564" },
  { name: "Super Saiyan Blue", id: "super-saiyan-blue", color: "05bbcb" },
  { name: "Ultra Instinct", id: "ultra-instinct", color: "56656c" }
];

const saiyans = saiyanIds.map(saiyan => ({
  ...saiyan,
  path: container.querySelector(`#${saiyan.id}`).getAttribute("d"),
}));

const destination = document.querySelector("#dest");
const colorSensibleElements = document.querySelectorAll(".colored");

const interpolators = saiyans.map((saiyan, i, arr) => {
  const from = saiyan;
  const to = arr[(i + 1) % arr.length];
  return {
    path: interpolate(from.path, to.path),
    color: (step) => interpolateColor(from.color, to.color, step),
  };
});

pipe(
  raf,
  scan(frame => frame + 1, 0),
  map(computeFrame(interpolators)),
  forEach(stepDef => {
    destination.setAttribute("d", stepDef.path);
    destination.style.fill = stepDef.color;

    colorSensibleElements.forEach((element) => element.style.fill = stepDef.color);
  })
);

function computeFrame(interpolators) {
  const framePerAnimation = 70;
  return (frame) => {
    const t = (frame / framePerAnimation) % 1;
    const interpolator = interpolators[Math.floor((frame / framePerAnimation) % saiyans.length)];
    const animationStep = EasingFunctions.easeInQuint(t) % 1;

    return {
      path: interpolator.path(animationStep),
      color: interpolator.color(animationStep),
    };
  }
}

const EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

