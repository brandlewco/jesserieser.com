// import Swup from "swup";
// import SwupScrollPlugin from "@swup/scroll-plugin";
// import SwupGaPlugin from "@swup/ga-plugin";
// import SwupBodyClassPlugin from "@swup/body-class-plugin";
// import SwupScriptsPlugin from "@swup/scripts-plugin";
// import SwupPreloadPlugin from "@swup/preload-plugin";
import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import * as PhotoSwipe from "photoswipe";
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import Midday from "midday.js";
import smoothscroll from "smoothscroll-polyfill";
import sal from "sal.js";
import Rellax from "rellax";

// Page Loader (SWUP)
// const options = {
//   containers: ["#content"],
//   plugins: [
//     new SwupScrollPlugin({
//       animateScroll: true,
//       scrollFriction: 0.4,
//       scrollAcceleration: 0.04,
//       doScrollingRightAway: false
//     }),
//     new SwupGaPlugin(),
//     new SwupPreloadPlugin(),
//     new SwupBodyClassPlugin(),
//     new SwupScriptsPlugin({
//       head: true,
//       body: true
//     })
//   ],
//   animateHistoryBrowsing: false,
//   preload: true,
//   cache: true,
//   linkSelector: 'a[href^="' + window.location.origin + '"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
//   skipPopStateHandling: function(event) {
//     if (event.state && event.state.source === "swup") {
//       return false;
//     }
//     return true;
//   }
// };
// const swup = new Swup(options);

// swup.on("contentReplaced", init);
function init() {
  // MIDDAY
  const middayNav = new Midday(document.getElementById("navigation"), {
    headerClass: "hue-header",
    innerClass: "hue-header-inner",
    sectionSelector: "hue"
  });

  // Sal Animations
  var scrollAnimations = sal({
    once: false,
    threshold: 0.4,
  });

  // Parellax
  var rellax = new Rellax(".rellax", {
    speed: 4,
    center: true,
    relativeToWrapper: true,
    wrapper: ".rellax-wrapper",
    round: true,
    vertical: true,
    horizontal: false
  });

  if (document.querySelector(".rellax")) {
    rellax.refresh();

    window.addEventListener("scroll", function() {
      rellax.refresh();
    });
  }
  // PhotoSwipe
  if (document.querySelector("#gallery")) {
    var initPhotoSwipeFromDOM = function(gallerySelector) {
      // parse slide data (url, title, size ...) from DOM elements
      // (children of gallerySelector)
      var parseThumbnailElements = function(el) {
        var thumbElements = Array.prototype.slice.call(document.querySelectorAll(".figure")),
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          imgEl,
          item;

        for (var i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i]; // <figure> element

          // include only element nodes
          if (figureEl.nodeType !== 1) {
            continue;
          }

          linkEl = figureEl.children[0]; // <a> element
          imgEl = linkEl.children[0]; // <img>

          size = linkEl.getAttribute("data-size");
          size = size && size.split("x");

          // create slide object
          item = {
            src: linkEl.getAttribute("href"),
            w: imgEl.naturalWidth,
            h: imgEl.naturalHeight
          };


          if (figureEl.children.length > 1) {
            // <figcaption> content
            item.title = figureEl.children[1].innerHTML;
          }

          if (linkEl.children.length > 0) {
            // <img> thumbnail element, retrieving thumbnail url
            item.msrc = linkEl.children[0].getAttribute("src");
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }

        return items;
      };

      // find nearest parent element
      var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
      };

      // triggers when user clicks on thumbnail
      var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === "FIGURE");
        });

        if (!clickedListItem) {
          return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = document.querySelectorAll(".my-gallery")[0], childNodes = Array.prototype.slice.call(document.querySelectorAll(".figure")),
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

        for (var i = 0; i < numChildNodes; i++) {
          if (childNodes[i].nodeType !== 1) {
            continue;
          }

          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }


        if (index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
          params = {};

        if (hash.length < 5) {
          return params;
        }

        var vars = hash.split("&");
        for (var i = 0; i < vars.length; i++) {
          if (!vars[i]) {
            continue;
          }
          var pair = vars[i].split("=");
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }

        if (params.gid) {
          params.gid = parseInt(params.gid, 10);
        }

        return params;
      };

      var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll(".pswp")[0],
          gallery,
          options,
          items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute("data-pswp-uid"),
          history: false,
          bgOpacity: 0.5,
          closeOnScroll: false,
          closeOnVerticalDrag: false,
          preload: [4, 4],
          loadingIndicatorDelay: 100,
          getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName("img")[0], // find thumbnail
              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect();

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          },
          fullscreenEl: false,
          zoomEl: false,
          shareEl: false,
          indexIndicatorSep: " of ",

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (var j = 0; j < items.length; j++) {
              if (items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.listen("imageLoadComplete", function(index, item) {
          if (item.h < 1 || item.w < 1) {
            const img = new Image();
            img.onload = () => {
              item.w = img.width;
              item.h = img.height;
              gallery.invalidateCurrItems();
              gallery.updateSize(true);
            };
            img.src = item.src;
          }
        });
        gallery.listen("afterChange", function() {
          Element.prototype.documentOffsetTop = function() {
            return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
          };
          var topPos = document.getElementById(gallery.currItem.el.id).documentOffsetTop() - (window.innerHeight / 2);
          window.scrollTo({
            top: topPos,
            left: 0,
            behavior: "smooth"
          });
          // document.getElementById(gallery.currItem.el.id).scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
        });
        // gallery.listen("close", function() {
        //   window.scrollPositions = window.scrollY;
        // });
        gallery.init();
      };

      // loop through all gallery elements and bind events
      var galleryElements = document.querySelectorAll(gallerySelector);

      for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute("data-pswp-uid", i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true);
      }
    };
    // execute above function
    initPhotoSwipeFromDOM(".my-gallery");
  }
}
init();

