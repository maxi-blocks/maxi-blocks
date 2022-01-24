/**
 * WordPress dependencies
 */
import { SVG, RadialGradient, Circle, Stop } from '@wordpress/primitives';

const motionBlur = (
	<SVG viewBox='0 0 24 24'>
		<RadialGradient
			id='maxi_svg_blur_a'
			cx={12.273}
			cy={11.669}
			r={11.69}
			gradientUnits='userSpaceOnUse'
		>
			<Stop offset={0.292} />
			<Stop offset={1} stopColor='#fff' />
		</RadialGradient>
		<Circle
			cx={12.3}
			cy={11.7}
			r={11.7}
			opacity={0.5}
			fill='url(#maxi_svg_blur_a)'
		/>
	</SVG>
);

export default motionBlur;
