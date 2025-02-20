/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const orderedList = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='orderred_list__a'
				stroke='var(--maxi-primary-color)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M2.75 3.1h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 2.5h1.1m-1.1 5.1h1.1m-1.1-2.6h1.1m-1.1 5.1h1.1m2.5-5.1h14.9m-14.9-5h14.9M6.35 3.1h14.9M6.35 5.6h14.9M6.35 8.1h14.9m-14.9 5h14.9m-14.9 5.1h14.9m-14.9 2.5h14.9'
			/>
		</defs>
		<use xlinkHref='#ordered_list__a' />
	</SVG>
);

export default orderedList;
