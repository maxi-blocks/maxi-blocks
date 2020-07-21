/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFade = () => {
    const uniqueID = 'motion_fade_' + uniqueId();

    return (
        <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <linearGradient id={uniqueID} gradientUnits="userSpaceOnUse" x1=".54" y1="12" x2="23.46" y2="12">
                <stop offset="0" stop-color="#fff"/>
                <stop offset="1"/>
            </linearGradient>
            <circle cx="12" cy="12" r="11.5" opacity=".2" fill={`url(#${uniqueID})`}/>
            <Path d="M13.1 6.9l5.1 5-5 5.2m5-5.2l-12.4.2" fill="none" stroke="#232533" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </SVG>
    )
}

export default motionFade;