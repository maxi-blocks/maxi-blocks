/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const slantBottomOpacity = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1280 140">
    <defs>
      <Path id="slant-bottom-opacity-a" fill-opacity=".498" d="M0 0v140h1280L0 0z"/>
      <Path id="slant-bottom-opacity-b" d="M0 42v98h1280L0 42z"/>
    </defs>
    <use href="#slant-bottom-opacity-a"/>
    <use href="#slant-bottom-opacity-b"/>
  </SVG>
)

export default slantBottomOpacity;