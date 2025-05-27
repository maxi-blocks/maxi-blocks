/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const priceList = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='price_list__a'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M2.7 18.65h3.5v3.5H2.7v-3.5zm5.65 1.6h7m3-.15h3.05'
			/>
			<Path
				id='price_list__b'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M2.7 13.25h3.5v3.5H2.7v-3.5zm5.65 1.6h7m3-.15h3.05'
			/>
			<Path
				id='price_list__c'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M2.7 8h3.5v3.5H2.7V8zm5.65 1.6h7m3-.15h3.05'
			/>
			<Path
				id='price_list__d'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M2.7 2.6h3.5v3.5H2.7V2.6zm5.65 1.6h7m3-.15h3.05'
			/>
		</defs>
		<use xlinkHref='#price_list__a' />
		<use xlinkHref='#price_list__b' transform='translate(0 .05)' />
		<use xlinkHref='#price_list__c' transform='translate(0 -.05)' />
		<use xlinkHref='#price_list__d' />
	</SVG>
);

export default priceList;
