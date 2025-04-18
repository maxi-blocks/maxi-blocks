/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const flexJustifySpaseBetween = (
	<SVG width={20} height={20} viewBox='0 0 20 20'>
		<G fill='var(--maxi-black)'>
			<Path d='M19 0H1a1 1 0 00-1 1v18a1 1 0 001 1h18a1 1 0 001-1V1a1 1 0 00-1-1M2 18v-.857a.987.987 0 00.733.332 1 1 0 001-1V3.525a1 1 0 00-1-1A.987.987 0 002 2.857V2h16v.638a.973.973 0 00-.439-.113 1 1 0 00-1 1v12.95a1 1 0 001 1 .972.972 0 00.439-.112V18z' />
			<Path d='M10 2.525a1 1 0 00-1 1v12.95a1 1 0 002 0V3.525a1 1 0 00-1-1' />
		</G>
	</SVG>
);

export default flexJustifySpaseBetween;
