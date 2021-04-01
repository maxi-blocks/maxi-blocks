/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const content = (
	<SVG preserveAspectRatio='none' x='0px' y='0px' viewBox='0 0 24 24'>
		<defs>
			<Path
				id='a'
				stroke='#464A53'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M20.4.95H3.45v22.2H15.1l.05-.05v-4.4h5.25V.95zm-.15 17.75l-5.1 4.4v.05h-.05M6.85 5.2H17.4M6.85 7.85h8.6m-8.6 2.95h5.05'
			/>
		</defs>
		<use xlinkHref='#a' />
	</SVG>
);

export default content;
