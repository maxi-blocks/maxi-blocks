/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarHide = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		preserveAspectRatio='none'
		viewBox='0 0 24 24'
	>
		<Path
			id='a'
			fill='none'
			stroke='#FFF'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1'
			d='M15.4 15.1q1.5-1.5 1.5-3.55 0-1.722-1-3.05l-1.85 1.85q.3.54.3 1.2 0 1-.75 1.75-.7.75-1.75.75-.66 0-1.2-.3L8.8 15.6q1.328 1 3.05 1 2.1 0 3.55-1.5zm-4.75-1.35q-.322-.172-.6-.45-.75-.75-.75-1.75 0-1.05.75-1.8t1.8-.75q1.05 0 1.75.75.278.278.45.6l-3.4 3.4zm12.6-2.6q-2.903-2.829-5.825-4.175L15.9 8.5q-.23-.28-.5-.55-1.45-1.45-3.55-1.45-2.1 0-3.6 1.45-1.45 1.5-1.45 3.6 0 2.05 1.45 3.55.27.27.55.5l-1.025 1.025q4.382 1.478 8.875-.325 4-1.65 6.5-4.75M1.2 23.2l6.575-6.575Q4.251 15.445.8 12.15q2.5-3.75 6.55-5.4 5.073-2.048 10.075.225L23 1.4'
		/>
	</SVG>
);

export default toolbarHide;
