import Swup from "swup";
import SwupGaPlugin from "@swup/ga-plugin";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScriptsPlugin from "@swup/scripts-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
import SwupScrollPlugin from "@swup/scroll-plugin";
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import Midday from "midday.js";

// Page Loader (SWUP)
const options = {
  containers: ["#content", "#navigation"],
  animateHistoryBrowsing: true,
  plugins: [
    new SwupGaPlugin(),
    new SwupPreloadPlugin(),
    new SwupBodyClassPlugin(),
    new SwupScrollPlugin({
      doScrollingRightAway: false,
      animateScroll: true,
      scrollFriction: 0.3,
      scrollAcceleration: 0.04,
    }),
    new SwupScriptsPlugin({
      head: true,
      body: true
    }),
  ],
  preload: true,
  cache: true, // DEVELOPMENT
  scroll: true,
  linkSelector: 'a[href^="' + window.location.origin + '"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
  skipPopStateHandling: function(event) {
    if (event.state && event.state.source === "photoswipe") {
      return false;
    }
    return true;
  }
};
const swup = new Swup(options);
swup.on("contentReplaced", init);

function init() {
  const middayNav = new Midday(document.getElementById("navigation"), {
    headerClass: "hue-header",
    innerClass: "hue-header-inner",
    sectionSelector: "hue"
  });
}
init();

import "./css/main.css";
