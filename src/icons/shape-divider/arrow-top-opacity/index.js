/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const arrowTopOpacity = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path
				id='arrow-top-opacity-a'
				opacity='.498'
				d='M0 0l640 140L1280 0H0z'
			/>
			<Path id='arrow-top-opacity-b' d='M0 0l640 98 640-98H0z' />
		</defs>
		<use href='#arrow-top-opacity-a' />
		<use href='#arrow-top-opacity-b' />
	</SVG>
);

export default arrowTopOpacity;
