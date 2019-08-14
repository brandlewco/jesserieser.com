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
  plugins: [
    new SwupScrollPlugin({
      doScrollingRightAway: false,
      animateScroll: true,
      scrollFriction: 0.3,
      scrollAcceleration: 0.04,
    }),
    new SwupGaPlugin(),
    new SwupPreloadPlugin(),
    new SwupBodyClassPlugin(),
    new SwupScriptsPlugin({
      head: true,
      body: true
    }),
  ],
  animateHistoryBrowsing: true,
  preload: true,
  cache: true,
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
} // end init.on
init();

var buttons = document.getElementsByClassName("toggle");
Array.prototype.forEach.call(buttons, function(button) {
  button.addEventListener("click", function(event) {
    button.classList.toggle("active");
  });
});

var navigation = document.getElementById("navigation");
var navToggle = document.getElementsByClassName("navToggle");
Array.prototype.forEach.call(navToggle, function(nav) {
  nav.addEventListener("click", function(event) {
    navigation.classList.toggle("active");
  });
});

// Show Hide Header
let scrollPos = 0;
function checkPosition() {
  const windowY = window.scrollY;
  if (windowY < scrollPos) {
    // Scrolling UP
    navigation.classList.add("mt-0");
    navigation.classList.remove("mt-neg");
  } else {
    // Scrolling DOWN
    navigation.classList.add("mt-neg");
    navigation.classList.remove("mt-0");
  }
  scrollPos = windowY;
}
window.addEventListener("scroll", checkPosition);

// Fade on Scroll
window.onscroll = function() {
  var target = document.getElementById("project-header");
  var height = window.innerHeight;
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  // Change this if you want it to fade faster
  height = height / 1;
  target.style.backgroundImage = (height - scrollTop) / height;
};


import "./css/main.css";
