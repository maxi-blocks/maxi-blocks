/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const flexAlignEvenly = (
	<SVG width={20} height={20} viewBox='0 0 20 20'>
		<G fill='var(--maxi-black)'>
			<Path d='M19 20H1a1 1 0 01-1-1V1a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1M2 18h16V2H2z' />
			<Path d='M16 14.068H4a1 1 0 110-2h12a1 1 0 010 2' />
			<Path d='M8.747 7.932H4a1 1 0 010-2h4.747a1 1 0 010 2' />
			<Path d='M16 7.932h-4.748a1 1 0 010-2H16a1 1 0 010 2' />
		</G>
	</SVG>
);

export default flexAlignEvenly;
