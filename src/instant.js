// import Swup from "swup";
// import SwupScrollPlugin from "@swup/scroll-plugin";
// import SwupGaPlugin from "@swup/ga-plugin";
// import SwupBodyClassPlugin from "@swup/body-class-plugin";
// import SwupScriptsPlugin from "@swup/scripts-plugin";
// import SwupPreloadPlugin from "@swup/preload-plugin";
import lazySizes from "lazysizes";
// import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
// import "lazysizes/plugins/bgset/ls.bgset";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import * as PhotoSwipe from "photoswipe";
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import Midday from "midday.js";
import smoothscroll from "smoothscroll-polyfill";
import sal from "sal.js";
import Rellax from "rellax";

lazySizes.cfg.expand = "1000";

// // Page Loader (SWUP)
// const options = {
//   containers: ["#navigation", "#content"],
//   plugins: [
//     new SwupScrollPlugin({
//       animateScroll: false,
//       scrollFriction: 0.4,
//       scrollAcceleration: 0.04,
//       doScrollingRightAway: false
//     }),
//     new SwupGaPlugin(),
//     new SwupPreloadPlugin(),
//     new SwupBodyClassPlugin(),
//     new SwupScriptsPlugin({
//       head: false,
//       body: false
//     })
//   ],
//   animateHistoryBrowsing: true,
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

// swup.on("animationInDone", function() {

// });

// swup.on("contentReplaced", init);

