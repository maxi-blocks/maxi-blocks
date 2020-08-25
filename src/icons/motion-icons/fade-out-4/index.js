/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionFadeOut4 = () => {
    const uniqueID = `motion_fade_out_4_${uniqueId()}`;

    return (
        <SVG
            xmlns='http://www.w3.org/2000/svg'
            data-name='Layer 1'
            viewBox='0 0 72.75 65.25'
        >
            <defs>
                <linearGradient
                    id={uniqueID}
                    x1='14.01'
                    x2='58.64'
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
                d='M45.65 55.35h22.88a3.25 3.25 0 002.4-.84 2.7 2.7 0 00.85-2V4.05a3.83 3.83 0 00-.85-2.2 4.18 4.18 0 00-2.4-.85H3.7a2.62 2.62 0 00-1.85.85A3 3 0 001 4.05v48.46a2.41 2.41 0 00.85 2 2.3 2.3 0 001.85.84h41.95v8.91h4.45m-27.3 0h4.3v-8.91m18.55 8.91H27.1'
                data-name='Layer1 21 1 STROKES'
            />
            <Path
                fill={`url(#${uniqueID})`}
                d='M14.37 8.08v25h44.9v-25z'
                data-name='Layer1 21 MEMBER 0 FILL'
                transform='translate(-.47 -.42)'
            />
            <Path
                fill='none'
                stroke='#081219'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M35.23 22.7h3.57l-5-5m5 5h.28l-.25-3.57'
                data-name='Layer1 21 MEMBER 1 1 STROKES'
            />
            <Path
                fill='none'
                stroke='#ff4a17'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M64.77 48.08l.14-7.28m-.14 7.28l-8.59-8.94m1.48 8.84l7.11.1'
                data-name='Layer1 21 MEMBER 2 1 STROKES'
            />
        </SVG>
    );
};

export default motionFadeOut4;
