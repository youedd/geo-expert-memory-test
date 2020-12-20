import { t } from "ttag";
import SvgPanZoom from "svg-pan-zoom";
import data from "./scripts/data";
/*
// const delta = 0.1;

// const lerp = (start: number, end: number, amt: number) => {
//   return (1 - amt) * start + amt * end;
// };

// let newZoom;
// let intervalId: NodeJS.Timeout | null = null;

// const startLerp = () => {
//   if (intervalId) {
//     return;
//   }
//   intervalId = setInterval(() => {
//     const zoom = panZoom.getZoom();
//     if (zoom === newZoom) {
//       clearInterval(intervalId);
//       intervalId = null;
//       return;
//     }
//     panZoom.zoom(lerp(zoom, newZoom, delta));
//   }, 1000 / 60);
// };
*/

const state = {
  total: data.length,
  found: 0,
};

const panZoom = SvgPanZoom("svg", {
  dblClickZoomEnabled: true,
  mouseWheelZoomEnabled: true,
});

window.addEventListener("resize", () => {
  panZoom.resize();
  panZoom.fit();
  panZoom.center();
});

const homeButton = document.getElementById("home");
homeButton.addEventListener("click", () => {
  // clearInterval(intervalId);
  // intervalId = null;
  panZoom.reset();
});

const zoominButoon = document.getElementById("zoomin");
zoominButoon.addEventListener("click", () => {
  const newZoom = panZoom.getZoom() * 1.5;
  panZoom.zoom(newZoom);
});

const zoomoutButoon = document.getElementById("zoomout");
zoomoutButoon.addEventListener("click", () => {
  const newZoom = panZoom.getZoom() / 1.5;
  panZoom.zoom(newZoom);
});

const description = document.getElementById("description") as HTMLElement;
const updateDescription = () => {
  const count = state.total - state.found;
  description.innerHTML = t`How many terretories can you find?<br> ${count} to recall…`;
};

const input = document.getElementById("input") as HTMLInputElement;
input.addEventListener("change", () => {
  const answer = input.value.trim().toLowerCase();
  const terretory = data.find(
    (item) => item.title.toLowerCase() === answer.toLowerCase()
  );

  if (terretory) {
    const element = document.getElementById(terretory.id);
    element.setAttribute("correct", "");
    state.found++;
    updateDescription();
  }
  input.value = "";
});

updateDescription();
