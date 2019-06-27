import * as PhotoSwipe from "photoswipe";
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";

var initGalleryClick = function() {
  var x = document.querySelectorAll(".opengallery");
  for (let i = 0; i < x.length; i++) {
    x[i].addEventListener("click", function() {
      openGallery(x[i].dataset.image);
    });
  }
  var openGallery = function(index) {
    var gallery;
    var pswpElement = document.querySelectorAll(".pswp")[0];
    var options = {
      history: true,
      bgOpacity: 0.75,
      // closeOnScroll: false,
      // closeOnVerticalDrag: false,
      preload: [2, 3],
      loadingIndicatorDelay: 0,
    };
    // Pass data to PhotoSwipe and initialize it
    options.index = parseInt(index, 10) - 1;
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    // console.log(items, index);
    gallery.listen("gettingData", function(index, item) {
      if (item.w < 1 || item.h < 1) {
        var img = new Image();
        img.onload = function() {
          item.w = this.width; // set image width
          item.h = this.height; // set image height
          gallery.updateSize(true); // reinit Items
        };
        img.src = item.src; // let's download image
      }
    });
    gallery.init();
  };
};

// OPEN GALLERY BY URL
var initGalleryDOM = function() {
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

  var openPhotoSwipe = function(index, galleryElement, fromURL) {
    var gallery;
    var pswpElement = document.querySelectorAll(".pswp")[0];
    var options = {
      history: true,
      bgOpacity: 0.75,
      // closeOnScroll: false,
      // closeOnVerticalDrag: false,
      preload: [2, 3],
      loadingIndicatorDelay: 0,
    };
    // PhotoSwipe opened from URL
    if (fromURL) {
      options.index = parseInt(index, 10) - 1;
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.listen("gettingData", function(index, item) {
      if (item.w < 1 || item.h < 1) {
        var img = new Image();
        img.onload = function() {
          item.w = this.width; // set image width
          item.h = this.height; // set image height
          gallery.updateSize(true); // reinit Items
        };
        img.src = item.src; // let's download image
      }
    });
    gallery.init();
  };
  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, hashData.gid, true);
  }
};

initGalleryClick();
initGalleryDOM();
