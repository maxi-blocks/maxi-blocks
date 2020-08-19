/**
 * WordPress dependencies
 */
const { SVG } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionBlur = () => {
    const uniqueID = 'motion_blur_' + uniqueId();

    return (
        <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <radialGradient id={uniqueID} cx="12.273" cy="11.669" r="11.69" gradientUnits="userSpaceOnUse">
                <stop offset=".292" />
                <stop offset="1" stopColor="#fff" />
            </radialGradient><circle cx="12.3" cy="11.7" r="11.7" opacity=".5" fill={`url(#${uniqueID})`} />
        </SVG>
    )
}

export default motionBlur;