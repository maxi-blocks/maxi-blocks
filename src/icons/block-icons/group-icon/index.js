/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const group = (
	<SVG viewBox='0 0 24 24'>
		<Path
			fill='var(--mpc)'
			stroke='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='0'
			d='M15.6 18.1h-3.1a.94.94 0 0 0-1 1 .94.94 0 0 0 1 1h3.1a.94.94 0 0 0 1-1c0-.6-.5-1-1-1zM23 7.4h-6.9V1a.94.94 0 0 0-1-1H1a1.08 1.08 0 0 0-1 1v14.6a.94.94 0 0 0 1 1h6.9V23a.94.94 0 0 0 1 1h14a.94.94 0 0 0 1-1V8.4c.1-.6-.4-1-.9-1zM2 14.6V2h12v5.3H8.9a.94.94 0 0 0-1 1v6.2H2zm12.1-5.2v5.2H9.9V9.4h4.2zM22 22H10v-5.3h5.1a.94.94 0 0 0 1-1V9.4H22V22z'
		/>
	</SVG>
);

export default group;
