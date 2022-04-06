/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarAlignLeft = (
	<SVG width={16} height={17.5} viewBox='0 0 16 17.5'>
		<Path
			d='M10.2 0H0m16 3.9H0m10.2 3.8H0m16 3.9H0M10.2 16H0'
			strokeLinejoin='round'
			strokeWidth={1.5}
			transform='translate(0 .75)'
		/>
	</SVG>
);

export default toolbarAlignLeft;
