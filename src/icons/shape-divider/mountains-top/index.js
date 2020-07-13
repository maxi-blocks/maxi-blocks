/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const mountainsTop = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1280 122">
    <defs>
      <Path id="mountains-top" d="M1134.45 29.1l79.85 11.5L1280 0H0v122.1l60.6-24.5 95.65 16.5 86.35-16.4 78.7 24.6 90.1-29.8 122.05 21.8 99.8-24.8 95.35 20.8 87.5-38.9 97.6 16.7 83.65-40 66.3 21.55 70.8-40.55z"/>
    </defs>
    <use href="#mountains-top"/>
  </SVG>
)

export default mountainsTop;