import Swup from "swup";
import SwupGaPlugin from "@swup/ga-plugin";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScriptsPlugin from "@swup/scripts-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
import SwupScrollPlugin from "@swup/scroll-plugin";
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import Midday from "midday.js";
import Filterizr from "filterizr";


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
      scrollAcceleration: 0.05,
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
  // midday
  const middayNav = new Midday(document.getElementById("navigation"), {
    headerClass: "hue-header",
    innerClass: "hue-header-inner",
    sectionSelector: "hue"
  });
  // filter
  if (document.querySelector("#filter")) {
    const filterizr = new Filterizr(".filtr-container", filtrOptions);
    // Configure your options
    const filtrOptions = {
      animationDuration: 0.33, // in seconds
      callbacks: {
        onFilteringStart: function() { },
        onFilteringEnd: function() { },
        onShufflingStart: function() { },
        onShufflingEnd: function() { },
        onSortingStart: function() { },
        onSortingEnd: function() { }
      },
      controlsSelector: "", // Selector for custom controls
      delay: 0, // Transition delay in ms
      delayMode: "alternate", // 'progressive' or 'alternate'
      easing: "ease-out",
      filter: "opacity", // Initial filter
      filterOutCss: { // Filtering out animation
        opacity: 0,
        transform: "scale(1)"
      },
      filterInCss: { // Filtering in animation
        opacity: 1,
        transform: "scale(1)"
      },
      gridItemsSelector: ".filtr-item",
      gridSelector: ".filtr-container",
      layout: "sameSize", // See layouts
      multifilterLogicalOperator: "and",
      searchTerm: "",
      setupControls: true // Should be false if controlsSelector is set
    };
  }
} // end init.on
init();

var buttons = document.getElementsByClassName("toggle");
Array.prototype.forEach.call(buttons, function(button) {
  button.addEventListener("click", function(event) {
    button.classList.toggle("active");
  });
});

import "./css/main.css";
