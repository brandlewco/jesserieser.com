// external js: isotope.pkgd.js
import Isotope from "isotope-layout";

// init Isotope
var grid = document.querySelector(".filtr-container");
var iso = new Isotope(grid, {
  itemSelector: ".filter-item",
  layoutMode: "fitRows",
  hiddenStyle: {
    opacity: 0
  },
  visibleStyle: {
    opacity: 1
  }
});

// store filter for each group
var filters = [];
function onHashchange() {
  var hashFilter = getHashFilter();
  iso.arrange({
    filter: hashFilter
  });
  console.log("onHashChange", hashFilter);
}
window.addEventListener("hashchange", onHashchange);
onHashchange();


// change is-checked class on buttons
var filtersElem = document.querySelector(".filters");

filtersElem.addEventListener("click", function(event) {
  // only buttons
  var target = event.target;
  if (target.nodeName != "BUTTON") {
    return;
  }
  target.classList.toggle("is-checked");
  var isChecked = target.classList.contains("is-checked");
  var filter = target.getAttribute("data-filter");
  if (isChecked) {
    addFilter(filter);
  } else {
    removeFilter(filter);
  }
  // filter isotope
  // group filters together, inclusive
  iso.arrange({filter: filters.join("")});
  // LOG CHANGE
  console.log("onClick", filters);

  // HASH
  if (!filter) {
    return;
  }
  location.hash = "filter=" + encodeURIComponent(filters.join(""));
});


function addFilter(filter) {
  if (filters.indexOf(filter) == -1) {
    filters.push(filter);
  }
}

function removeFilter(filter) {
  var index = filters.indexOf(filter);
  if (index != -1) {
    filters.splice(index, 1);
  }
}

function getHashFilter() {
  // get filter=filterName
  var matches = location.hash.match(/filter=([^&]+)/i);
  var hashFilter = matches && matches[1];
  return hashFilter && decodeURIComponent(hashFilter);
}
