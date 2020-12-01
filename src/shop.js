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
    // store filter for each group

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
