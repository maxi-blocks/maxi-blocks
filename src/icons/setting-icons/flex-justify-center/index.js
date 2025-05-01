/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const flexJustifyCenter = (
	<SVG width={20} height={20} viewBox='0 0 20 20'>
		<G fill='var(--maxi-black)'>
			<Path d='M19 20H1a1 1 0 01-1-1V1a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1M2 18h16V2H2z' />
			<Path d='M6.546 17.475a1 1 0 01-1-1V3.526a1 1 0 112 0v12.949a1 1 0 01-1 1' />
			<Path d='M10 17.475a1 1 0 01-1-1V3.526a1 1 0 112 0v12.949a1 1 0 01-1 1' />
			<Path d='M13.453 17.475a1 1 0 01-1-1V3.526a1 1 0 112 0v12.949a1 1 0 01-1 1' />
		</G>
	</SVG>
);

export default flexJustifyCenter;
