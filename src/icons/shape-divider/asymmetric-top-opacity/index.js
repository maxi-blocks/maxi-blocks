/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const asymmetricTopOpacity = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 122'
	>
		<defs>
			<Path
				id='asymmetric-top-opacity-a'
				fillOpacity='.498'
				d='M978.8 122.25q20.45 2.45 39.1-6L1280 0H0l978.8 122.25z'
			/>
			<Path
				id='asymmetric-top-opacity-b'
				d='M983.15 95.2q15.9 1.5 30.85-3.7L1280 0H0l983.15 95.2z'
			/>
		</defs>
		<use href='#asymmetric-top-opacity-a' />
		<use href='#asymmetric-top-opacity-b' />
	</SVG>
);

export default asymmetricTopOpacity;
