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
if (window.location.hash.length > 9) {
  window.addEventListener("hashchange", onHashchange);
  onHashchange();
}

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
  const filterPersonal = document.getElementById("personal");
  const filterComissioned = document.getElementById("commissionedstock");
  if (filter === ".personal") {
    removeFilter(".commissionedstock");
    addFilter(".personal");
    filterPersonal.classList.add("is-checked");
    filterComissioned.classList.remove("is-checked");
  }
  if (filter === ".commissionedstock") {
    removeFilter(".personal");
    addFilter(".commissionedstock");
    filterComissioned.classList.add("is-checked");
    filterPersonal.classList.remove("is-checked");
  }
  // filterComissioned.addEventListener("click", function() {
  //   if (filterComissioned.classList.contains("is-checked")) {
  //     removeFilter(".commissionedstock");
  //     filterComissioned.classList.remove("is-checked");
  //   }
  // });


  // filter isotope
  // group filters together, inclusive
  iso.arrange({filter: filters.join("")});

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

function removeHash() {
  history.pushState("", document.title, window.location.pathname + window.location.search);
}

function clearActiveClass() {
  const filterClearClass = Array.from(document.querySelectorAll(".button.is-checked"));
  for (const element of filterClearClass) {
    element.classList.remove("is-checked");
  }
}

function resetFilters() {
  filters = {};
  iso.arrange({
    filter: "*"
  });
}

// const filtersClear = document.getElementById("all");
// filtersClear.addEventListener("click", function() {
//   removeHash();
//   clearActiveClass();
//   resetFilters();
// });

const filterItems = document.querySelectorAll(".filter-item");
filterItems.forEach((items) => {
  const filters = items.dataset.filter.split(",");
  // const filtersTheme = items.dataset.theme;
  items.addEventListener("mouseenter", () => {
    filters.forEach(function(element) {
      var filterActive = document.getElementById(element);
      if (filterActive) {
        // filterActive.style.color = filtersTheme;
        filterActive.classList.add("font-bold");
      }
    });
  });
  items.addEventListener("mouseleave", () => {
    filters.forEach(function(element) {
      var filterActive = document.getElementById(element);
      if (filterActive) {
        // filterActive.style.color = null;
        filterActive.classList.remove("font-bold");
      }
    });
  });
});

const catButtons = document.querySelectorAll("#categories .button");
catButtons.forEach((catFilter) => {
  catFilter.addEventListener("mouseenter", () => {
    var catDataFilter = catFilter.getAttribute("data-filter");
    var splitFilter = catDataFilter.replace(/^\./, "");
    const filterItems = document.querySelectorAll(".filter-item");
    filterItems.forEach(function(element) {
      if (element.classList.contains(splitFilter)) {
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
    });
  });

  catFilter.addEventListener("mouseleave", () => {
    const filterItems = document.querySelectorAll(".filter-item");
    filterItems.forEach(function(element) {
      element.classList.add("active");
    });
  });
});
// console.log(catButtons);


const catToggle = document.getElementById("catToggle");
const categories = document.getElementById("categories");
catToggle.addEventListener("click", function() {
  if (catToggle.classList.contains("is-checked")) {
    categories.classList.add("opened");
  } else {
    categories.classList.remove("opened");
  }
});
