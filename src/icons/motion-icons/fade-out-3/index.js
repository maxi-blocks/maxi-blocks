/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFadeOut3 = () => {
  const uniqueID = 'motion_fade_out_3_' + uniqueId();

  return (
    <SVG xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 72.75 65.25">
      <defs>
        <linearGradient id={uniqueID} x1="19.87" x2="53.18" y1="47.42" y2="47.42" gradientTransform="matrix(1 0 0 -1 0 68)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#999" />
          <stop offset="1" stopColor="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <Path fill="none" stroke="#464a53" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M45.65 55.35h22.88a3.25 3.25 0 002.4-.84 2.74 2.74 0 00.85-2V4.05a3.9 3.9 0 00-.85-2.2 4.18 4.18 0 00-2.4-.85H3.71a2.63 2.63 0 00-1.86.85A3 3 0 001 4.05v48.46a2.38 2.38 0 00.85 2 2.31 2.31 0 001.86.84h41.94v8.91h4.45m-27.3 0h4.3v-8.91m18.55 8.91H27.1" data-name="Layer1 22 1 STROKES" />
      <Path fill={`url(#${uniqueID})`} d="M53.52 8.08H20.07v25h33.45z" data-name="Layer1 22 MEMBER 0 FILL" transform="translate(-.47 -.42)" />
      <Path fill="none" stroke="#081219" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M35.25 22.74h3.57l-5-5m5 5h.28l-.25-3.57" data-name="Layer1 22 MEMBER 1 1 STROKES" />
      <Path fill="none" stroke="#ff4a17" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M65.19 48.12l.14-7.28m-.14 7.28l-8.59-8.95m1.49 8.84l7.1.11" data-name="Layer1 22 MEMBER 2 1 STROKES" />
    </SVG>
  )
}

export default motionFadeOut3;