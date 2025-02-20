/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const searchIcon = (
	<SVG viewBox='0 0 24 24'>
		<Path
			fill='var(--maxi-primary-color)'
			stroke='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='0'
			d='M23.0855,21.3684l-5.2966-5.2966c1.3242-1.6552,2.1849-3.7739,2.1849-6.0911
			c0-5.3628-4.3697-9.7326-9.7326-9.7326c-5.3628,0-9.7326,4.3697-9.7326,9.7326s4.3697,9.7326,9.7326,9.7326
			c2.0524,0,3.9725-0.6621,5.5615-1.7214l5.3629,5.3629c0.2648,0.2648,0.5959,0.3972,0.9931,0.3972
			c0.331,0,0.7283-0.1324,0.9931-0.3972C23.6152,22.825,23.6152,21.8981,23.0855,21.3684z M3.2231,9.9807
			c0-3.8401,3.1118-6.9518,6.9518-6.9518s6.9518,3.1118,6.9518,6.9518s-3.1118,6.9518-6.9518,6.9518
			C6.4011,16.9987,3.2231,13.8207,3.2231,9.9807z'
		/>
	</SVG>
);

export default searchIcon;
