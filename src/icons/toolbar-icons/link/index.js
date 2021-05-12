/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarLink = (
	<SVG x='0px' y='0px' viewBox='0 0 24 24' xmlSpace='preserve'>
		<Path
			d='M13.5 6.1L17 2.7c.7-.7 1.5-1.1 2.4-1.1 1 0 1.8.4 2.5 1.1.6.7 1 1.5 1 2.4 0 1.1-.4 1.9-1.1 2.4l-6.1 6.3c-.7.7-1.5 1-2.4 1-1 0-1.8-.3-2.4-1m-.5 4.2L7 21.4c-.6.7-1.4 1-2.4 1s-1.8-.3-2.4-.9c-.7-.7-1.1-1.5-1.1-2.5s.3-1.8 1-2.5l6.3-6.3c.6-.6 1.4-.9 2.4-.9s1.8.3 2.4.9'
			fill='none'
			stroke='#fff'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</SVG>
);

export default toolbarLink;
