/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const mountainsBottom = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path
				id='mountains-bottom'
				d='M1214.3 61.3l-79.85-23-70.8 26.75-66.3-14.65-83.65 42.3-97.6-21.3-96.7 41.2-113.6-18.8-99.95 15.9-94.45-10.3-90.1 22.9-78.7-13.1-86.35 18.7-95.65 4.2-60.6-10V140h1280V0l-65.7 61.3z'
			/>
		</defs>
		<use href='#mountains-bottom' />
	</SVG>
);

export default mountainsBottom;
