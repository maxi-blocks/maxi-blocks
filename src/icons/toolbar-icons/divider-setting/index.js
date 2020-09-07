/**
 * WordPress dependencies
 */
const { SVG, Path, G } = wp.primitives;

const toolbarDividerSetting = (
	<SVG
		version='1.1'
		id='Layer_1'
		xmlns='http://www.w3.org/2000/svg'
		x='0'
		y='0'
		viewBox='0 0 24 24'
		space='preserve'
	>
		<G>
			<Path
				fill='none'
				stroke='#fff'
				strokeWidth='1.5'
				strokeLinecap='round'
				join='round'
				d='M12.1 15.1l-.1 7.3m.1-13.3L12 1.9'
			/>
		</G>
		<G transform='translate(.75 -.8)'>
			<Path
				fill='none'
				stroke='#fff'
				strokeWidth='1.5'
				strokeLinecap='round'
				join='round'
				d='M1.3 14.1h19.9M1.3 11.6h19.9'
			/>
		</G>
		<G transform='translate(0 1.5)'>
			<Path
				fill='none'
				stroke='#fff'
				strokeWidth='1.5'
				strokeLinecap='round'
				join='round'
				d='M11.8 7.6l-1.4-1.7m3.2 0l-1.5 1.7'
			/>
		</G>
		<G transform='matrix(1 0 0 -1 0 22.7)'>
			<Path
				fill='none'
				stroke='#fff'
				strokeWidth='1.5'
				strokeLinecap='round'
				join='round'
				d='M11.8 7.6l-1.4-1.7m3.2 0l-1.5 1.7'
			/>
		</G>
	</SVG>
);

export default toolbarDividerSetting;
