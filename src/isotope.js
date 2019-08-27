// external js: isotope.pkgd.js
import Isotope from "isotope-layout";

// init Isotope
var grid = document.querySelector(".grid");
var iso = new Isotope(grid, {
  itemSelector: ".filter-item",
});

// store filter for each group
var filters = [];

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
  iso.arrange({filter: filters.join(",")});
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

// Hash Change Filter
// function onHashchange() {
//   var hashFilter = getHashFilter();
//   if (!hashFilter && iso) {
//     return;
//   }
//   if (!iso) {
//     // init Isotope for first time
//     iso = new Isotope(grid, {
//       itemSelector: ".element-item",
//       layoutMode: "fitRows",
//       filter: hashFilter || "",
//     });
//   } else {
//     // just filter with hash
//     iso.arrange({
//       filter: hashFilter
//     });
//   }

//   // set selected class on button
//   if (hashFilter) {
//     var checkedButton  = filterButtonGroup.querySelector(".is-checked");
//     if (checkedButton) {
//       checkedButton.classList.remove("is-checked");
//     }
//     filterButtonGroup.querySelector('[data-filter="' + hashFilter + '"]').classList.add("is-checked");
//   }
// }

// window.addEventListener("hashchange", onHashchange);
// // trigger event handler to init Isotope
// onHashchange();


// // bind filter button click
// filterButtonGroup.addEventListener("click", function(event) {
//   var filterAttr = event.target.getAttribute("data-filter");
//   if (!filterAttr) {
//     return;
//   }
//   location.hash = "filter=" + encodeURIComponent(filterAttr);
// });

// function getHashFilter() {
//   // get filter=filterName
//   var matches = location.hash.match(/filter=([^&]+)/i);
//   var hashFilter = matches && matches[1];
//   return hashFilter && decodeURIComponent(hashFilter);
// }
