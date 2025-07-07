/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const textIcon = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			fill='var(--maxi-primary-color)'
			stroke='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M23 0h-5.4a.94.94 0 0 0-1 1v22a.94.94 0 0 0 1 1H23a.94.94 0 0 0 1-1V1c0-.5-.4-1-1-1zm-1 22h-3.4V2H22v20zM5.4 0H1C.4 0 0 .5 0 1v22a.94.94 0 0 0 1 1h4.4a.94.94 0 0 0 1-1V1c0-.5-.4-1-1-1zm-1 22H2V2h2.4v20zm9.3-22H9.3a.94.94 0 0 0-1 1v22a.94.94 0 0 0 1 1h4.4a.94.94 0 0 0 1-1V1c0-.5-.4-1-1-1zm-1 22h-2.4V2h2.4v20z'
		/>
	</SVG>
);

export default textIcon;
