/**
 * WordPress dependencies
 */
const { SVG, Path, G } = wp.primitives;

const cloudLib = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path fill='none' stroke='#474A54' d='M1 1h22v22H1z' />
		<G fill='none' stroke='#F04F26'>
			<Path d='M3 3h8v6.6H3zM10.5 11H8.4' />
		</G>
		<G fill='none' stroke='#F04F26'>
			<Path d='M12.9 3h8v6.6h-8zM20.4 11h-2.1' />
		</G>
		<G fill='none' stroke='#F04F26'>
			<Path d='M3 13.1h8v6.6H3zM10.5 21H8.4' />
		</G>
		<G fill='none' stroke='#F04F26'>
			<Path d='M12.9 13.1h8v6.6h-8zM20.4 21h-2.1' />
		</G>
	</SVG>
);

export default cloudLib;
