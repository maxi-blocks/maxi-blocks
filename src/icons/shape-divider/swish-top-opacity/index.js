/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const waveTopOpacity = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1280 140">
    <defs>
      <Path id="swish-top-opacity-a" fillOpacity=".298" d="M1280 140V0H0v60q35.8 5 100.6 12.5 129.5 15 274.3 27.5 463.25 40 905.1 40z" />
      <Path id="swish-top-opacity-b" fillOpacity=".498" d="M1280 140V0H0v30q35.8 6.9 100.6 17.2Q230.1 67.8 374.9 85q463.25 55 905.1 55z" />
      <Path id="swish-top-opacity-c" d="M1280 140V0H0q35.8 8.75 100.6 21.9Q230.15 48.15 374.9 70q202.65 30.6 406.85 48.15Q1036.95 140 1280 140z" />
    </defs>
    <use href="#swish-top-opacity-a" />
    <use href="#swish-top-opacity-b" />
    <use href="#swish-top-opacity-c" />
  </SVG>
)

export default waveTopOpacity;