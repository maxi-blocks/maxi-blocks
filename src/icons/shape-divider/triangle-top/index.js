/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const tirangleTop = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path
				id='tirangle-top'
				d='M560 140L640 0H0v140h560m720 0V0H640l80 140h560z'
			/>
		</defs>
		<use href='#tirangle-top' />
	</SVG>
);

export default tirangleTop;
