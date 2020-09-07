/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const motionHorizontal = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			d='M17 1.4L22.7 7l-5.6 5.7M22.7 7l-13.9.1M7 22.6L1.3 17l5.6-5.7M1.3 17l13.9-.1'
			stroke='#232533'
			strokeWidth='1.5'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</SVG>
);

export default motionHorizontal;
