/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const toolbarSpecialPaste = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<G fill='none' stroke='#FFF'>
			<Path d='M13.6 18.9h6.1M13.9 5.5V1.3H1.3v17.2h8.8v-13z' />
			<Path d='M10.1 18.5v4.2h12.6V5.5h-8.8' />
			<Path d='M13.9 5.5h-3.8v13' />
		</G>
		<Path
			fill='none'
			stroke='#FFF'
			d='M16.4 8.7l1.2 2.3 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.3 1.2.5-2.6-1.9-1.8 2.6-.4z'
		/>
	</SVG>
);

export default toolbarSpecialPaste;
