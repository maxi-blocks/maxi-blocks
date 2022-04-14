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
			d='M19.3,2.7H4.7c-1.2,0-2.1,0.9-2.1,2.1V17c0,1.2,0.9,2.1,2.1,2.1h4.1l3.2,2.1l3.2-2.1h4.1
c1.2,0,2.1-0.9,2.1-2.1V4.9C21.5,3.7,20.5,2.7,19.3,2.7z'
		/>
	</SVG>
);

export default mapPopup1;
