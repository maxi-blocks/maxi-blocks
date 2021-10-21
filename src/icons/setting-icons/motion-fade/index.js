/**
 * WordPress dependencies
 */
import { SVG, Path, LinearGradient, Stop, Circle } from '@wordpress/primitives';

const motionFade = (
	<SVG viewBox='0 0 24 24'>
		<LinearGradient
			id='maxi_svg_fade_q'
			gradientUnits='userSpaceOnUse'
			x1={0.54}
			y1={12}
			x2={23.46}
			y2={12}
		>
			<Stop offset={0} stopColor='#fff' />
			<Stop offset={1} />
		</LinearGradient>
		<Circle
			cx={12}
			cy={12}
			r={11.5}
			opacity={0.2}
			fill='url(#maxi_svg_fade_q)'
		/>
		<Path
			d='M13.1 6.9l5.1 5-5 5.2m5-5.2l-12.4.2'
			fill='none'
			stroke='#232533'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</SVG>
);

export default motionFade;
