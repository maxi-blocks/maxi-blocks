/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarDrop = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 20 20'
		fill='none'
		stroke='#141516'
		strokeWidth='1.5'
		strokeLinejoin='round'
	>
		<Path d='M15.689 11.67c-.1-.1-.1-.1 0 0-1.3-.8-2.8-.7-3.8.3l-.5.5v-7.2a1.54 1.54 0 0 0-1.5-1.5 1.54 1.54 0 0 0-1.5 1.5v3.3c-1.9-.4-3.9.4-5 2-.6 1-.9 2.2-.9 3.4 0 2.7 2.1 4.9 4.8 4.9 1.2 0 2.4-.5 3.3-1.4h0l5.1-5.2c.2-.1.2-.4 0-.6z' />
		<g strokeLinecap='round'>
			<path d='M16.489 6.07l2.5-2.6-2.5-2.6' />
			<path d='M14.289 3.57h4.7m-18 0h4.7' />
			<path d='M3.489.97l-2.5 2.6 2.5 2.6' />
		</g>
	</SVG>
);

export default toolbarDrop;
