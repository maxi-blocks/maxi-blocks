/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const swishBottomOpacity = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1157 140">
    <defs>
      <Path id="swish-bottom-opacity-a" fillOpacity=".298" d="M1157.7 139.3q-184.55-4.763-375.95-21.15Q577.55 100.6 374.9 70 230.15 48.15 100.6 21.9 35.8 8.75 0 0v140l1157.7-.7z" />
      <Path id="swish-bottom-opacity-b" fillOpacity=".498" d="M0 30v110l1113.55-1q-362.26-9.313-738.65-54-144.8-17.2-274.3-37.8Q35.8 36.9 0 30z" />
      <Path id="swish-bottom-opacity-c" d="M0 60v80l1057.7-1.25Q722.337 130 374.9 100 230.1 87.5 100.6 72.5 35.8 65 0 60z" />
    </defs>
    <use href="#swish-bottom-opacity-a" />
    <use href="#swish-bottom-opacity-b" />
    <use href="#swish-bottom-opacity-c" />
  </SVG>
)

export default swishBottomOpacity;