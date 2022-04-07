/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarAlignRight = (
	<SVG width={16} height={17.5} viewBox='0 0 16 17.5'>
		<Path
			d='M16 0H5.8M16 3.9H0m16 3.8H5.8M16 11.6H0M16 16H5.8'
			strokeLinejoin='round'
			strokeWidth={1.5}
			transform='translate(0 .75)'
		/>
	</SVG>
);

export default toolbarAlignRight;
