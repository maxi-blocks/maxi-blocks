/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

const motionBlurOut1 = () => {
    const uniqueID = `motion_blur_out_1_${uniqueId()}`;

    return (
        <SVG
            xmlns='http://www.w3.org/2000/svg'
            data-name='Layer 1'
            viewBox='0 0 72.75 65.25'
        >
            <defs>
                <radialGradient
                    id={uniqueID}
                    cx='-546.03'
                    cy='402.22'
                    r='10.45'
                    gradientTransform='matrix(1 0 0 -1 596.15 432.2)'
                    gradientUnits='userSpaceOnUse'
                >
                    <stop offset='0' stopColor='#999' />
                    <stop offset='1' stopColor='#fff' stopOpacity='0' />
                </radialGradient>
            </defs>
            <Path
                fill={`url(#${uniqueID})`}
                d='M57.47 37.32V22.57H42.72v14.75z'
                data-name='Layer1 19 FILL'
                transform='translate(-.47 -.42)'
            />
            <Path
                fill='none'
                stroke='#464a53'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M45.66 55.36h22.87a3.26 3.26 0 002.41-.86 2.74 2.74 0 00.84-2V4.06a3.93 3.93 0 00-.84-2.2A4.15 4.15 0 0068.53 1H3.71a2.6 2.6 0 00-1.86.86A3 3 0 001 4.06V52.5a2.36 2.36 0 00.85 2 2.3 2.3 0 001.86.86h42v8.89h4.44m-4.44 0H22.8m4.3 0v-8.89'
                data-name='Layer1 19 1 STROKES'
            />
            <Path
                fill='none'
                stroke='#081219'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M52.16 29.06l-2.56 2.52v-7.1m0 7.1l-.19.2-2.36-2.7'
                data-name='Layer1 19 MEMBER 0 1 STROKES'
            />
            <Path
                fill='none'
                stroke='#ff4a17'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13.92 37.21l5-5m-5 5h-.28l.24-3.57m3.65 3.61h-3.57m8.2-8.2l5.16-5-.1 3.29m-3.69-3.56l3.75-.07v.28'
                data-name='Layer1 19 MEMBER 1 1 STROKES'
            />
        </SVG>
    );
};

export default motionBlurOut1;
