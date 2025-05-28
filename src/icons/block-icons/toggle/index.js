/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toggle = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='toggle__a'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M4.75 4.2h-1v1m0-2v1h-1m18.65 0H6.9'
			/>
			<Path
				id='toggle__b'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M3.75 10.45v-1h-1m1-1v1h1m16.65 0H6.9'
			/>
			<Path
				id='toggle__c'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M4.75 15.65h-1v1m-1-1h1v-1m17.65 1H6.9'
			/>
			<Path
				id='toggle__d'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M3.75 20.8v-1h-1m2 0h-1v-1m17.65 1H6.9'
			/>
		</defs>
		<use xlinkHref='#toggle__a' />
		<use xlinkHref='#toggle__b' transform='translate(0 -.05)' />
		<use xlinkHref='#toggle__c' transform='translate(0 -1.05)' />
		<use xlinkHref='#toggle__d' />
	</SVG>
);

export default toggle;
