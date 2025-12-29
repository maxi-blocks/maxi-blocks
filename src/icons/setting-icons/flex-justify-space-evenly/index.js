/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const flexJustifySpaseEvenly = (
	<SVG width={20} height={20} viewBox='0 0 20 20'>
		<G fill='var(--mb)'>
			<Path d='M19 20H1a1 1 0 01-1-1V1a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1M2 18h16V2H2z' />
			<Path d='M9.944 17.475a1 1 0 01-1-1V3.525a1 1 0 112 0v12.95a1 1 0 01-1 1' />
			<Path d='M14.416 17.475a1 1 0 01-1-1V3.525a1 1 0 012 0v12.95a1 1 0 01-1 1' />
			<Path d='M5.472 17.475a1 1 0 01-1-1V3.525a1 1 0 012 0v12.95a1 1 0 01-1 1' />
		</G>
	</SVG>
);

export default flexJustifySpaseEvenly;
