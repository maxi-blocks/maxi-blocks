/**
 * WordPress dependencies
 */
import { SVG, Polygon } from '@wordpress/primitives';

const mapPopup1 = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		className='map-marker-info-window__background'
		preserveAspectRatio='none'
	>
		<Polygon
			fill='#FFFFFF'
			stroke='#081219'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeMiterlimit='10'
			strokeWidth='1'
			opacity='1'
			points='22,1.8 2,1.8 2,16.3 6.3,16.3 6.3,22.2 12.1,16.3 22,16.3 	'
		/>
	</SVG>
);

export default mapPopup1;
