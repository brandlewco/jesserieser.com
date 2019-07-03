import Filterizr from "filterizr";

// you set up your image gallery
const filterizr = new Filterizr(".filtr-container", filtrOptions);
// Configure your options
const filtrOptions = {
  animationDuration: 0.33, // in seconds
  callbacks: {
    onFilteringStart: function() { },
    onFilteringEnd: function() { },
    onShufflingStart: function() { },
    onShufflingEnd: function() { },
    onSortingStart: function() { },
    onSortingEnd: function() { }
  },
  controlsSelector: "", // Selector for custom controls
  delay: 0, // Transition delay in ms
  delayMode: "progressive", // 'progressive' or 'alternate'
  easing: "ease-out",
  filter: "all", // Initial filter
  filterOutCss: { // Filtering out animation
    opacity: 0,
    transform: "none"
  },
  filterInCss: { // Filtering in animation
    opacity: 1,
    transform: "none"
  },
  gridItemsSelector: ".filtr-container",
  gridSelector: ".filtr-item",
  layout: "sameSize", // See layouts
  multifilterLogicalOperator: "or",
  searchTerm: "",
  setupControls: true // Should be false if controlsSelector is set
};
