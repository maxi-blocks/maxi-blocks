/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFadeIn4 = () => {
    const uniqueID = `motion_fade_in_4_${uniqueId()}`;

    return (
        <SVG
            xmlns='http://www.w3.org/2000/svg'
            data-name='Layer 1'
            viewBox='0 0 72.75 65.25'
        >
            <defs>
                <linearGradient
                    id={uniqueID}
                    x1='59.49'
                    x2='14.76'
                    y1='31.92'
                    y2='31.92'
                    gradientTransform='matrix(1 0 0 -1 0 68)'
                    gradientUnits='userSpaceOnUse'
                >
                    <stop offset='0' stopColor='#999' />
                    <stop offset='1' stopColor='#fff' stopOpacity='0' />
                </linearGradient>
            </defs>
            <Path
                fill='none'
                stroke='#464a53'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M45.65 55.36h22.88a3.22 3.22 0 002.4-.86 2.67 2.67 0 00.85-2V4.06a3.78 3.78 0 00-.85-2.2 4.13 4.13 0 00-2.4-.86H3.7a2.6 2.6 0 00-1.85.86A3 3 0 001 4.06V52.5a2.4 2.4 0 00.85 2 2.29 2.29 0 001.85.86h41.95v8.89h4.45m-4.45 0H22.8m4.3 0v-8.89'
                data-name='Layer1 28 1 STROKES'
            />
            <Path
                fill={`url(#${uniqueID})`}
                d='M59.27 23.58h-44.9v25h44.9z'
                data-name='Layer1 28 MEMBER 0 FILL'
                transform='translate(-.47 -.42)'
            />
            <Path
                fill='none'
                stroke='#081219'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M35.23 38.16h3.57l-5-5m5 5h.28l-.25-3.58'
                data-name='Layer1 28 MEMBER 1 1 STROKES'
            />
            <Path
                fill='none'
                stroke='#ff4a17'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M64.69 7.75l.14 7.28m-.14-7.28l-8.59 8.94m1.49-8.84l7.1-.1'
                data-name='Layer1 28 MEMBER 2 1 STROKES'
            />
        </SVG>
    );
};

export default motionFadeIn4;
