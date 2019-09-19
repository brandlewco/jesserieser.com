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

  // hash style
  var hashSplit = hashFilter.split(".");
  var hashClean = hashSplit.slice(1);
  hashClean.forEach(function(element) {
    document.getElementById(element).classList.add("is-checked");
  });
}
window.addEventListener("hashchange", onHashchange);
if (window.location.hash) {
  onHashchange();
};
// onHashchange();


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
  if (filter === ".personal") {
    removeFilter(".commissionedstock");
    addFilter(".personal");
    document.getElementById("personal").classList.add("is-checked");
    document.getElementById("commissionedstock").classList.remove("is-checked");
  }
  if (filter === ".commissionedstock") {
    removeFilter(".personal");
    addFilter(".commissionedstock");
    document.getElementById("commissionedstock").classList.add("is-checked");
    document.getElementById("personal").classList.remove("is-checked");
  }
  // filter isotope
  // group filters together, inclusive
  iso.arrange({filter: filters.join("")});
  // LOG CHANGE
  // console.log("onClick", filters);

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

const filterItems = document.querySelectorAll(".filter-item");
filterItems.forEach((items) => {
  const filters = items.dataset.filter.split(",");
  const filtersTheme = items.dataset.theme;
  items.addEventListener("mouseover", () => {
    filters.forEach(function(element) {
      document.getElementById(element).style.color = filtersTheme;
      document.getElementById(element).classList.add("font-bold");
    });
  });
  items.addEventListener("mouseout", () => {
    filters.forEach(function(element) {
      document.getElementById(element).style.color = "#000";
      document.getElementById(element).classList.remove("font-bold");
    });
  });
});

