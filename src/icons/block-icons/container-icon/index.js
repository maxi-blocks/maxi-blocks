/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const textIcon = (
	<SVG viewBox='0 0 24 24'>
		<Path
			fill='var(--mpc)'
			stroke='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='0'
			d='M15.6 6H18v2.6a.94.94 0 0 0 1 1 .94.94 0 0 0 1-1V5a.94.94 0 0 0-1-1h-3.4a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1zM22.9.1H1.1a.94.94 0 0 0-1 1v21.8a.94.94 0 0 0 1 1h16.1.2.2 5.3a.94.94 0 0 0 1-1V1.1a.94.94 0 0 0-1-1zm-1 21.8h-4.3-.2-.2H2.1V2.1h19.8v19.8zm-6.3-1.8H19a.94.94 0 0 0 1-1v-3.7a.94.94 0 0 0-1-1 .94.94 0 0 0-1 1v2.7h-2.4a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1zm-10.7 0h3.3a.94.94 0 0 0 1-1 .94.94 0 0 0-1-1H5.9v-2.7a.94.94 0 0 0-1-1 .94.94 0 0 0-1 1v3.7a1.08 1.08 0 0 0 1 1zm0-10.4a.94.94 0 0 0 1-1V6h2.3a.94.94 0 0 0 1-1 .94.94 0 0 0-1-1H4.9a.94.94 0 0 0-1 1v3.6c0 .6.5 1.1 1 1.1z'
		/>
	</SVG>
);

export default textIcon;
