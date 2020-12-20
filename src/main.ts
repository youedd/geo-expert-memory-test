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
  maxZoom: 50,
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

const updateDescription = () => {
  const description = document.getElementById("description") as HTMLElement;
  const count = state.total - state.found;
  description.innerHTML = t`How many territories can you find?<br> ${count} to recall…`;
};

const showTerritory = (node: SVGPathElement) => {
  panZoom.fit();
  const bbox = node.getBBox();

  const { width, height, realZoom, viewBox } = panZoom.getSizes();
  panZoom.pan({
    x: -realZoom * (bbox.x - width / (realZoom * 2) + bbox.width / 2),
    y: -realZoom * (bbox.y - height / (realZoom * 2) + bbox.height / 2),
  });

  const newScale = Math.max(
    bbox.width / viewBox.width,
    bbox.height / viewBox.height
  );

  panZoom.zoom((0.8 * panZoom.getZoom()) / newScale);
};

let isDrag = false;
document.addEventListener("mousedown", () => (isDrag = false));
document.addEventListener("mousemove", () => (isDrag = true));

document.querySelectorAll(".land").forEach((elem) =>
  elem.addEventListener("mouseup", (event) => {
    if (!isDrag) {
      showTerritory((elem as unknown) as SVGPathElement);
    }
  })
);
const form = document.getElementById("form") as HTMLFontElement;
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("input") as HTMLInputElement;
  const answer = input.value.trim().toLowerCase();
  const territory = data.find(
    (item) => item.title.toLowerCase() === answer.toLowerCase()
  );

  if (territory) {
    const element = document.getElementById(territory.id);
    showTerritory((element as unknown) as SVGPathElement);
    const title = element.getElementsByTagName("title")[0];
    title.innerHTML = territory.title;
    if (!element.hasAttribute("correct")) {
      element.setAttribute("correct", "");
      state.found++;
    }
    updateDescription();
  }
  input.value = "";
});

updateDescription();
