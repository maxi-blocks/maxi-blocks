/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const columnIcon = (
	<SVG preserveAspectRatio='none' viewBox='0 0 24 24'>
		<Path
			stroke='var(--maxi-primary-color)'
			strokeWidth='1.5'
			strokeLinejoin='round'
			strokeLinecap='round'
			fill='none'
			d='M1 1h18v18H1z'
		/>
	</SVG>
);

export default columnIcon;
