/**
 * WordPress dependencies
 */
import { SVG, Path, G, Defs, Rect } from '@wordpress/primitives';

const presetTen = () => (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		width='33'
		height='33'
		viewBox='0 0 33 33'
	>
		<Defs>
			<clipPath id='A'>
				<Path
					fill='none'
					stroke='#163247'
					strokeWidth='1.5'
					d='M0 0h19.982v17.489H0z'
				/>
			</clipPath>
		</Defs>
		<G fill='#fff' stroke='#163247'>
			<Rect width='33' height='33' rx='5' stroke='none' />
			<Rect
				x='.75'
				y='.75'
				width='31.5'
				height='31.5'
				rx='4.25'
				fill='none'
				strokeWidth='1.5'
			/>
		</G>
		<G transform='translate(7 8)' clipPath='url(#A)'>
			<Path
				d='M1.942 5.646h8.267v-3.7c0-.418.252-.794.638-.954s.83-.072 1.125.224l6.8 6.8c.194.194.303.457.303.73s-.109.537-.303.73l-6.8 6.8c-.295.295-.739.383-1.125.224s-.637-.536-.638-.954v-3.7H1.942c-.275 0-.538-.11-.732-.304s-.302-.459-.301-.734v-4.13c0-.571.462-1.033 1.033-1.033z'
				fill='none'
				stroke='#163247'
				strokeLinejoin='round'
				strokeWidth='1.5'
			/>
		</G>
	</SVG>
);

export default presetTen;
