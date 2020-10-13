/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarP = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			fill='#fff'
			d='M6.8 3.5c1-.2 2.4-.3 4.2-.3 2.1 0 3.7.5 4.7 1.5.9.8 1.5 2.1 1.5 3.7s-.4 2.8-1.3 3.8c-1.1 1.3-3 1.9-5.1 1.9-.6 0-1.2 0-1.7-.2v7H6.8V3.5zM9 12c.5.1 1.1.2 1.8.2 2.6 0 4.2-1.3 4.2-3.8C15 6.1 13.4 5 11 5c-.9 0-1.6 0-2 .1V12z'
		/>
	</SVG>
);

export default toolbarP;
