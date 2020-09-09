/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const waveBottom = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 112'
	>
		<defs>
			<Path
				id='wave-bottom'
				d='M1280 70q-40 10.5-61.25 15.4-35.4 8.25-68.75 13.5-83.35 13.1-190 13.1T770 98.9q-33.35-5.25-68.75-13.5Q680 80.5 640 70t-61.25-15.4q-35.4-8.2-68.75-13.45Q426.65 28 320 28T130 41.15Q96.65 46.4 61.25 54.6 40 59.5 0 70v70h1280V70z'
			/>
		</defs>
		<use transform='translate(0 -28)' href='#wave-bottom' />
	</SVG>
);

export default waveBottom;
