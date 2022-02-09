import { t } from "ttag";
import data from "./scripts/data";
import { creatPanZoom } from "./scripts/initZoomPan";

const state = JSON.parse(localStorage.getItem("state")) || {
  total: data.length,
  found: [],
  mapLocked: false,
};

const panZoom = creatPanZoom();
const form = document.getElementById("form") as HTMLFormElement;
const description = document.getElementById("description") as HTMLElement;
const lockButton = document.getElementById("lock");
const homeButton = document.getElementById("home");
const zoominButton = document.getElementById("zoomin");
const zoomoutButton = document.getElementById("zoomout");
const deleteButton = document.getElementById("delete");

const updateDescription = () => {
  const count = state.total - state.found.length;
  description.innerHTML = t`How many territories can you find?<br> ${count} to recall…`;
  localStorage.setItem("state", JSON.stringify(state));
};

const zoomOnTerritory = (node: SVGPathElement) => {
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

  panZoom.zoom((0.6 * panZoom.getZoom()) / newScale);
};

updateDescription();

state.found.forEach((id) => {
  const element = document.getElementById(id);
  const title = element.getElementsByTagName("title")[0];
  title.innerHTML = data.find((country) => country.id === id).title;
  element.setAttribute("correct", "");
});

lockButton.className = `icon ${
  !state.mapLocked ? "icon-unlocked" : "icon-lock"
}`;

// EVENTS
window.addEventListener("resize", () => {
  panZoom.resize();
});

lockButton.addEventListener("click", () => {
  lockButton.className = `icon ${
    state.mapLocked ? "icon-unlocked" : "icon-lock"
  }`;
  state.mapLocked = !state.mapLocked;
  localStorage.setItem("state", JSON.stringify(state));
});

homeButton.addEventListener("click", () => {
  panZoom.fit();
  panZoom.center();
});

zoominButton.addEventListener("click", () => {
  const newZoom = panZoom.getZoom() * 1.5;
  panZoom.zoom(newZoom);
});

zoomoutButton.addEventListener("click", () => {
  const newZoom = panZoom.getZoom() / 1.5;
  panZoom.zoom(newZoom);
});

deleteButton.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

let isDrag = false;
document.addEventListener("mousedown", () => (isDrag = false));
document.addEventListener("mousemove", () => (isDrag = true));

document.querySelectorAll(".land").forEach((elem) =>
  elem.addEventListener("mouseup", () => {
    if (!isDrag) {
      zoomOnTerritory(elem as unknown as SVGPathElement);
    }
  })
);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("input") as HTMLInputElement;
  const answer = input.value.trim().toLowerCase();
  const territory = data.find(
    (item) => item.title.toLowerCase() === answer.toLowerCase()
  );

  if (territory) {
    const element = document.getElementById(territory.id);
    if (!state.mapLocked) {
      zoomOnTerritory(element as unknown as SVGPathElement);
    }
    const title = element.getElementsByTagName("title")[0];
    title.innerHTML = territory.title;
    if (!element.hasAttribute("correct")) {
      element.setAttribute("correct", "");
      state.found.push(territory.id);
    }
    updateDescription();
  }
  input.value = "";
});
