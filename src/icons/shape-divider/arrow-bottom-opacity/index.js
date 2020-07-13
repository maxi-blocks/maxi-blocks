/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const curveBottomOpacity = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1280 140">
    <defs>
      <Path id="curve-bottom-opacity-a" fill-opacity=".298" d="M1280 0q-9.65 5-30.4 12.8-41.55 15.65-96.95 29.8-177.35 45.25-427.4 58.55-250.05 13.3-512.65-42.6Q130.55 41.1 57.05 18.8 20.35 7.65 0 0v140h1280V0z"/>
      <Path id="curve-bottom-opacity-b" fill-opacity=".498" d="M1280 14q-20.4 7.9-57.25 19.35-73.6 23-155.65 41.1-114.9 25.35-230.15 37.3-144.05 14.95-280.5 7.95-248.1-12.65-427.1-67.45-55.9-17.1-98.25-36.4Q9.95 6.2 0 0v140h1280V14z"/>
      <Path id="curve-bottom-opacity-c" d="M609.5 139.8q-106.956-2.531-218.65-21.65Q288.75 100.6 187.45 70 115.05 48.15 50.3 21.9 17.9 8.75 0 0v140l609.5-.2M1280 0q-17.9 8.75-50.3 21.9-64.8 26.25-137.15 48.1-101.35 30.65-203.45 48.15-111.65 19.119-218.65 21.65l609.55.2V0z"/>
    </defs>
    <use href="#curve-bottom-opacity-a"/>
    <use href="#curve-bottom-opacity-b"/>
    <use href="#curve-bottom-opacity-c"/>
  </SVG>
)

export default curveBottomOpacity;