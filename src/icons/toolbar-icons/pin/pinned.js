/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarPinLocked = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		width='7.93'
		height='10.597'
		fill='none'
		stroke='#fff'
		strokeLinejoin='round'
		strokeWidth='1.5'
	>
		<Path d='M.75 3.965h6.43v5.882H.75z' />
		<Path
			d='M2.358 3.965V2.357c0-.574.306-1.105.803-1.392s1.11-.287 1.607 0 .803.818.803 1.392v1.608'
			strokeLinecap='round'
		/>
		<Path d='M3.964 6.166c.156 0 .297.094.357.238s.027.31-.084.421-.276.143-.421.084-.238-.2-.238-.357c0-.213.173-.386.386-.386z' />
		<Path strokeLinecap='round' d='M3.966 8.195V6.938' />
	</SVG>
);

export default toolbarPinLocked;
