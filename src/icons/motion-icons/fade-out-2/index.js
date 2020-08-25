/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFadeOut2 = () => {
    const uniqueID = `motion_fade_out_2_${uniqueId()}`;

    return (
        <SVG
            xmlns='http://www.w3.org/2000/svg'
            data-name='Layer 1'
            viewBox='0 0 72.75 65.25'
        >
            <defs>
                <linearGradient
                    id={uniqueID}
                    x1='25.4'
                    x2='47.85'
                    y1='47.42'
                    y2='47.42'
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
                d='M45.53 55.35H69.1a3 3 0 001.8-.82 2.7 2.7 0 00.85-2V4.05a3.83 3.83 0 00-.85-2.2A4.18 4.18 0 0068.53 1H3.7a2.62 2.62 0 00-1.85.85A3 3 0 001 4.05v48.46a2.38 2.38 0 00.85 2 2.3 2.3 0 001.85.84h41.83l.1 1.2v7.71h4.45m-27.3 0h4.3v-7.68l-.1-1.2m18.65 8.91H27.1'
                data-name='Layer1 23 1 STROKES'
            />
            <Path
                fill={`url(#${uniqueID})`}
                d='M48 8.08H25.47v25H48z'
                data-name='Layer1 23 MEMBER 0 FILL'
                transform='translate(-.47 -.42)'
            />
            <Path
                fill='none'
                stroke='#081219'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M35.17 22.74h3.57l-5-5m5 5h.29l-.25-3.57'
                data-name='Layer1 23 MEMBER 1 1 STROKES'
            />
            <Path
                fill='none'
                stroke='#ff4a17'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M64.9 48.12l.14-7.28m-.14 7.28l-8.59-8.95m1.49 8.84l7.1.11'
                data-name='Layer1 23 MEMBER 2 1 STROKES'
            />
        </SVG>
    );
};

export default motionFadeOut2;
