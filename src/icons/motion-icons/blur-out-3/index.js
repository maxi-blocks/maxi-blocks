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
					cx='-714.03'
					cy='402.22'
					r='18.6'
					gradientTransform='matrix(1 0 0 -1 763.9 432.95)'
					gradientUnits='userSpaceOnUse'
				>
					<stop offset='0' stopColor='#999' />
					<stop offset='1' stopColor='#fff' stopOpacity='0' />
				</radialGradient>
			</defs>
			<Path
				fill={`url(#${uniqueID})`}
				d='M37.18 17.23v25.5h25.5v-25.5z'
				data-name='Layer1 17 FILL'
				transform='translate(-.47 -.42)'
			/>
			<Path
				fill='none'
				stroke='#464a53'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M45.66 55.36h22.87a3.26 3.26 0 002.41-.86 2.74 2.74 0 00.84-2V4.06a3.93 3.93 0 00-.84-2.2A4.15 4.15 0 0068.53 1H3.71a2.6 2.6 0 00-1.86.86A3 3 0 001 4.06V52.5a2.36 2.36 0 00.85 2 2.3 2.3 0 001.86.86h42v8.89h4.44m-4.44 0H22.8m4.3 0v-8.89'
				data-name='Layer1 17 1 STROKES'
			/>
			<Path
				fill='none'
				stroke='#ff4a17'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M10.21 34.5v3.75h.3l5-5.1m-5 5.1h3.29m12-15.31l5-5v-.36l-3.54.3m3.59 3.6l-.05-3.6'
				data-name='Layer1 17 2 STROKES'
			/>
			<Path
				fill='none'
				stroke='#081219'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M52 29.01l-2.55 2.5v-7.1m0 7.1l-.2.2-2.35-2.7'
				data-name='Layer1 17 MEMBER 0 1 STROKES'
			/>
		</SVG>
	);
};

export default motionBlurOut1;
