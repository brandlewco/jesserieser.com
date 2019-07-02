import Swup from "swup";
import SwupGaPlugin from "@swup/ga-plugin";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScriptsPlugin from "@swup/scripts-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
import SwupScrollPlugin from "@swup/scroll-plugin";
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import Midday from "midday.js";
import Isotope from "isotope-layout";

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
  const middayNav = new Midday(document.getElementById("navigation"), {
    headerClass: "hue-header",
    innerClass: "hue-header-inner",
    sectionSelector: "hue"
  });

  // Sorter
  // filter functions
  var filterFns = {
    greaterThan50: function(itemElem) {
      var number = itemElem.querySelector(".number").textContent;
      return parseInt(number, 10) > 50;
    },
    even: function(itemElem) {
      var number = itemElem.querySelector(".number").textContent;
      return parseInt(number, 10) % 2 === 0;
    }
  };

  // store filter for each group
  var filters = {};

  // init Isotope
  var iso = new Isotope(".collection-sort", {
    itemSelector: ".collection-item",
    filter: function(itemElem) {

      var isMatched = true;

      for (var prop in filters) {
        var filter = filters[ prop ];
        // use function if it matches
        filter = filterFns[ filter ] || filter;
        // test each filter
        var filterType = typeof filter;
        if (filter && filterType == "function") {
          isMatched = filter(itemElem);
        } else if (filter) {
          isMatched = matchesSelector(itemElem, filter);
        }
        // break if not matched
        if (!isMatched) {
          break;
        }
      }
      return isMatched;
    }

  });

  document.querySelector("#filters").addEventListener("click", function(event) {
  // only work with buttons
    if (!matchesSelector(event.target, "button")) {
      return;
    }
    // get group key
    var buttonGroup = event.target.parentNode;
    var filterGroup = buttonGroup.getAttribute("data-filter-group");
    // set filter for group
    filters[ filterGroup ] = event.target.getAttribute("data-filter");
    // arrange, and use filter fn
    iso.arrange();
  });

  // change is-checked class on buttons
  var buttonGroups = document.querySelectorAll(".button-group");
  for (var i = 0; i < buttonGroups.length; i++) {
    var buttonGroup = buttonGroups[i];
    radioButtonGroup(buttonGroup);
  }

  function radioButtonGroup(buttonGroup) {
    buttonGroup.addEventListener("click", function(event) {
    // only work with buttons
      if (!matchesSelector(event.target, "button")) {
        return;
      }
      buttonGroup.querySelector(".is-checked").classList.remove("is-checked");
      event.target.classList.add("is-checked");
    });
  }

}
init();

import "./css/main.css";
