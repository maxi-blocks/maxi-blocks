/**
 * WordPress dependencies
 */
const { SVG } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const backgroundGradient = () => {
    const uniqueID = `gradient_${uniqueId()}`;

    return (
        <SVG x='24px' y='24px' viewBox='0 0 24 24' xmlSpace='preserve'>
            <linearGradient
                id={uniqueID}
                gradientUnits='userSpaceOnUse'
                x1={0.3129}
                y1={12}
                x2={23.687}
                y2={12}
            >
                <stop offset={0} stopColor='#fff' />
                <stop offset={1} />
            </linearGradient>
            <circle cx={12} cy={12} r={11.7} fill={`url(#${uniqueID})`} />
        </SVG>
    );
};

export default backgroundGradient;
