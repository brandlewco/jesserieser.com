import Swup from "swup";
import SwupGaPlugin from "@swup/ga-plugin";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScriptsPlugin from "@swup/scripts-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
import SwupScrollPlugin from "@swup/scroll-plugin";
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import Midday from "midday.js";
import Shuffle from "shufflejs";

// Sorter
var Sort = function (element) {
  this.cats = Array.from(document.querySelectorAll('.js-cats input'));
  this.filters = Array.from(document.querySelectorAll('.js-filters button'));

  this.shuffle = new Shuffle(element, {
    easing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
    sizer: '.the-sizer',
  });

  this.filters = {
    cats: [],
    filters: [],
  };

  this._bindEventListeners();
};

/**
 * Bind event listeners for when the filters change.
 */
Sort.prototype._bindEventListeners = function () {
  this._onShapeChange = this._handleShapeChange.bind(this);
  this._onColorChange = this._handleColorChange.bind(this);

  this.cats.forEach(function (input) {
    input.addEventListener('change', this._onShapeChange);
  }, this);

  this.filters.forEach(function (button) {
    button.addEventListener('click', this._onColorChange);
  }, this);
};

/**
 * Get the values of each checked input.
 * 
 */
Sort.prototype._getCurrentShapeFilters = function () {
  return this.cats.filter(function (input) {
    return input.checked;
  }).map(function (input) {
    return input.value;
  });
};

/**
 * Get the values of each active button.
 * 
 */
Sort.prototype._getCurrentColorFilters = function () {
  return this.filters.filter(function (button) {
    return button.classList.contains('active');
  }).map(function (button) {
    return button.getAttribute('data-value');
  });
};

/**
 * A cat input check state changed, update the current filters and filte.r
 */
Sort.prototype._handleShapeChange = function () {
  this.filters.cats = this._getCurrentShapeFilters();
  this.filter();
};

/**
 * A filter button was clicked. Update filters and display.
 *
 */
Sort.prototype._handleColorChange = function (evt) {
  var button = evt.currentTarget;

  // // Treat these buttons like radio buttons where only 1 can be selected.
  // if (button.classList.contains('active')) {
  //   button.classList.remove('active');
  // } else {
  //   this.filters.forEach(function (btn) {
  //     btn.classList.remove('active');
  //   });

  //   button.classList.add('active');
  // }

  this.filters.filters = this._getCurrentColorFilters();
  this.filter();
};

/**
 * Filter shuffle based on the current state of filters.
 */
Sort.prototype.filter = function () {
  if (this.hasActiveFilters()) {
    this.shuffle.filter(this.itemPassesFilters.bind(this));
  } else {
    this.shuffle.filter(Shuffle.ALL_ITEMS);
  }
};

/**
 * If any of the arrays in the filters property have a length of more than zero,
 * that means there is an active filter.
 * 
 */
Sort.prototype.hasActiveFilters = function () {
  return Object.keys(this.filters).some(function (key) {
    return this.filters[key].length > 0;
  }, this);
};

/**
 * Determine whether an element passes the current filters.
 *
 */
Sort.prototype.itemPassesFilters = function (element) {
  var cats = this.filters.cats;
  var filters = this.filters.filters;
  var cat = element.getAttribute('data-cat');
  var filter = element.getAttribute('data-filter');

  // If there are active cat filters and this cat is not in that array.
  if (cats.length > 0 && !cats.includes(cat)) {
    return false;
  }

  // If there are active filter filters and this filter is not in that array.
  if (filters.length > 0 && !filters.includes(filter)) {
    return false;
  }

  return true;
};


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

  const sort = new Sort(document.getElementById("grid"));
}
init();

import "./css/main.css";
