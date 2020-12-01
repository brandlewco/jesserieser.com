// external js: isotope.pkgd.js
import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";

// init Isotope
var grid = document.querySelector(".filter-container");
var iso;

const navigation = document.getElementById("navigation");
const navigationHeight = navigation.clientHeight;
const filterWrapper = document.getElementById("filter-container");
const filterContainer = document.getElementById("filters");
const filterContainerHeight = filterContainer.clientHeight;
const filter = document.getElementById("filter");
const filterLoading = document.getElementById("filter-loading");
const gumroadContainer = document.querySelector(".gumroad-scroll-container");

function filterCalc() {
  filterWrapper.style.top = navigationHeight + "px";
  filterWrapper.style.opacity = 1;
}

filterCalc();


imagesLoaded(grid, function() {
  setTimeout(function() {
    filter.style.opacity = 1;
    filterLoading.style.opacity = 0;

    let scrollPos = 0;
    window.onscroll = function() {
      // document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
      var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      const windowY = window.scrollY;
      if (window.scrollY === 0) {
        navigation.style.transform = "translate3d(0, 0, 0)";
        filterContainer.style.transform = "translate3d(0, 0, 0)";
      }
      else if (scrollTop < scrollPos && window.scrollY > 1) {
        navigation.style.transform = "translate3d(0, 0, 0)";
        filterContainer.style.transform = "translate3d(0," + navigationHeight + "px, 0)";
      } else if (window.scrollY > 1) {
        navigation.style.transform = "translate3d(0, -" + navigationHeight + "px, 0)";
        filterContainer.style.transform = "translate3d(0, 0, 0)";
      }
      scrollPos = windowY;
    };

    var iso = new Isotope(grid, {
      itemSelector: ".filter-item",
      // stamp: ".stamp",
      layoutMode: "fitRows",
      fitRows: {
        gutter: 0,
      },
      hiddenStyle: {
        opacity: 0,
      },
      visibleStyle: {
        opacity: 1,
      },
    });
    // store filter for each group
    var filters = [];
    function onHashchange() {
      var hashFilter = getHashFilter();
      iso.arrange({
        filter: hashFilter,
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

      const filterAll = document.getElementById("all");
      const filterAllDivide = document.getElementById("all-divide");
      const filterPersonal = document.getElementById("personal");
      const filterComissioned = document.getElementById("commissionedstock");
      if (filter === ".personal") {
        removeFilter(".commissionedstock");
        removeFilter(".all");
        addFilter(".personal");
        filterAll.style.opacity = 1;
        filterAllDivide.style.opacity = 1;
        filterPersonal.classList.add("is-checked");
        filterComissioned.classList.remove("is-checked");
        filterAll.classList.remove("is-checked");
      }
      if (filter === ".commissionedstock") {
        removeFilter(".personal");
        removeFilter(".all");
        addFilter(".commissionedstock");
        filterAll.style.opacity = 1;
        filterAllDivide.style.opacity = 1;
        filterComissioned.classList.add("is-checked");
        filterPersonal.classList.remove("is-checked");
        filterAll.classList.remove("is-checked");
      }
      if (filter === ".all") {
        removeFilter(".personal");
        removeFilter(".commissionedstock");
        addFilter(".all");
        filterAll.style.opacity = 0;
        filterAllDivide.style.opacity = 0;
        filterAll.classList.add("is-checked");
        filterComissioned.classList.remove("is-checked");
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
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }

    function clearActiveClass() {
      const filterClearClass = Array.from(
        document.querySelectorAll(".button.is-checked")
      );
      for (const element of filterClearClass) {
        element.classList.remove("is-checked");
      }
    }

    function resetFilters() {
      filters = {};
      iso.arrange({
        filter: "*",
      });
    }

    // const filtersClear = document.getElementById("all");
    // filtersClear.addEventListener("click", function() {
    //   removeHash();
    //   clearActiveClass();
    //   resetFilters();
    // });

    const collectionPreview = document.querySelectorAll(".collection-preview");
    collectionPreview.forEach((preview) => {
      var slides = preview.getElementsByTagName("img");
      var current = 0;
      var fader;
      for (var i = 0; i < slides.length; i++) {
        slides[0].style.removeProperty("opacity");
      }

      function faderTimer() {
        for (var i = 0; i < slides.length; i++) {
          slides[i].style.opacity = 0;
          slides[i].style.transitionDelay = "0.25s";
        }
        current = current != slides.length - 1 ? current + 1 : 0;
        slides[current].style.opacity = 1;
        fader = setTimeout(faderTimer, 1000);
      }

      // start a crossfade animation by looping the images
      function crossfade() {
        faderTimer();
      }

      // clear timeout and reset styles
      function stopCrossfade() {
        clearTimeout(fader);
        current = 0;
        slides[0].style.removeProperty("opacity");
        slides[1].style.removeProperty("opacity");
        slides[2].style.removeProperty("opacity");
        slides[3].style.removeProperty("opacity");
      }

      preview.addEventListener("mouseenter", () => {
        // crossfade
        crossfade();
      });
      preview.addEventListener("mouseleave", () => {
        stopCrossfade();
      });

    });

    const filterItems = document.querySelectorAll(".filter-item");
    filterItems.forEach((items) => {
      const filters = items.dataset.filter.split(",");
      const filtersTheme = items.dataset.theme;
      var current = 0;
      // var slides = items.getElementsByTagName("img");
      var fader;

      // unset after initial load
      // for (var i = 0; i < slides.length; i++) {
      //   slides[0].style.removeProperty("opacity");
      // }

      // function faderTimer() {
      //   for (var i = 0; i < slides.length; i++) {
      //     slides[i].style.opacity = 0;
      //     slides[i].style.transitionDelay = "0.25s";
      //   }
      //   current = current != slides.length - 1 ? current + 1 : 0;
      //   slides[current].style.opacity = 1;
      //   fader = setTimeout(faderTimer, 1000);
      // }

      // // start a crossfade animation by looping the images
      // function crossfade() {
      //   faderTimer();
      // }

      // // clear timeout and reset styles
      // function stopCrossfade() {
      //   clearTimeout(fader);
      //   current = 0;
      //   slides[0].style.removeProperty("opacity");
      //   slides[1].style.removeProperty("opacity");
      //   slides[2].style.removeProperty("opacity");
      //   slides[3].style.removeProperty("opacity");
      // }

      items.addEventListener("mouseenter", () => {
        // crossfade
        // crossfade();
        items.classList.add("hover-animate");
        filters.forEach(function(element) {
          var filterActive = document.getElementById(element);
          if (filterActive) {
            filterActive.style.color = filtersTheme;
            // filterActive.style.color = "#000";
          }
        });
      });
      items.addEventListener("mouseleave", () => {
        // stopCrossfade();
        items.classList.remove("hover-animate");
        // void items.offsetWidth; // trigger a DOM reflow
        filters.forEach(function(element) {
          var filterActive = document.getElementById(element);
          if (filterActive) {
            // filterActive.style.color = null;
            filterActive.style.color = null;
          }
        });
      });
    });

    const catButtons = document.querySelectorAll(".button");
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

    const windowHeight = window.innerHeight;
    console.log(windowHeight);
    if (windowHeight < 801) {
      catToggle.classList.remove("active");
      catToggle.classList.add("is-checked");
      categories.classList.remove("opened");
    }


    const filterError = document.getElementById("filter-error");
    const filterArchive = document.getElementById("filter-archive");

    iso.on("layoutComplete", function(laidOutItems) {
      // console.log(laidOutItems.length);
      if (laidOutItems.length === 1) {
        filterError.classList.add("active");
        filterArchive.style.opacity = 0;
      } else {
        filterError.classList.remove("active");
        filterArchive.style.opacity = 1;
      }
    });
  }, 500);
});
