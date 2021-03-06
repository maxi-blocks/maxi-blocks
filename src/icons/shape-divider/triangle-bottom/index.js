/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const tirangleBottom = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path
				id='tirangle-bottom'
				d='M560 0l80 140H0V0h560m720 0v140H640L720 0h560z'
			/>
		</defs>
		<use href='#tirangle-bottom' />
	</SVG>
);

export default tirangleBottom;
