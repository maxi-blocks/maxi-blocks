/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionBlurIn4 = () => {
  const uniqueID = 'motion_blur_in_4_' + uniqueId();

  return (
    <SVG id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72.75 65.25">
      <defs>
        <radialGradient id={uniqueID} cx="-797.98" cy="402.22" r="26.25" gradientTransform="matrix(1, 0, 0, -1, 847.4, 431.95)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#999" />
          <stop offset="1" stopColor="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g id="Layer1_16_FILL" data-name="Layer1 16 FILL">
        <Path fill={`url(#${uniqueID})`} d="M67.57,48.28V11.57H30.87V48.28Z" transform="translate(-0.47 -0.42)" />
      </g>
      <Path id="Layer1_16_1_STROKES" data-name="Layer1 16 1 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#464a53" d="M46.12,55.78H69a3.22,3.22,0,0,0,2.4-.86,2.71,2.71,0,0,0,.85-2V4.48a3.88,3.88,0,0,0-.85-2.2A4.13,4.13,0,0,0,69,1.42H4.18a2.6,2.6,0,0,0-1.86.86,3,3,0,0,0-.85,2.2V52.92a2.36,2.36,0,0,0,.85,2,2.3,2.3,0,0,0,1.86.86H46.12v8.89h4.45m-4.45,0H23.27m4.3,0V55.78" transform="translate(-0.47 -0.42)" />
      <Path id="Layer1_16_2_STROKES" data-name="Layer1 16 2 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#ff4a17" d="M11.77,38.53l-5,5.14,3.3-.1M6.57,40l-.1,3.69h.25" transform="translate(-0.47 -0.42)" />
      <Path id="Layer1_16_MEMBER_0_1_STROKES" data-name="Layer1 16 MEMBER 0 1 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#464a53" d="M51.77,29l-2.55-2.5v7.1m0-7.1-.2-.21L46.67,29" transform="translate(-0.47 -0.42)" />
      <Path id="Layer1_16_MEMBER_1_1_STROKES" data-name="Layer1 16 MEMBER 1 1 STROKES" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="#ff4a17" d="M30.32,20l5-5.06v-.25l-3.6.25m3.6,3.61V14.92" transform="translate(-0.47 -0.42)" />
    </SVG>
  )
}

export default motionBlurIn4;