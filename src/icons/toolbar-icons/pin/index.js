/**
 * WordPress dependencies
 */
import { SVG, Path, G, Defs } from '@wordpress/primitives';

const toolbarPin = (
	<SVG xmlns='http://www.w3.org/2000/svg' width='6.659' height='8'>
		<Defs>
			<clipPath id='A'>
				<Path d='M0 0h5.659v8H0z' />
			</clipPath>
		</Defs>
		<G clipPath='url(#A)'>
			<Path d='M4.61.638a2.77 2.77 0 0 0-3.536 0c-1.154.951-1.412 2.616-.6 3.871l2.215 3.4c.025.051.074.086.131.091s.107-.02.134-.067l2.215-3.4A2.96 2.96 0 0 0 4.61.638m-1.768 3.2c-.643 0-1.164-.521-1.164-1.164S2.199 1.51 2.842 1.51s1.164.521 1.164 1.164c.002.309-.12.606-.338.825s-.516.341-.825.339' />
		</G>
	</SVG>
);

export default toolbarPin;
