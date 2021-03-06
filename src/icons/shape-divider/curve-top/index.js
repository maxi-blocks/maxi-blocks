/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const curveTop = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 140'
	>
		<defs>
			<Path
				id='curve-top'
				d='M1229.7 21.9Q1262.1 8.75 1280 0H0q17.9 8.75 50.3 21.9Q115.05 48.15 187.45 70q101.3 30.6 203.4 48.15Q518.5 140 640 140t249.1-21.85q102.1-17.5 203.45-48.15 72.35-21.85 137.15-48.1z'
			/>
		</defs>
		<use href='#curve-top' />
	</SVG>
);

export default curveTop;
