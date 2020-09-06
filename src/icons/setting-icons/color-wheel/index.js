/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const colorWheel = (
	<SVG
		width={24}
		height={24}
		x='0px'
		y='0px'
		viewBox='0 0 24 24'
		xmlSpace='preserve'
	>
		<Path
			d='M20.2 3.7C18.8 2.3 17 1.2 15 .7L12 12l8.2-8.3z'
			fill='#fac712'
		/>
		<Path
			d='M15 .7c-1-.3-2-.4-3-.4S9.9.4 9 .7l.1.3c0 .1.1.2.1.4l.1.2c0 .1.1.2.1.3V2c0 .1 0 .2.1.3l.2.7.1.5v.1L12 12l1.9-7.1L15 .7z'
			fill='#feef00'
		/>
		<Path
			d='M23.3 9c-.5-2-1.6-3.8-3-5.2L18 6l-6 6 11.3-3z'
			fill='#f69f23'
		/>
		<Path
			d='M15 23.3l-1.1-4.2L12 12 9 23.3c1 .3 2 .4 3 .4s2.1-.2 3-.4z'
			fill='#7421b0'
		/>
		<Path
			d='M12 12l-8.3 8.3c1.4 1.4 3.2 2.5 5.2 3l1.1-4.2 2-7.1z'
			fill='#3a48ba'
		/>
		<Path
			d='M20.2 20.3c.1 0 .1 0 0 0l-3.1-3.1L12 12l3 11.3c2-.6 3.8-1.6 5.2-3z'
			fill='#d2298e'
		/>
		<Path
			d='M12 12L.7 15c.5 2 1.6 3.8 3 5.2l3.1-3.1L12 12z'
			fill='#006fc4'
		/>
		<Path
			d='M23.3 15l-4.2-1.1L12 12l8.3 8.3c1.4-1.5 2.4-3.3 3-5.3z'
			fill='#ff2600'
		/>
		<Path
			d='M23.7 12c0-1-.1-2.1-.4-3l-4.2 1.1L12 12l11.3 3c.2-.9.4-2 .4-3z'
			fill='#fb6312'
		/>
		<Path
			d='M12 12L.7 9c-.3 1-.4 2-.4 3s.1 2.1.4 3l4.2-1.1L12 12z'
			fill='#00c2af'
		/>
		<Path
			d='M12 12l-1.9-7.1v-.2l-.1-.3c-.1-.2-.1-.4-.2-.6l-.1-.5v-.2l-.2-.4-.5-2c-2 .5-3.8 1.6-5.2 3L12 12z'
			fill='#7fd200'
		/>
		<Path
			d='M12 12L3.7 3.7C2.3 5.2 1.3 7 .7 9c1 .3 2.1.6 4.2 1.1L12 12z'
			fill='#00b500'
		/>
	</SVG>
);

export default colorWheel;
