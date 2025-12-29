/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const scale = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='scale__a'
				stroke='var(--mpc)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M18.7 5.7l-5.15 5.05m8.6-3.3V2h-4.8m4.8 14.95v5.45h-4.8M2.25 7.45V2h4.8m-4.8 14.95v5.45h4.8m-1-4.25l4.8-4.7'
			/>
			<Path
				id='scale__b'
				stroke='var(--mpc)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M18.531 5.456l-2.192.142m2.299 2.298l.106-2.228'
			/>
			<Path
				id='scale__c'
				stroke='var(--mpc)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M5.762 16.306l-.106 2.227m.212.212l2.192-.141'
			/>
		</defs>
		<use xlinkHref='#scale__a' />
		<use
			xlinkHref='#scale__b'
			transform='translate(.04 -.023) scale(.99998)'
		/>
		<use
			xlinkHref='#scale__c'
			transform='translate(0 .009) scale(.99998)'
		/>
	</SVG>
);

export default scale;