// const scrollPositions = [];
// let scrollToSavedPosition = null;

// swup.on("clickLink", () => {
//   scrollPositions[window.location.href] = window.scrollY;
// });

// swup.on("popState", () => {
//   scrollToSavedPosition = true;
// });

// swup.on("contentReplaced", () => {
//   if (scrollToSavedPosition) {
//     window.scrollTo(0, window.scrollPositions);
//   }
//   scrollToSavedPosition = false;
// });

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


function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}


// Scroll Animations
window.onscroll = function() {
  checkPosition();
  var headerOverlay = document.getElementById("header-overlay");
  var pageTitle = document.getElementById("page-title");
  var collectionTitle = document.querySelectorAll("figure.sal-animate figcaption");
  var height = window.innerHeight;
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  if (pageTitle) {
    pageTitle.style.transform = "translate3d(0, -" + value_limit((((90 - ((scrollTop * 1.2) / height) * 100) / 2)), 0, 45) + "vh, 0)";
  }
  if (headerOverlay) {
    headerOverlay.style.opacity = value_limit((scrollTop / (height * 0.5)), 0, 1);
  }
  // collectionTitle.forEach((title) => {
  //   title.style.transform = "translate3d(0, -" + ((scrollTop / height) / height) + "vh, 0)";
  // });
};

// Show Hide Header
let scrollPos = 0;
function checkPosition() {
  var filters = document.getElementById("filters");
  const windowY = window.scrollY;
  if (document.querySelector("#project-header")) {
    if (windowY > (window.innerHeight * 0.75)) {
      if (windowY < scrollPos) {
        navigation.classList.add("mt-0");
        navigation.classList.remove("mt-neg");
      } else {
        navigation.classList.add("mt-neg");
        navigation.classList.remove("mt-0");
      }
    }
  } else {
    if (windowY < scrollPos) {
      navigation.classList.add("mt-0");
      navigation.classList.remove("mt-neg");
      filters.classList.add("mt-0");
      filters.classList.remove("mt-neg");
    } else {
      navigation.classList.add("mt-neg");
      navigation.classList.remove("mt-0");
      filters.classList.add("mt-neg");
      filters.classList.remove("mt-0");
    }
  }
  scrollPos = windowY;
}

const anchorlinks = document.querySelectorAll('a[href^="#"]');

for (const item of anchorlinks) { // relitere
  item.addEventListener("click", (e) => {
    const hashval = item.getAttribute("href");
    const target = document.querySelector(hashval);
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    history.pushState(null, null, hashval);
    e.preventDefault();
  });
}

window.__forceSmoothScrollPolyfill__ = true;
smoothscroll.polyfill();

import "./css/main.css";
