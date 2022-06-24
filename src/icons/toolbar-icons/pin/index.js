/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarPin = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		width='7.792'
		height='10.616'
		fill='none'
		opacity='0.7'
		stroke='#fff'
		strokeLinejoin='round'
		strokeWidth='1.5'
	>
		<Path d='M.75 4.111h6.292v5.755H.75z' />
		<Path d='M3.895 6.266c.209 0 .378.169.378.378s-.169.378-.378.378-.378-.169-.378-.378c0-.1.04-.196.111-.267s.167-.111.267-.111z' />
		<Path
			d='M3.896 8.251v-1.23m-1.573-2.91V2.322A1.57 1.57 0 0 1 3.896.75'
			strokeLinecap='round'
		/>
	</SVG>
);

export default toolbarPin;
