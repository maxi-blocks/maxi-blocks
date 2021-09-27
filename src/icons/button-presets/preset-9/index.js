/**
 * WordPress dependencies
 */
import { SVG, Circle, Path } from '@wordpress/primitives';

const presetNine = () => (
	<SVG xmlns='http://www.w3.org/2000/svg'>
		<Circle cx={17.5} cy={17.5} r={17.5} fill='#163247' />
		<Path
			d='M26.5 11.9a8.3 8.3 0 01-2.1.6c.8-.5 1.4-1.2 1.6-2-.7.4-1.5.7-2.3.9-1.4-1.5-3.7-1.6-5.2-.2-.7.7-1.2 1.7-1.2 2.7 0 .3 0 .6.1.8-3-.1-5.7-1.5-7.6-3.9-1 1.7-.5 3.8 1.1 4.9-.6 0-1.2-.2-1.7-.5h0c0 1.8 1.2 3.3 3 3.6-.3.1-.6.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.5 3.4 2.6-1.3 1-2.9 1.6-4.6 1.6h-.9a10.56 10.56 0 005.7 1.7c5.8 0 10.5-4.6 10.5-10.4v-.6c.8-.4 1.4-1 1.9-1.8z'
			fill='none'
			stroke='#fff'
			strokeWidth={1.5}
			strokeLinejoin='round'
		/>
	</SVG>
);

export default presetNine;
