/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const numberCounterIcon = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			fill='none'
			stroke='#FF4A17'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
			d='M22.1 12c0 2.8-1 5.2-3 7.1s-4.3 3-7.1 3-5.2-1-7.2-3-2.9-4.3-2.9-7.1 1-5.2 2.9-7.2'
		/>
		<g fill='#FF4A17' stroke='#FF4A17' strokeMiterlimit='10'>
			<Path d='M6.8 14.7c.3.2 1 .5 1.7.5 1.4 0 1.8-.9 1.8-1.5 0-1.1-1-1.6-2-1.6h-.6v-.8h.6c.7 0 1.7-.4 1.7-1.3 0-.6-.4-1.2-1.4-1.2-.6 0-1.2.3-1.5.5l-.3-.7c.4-.3 1.2-.6 2-.6 1.5 0 2.2.9 2.2 1.9 0 .8-.5 1.5-1.4 1.8v0c1 .2 1.7.9 1.7 2 0 1.2-1 2.3-2.8 2.3-.9 0-1.6-.3-2-.5l.3-.8zM12.9 14.7c.3.2 1 .5 1.7.5 1.4 0 1.8-.9 1.8-1.5 0-1.1-1-1.6-2-1.6h-.6v-.8h.6c.8 0 1.7-.4 1.7-1.3 0-.6-.4-1.2-1.4-1.2-.6 0-1.2.3-1.6.5l-.3-.8c.6-.2 1.3-.5 2.2-.5 1.5 0 2.2.9 2.2 1.9 0 .8-.5 1.5-1.4 1.8v0c1 .2 1.7.9 1.7 2 0 1.2-1 2.3-2.8 2.3-.9 0-1.6-.3-2-.5l.2-.8z' />
		</g>
	</SVG>
);

export default numberCounterIcon;
