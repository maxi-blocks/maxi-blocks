/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';
import React from 'react';

const remove = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			fill='var(--mpc);'
			d='M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.21 11.79a1 1 0 010 1.42 1 1 0 01-1.42 0L12 13.41l-1.79 1.8a1 1 0 01-1.42 0 1 1 0 010-1.42l1.8-1.79-1.8-1.79a1 1 0 011.42-1.42l1.79 1.8 1.79-1.8a1 1 0 011.42 1.42L13.41 12z'
		/>
	</SVG>
);

export default remove;
