import Filterizr from "filterizr";

// you set up your image gallery
const filterizr = new Filterizr(".filtr-container");
window.filterizr = filterizr;
// Configure your options
window.filterizr.setOptions({
  animationDuration: 0.1, // in seconds
  controlsSelector: "", // Selector for custom controls
  delay: 100, // Transition delay in ms
  delayMode: "alternate", // 'progressive' or 'alternate'
  easing: "ease-out",
  filter: "all", // Initial filter
  filterOutCss: { // Filtering out animation
    opacity: 0,
    transform: "scale(1)"
  },
  filterInCss: { // Filtering in animation
    opacity: 1,
    transform: "scale(1)"
  },
  gridItemsSelector: ".filtr-item",
  layout: "sameWidth", // See layouts
  multifilterLogicalOperator: "and",
  searchTerm: "",
  setupControls: true // Should be false if controlsSelector is set
});
