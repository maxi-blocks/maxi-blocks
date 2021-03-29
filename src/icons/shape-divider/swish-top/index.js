/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const swishTop = (
	<SVG
		xmlns='http://www.w3.org/2000/SVG'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path
				id='swish-top'
				d='M1280 140V0H0q35.8 8.75 100.6 21.9Q230.15 48.15 374.9 70q202.65 30.6 406.85 48.15Q1036.95 140 1280 140z'
			/>
		</defs>
		<use href='#swish-top' />
	</SVG>
);

export default swishTop;
