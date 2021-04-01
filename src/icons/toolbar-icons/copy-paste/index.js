/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const toolbarCopyPaste = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			fill='none'
			stroke='#FFF'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
			d='M13.6 18.9h6.1M13.6 15.5h6.1M13.6 12.2h6.1M13.6 8.9h6.1M5.2 14.5H10M5.2 11.1H10M5.2 7.8H10M5.2 4.5H10'
		/>
		<G
			fill='none'
			stroke='#FFF'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
		>
			<Path d='M13.9 5.5V1.3H1.3v17.2h8.8v-13z' />
			<Path d='M10.1 18.5v4.2h12.6V5.5h-8.8' />
			<Path d='M13.9 5.5h-3.8v13' />
		</G>
	</SVG>
);

export default toolbarCopyPaste;
