/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const fontIcon = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path d='M12 24a12 12 0 1112-12 12 12 0 01-12 12zm0-22a10 10 0 1010 10A10 10 0 0012 2z' />
		<Path d='M12 19.1a8.46 8.46 0 01-6.35-2.94l1.5-1.32A6.48 6.48 0 0012 17.1a6.3 6.3 0 004.83-2.24l1.54 1.28A8.21 8.21 0 0112 19.1zM8.19 9.06a1.14 1.14 0 11-1.14 1.14 1.17 1.17 0 011.14-1.14m0-2a3.14 3.14 0 100 6.28 3.14 3.14 0 100-6.28zM15.81 9.06a1.14 1.14 0 11-1.14 1.14 1.17 1.17 0 011.14-1.14m0-2A3.14 3.14 0 1019 10.2a3.18 3.18 0 00-3.14-3.14z' />
	</SVG>
);

export default fontIcon;
