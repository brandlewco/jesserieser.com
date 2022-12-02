import Swup from "swup";
import SwupScrollPlugin from "@swup/scroll-plugin";
import SwupGtmPlugin from "@swup/gtm-plugin";
import SwupBodyClassPlugin from "@swup/body-class-plugin";
import SwupScriptsPlugin from "@swup/scripts-plugin";
import lazySizes from "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "lazysizes/plugins/respimg/ls.respimg";
import sal from "sal.js";
import Rellax from "rellax";
import Flickity from "flickity";
import Midday from "midday.js";
import * as PhotoSwipe from "photoswipe";
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";
import smoothscroll from "smoothscroll-polyfill";
import {disablePageScroll, enablePageScroll} from "scroll-lock";

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
    new SwupGtmPlugin(),
    // new SwupPreloadPlugin(),
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
  // document.addEventListener("load", function(e) {
  //   console.log(e.target.currentSrc || e.target.src, e.target.width, "w", e.target.height, "h", "width", body.clientWidth);
  // }, true);

  const body = document.body;
  const navigation = document.getElementById("navigation");
  const navigationHeight = navigation.clientHeight;

  // swup.preloadPages();

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  var windowResize = debounce(function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);  }, 250);

  window.addEventListener("resize", windowResize);

  const setUp = () => {
    console.log("// built by brett lewis");
    console.log("// hello@brandlew.co");
  };
  setUp();

  // MIDDAY
  const middayNav = new Midday(document.getElementById("navigation"), {
    headerClass: "hue-header",
    innerClass: "hue-header-inner",
    sectionSelector: "hue"
  });

  // Sal Animations
  var scrollAnimations = sal({
    once: false,
    threshold: 0.15,
  });

  // Rellax Animation with content loaded detection
  // const content = document.getElementById("content");
  // imagesLoaded(content, function() {
  //   const rellaxIn = document.querySelectorAll(".rellax");
  //   rellaxIn.forEach((el) => {
  //     const rellax = new Rellax(el, {
  //       speed: 4,
  //       center: true,
  //       relativeToWrapper: true,
  //       wrapper: el.parentElement,
  //       round: true,
  //       vertical: true,
  //       horizontal: false,
  //       breakpoints: [1200, 1600, 2000]
  //     });
  //     window.addEventListener("scroll", () => { // fix to init
  //       rellax.refresh();
  //     });
  //   });
  // });

  const rellaxIn = document.querySelectorAll(".rellax");
  rellaxIn.forEach((el) => {
    const rellax = new Rellax(el, {
      speed: 4,
      center: true,
      relativeToWrapper: true,
      wrapper: el.parentElement,
      round: true,
      vertical: true,
      horizontal: false,
      breakpoints: [1200, 1600, 2000]
    });
    window.addEventListener("scroll", () => { // fix to init
      rellax.refresh();
    });
  });

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
          frameEl,
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


          // background=" + (videoBg ? 1 : 0) + "&amp;autoplay=" + (videoBg ? 1 : 0) + "
          // create slide object
          if (linkEl.classList.contains("video")) {
            var videoID = linkEl.getAttribute("pid");
            var videoBg = linkEl.getAttribute("background");
            item = {
              html: "<div class='relative w-full h-full'><iframe src='https://player.vimeo.com/video/" + videoID + "?title=0&amp;byline=0&amp;portrait=0&amp;loop=1&amp;background=1&amp;autoplay=1;' ' frameborder='0' allow='autoplay; fullscreen' allowfullscreen='' style='position:absolute;top:5%;left:0;width:100%;height:90%;z-index:2;'></iframe><svg class='icon pointer h-8 w-8 m-4 text-black opacity-50 absolute spin' style='top: 50%; left: 50%; margin-top: -1rem; margin-left: -1rem;'><use xlink:href='#spinner'></use></svg></div>",
              pid: linkEl.getAttribute("pid"),
            };
          } else {
            item = {
              src: linkEl.getAttribute("href"),
              w: imgEl.naturalWidth * 2,
              h: imgEl.naturalHeight * 2,
              pid: linkEl.getAttribute("pid")
            };
          }

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
      // var onThumbnailsHover = function(e) {
      //   console.log("hover:", "srcElement", e.srcElement, "target", e.target);
      // };

      function galleryUiLaunch() {
        navigation.style.zIndex = 0;
        navigation.style.opacity = 0;
        navigation.style.display = "hidden";
        const figureIMG = document.querySelectorAll(".figure img");
        figureIMG.forEach(function(element) {
          // console.log(element);
          element.style.opacity = 0;
        });
      }

      // triggers when user clicks on thumbnail
      var onThumbnailsClick = function(e) {
        // UI pre-gallery launch

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
          closeOnVerticalDrag: true,
          preload: [2, 3],
          loadingIndicatorDelay: 0,
          getThumbBoundsFn: function(index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName("a")[0], // find thumbnail
              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect();

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          },
          fullscreenEl: false,
          zoomEl: false,
          shareEl: false,
          indexIndicatorSep: "/",
          loop: true,
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

        const galleryClose = document.getElementById("pswp_close");
        galleryClose.addEventListener("click", () => {
          gallery.close();
        });

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.listen("beforeChange", function() {
          var activeSlide = document.getElementsByClassName("active-slide");
          var activeWrapper = document.getElementsByClassName("active-wrapper");
          var activeBefore = document.getElementsByClassName("active-before");
          var activeAfter = document.getElementsByClassName("active-after");
          function removeActiveSlide() {
            while (activeSlide[0]) {
              // activeSlide[0].style.opacity = "1";
              activeSlide[0].classList.remove("active-slide");
            }
            while (activeWrapper[0]) {
              // activeWrapper[0].style.opacity = "1";
              activeWrapper[0].classList.remove("active-wrapper");
            }
            while (activeBefore[0]) {
              // activeBefore[0].style.transitionDelay = "0s";
              activeBefore[0].classList.remove("active-before");
            }
            while (activeAfter[0]) {
              // activeAfter[0].style.transitionDelay = "0s";
              activeAfter[0].classList.remove("active-after");
            }
          }
          removeActiveSlide();
        });
        gallery.listen("afterChange", function() {
          console.log("h", gallery.currItem);
          // console.log("h", gallery.currItem.h, "w", gallery.currItem.w);
          var currentItem = gallery.currItem.container;
          var currentItemParent = gallery.currItem.container.parentNode;
          currentItem.classList.add("active-slide");
          currentItemParent.classList.add("active-wrapper");
          if (currentItemParent.previousElementSibling) {
            currentItemParent.previousElementSibling.classList.add("active-before");
          }
          if (currentItemParent.nextElementSibling) {
            currentItemParent.nextElementSibling.classList.add("active-after");
          }
          if (currentItemParent.nextElementSibling) {}
          Element.prototype.documentOffsetTop = function() {
            return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
          };
          var topPos = document.getElementById(gallery.currItem.el.id).documentOffsetTop() - (window.innerHeight / 2);
          window.scrollTo({
            top: topPos,
            left: 0,
            behavior: "smooth",
          });
          // document.getElementById(gallery.currItem.el.id).scrollIntoView({behavior: "smooth", block: "nearest", inline: "start"});
        });
        gallery.listen("close", function() {
          console.log("close", gallery.currItem.el.id);
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

      var figureClick = document.querySelectorAll(".figure a");
      figureClick.forEach((trigger) => {
        trigger.addEventListener("mouseenter", () => {
          setTimeout(function() {
            var preloadURL = trigger.getAttribute("href");
            var preloadIMG = new Image();
            preloadIMG.src = preloadURL;
          }, 20);
        });
        trigger.addEventListener("click", () => {
          galleryUiLaunch();
        });
      });

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true);
      }
    };
    // execute above function
    initPhotoSwipeFromDOM(".my-gallery");
  }

  function lazyloadToggle(e) {
    // console.log(e);
    var lazydelay = e.getElementsByClassName("lazyload-delay");
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
    const popupGalleryInit = popupModal.querySelector(".gallery_scroller");
    const popupList = popupModal.querySelector(".scrollbar");

    // launch modal function
    function launchModal() {
      history.pushState("", document.title, window.location.pathname + "#" + popupTrigger);
      // window.location.hash = popupTrigger;
      disablePageScroll(popupModal);
      if (popupList) {
        disablePageScroll(popupList);
      }
      lazyloadToggle(popupModal);
      if (popupGalleryInit) {
        var flkty = new Flickity(popupGalleryInit, {
          wrapAround: true,
          adaptiveHeight: true,
          percentPosition: false,
          draggable: ">1",
          accessibility: false,
          arrowShape: "m77.59 5.06-5.17-5.21-50 50 50 50 5.17-5.21-44.77-44.81z"
        });
      }
      navigation.classList.remove("active");
      navigation.style.opacity = 0;
      navigation.style.display = "none";
      popupModal.style.opacity = 1;
      popupModal.style.visibility = "visible";
      popupModal.classList.add("is--visible");

      var navToggle = document.getElementsByClassName("navToggle");
      Array.prototype.forEach.call(navToggle, function(nav) {
        nav.classList.remove("toggle-active");
      });
    }

    // close modal function
    function closeModal() {
      // console.log(event);
      history.pushState("", document.title, window.location.pathname + window.location.search);
      enablePageScroll(popupModal);
      if (popupList) {
        enablePageScroll(popupList);
      }
      navigation.style.opacity = 1;
      navigation.style.display = "block";
      popupModal.style.opacity = 0;
      popupModal.style.visibility = "hidden";
      popupModal.classList.remove("is--visible");
      
      // search for all video and pause
      document.querySelectorAll(".modal-video").forEach((iframe) => {
        var player = new Vimeo.Player(iframe);
        player.pause();
      });
    }

    // modal open method
    trigger.addEventListener("click", () => {
      launchModal();
    });

    // modal close methods
    // close on close click
    popupModal.querySelector(".popup-modal__close").addEventListener("click", () => {
      closeModal();
    });
    // close on collection click-through
    if (popupModal.querySelector(".exit-modal")) {
      popupModal.querySelector(".exit-modal").addEventListener("click", () => {
        closeModal();
        swup.scrollTo(document.body, 0);
      });
    }
    // close on esc key click
    document.addEventListener("keyup", function(event) {
      if (event.defaultPrevented) {
        return;
      }
      var key = event.key || event.keyCode;
      if (key === "Escape" || key === "Esc" || key === 27) {
        closeModal();
      }
    });
  });

  if (window.location.hash) {
    var locHash = window.location.hash;
    var locPop = locHash.substring(1);
    // var locSlide = locPop.slice(5);
    var locButton = document.getElementById(locPop);
    // var topButton = document.getElementById(locPop).documentOffsetTop() - (window.innerHeight / 2);
    if (locButton) {
      locButton.scrollIntoView();
      locButton.click();
    }
  }

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

  function value_limit(val, min, max) {
    return val < min ? min : (val > max ? max : val);
  }

  const projectHeader = document.getElementById("project-header");
  // const filterContainer = document.getElementById("filters");
  const headerPointer = document.getElementById("header-pointer");
  const pageTitle = document.getElementById("page-title");
  // const headerOverlay = document.getElementById("header-overlay");
  // const featureOverlay = document.getElementById("feature-overlay");
  const headerImage = document.getElementById("header-image");
  const featureImage = document.getElementById("feature-image");
  const height = window.innerHeight;

  // Scroll Animations
  let scrollPos = 0;
  window.onscroll = function() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const windowY = window.scrollY;
    if (headerImage) {
      headerImage.style.opacity = value_limit(1 - (scrollTop / (height * 0.4)), 0, 1).toFixed(2);
    }
    if (featureImage) {
      featureImage.style.opacity = value_limit(1 - (scrollTop / (height * 0.9)), 0, 1).toFixed(2);
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
    scrollPos = windowY;
  };

  window.__forceSmoothScrollPolyfill__ = true;
  window.smoothscroll = true;
  smoothscroll.polyfill();

  if (document.querySelector("#current")) {
    var currentPage = document.getElementById("current");

    currentPage.previousElementSibling.classList.remove("hidden");
    currentPage.previousElementSibling.classList.add("visible", "collection-prev");
    currentPage.previousElementSibling.querySelector(".mobile").innerHTML = "Prev";

    currentPage.nextElementSibling.classList.remove("hidden");
    currentPage.nextElementSibling.classList.add("visible", "collection-next");
    currentPage.nextElementSibling.querySelector(".mobile").innerHTML = "Next";
  }

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

  // accesibility highlighter
  (function(document, window) {
    var styleText = "::-moz-focus-inner{border:0 !important;}:focus{outline: none !important;";
    var unfocus_style = document.createElement("STYLE");

    window.unfocus = function() {
      document.getElementsByTagName("HEAD")[0].appendChild(unfocus_style);

      document.addEventListener("mousedown", function() {
        unfocus_style.innerHTML = styleText + "}";
      });
      document.addEventListener("keydown", function() {
        unfocus_style.innerHTML = "";
      });
    };

    unfocus.style = function(style) {
      styleText += style;
    };

    unfocus();
  })(document, window);
}

// intit code on each page load
init();

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "visible") {
    console.time("visible");
  }
});

import "./css/main.css";
