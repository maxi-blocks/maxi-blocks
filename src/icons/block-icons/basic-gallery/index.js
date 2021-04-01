/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const basicGallery = (
	<SVG viewBox='0 0 24 24'>
		<Path
			d='M16.45 16.4h5.5v5.4h-5.5v-5.4zm0-7.1h5.5v5.4h-5.5V9.3zm0-7.1h5.5v5.4h-5.5V2.2zm-7.2 0h5.5v5.4h-5.5V2.2zm-7.1 7.1h5.4v5.4h-5.4V9.3zm0-7.1h5.4v5.4h-5.4V2.2zm7.1 14.2h5.5v5.4h-5.5v-5.4zm-7.1 0h5.4v5.4h-5.4v-5.4zm7.1-7.1h5.5v5.4h-5.5V9.3z'
			fill='none'
			stroke='#ff4a17'
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</SVG>
);

export default basicGallery;
