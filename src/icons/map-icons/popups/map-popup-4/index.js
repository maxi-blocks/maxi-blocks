/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const mapPopup1 = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		className='map-marker-info-window__background'
		preserveAspectRatio='none'
	>
		<Path
			fill='#FFFFFF'
			stroke='#081219'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeMiterlimit='10'
			strokeWidth='1'
			opacity='1'
			d='M21.4,2.2H2.5v15.9h7l2.7,3.7l2.2-3.7h7V2.2L21.4,2.2z'
		/>
	</SVG>
);

export default mapPopup1;
