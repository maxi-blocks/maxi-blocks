/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFadeIn3 = () => {
  const uniqueID = 'motion_fade_in_3_' + uniqueId();

  return (
    <SVG xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 72.75 65.25">
      <defs>
        <linearGradient id={uniqueID} x1="53.57" x2="20.22" y1="31.92" y2="31.92" gradientTransform="matrix(1 0 0 -1 0 68)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#999" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <Path fill="none" stroke="#464a53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M45.65 55.36h22.88a3.22 3.22 0 002.4-.86 2.71 2.71 0 00.85-2V4.06a3.85 3.85 0 00-.85-2.2 4.13 4.13 0 00-2.4-.86H3.71a2.6 2.6 0 00-1.86.86A3 3 0 001 4.06V52.5a2.37 2.37 0 00.85 2 2.3 2.3 0 001.86.86h41.94v8.89h4.45m-4.45 0H22.8m4.3 0v-8.89" data-name="Layer1 27 1 STROKES" />
      <Path fill={`url(#${uniqueID})`} d="M53.57 23.58H20.12v25h33.45z" data-name="Layer1 27 MEMBER 0 FILL" transform="translate(-.47 -.42)" />
      <Path fill="none" stroke="#081219" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M35.25 38.12h3.57l-5-5m5 5h.28l-.25-3.58" data-name="Layer1 27 MEMBER 1 1 STROKES" />
      <Path fill="none" stroke="#ff4a17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M65.15 7.74l.14 7.29m-.14-7.29l-8.59 9m1.49-8.84l7.1-.11" data-name="Layer1 27 MEMBER 2 1 STROKES" />
    </SVG>
  )
}

export default motionFadeIn3;