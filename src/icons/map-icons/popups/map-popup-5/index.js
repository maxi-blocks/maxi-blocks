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
			d='M12,2c-5,0-9,4-9,9c0,3.1,1.6,5.9,4,7.5C7,19.9,7,22,7,22s0.7-1.3,2.3-2.4c0.8,0.3,1.8,0.4,2.7,0.4
			 c5,0,9-4,9-9S17,2,12,2z'
		/>
	</SVG>
);

export default mapPopup1;
