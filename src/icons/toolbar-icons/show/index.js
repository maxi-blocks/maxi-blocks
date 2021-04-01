/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarShow = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		preserveAspectRatio='none'
		viewBox='0 0 24 24'
	>
		<Path
			id='toolbar-show'
			fill='none'
			stroke='#FFF'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1'
			d='M14.35 11.55q0 1-.75 1.75-.7.75-1.75.75t-1.8-.75q-.75-.75-.75-1.75 0-1.05.75-1.8t1.8-.75q1.05 0 1.75.75.75.75.75 1.8zm2.55 0q0 2.05-1.5 3.55-1.45 1.5-3.55 1.5-2.1 0-3.6-1.5-1.45-1.5-1.45-3.55 0-2.1 1.45-3.6 1.5-1.45 3.6-1.45t3.55 1.45q1.5 1.5 1.5 3.6zm6.25 0q-2.5 3.1-6.5 4.75Q8.55 19.55.8 12.15q2.5-3.75 6.55-5.4 8.05-3.25 15.9 4.4'
		/>
	</SVG>
);

export default toolbarShow;
