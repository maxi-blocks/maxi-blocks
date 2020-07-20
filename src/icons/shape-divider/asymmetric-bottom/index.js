/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const asymmetricBottom = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1280 140">
    <defs>
      <Path id="asymmetric-bottom" d="M1280 140V0l-262.1 116.25q-18.65 8.45-39.1 6L0 0v140h1280z"/>
    </defs>
    <use href="#asymmetric-bottom"/>
  </SVG>
)

export default asymmetricBottom;