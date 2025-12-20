/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const textBox = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='text_box__a'
				stroke='var(--mpc)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M2.95 20.8h2.5m-2.5-2.4h6m-6-5.45h18.5m-18.5-5h18.5m-18.5 2.5h18.5m-18.5-5h18.5m-18.5-2.5h18.5m-18.5 12.5h18.5'
			/>
		</defs>
		<use xlinkHref='#text_box__a' transform='translate(-.2 .15)' />
	</SVG>
);

export default textBox;
