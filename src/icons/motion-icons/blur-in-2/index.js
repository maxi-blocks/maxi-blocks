/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionBlurIn2 = () => {
    const uniqueID = `motion_blur_in_2_${uniqueId()}`;

    return (
        <SVG
            xmlns='http://www.w3.org/2000/svg'
            data-name='Layer 1'
            viewBox='0 0 72.75 65.25'
        >
            <defs>
                <radialGradient
                    id={uniqueID}
                    cx='-629.98'
                    cy='402.22'
                    r='13.6'
                    gradientTransform='matrix(1 0 0 -1 680.45 432.95)'
                    gradientUnits='userSpaceOnUse'
                >
                    <stop offset='0' stopColor='#999' />
                    <stop offset='1' stopColor='#fff' stopOpacity='0' />
                </radialGradient>
            </defs>
            <Path
                fill={`url(#${uniqueID})`}
                d='M40.82 21.13v17.69h17.7V21.13z'
                data-name='Layer1 18 FILL'
                transform='translate(-.47 -.42)'
            />
            <Path
                fill='none'
                stroke='#464a53'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M45.65 55.36h22.88a3.22 3.22 0 002.4-.86 2.71 2.71 0 00.85-2V4.06a3.88 3.88 0 00-.85-2.2 4.13 4.13 0 00-2.4-.86H3.71a2.6 2.6 0 00-1.86.86A3 3 0 001 4.06V52.5a2.36 2.36 0 00.85 2 2.3 2.3 0 001.86.86h41.94v8.89h4.45m-4.45 0H22.8m4.3 0v-8.89'
                data-name='Layer1 18 1 STROKES'
            />
            <Path
                fill='none'
                stroke='#ff4a17'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M28.96 23.15v-3.57l-5.06 5m5.06-5v-.3l-3.61.3m-8.14 11.73l-5.06 5.15 3.31-.1M12 32.75l-.1 3.75h.25'
                data-name='Layer1 18 2 STROKES'
            />
            <Path
                fill='none'
                stroke='#081219'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M51.75 28.58l-2.55-2.5v7.1m0-7.1l-.2-.21-2.35 2.71'
                data-name='Layer1 18 MEMBER 0 1 STROKES'
            />
        </SVG>
    );
};

export default motionBlurIn2;
