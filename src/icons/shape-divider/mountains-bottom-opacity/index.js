/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const mountainsBottomOpacity = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 134'
	>
		<defs>
			<Path
				id='mountains-bottom-opacity-a'
				fillOpacity='.498'
				d='M1279.95 99.15L1280 135H0V8.3L60.6.9 156.25 4l86.35 13.9 78.7-9.75 90.1 17.1 94.45-7.7L582.8 29.4l82.65-13.95 76.95 8.5 73.7 22.1 97.6-7.3 83.65 22.95 66.3-10.95 70.8 18.2h79.85z'
			/>
			<Path
				id='mountains-bottom-opacity-b'
				d='M1280 134.95v.05H0V7.1l60.6-4.85 95.65 31.5 86.35-9.2 78.7 36.1 90.1-24.4 94.45 38.4L583.8 46.3l91.65 25.25L752.4 38.2l63.7 21.4 97.6-7.05 83.65 29.6 66.3-11.7 70.8 23.35 74.85 4.6z'
			/>
		</defs>
		<use href='#mountains-bottom-opacity-a' />
		<use href='#mountains-bottom-opacity-b' />
	</SVG>
);

export default mountainsBottomOpacity;
