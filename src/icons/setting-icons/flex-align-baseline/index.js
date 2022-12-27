/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const flexAlignBaseline = (
	<SVG width={20} height={20} viewBox='0 0 20 20'>
		<G fill='#090f13'>
			<Path d='M19 20H1a1 1 0 01-1-1V1a1 1 0 011-1h18a1 1 0 011 1v18a1 1 0 01-1 1M2 18h16V2H2z' />
			<Path d='M8.561 9.93H4a1 1 0 01-1-1V4.366a1 1 0 011-1h4.561a1 1 0 011 1V8.93a1 1 0 01-1 1' />
			<Path d='M15.975 8.835H11.41a1 1 0 01-1-1V5.46a1 1 0 011-1h4.565a1 1 0 011 1v2.375a1 1 0 01-1 1' />
			<Path d='M15.975 17.085H4a1 1 0 01-1-1v-3.911a1 1 0 011-1h11.975a1 1 0 011 1v3.911a1 1 0 01-1 1' />
		</G>
	</SVG>
);

export default flexAlignBaseline;
