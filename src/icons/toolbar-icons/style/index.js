/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarStyle = (
	<SVG x='0px' y='0px' viewBox='0 0 24 24' xmlSpace='preserve'>
		<Path
			d='M17.8 8.1H6.2m5.7-5.7v4.5m3.4-4.5v5.7M5.4 1.4v9.3c0 .7.3 1.4.8 1.9s1.1.8 1.8.8h1.4V20c0 .8.3 1.4.8 1.9s1.1.8 1.8.8c.8 0 1.4-.3 1.9-.8s.8-1.2.8-1.9v-6.6H16c.7 0 1.3-.3 1.8-.8s.8-1.2.8-1.9V1.4H5.4zm3.2 1v4.5'
			fill='none'
			stroke='#fff'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			transform='translate(.05 .05)'
		/>
	</SVG>
);

export default toolbarStyle;
