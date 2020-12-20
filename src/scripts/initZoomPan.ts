import Hammer from "hammerjs";
import SvgPanZoom from "svg-pan-zoom";

export const creatPanZoom = function () {
  let hammer: HammerManager;
  return SvgPanZoom("svg", {
    dblClickZoomEnabled: true,
    mouseWheelZoomEnabled: true,

    maxZoom: 50,
    customEventsHandler: {
      haltEventListeners: [
        "touchstart",
        "touchend",
        "touchmove",
        "touchleave",
        "touchcancel",
      ],
      init: (options) => {
        var instance = options.instance,
          initialScale = 1,
          pannedX = 0,
          pannedY = 0;

        hammer = new Hammer(options.svgElement);

        // Enable pinch
        hammer.get("pinch").set({ enable: true });

        // Handle double tap
        hammer.on("doubletap", () => {
          instance.zoomIn();
        });

        // Handle pan
        hammer.on("panstart panmove", (ev) => {
          console.log("here");
          // On pan start reset panned variables
          if (ev.type === "panstart") {
            pannedX = 0;
            pannedY = 0;
          }

          // Pan only the difference
          instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
          pannedX = ev.deltaX;
          pannedY = ev.deltaY;
        });

        // Handle pinch
        hammer.on("pinchstart pinchmove", function (ev) {
          // On pinch start remember initial zoom
          if (ev.type === "pinchstart") {
            initialScale = instance.getZoom();
            instance.zoomAtPoint(initialScale * ev.scale, {
              x: ev.center.x,
              y: ev.center.y,
            });
          }

          instance.zoomAtPoint(initialScale * ev.scale, {
            x: ev.center.x,
            y: ev.center.y,
          });
        });

        options.svgElement.addEventListener("touchmove", function (e) {
          e.preventDefault();
        });
      },
      destroy: () => {
        hammer.destroy();
      },
    },
  });
};
