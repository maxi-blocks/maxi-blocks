/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const hero = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='hero__a'
				stroke='var(--mpc)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M22.55 20.25l-21.05-.1V3.45h21.05v16.1M13.3 10.4h1.25m1.5 0h1.1m-6.6 0h1.1m-3.85 0h1.25m-.15 2.65h6.4v2.5H8.9v-2.5zm-3.1-5.3h12.5'
			/>
		</defs>
		<use xlinkHref='#hero__a' transform='translate(0 .15)' />
	</SVG>
);

export default hero;
