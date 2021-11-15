/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const paddingSyncDirection = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 19.5 19.5'>
		<Path
			fill='none'
			stroke='#141516'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
			d='M16.015 18.75H3.967M18.75 3.531v12.19M3.967.75h12.048M.75 15.721V3.531'
		/>
		<Path
			fill='none'
			stroke='#141516'
			strokeDasharray='3 3 3 3 3'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
			d='M15.679 15.679H3.821V3.825h11.858Z'
		/>
	</SVG>
);

export default paddingSyncDirection;
