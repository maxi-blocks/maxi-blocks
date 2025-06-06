/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const container = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='container__a'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M17.35 22.4h4.8V2H2.25v20.4h14.8M18.6 9.15V5.7h-3.1M5.85 9.15V5.7H8.9m-3.05 9.55v3.5H8.9m9.7-3.5v3.5h-3.1'
			/>
		</defs>
		<use xlinkHref='#container__a' />
	</SVG>
);

export default container;
