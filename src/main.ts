import data from "./scripts/data";
import SvgPanZoom from "svg-pan-zoom";

const svgHandler = SvgPanZoom("svg", {
  dblClickZoomEnabled: false,
  mouseWheelZoomEnabled: false,
});

const lerp = (start: number, end: number, amt: number) => {
  return (1 - amt) * start + amt * end;
};

const homeButton = document.getElementById("home");
homeButton.addEventListener("click", () => {
  svgHandler.reset();
});

const zoominButoon = document.getElementById("zoomin");
zoominButoon.addEventListener("click", () => {
  svgHandler.zoom(svgHandler.getZoom() * 1.1);
});

const zoomoutButoon = document.getElementById("zoomout");
zoomoutButoon.addEventListener("click", () => {
  svgHandler.zoom(svgHandler.getZoom() / 1.1);
});
