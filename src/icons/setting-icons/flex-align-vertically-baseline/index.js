/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const flexAlignVerticallyStart = (
	<SVG width={20} height={20} viewBox='0 0 20 20'>
		<G fill='var(--maxi-black)'>
			<Path d='M19 0H1a1 1 0 00-1 1v18a1 1 0 001 1h18a1 1 0 001-1V1a1 1 0 00-1-1m-1 18H2V2h16z' />
			<Path d='M4.482 11.916a1 1 0 001-1V9.543h1.733v4.287a1 1 0 002 0V9.543h1.734v1.373a1 1 0 102 0V9.543h1.734v4.287a1 1 0 002 0V6.17a1 1 0 00-2 0v1.373h-1.734V6.17a1 1 0 00-2 0v1.373H9.215V6.17a1 1 0 00-2 0v1.373H5.482V6.17a1 1 0 10-2 0v4.746a1 1 0 001 1' />
		</G>
	</SVG>
);

export default flexAlignVerticallyStart;
