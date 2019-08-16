import Filterizr from "filterizr";

// you set up your image gallery
const filterizr = new Filterizr(".filtr-container");
window.filterizr = filterizr;
// Configure your options
window.filterizr.setOptions({
  animationDuration: 0.66, // in seconds
  controlsSelector: "", // Selector for custom controls
  delay: 66, // Transition delay in ms
  delayMode: "progressive", // 'progressive' or 'alternate'
  easing: "ease-in-out",
  filter: "all", // Initial filter
  filterOutCss: { // Filtering out animation
    opacity: 0,
    transform: "translateY(-150%)"
  },
  filterInCss: { // Filtering in animation
    opacity: 1,
    transform: ""
  },
  gridItemsSelector: ".filtr-item",
  layout: "sameWidth", // See layouts
  multifilterLogicalOperator: "and",
  searchTerm: "",
  setupControls: true // Should be false if controlsSelector is set
});
