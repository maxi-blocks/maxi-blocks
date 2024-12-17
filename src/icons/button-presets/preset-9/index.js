/**
 * WordPress dependencies
 */
import { SVG, Path, G, Defs, Circle } from '@wordpress/primitives';

const presetNine = () => (
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
					stroke='#fff'
					strokeWidth='1.5'
					d='M0 0h19.982v17.489H0z'
				/>
			</clipPath>
		</Defs>
		<Circle cx='16.5' cy='16.5' r='16.5' fill='#163247' />
		<G transform='translate(7 8)' clipPath='url(#A)'>
			<Path
				d='M1.942 5.646h8.267v-3.7c0-.418.252-.794.638-.954s.83-.072 1.125.224l6.8 6.8c.194.194.303.457.303.73s-.109.537-.303.73l-6.8 6.8c-.295.295-.739.383-1.125.224s-.637-.536-.638-.954v-3.7H1.942c-.275 0-.538-.11-.732-.304s-.302-.459-.301-.734v-4.13c0-.571.462-1.033 1.033-1.033z'
				fill='none'
				stroke='#fff'
				strokeLinejoin='round'
				strokeWidth='1.5'
			/>
		</G>
	</SVG>
);

export default presetNine;
