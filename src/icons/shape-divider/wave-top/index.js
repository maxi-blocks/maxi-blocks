/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const waveTop = (
  <SVG xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" viewBox="0 0 1280 112">
    <defs>
      <Path id="wave-top" d="M1218.75 85.4Q1240 80.5 1280 70V0H0v70q40-10.5 61.25-15.4 35.4-8.2 68.75-13.45Q213.35 28 320 28t190 13.15q33.35 5.25 68.75 13.45Q600 59.5 640 70t61.25 15.4q35.4 8.25 68.75 13.5Q853.35 112 960 112t190-13.1q33.35-5.25 68.75-13.5z"/>
    </defs>
    <use href="#wave-top"/>
  </SVG>
)

export default waveTop;