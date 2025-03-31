/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const testimonials = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='testimonials__a'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M22.25 10.45q0 3.35-2.75 5.75l-2.3 5.85-2.15-3.5q-1.45.35-3.05.35-4.25 0-7.25-2.5-3-2.45-3-5.95t3-6Q7.75 2 12 2t7.25 2.45q3 2.5 3 6z'
			/>
		</defs>
		<use xlinkHref='#testimonials__a' />
	</SVG>
);

export default testimonials;
