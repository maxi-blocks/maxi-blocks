/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const imageBox = (
	<SVG viewBox='0 0 24 24'>
		<Path
			fill='var(--mpc)'
			stroke='var(--mpc)'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='0'
			d='M15.9 11.8c.5 0 1-.1 1.5-.3 1.7-.7 2.6-2.3 2.3-4-.3-1.8-1.5-3-3-3.3s-3.2.3-4 1.6c-.9 1.3-.7 3 .3 4.6.7.9 1.8 1.4 2.9 1.4zm-1.5-4.9c.3-.5.9-.8 1.6-.8h.4c.5.1 1.2.5 1.5 1.8.2.9-.5 1.5-1.1 1.8-.6.2-1.5.3-2-.5-.7-.9-.8-1.7-.4-2.3z'
		/>
		<Path
			fill='var(--mpc)'
			stroke='var(--mpc)'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='0'
			d='M23 0H1.1a.94.94 0 0 0-1 1v21.6.4a.94.94 0 0 0 1 1H23a.94.94 0 0 0 1-1V1a1.08 1.08 0 0 0-1-1zM2.5 22l4.9-10.5 1.8 6.8c.1.3.3.6.6.7s.7.1.9-.1l4.1-3 6.5 6.2H2.5zM22 19.7l-6.2-6c-.2-.2-.4-.3-.7-.3-.2 0-.4.1-.6.2l-3.6 2.6-2.1-8c-.2-.4-.6-.7-1-.7a1.1 1.1 0 0 0-1 .6L2.1 18.2V2H22v17.7z'
		/>
	</SVG>
);

export default imageBox;
