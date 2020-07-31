/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFadeOut5 = () => {
    const uniqueID = 'motion_fade_out_5_' + uniqueId();

    return (
      <SVG xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 72.75 65.25">
        <defs>
          <linearGradient id={uniqueID} x1="1.45" x2="69.8" y1="47.42" y2="47.42" gradientTransform="matrix(1 0 0 -1 0 68)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#999"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <Path fill="none" stroke="#464a53" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M45.65 55.35h22.88a3.22 3.22 0 002.4-.86 2.71 2.71 0 00.85-2V4.05a3.88 3.88 0 00-.85-2.2 4.09 4.09 0 00-2.4-.85H3.71a2.55 2.55 0 00-1.85.85A3 3 0 001 4.05v48.44a2.34 2.34 0 00.86 2 2.26 2.26 0 001.85.86h41.94v8.89h4.46m-27.3 0h4.3v-8.89m18.54 8.89H27.11" data-name="Layer1 20 MEMBER 0 1 STROKES"/>
        <Path fill={`url(#${uniqueID})`} d="M71 33.08v-25H2.18v25z" data-name="Layer1 20 MEMBER 1 FILL" transform="translate(-.47 -.43)"/>
        <Path fill="none" stroke="#081219" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M35.14 22.7h3.57l-5-5m5 5h.28l-.25-3.57" data-name="Layer1 20 MEMBER 2 1 STROKES"/>
        <Path fill="none" stroke="#ff4a17" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M63.53 48.07l.14-7.28m-.14 7.28l-8.59-8.94m1.49 8.84l7.11.1" data-name="Layer1 20 MEMBER 3 1 STROKES"/>
      </SVG>
    )
}

export default motionFadeOut5;