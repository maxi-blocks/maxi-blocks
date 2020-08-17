/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionBlurOut1 = () => {
  const uniqueID = 'motion_blur_out_1_' + uniqueId();

  return (
    <SVG id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 73.92 65.71">
      <defs>
        <radialGradient id={uniqueID} cx="-881.34" cy="401.99" r="38.6" gradientTransform="matrix(1, 0, 0, -1, 926.4, 431.45)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#999" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g id="Layer1_16_FILL" data-name="Layer1 16 FILL">
        <Path fill={`url(#${uniqueID})`} d="M70.26,55.06V2.36H17.56v52.7Z" transform="translate(0.11 -0.19)" />
      </g>
      <Path id="Layer1_16_1_STROKES" data-name="Layer1 16 1 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#464a53" d="M46.71,56H69.56a3.28,3.28,0,0,0,2.4-.85,2.74,2.74,0,0,0,.85-2V4.71A3.88,3.88,0,0,0,72,2.51a4.11,4.11,0,0,0-2.4-.85H4.76a2.57,2.57,0,0,0-1.85.85,3,3,0,0,0-.85,2.2V53.16a2.36,2.36,0,0,0,.85,2A2.3,2.3,0,0,0,4.76,56h42v8.9h4.45m-27.3,0h4.3V56m18.55,8.9H28.16" transform="translate(0.11 -0.19)" />
      <Path id="Layer1_16_2_STROKES" data-name="Layer1 16 2 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#464a53" d="M46.57 30.97l-2.55 2.5v-7.1m0 7.1l-.2.2-2.35-2.7" transform="translate(0.11 -0.19)" />
      <Path id="Layer1_16_MEMBER_0_1_STROKES" data-name="Layer1 16 MEMBER 0 1 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#ff4a17" d="M47.6,5.05l0-3.57-5,5m5-5V1.19L44,1.44" transform="translate(0.11 -0.19)" />
      <Path id="Layer1_16_MEMBER_1_1_STROKES" data-name="Layer1 16 MEMBER 1 1 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#ff4a17" d="M6.19 45.9l-5 5.16L4.46 51M1 47.32l-.11 3.74h.28" transform="translate(0.11 -0.19)" />
    </SVG>
  )
}

export default motionBlurOut1;