function init() {
// MIDDAY
const middayNav = new Midday(document.getElementById("navigation"), {
  headerClass: "hue-header",
  innerClass: "hue-header-inner",
  sectionSelector: "hue"
});

// middayNav.refresh();

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
  const figureIMG = document.querySelectorAll(".figure img");
  var initPhotoSwipeFromDOM = function(gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
      var thumbElements = Array.prototype.slice.call(document.querySelectorAll(".figure")),
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        // size,
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

        // size = linkEl.getAttribute("data-size").split("x");

        // create slide object
        item = {
          src: linkEl.getAttribute("href"),
          w: imgEl.naturalWidth,
          h: imgEl.naturalHeight,
          pid: linkEl.getAttribute("pid")
        };


        if (figureEl.children.length > 1) {
          // <figcaption> content
          item.title = figureEl.children[1].innerHTML;
        }

        if (linkEl.children.length > 0) {
          // <img> thumbnail element, retrieving thumbnail url
          item.msrc = item.src;
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
      navigation.style.opacity = 0;
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
        bgOpacity: 0.40,
        closeOnScroll: false,
        closeOnVerticalDrag: false,
        preload: [2, 2],
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
        indexIndicatorSep: " / ",

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
      // gallery.listen("imageLoadComplete", function(index, item) {
      //   if (item.h < 1 || item.w < 1) {
      //     const img = new Image();
      //     img.onload = () => {
      //       item.w = img.width;
      //       item.h = img.height;
      //       gallery.invalidateCurrItems();
      //       gallery.updateSize(true);
      //     };
      //     img.src = item.src;
      //   }
      // });
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
      gallery.listen("close", function() {
        var topPos = document.getElementById(gallery.currItem.el.id).documentOffsetTop() - (window.innerHeight / 2);
        window.scrollTo({
          top: topPos,
          left: 0,
          behavior: "smooth"
        });
        navigation.style.opacity = 1;
      });
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

// smooth scroll anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

function removeActive() {
  const navigation = document.getElementById("navigation");
  navigation.classList.remove("active");
}
removeActive();

// Modal
const modalTriggers = document.querySelectorAll(".popup-trigger");
const bodyPopup = document.querySelector(".body-popup");

modalTriggers.forEach((trigger) => {
  // const navigation = document.getElementById("navigation");
  const {popupTrigger} = trigger.dataset;
  const popupModal = document.querySelector(`[data-popup-modal="${popupTrigger}"]`);
  trigger.addEventListener("click", () => {
    navigation.classList.remove("active");
    navigation.style.opacity = 0;
    navigation.style.display = "none";
    console.log("modal open");
    scrollLock();
    // document.body.style.overflowY = "hidden";
    popupModal.classList.add("is--visible");
    bodyPopup.classList.add("is-poped-out");
    popupModal.addEventListener("scroll", function() {
      rellax.refresh();
    });
  });
  popupModal.querySelector(".popup-modal__close").addEventListener("click", () => {
    scrollUnlock();
    navigation.style.opacity = 1;
    navigation.style.display = "block";
    console.log("modal close");
    // document.body.style.overflowY = "auto";
    popupModal.classList.remove("is--visible");
    bodyPopup.classList.remove("is-poped-out");
  });

  bodyPopup.addEventListener("click", () => {
    scrollUnlock();
    navigation.style.opacity = 1;
    navigation.style.display = "block";
    console.log("modal close");

    // document.body.style.overflowY = "auto";
    popupModal.classList.remove("is--visible");
    bodyPopup.classList.remove("is-poped-out");
  });
});

// Inner Modal
const innerModalTriggers = document.querySelectorAll(".inner-popup-trigger");

innerModalTriggers.forEach((trigger) => {
  const {innerPopupTrigger} = trigger.dataset;
  const innerPopupModal = document.querySelector(`[data-inner-popup-modal="${innerPopupTrigger}"]`);
  trigger.addEventListener("click", () => {
    innerPopupModal.classList.add("is--visible");
  });
  innerPopupModal.querySelector(".popup-modal__close").addEventListener("click", () => {
    innerPopupModal.classList.remove("is--visible");
  });
});

// Button Toggle
var buttons = document.getElementsByClassName("toggle");
Array.prototype.forEach.call(buttons, function(button) {
  button.addEventListener("click", function(event) {
    button.classList.toggle("active");
  });
});

// Navigation Toggle
const navigation = document.getElementById("navigation");
var navToggle = document.getElementsByClassName("navToggle");
Array.prototype.forEach.call(navToggle, function(nav) {
  nav.addEventListener("click", function(event) {
    nav.classList.toggle("toggle-active");
    navigation.classList.toggle("active");
    // // create locking event
    // scrollLock();
    // // create unlocking event
    // const navToggleActive = document.getElementsByClassName("toggle-active");
    // Array.prototype.forEach.call(navToggleActive, function(toggledActive) {
    //   toggledActive.addEventListener("click", function(event) {
    //     scrollUnlock();
    //   });
    // });
  });
});


// USE FOR BLOCK HOVER
const figureAll = document.querySelectorAll(".figure");
figureAll.forEach((figureHovered) => {
  figureHovered.addEventListener("mouseenter", () => {
    figureAll.forEach(function(element) {
      element.classList.add("dimmed");
    });
  });
  figureHovered.addEventListener("mouseleave", () => {
    figureAll.forEach(function(element) {
      element.classList.remove("dimmed");
    });
  });
});

// SCROLL FUNCTION
const scrollLock = () => {
  // document.getElementById("dialog").classList.add("show");
  const body = document.body;
  body.style.overflowY = "hidden";
  // body.style.position = "fixed";
  // console.log(scrollY);
  // body.style.top = window.scrollY;
};
const scrollUnlock = () => {
  const body = document.body;
  body.style.overflowY = "scroll";
  // body.style.position = "";
  // const body = document.body;
  // body.style.top = window.scrollY;
  // window.scrollTo(0, parseInt(scrollY || "0") * -1);
  // document.getElementById("dialog").classList.remove("show");
};
function value_limit(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}

const projectHeader = document.getElementById("project-header");
const content = document.getElementById("content");
const filterContainer = document.getElementById("filter-container");
const headerPointer = document.getElementById("header-pointer");
// Scroll Animations
let scrollPos = 0;
window.onscroll = function() {
  document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
  // var headerOverlay = document.getElementById("header-overlay");
  // var featureOverlay = document.getElementById("feature-overlay");
  var pageTitle = document.getElementById("page-title");
  var headerImage = document.querySelector("#project-header > img");
  var height = window.innerHeight;
  var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  if (headerImage) {
    headerImage.style.opacity = value_limit(1 - (scrollTop / (height * 0.4)), 0, 1).toFixed(3);
  }
  // if (headerOverlay) {
  //   headerOverlay.style.opacity = value_limit((scrollTop / (height * 0.4)), 0, 1).toFixed(2);
  // }
  // if (featureOverlay) {
  //   featureOverlay.style.opacity = value_limit((scrollTop / (height * 0.9)), 0, 1).toFixed(2);
  // }
  const windowY = window.scrollY;
  if (document.body.contains(projectHeader)) {
    if (windowY > (window.innerHeight * 0.75)) {
      if (windowY < scrollPos) {
        navigation.style.transform = "translate3d(0, 0, 0)";
      } else {
        navigation.style.transform = "translate3d(0, -200%, 0)";
      }
    }
  }
  if (document.body.contains(filterContainer)) {
    if (windowY < scrollPos) {
      navigation.style.transform = "translate3d(0, 0, 0)";
      filterContainer.style.transform = "translate3d(0, 68px, 0)";
    } else {
      navigation.style.transform = "translate3d(0, -68px, 0)";
      filterContainer.style.transform = "translate3d(0, 0px, 0)";
    }
  }
  if (document.querySelector("#page-title")) {
    if (windowY > (window.innerHeight * 0.15)) {
      headerPointer.style.opacity = 0;
    } else {
      headerPointer.style.opacity = 1;
    }
    if (windowY > (window.innerHeight * 0.40)) {
      pageTitle.classList.add("absolute");
      pageTitle.classList.remove("fixed");
      pageTitle.style.transform = "translate3d(0, 0vh, 0)";
    } else {
      pageTitle.classList.add("fixed");
      pageTitle.classList.remove("absolute");
      pageTitle.style.transform = "translate3d(0, -40vh, 0)";
    }
  }
  scrollPos = windowY;
};

window.__forceSmoothScrollPolyfill__ = true;
smoothscroll.polyfill();

if (document.querySelector("#current")) {
  var currentPage = document.getElementById("current");

  currentPage.previousElementSibling.classList.remove("hidden");
  currentPage.previousElementSibling.classList.add("visible", "collection-prev");

  currentPage.nextElementSibling.classList.remove("hidden");
  currentPage.nextElementSibling.classList.add("visible", "collection-next");
}

const aboutModal = document.getElementById("modal-about");
setTimeout(function() {
  aboutModal.style.display = "block";
}, 1000);

navigation.style.opacity = "1";


(function() {
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    if (/^(https?:)?\/\//.test(links[i].getAttribute("href"))) {
      links[i].target = "_blank";
    }
  }
})();
}

// intit code on each page load
init();

import "./css/main.css";
