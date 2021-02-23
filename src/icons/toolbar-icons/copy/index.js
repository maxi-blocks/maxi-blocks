/**
 * WordPress dependencies
 */
const { SVG, Path, G } = wp.primitives;

const toolbarCopy = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<G fill='none' stroke='#FFF'>
			<Path d='M19.7 5.1h-6.1M19.7 14.6h-6.1M19.7 11.5h-6.1M19.7 8.3h-6.1M10.1 18.5v-13H1.3v17.2h12.6v-4.2z' />
			<Path d='M13.9 18.5h8.8V1.3H10.1v4.2M10.1 5.5v13h3.8' />
		</G>
	</SVG>
);

export default toolbarCopy;
