/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const motionScale = (
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
    <Path d="M18.7 5.3l-5.4 5.3m9-3.6V1.4h-5m5 15.6v5.6h-5M1.7 7V1.4h5M1.7 17v5.6h5m-1-4.5l5-4.9" fill="none" stroke="#232533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.24 18.876l2.2-.1m-2.3-2.4l-.1 2.3M19.2 7.1l.1-2.3m-.2-.3l-2.2.1" strokeMiterlimit="3.9998" fill="none" stroke="#232533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </SVG>
)

export default motionScale;