import Filterizr from "filterizr";

// var getParams = function(url) {
//   var params = [];
//   var parser = document.createElement("a");
//   parser.href = url;
//   var query = parser.search.substring(1);
//   var vars = query.split(",");
//   for (var i = 0; i < vars.length; i++) {
//     var pair = vars[i].split("=");
//     params[pair[0]] = decodeURIComponent(pair[1]);
//   }
//   return params;
// };

// console.log(getParams(window.location.href));
// you set up your image gallery
const filterizr = new Filterizr(".filtr-container");
window.filterizr = filterizr;

// Get URL parameters
function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split("&");
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

// Get the parameter you want & check if it"s defined
var cat = GetURLParameter("cat");
if (cat == null) {cat = "all";}
console.log([cat]);

// Configure your options
window.filterizr.setOptions({
  animationDuration: 0.33, // in seconds
  controlsSelector: "", // Selector for custom controls
  delay: 66, // Transition delay in ms
  delayMode: "progressive", // "progressive" or "alternate"
  easing: "ease-in-out",
  filter: "color", // Initial filter
  filterOutCss: { // Filtering out animation
    opacity: 0,
    transform: "scale(0)"
  },
  filterInCss: { // Filtering in animation
    opacity: 1,
    transform: "scale(1)"
  },
  gridItemsSelector: ".filtr-item",
  layout: "sameHeight", // See layouts
  multifilterLogicalOperator: "and",
  searchTerm: "",
  setupControls: true, // Should be false if controlsSelector is set
});
