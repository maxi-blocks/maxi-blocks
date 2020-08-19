/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFadeIn2 = () => {
  const uniqueID = 'motion_fade_in_2_' + uniqueId();

  return (
    <SVG xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 72.75 65.25">
      <defs>
        <linearGradient id={uniqueID} x1="48.02" x2="25.52" y1="31.92" y2="31.92" gradientTransform="matrix(1 0 0 -1 0 68)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#999" />
          <stop offset="1" stopColor="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <Path fill="none" stroke="#464a53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M45.65 55.36h22.88a3.22 3.22 0 002.4-.86 2.67 2.67 0 00.85-2V4.06a3.78 3.78 0 00-.85-2.2 4.13 4.13 0 00-2.4-.86H3.7a2.6 2.6 0 00-1.85.86A3 3 0 001 4.06V52.5a2.37 2.37 0 00.85 2 2.29 2.29 0 001.85.86h41.95v8.89h4.45m-4.45 0H22.8m4.3 0v-8.89" data-name="Layer1 26 1 STROKES" />
      <Path fill={`url(#${uniqueID})`} d="M48.07 23.58h-22.5v25h22.5z" data-name="Layer1 26 MEMBER 0 FILL" transform="translate(-.47 -.42)" />
      <Path fill="none" stroke="#081219" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M35.3 38.12h3.57l-5-5m5 5h.29l-.25-3.57" data-name="Layer1 26 MEMBER 1 1 STROKES" />
      <Path fill="none" stroke="#ff4a17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M64.99 7.74l.14 7.29m-.14-7.29l-8.59 9m1.48-8.84l7.11-.11" data-name="Layer1 26 MEMBER 2 1 STROKES" />
    </SVG>
  )
}

export default motionFadeIn2;