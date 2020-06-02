import Swup from "swup";
import SwupScrollPlugin from "@swup/scroll-plugin";
import SwupGaPlugin from "@swup/ga-plugin";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScriptsPlugin from "@swup/scripts-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";
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

// Page Loader (SWUP)
const options = {
  containers: ["#navigation", "#content"],
  plugins: [
    new SwupScrollPlugin({
      animateScroll: false,
      scrollFriction: 0.4,
      scrollAcceleration: 0.04,
      doScrollingRightAway: false
    }),
    new SwupGaPlugin(),
    new SwupPreloadPlugin(),
    new SwupBodyClassPlugin(),
    new SwupScriptsPlugin({
      head: false,
      body: false
    })
  ],
  animateHistoryBrowsing: true,
  preload: true,
  cache: true,
  linkSelector: 'a[href^="' + window.location.origin + '"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
  skipPopStateHandling: function(event) {
    if (event.state && event.state.source === "swup") {
      return false;
    }
    return true;
  }
};
const swup = new Swup(options);

swup.on("contentReplaced", init);

function init() {
  const navigation = document.getElementById("navigation");
  const navigationHeight = navigation.clientHeight;

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
    horizontal: false,
    breakpoints: [1200, 1600, 2000]
  });

  if (document.querySelector(".rellax")) {
    rellax.refresh();
    window.addEventListener("scroll", function() {
      rellax.refresh();
    });
  }

  // PhotoSwipe
  if (document.querySelector("#gallery")) {
    // const figureIMG = document.querySelectorAll(".figure img");
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

          // size = linkEl.getAttribute("data-size").split("x");

          // create slide object
          item = {
            src: linkEl.getAttribute("href"),
            w: imgEl.naturalWidth * 2,
            h: imgEl.naturalHeight * 2,
            // w: imgEl.naturalWidth,
            // h: imgEl.naturalHeight,
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
        // UI pre-gallery launch
        navigation.style.zIndex = 0;
        navigation.style.opacity = 0;
        navigation.style.display = "hidden";
        const figureIMG = document.querySelectorAll(".figure img");
        figureIMG.forEach(function(element) {
          // console.log(element);
          element.style.opacity = 0;
        });

        // launch gallery
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
          bgOpacity: 0.15,
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
          loop: false,

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
        gallery.listen("imageLoadComplete", function() {
          const imgItem = document.querySelectorAll(".pswp__img");
          imgItem.forEach(function(element) {
            element.style.opacity = null;
          });
        });
        gallery.listen("beforeChange", function() {
          var activeSlide = document.getElementsByClassName("active-slide");
          var activeWrapper = document.getElementsByClassName("active-wrapper");
          function removeActiveSlide() {
            while (activeSlide[0]) {
              activeSlide[0].classList.remove("active-slide");
            }
            while (activeWrapper[0]) {
              activeWrapper[0].classList.remove("active-wrapper");
            }
          }
          removeActiveSlide();
        });
        gallery.listen("afterChange", function() {
          // console.log("h", gallery.currItem.h, "w", gallery.currItem.w);
          var currentItem = gallery.currItem.container;
          var currentItemParent = gallery.currItem.container.parentNode;
          currentItem.classList.add("active-slide");
          currentItemParent.classList.add("active-wrapper");
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
          navigation.style.zIndex = 110;
          navigation.style.transform = "translate3d(0, 0px, 0)";
          navigation.style.opacity = 1;
          navigation.style.display = "block";
          const figureIMG = document.querySelectorAll(".figure img");
          figureIMG.forEach(function(element) {
            element.style.opacity = 1;
          });
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

  var lazydelay = document.getElementsByClassName("lazyload-delay");
  function lazyloadToggle() {
    for (var i = 0; i < lazydelay.length; i++) {
      lazydelay[i].classList.add("lazyload");
    }
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

  // Navigation Toggle
  function navigationToggle() {
    var navToggle = document.getElementsByClassName("navToggle");
    Array.prototype.forEach.call(navToggle, function(nav) {
      nav.addEventListener("click", function(event) {
        nav.classList.toggle("toggle-active");
        navigation.classList.toggle("active");
      });
    });
  }
  navigationToggle();

  function removeActive() {
    navigation.classList.remove("active");
  }
  removeActive();

  // Modal
  const modalTriggers = document.querySelectorAll(".popup-trigger");
  modalTriggers.forEach((trigger) => {
    const {popupTrigger} = trigger.dataset;
    const popupModal = document.querySelector(`[data-popup-modal="${popupTrigger}"]`);
    trigger.addEventListener("click", () => {
      navigation.classList.remove("active");
      navigation.style.opacity = 0;
      navigation.style.display = "none";
      scrollLock();
      // document.body.style.overflowY = "hidden";
      popupModal.style.opacity = 1;
      popupModal.style.visibility = "visible";
      popupModal.classList.add("is--visible");
      // bodyPopup.classList.add("is-poped-out");
      // popupModal.addEventListener("scroll", function() {
      //   rellax.refresh();
      // });
      lazyloadToggle();

      // Blog Gallery
      var paginatedGallery = popupModal.querySelector(".paginated_gallery");
      if (paginatedGallery) {
        var gallery_scroller = paginatedGallery.querySelector(".gallery_scroller");
        var gallery_scroller_size = gallery_scroller.clientWidth;
        var gallery_prev = paginatedGallery.querySelector(".prev");
        var gallery_next = paginatedGallery.querySelector(".next");
        // console.log(gallery_scroller, gallery_scroller_size);
        gallery_prev.addEventListener("click", () => {
          gallery_scroller.scrollBy({
            top: 0,
            left: -gallery_scroller_size,
            behavior: "smooth"
          });
        });
        gallery_next.addEventListener("click", () => {
          gallery_scroller.scrollBy({
            top: 0,
            left: gallery_scroller_size,
            behavior: "smooth"
          });
        });
      }
      var navToggle = document.getElementsByClassName("navToggle");
      Array.prototype.forEach.call(navToggle, function(nav) {
        nav.classList.remove("toggle-active");
      });
    });

    // modal close methods
    popupModal.querySelector(".popup-modal__close").addEventListener("click", () => {
      scrollUnlock();
      navigation.style.opacity = 1;
      navigation.style.display = "block";
      popupModal.style.opacity = 0;
      popupModal.style.visibility = "hidden";
      popupModal.classList.remove("is--visible");
    });

    document.addEventListener("keyup", function(event) {
      if (event.defaultPrevented) {
        return;
      }
      var key = event.key || event.keyCode;
      if (key === "Escape" || key === "Esc" || key === 27) {
        scrollUnlock();
        navigation.style.opacity = 1;
        navigation.style.display = "block";
        popupModal.style.opacity = 0;
        popupModal.style.visibility = "hidden";
        popupModal.classList.remove("is--visible");
      }
    });
  });

  // Inner Modal
  const innerModalTriggers = document.querySelectorAll(".inner-popup-trigger");
  innerModalTriggers.forEach((trigger) => {
    const {innerPopupTrigger} = trigger.dataset;
    const innerPopupModal = document.querySelector(`[data-inner-popup-modal="${innerPopupTrigger}"]`);
    trigger.addEventListener("click", () => {
      innerPopupModal.classList.add("is--visible");
      innerPopupModal.style.visibility = "visible";
      innerPopupModal.style.opacity = 1;
      scrollLock();
    });
    innerPopupModal.querySelector(".popup-modal__close").addEventListener("click", () => {
      innerPopupModal.classList.remove("is--visible");
      innerPopupModal.style.visibility = "hidden";
      innerPopupModal.style.opacity = 0;
      scrollUnlock();
    });
  });

  // Generic Button Toggle
  var buttons = document.getElementsByClassName("toggle");
  Array.prototype.forEach.call(buttons, function(button) {
    button.addEventListener("click", function(event) {
      button.classList.toggle("active");
    });
  });


  // Block Hover Dimming
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

  const body = document.body;
  // Scroll Lock / Unlock
  const scrollLock = () => {
    body.style.overflowY = "hidden";
  };
  const scrollUnlock = () => {
    body.style.overflowY = "scroll";
  };
  function value_limit(val, min, max) {
    return val < min ? min : (val > max ? max : val);
  }

  const projectHeader = document.getElementById("project-header");
  const filterContainer = document.getElementById("filters");
  const headerPointer = document.getElementById("header-pointer");
  const pageTitle = document.getElementById("page-title");
  const headerOverlay = document.getElementById("header-overlay");
  const featureOverlay = document.getElementById("feature-overlay");
  const headerImage = document.getElementById("header-image");
  const featureImage = document.getElementById("feature-image");
  const height = window.innerHeight;

  // Scroll Animations
  let scrollPos = 0;
  window.onscroll = function() {

    // document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const windowY = window.scrollY;


    // if (headerImage) {
    //   headerImage.style.opacity = value_limit(1 - (scrollTop / (height * 0.35)), 0, 1).toFixed(2);
    // }
    // if (featureImage) {
    //   featureImage.style.opacity = value_limit(1 - (scrollTop / (height * 0.9)), 0, 1).toFixed(2);
    // }
    if (headerOverlay) {
      headerOverlay.style.opacity = value_limit((scrollTop / (height * 0.4)), 0, 1).toFixed(2);
    }
    if (featureOverlay) {
      featureOverlay.style.opacity = value_limit((scrollTop / (height * 0.9)), 0, 1).toFixed(2);
    }

    if (projectHeader) {
      if (windowY > (window.innerHeight * 0.75)) {
        if (windowY < scrollPos) {
          navigation.style.transform = "translate3d(0, 0, 0)";
        } else {
          navigation.style.transform = "translate3d(0, -" + navigationHeight + "px, 0)";
        }
      }
    }
    if (pageTitle) {
      const pageTitleHeight = pageTitle.offsetHeight;
      const pageTitleBottom = (height - pageTitleHeight) / 2;
      if (windowY > (pageTitleBottom - 150)) {
        headerPointer.style.opacity = 0;
      } else {
        headerPointer.style.opacity = 1;
      }
      if (windowY > pageTitleBottom) {
        pageTitle.classList.add("absolute");
        pageTitle.classList.remove("fixed");
        pageTitle.style.top = "auto";
        pageTitle.style.bottom = "0";
        pageTitle.style.transform = "translate3d(0, 0vh, 0)";
      } else {
        pageTitle.classList.add("fixed");
        pageTitle.classList.remove("absolute");
        pageTitle.style.top = "50%";
        pageTitle.style.bottom = "auto";
        pageTitle.style.transform = "translate3d(0, -50%, 0)";
      }
    }
    if (filterContainer) {
      if ((scrollTop < scrollPos) || scrollPos < 0) {
        navigation.style.transform = "translate3d(0, 0, 0)";
        filterContainer.style.transform = "translate3d(0, 0px, 0)";
      } else {
        navigation.style.transform = "translate3d(0, -" + navigationHeight + "px, 0)";
        filterContainer.style.transform = "translate3d(0, -" + navigationHeight + "px, 0)";
      }
    }
    // console.log("scrollTop", scrollTop, "scrollPos", scrollPos);
    scrollPos = windowY;
  };

  window.__forceSmoothScrollPolyfill__ = true;
  window.smoothscroll = true;
  smoothscroll.polyfill();

  if (document.querySelector("#current")) {
    var currentPage = document.getElementById("current");

    currentPage.previousElementSibling.classList.remove("hidden");
    currentPage.previousElementSibling.classList.add("visible", "collection-prev");

    currentPage.nextElementSibling.classList.remove("hidden");
    currentPage.nextElementSibling.classList.add("visible", "collection-next");
  }

  // setTimeout(function() {
  //   const popupModal = document.querySelectorAll(".popup-modal");
  //   popupModal.forEach((element) => {
  //     element.style.display = "block";
  //   });
  // }, 2000);

  // Animate Navigaiton on Load
  navigation.style.opacity = "1";

  // Open External Links In New Window
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
