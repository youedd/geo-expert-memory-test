import SvgPanZoom from "svg-pan-zoom";
import data from "./scripts/data";

const delta = 0.1;

const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

const svgHandler = SvgPanZoom("svg", {
  dblClickZoomEnabled: false,
  mouseWheelZoomEnabled: false,

});

const homeButton = document.getElementById("home");
homeButton.addEventListener("click", () => {
  svgHandler.reset();
});

let newZoom;
let intervalId: NodeJS.Timeout | null = null;

const startLerp = () => {

  if (intervalId) {
    return;
  }
  intervalId = setInterval(() => {
    const zoom = svgHandler.getZoom();
    if (zoom === newZoom) {
      clearInterval(intervalId);
    }
    svgHandler.zoom(lerp(zoom, newZoom, delta));
  }, 1000 / 60);
}

const zoominButoon = document.getElementById("zoomin");
zoominButoon.addEventListener("click", () => {
  newZoom = svgHandler.getZoom() * 1.5;
  startLerp();
});

const zoomoutButoon = document.getElementById("zoomout");
zoomoutButoon.addEventListener("click", () => {
  newZoom = svgHandler.getZoom() / 1.5;
  startLerp();
});
