/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const image = (
	<SVG data-name='Layer 1' viewBox='0 0 21.15 21.15'>
		<defs>
			<clipPath id='a'>
				<Path fill='none' d='M0 0H21.15V21.15H0z' />
			</clipPath>
		</defs>
		<g clipPath='url(#a)'>
			<Path
				d='M20.15 19.4v.75H1V1h19.15v18.4l-6.9-6.6-4.2 3L6.8 7.6 1 20.05M16.55 7a2.39 2.39 0 01-.75 1.7 2.3 2.3 0 01-1.75.75 2.35 2.35 0 01-1.7-.75 2.31 2.31 0 010-3.5 2.42 2.42 0 011.7-.7 2.37 2.37 0 011.75.7 2.39 2.39 0 01.75 1.8z'
				stroke='#464a53'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2px'
				fill='none'
			/>
		</g>
	</SVG>
);

export default image;
