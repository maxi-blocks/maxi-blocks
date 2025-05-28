/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const textIcon = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			fill='none'
			stroke='var(--maxi-primary-color)'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
			d='M1.8 2.4v5.4H5V6.4c0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h4.2v11.8c0 .4-.1.7-.4.9-.3.3-.6.4-.9.4H7.3v3.1h9.3v-3.1h-1.3c-.4 0-.7-.1-.9-.4-.3-.3-.4-.6-.4-.9V5.4h4.2c.2 0 .5.1.6.3.1.2.2.4.2.7v1.4h3.2V2.4H1.8z'
		/>
	</SVG>
);

export default textIcon;
