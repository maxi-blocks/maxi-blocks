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
			d='M21.2,3.6v11.8c0,1.4-1.1,2.5-2.5,2.5H9.4l-4.1,3.7v-3.7l0,0c-1.4,0-2.5-1.1-2.5-2.5V3.6
		C8.2,1.9,15.6,2,21.2,3.6z'
		/>
	</SVG>
);

export default mapPopup1;
