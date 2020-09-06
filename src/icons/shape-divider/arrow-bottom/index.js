/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const arrowBottom = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path
				id='arrow-bottom'
				d='M0 0v140h640L0 0m1280 140V0L640 140h640z'
			/>
		</defs>
		<use href='#arrow-bottom' />
	</SVG>
);

export default arrowBottom;
