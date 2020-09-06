/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const slantTop = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path id='slant-top' d='M1280 140V0H0l1280 140z' />
		</defs>
		<use href='#slant-top' />
	</SVG>
);

export default slantTop;
