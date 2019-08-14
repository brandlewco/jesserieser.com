import "lazysizes";
import "lazysizes/plugins/unveilhooks/ls.unveilhooks";
import Midday from "midday.js";
fadeInPage();
function fadeInPage() {
  if (!window.AnimationEvent) { return; }
  var fader = document.getElementById("fader");
  fader.classList.add("fade-out");
}

document.addEventListener("DOMContentLoaded", function() {
  if (!window.AnimationEvent) { return; }

  var anchors = document.getElementsByTagName("a");

  for (var idx = 0; idx < anchors.length; idx += 1) {
    if (anchors[idx].hostname !== window.location.hostname) {
      return;
    }

    anchors[idx].addEventListener("click", function(event) {
      var fader = document.getElementById("fader"),
        anchor = event.currentTarget;

      var listener = function() {
        window.location = anchor.href;
        fader.removeEventListener("animationend", listener);
      };
      fader.addEventListener("animationend", listener);

      event.preventDefault();
      fader.classList.add("fade-in");
    });
  }
});

window.addEventListener("pageshow", function(event) {
  if (!event.persisted) {
    return;
  }
  var fader = document.getElementById("fader");
  fader.classList.remove("fade-in");
});


// midday
const middayNav = new Midday(document.getElementById("navigation"), {
  headerClass: "hue-header",
  innerClass: "hue-header-inner",
  sectionSelector: "hue"
});


var buttons = document.getElementsByClassName("toggle");
Array.prototype.forEach.call(buttons, function(button) {
  button.addEventListener("click", function(event) {
    button.classList.toggle("active");
  });
});

var navigation = document.getElementById("navigation");
var navToggle = document.getElementsByClassName("navToggle");
Array.prototype.forEach.call(navToggle, function(nav) {
  nav.addEventListener("click", function(event) {
    navigation.classList.toggle("active");
  });
});

import "./css/main.css";
