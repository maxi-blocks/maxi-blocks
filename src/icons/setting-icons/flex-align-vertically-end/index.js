/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const flexAlignVerticallyStart = (
	<SVG width={20} height={20} viewBox='0 0 20 20'>
		<G fill='var(--mb)' transform='rotate(180 10 10)'>
			<Path d='M19 20H1a1 1 0 01-1-1V1a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1M2 18h16V2H2z' />
			<Path d='M8.215 12.185a1 1 0 01-1-1V3.526a1 1 0 112 0v7.659a1 1 0 01-1 1' />
			<Path d='M15.683 12.185a1 1 0 01-1-1V3.526a1 1 0 012 0v7.659a1 1 0 01-1 1' />
			<Path d='M11.949 9.271a1 1 0 01-1-1V3.525a1 1 0 112 0v4.746a1 1 0 01-1 1' />
			<Path d='M4.482 9.271a1 1 0 01-1-1V3.525a1 1 0 112 0v4.746a1 1 0 01-1 1' />
		</G>
	</SVG>
);

export default flexAlignVerticallyStart;
