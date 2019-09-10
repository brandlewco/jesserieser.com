import Swup from "swup";
import SwupScrollPlugin from "@swup/scroll-plugin";
import SwupGaPlugin from "@swup/ga-plugin";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScriptsPlugin from "@swup/scripts-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import Midday from "midday.js";
import smoothscroll from "smoothscroll-polyfill";
import sal from "sal.js";


sal();
// Page Loader (SWUP)
const options = {
  containers: ["#content"],
  plugins: [
    new SwupScrollPlugin({
      animateScroll: true,
      scrollFriction: 0.3,
      scrollAcceleration: 0.04,
      doScrollingRightAway: false
    }),
    new SwupGaPlugin(),
    new SwupPreloadPlugin(),
    new SwupBodyClassPlugin(),
    new SwupScriptsPlugin({
      head: true,
      body: true
    })
  ],
  animateHistoryBrowsing: false,
  preload: true,
  cache: true,
  linkSelector: 'a[href^="' + window.location.origin + '"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
  skipPopStateHandling: function(event) {
    if (event.state && event.state.source === "swup") {
      return false;
    }
    if (event.state && event.state.source === "photoSwipe") {
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

const scrollPositions = [];
let scrollToSavedPosition = null;

swup.on("clickLink", () => {
  scrollPositions[window.location.href] = window.scrollY;
});

swup.on("popState", () => {
  scrollToSavedPosition = true;
});

swup.on("animationInStart", () => {
  if (scrollToSavedPosition)
    window.scrollTo(0, scrollPositions[window.location.href]);
  scrollToSavedPosition = false;
});

// Button Toggle
var buttons = document.getElementsByClassName("toggle");
Array.prototype.forEach.call(buttons, function(button) {
  button.addEventListener("click", function(event) {
    button.classList.toggle("active");
  });
});

// Navigation Toggle
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

function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}

// Scroll Animations
window.onscroll = function() {
  var headerOverlay = document.getElementById("header-overlay");
  var pageTitle = document.getElementById("page-title");
  var height = window.innerHeight;
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  // if (pageTitle) {
  //   pageTitle.style.transform = "translate3d(0, -" + value_limit((((90 - ((scrollTop * 1.2) / height) * 100) / 2)), 0, 45) + "vh, 0)";
  // }
  if (headerOverlay) {
    headerOverlay.style.opacity = value_limit((scrollTop / (height * 0.5)), 0, 1);
  }
};

// Highlight Class Switcher
var highlight = document.getElementsByClassName("highlight");
for (var i = 0; i < highlight.length; i++) {
  highlight[i].addEventListener("mouseover", highlightThem);
  highlight[i].addEventListener("mouseout", DontHighlightThem);
}
function highlightThem() {
  for (var i = 0; i < highlight.length; i++) {
    highlight[i].classList.add("lit");
  }
}
function DontHighlightThem() {
  for (var i = 0; i < highlight.length; i++) {
    highlight[i].classList.remove("lit");
  }
}

window.__forceSmoothScrollPolyfill__ = true;
smoothscroll.polyfill();

import "./css/main.css";
