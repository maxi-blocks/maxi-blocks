/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const toolbarSizing = (
	<SVG xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
		<Path
			fill='#fff'
			d='M19.6 8.3L19 9l2.5 2.5h-8.1v.9h8.1L19 15l.7.7 3.7-3.7-3.8-3.7zm-9 4.2v-.9H2.5l2.9-2.9-.7-.7-4 4 3.7 3.7.6-.7-2.5-2.5h8.1zm1.9 9v-8.1h-.9v8.1L9 19l-.7.7 3.7 3.7 4-4-.7-.7-2.8 2.8zm-1-19v8.1h.9V2.5L15 5l.7-.7L12 .7 8.3 4.4 9 5l2.5-2.5z'
		/>
		<path
			fill='none'
			stroke='#fff'
			strokeMiterlimit='10'
			d='M19.6 8.3L19 9l2.5 2.5h-8.1v.9h8.1L19 15l.7.7 3.7-3.7-3.8-3.7zm-9 4.2v-.9H2.5l2.9-2.9-.7-.7-4 4 3.7 3.7.6-.7-2.5-2.5h8.1zm1.9 9v-8.1h-.9v8.1L9 19l-.7.7 3.7 3.7 4-4-.7-.7-2.8 2.8zm-1-19v8.1h.9V2.5L15 5l.7-.7L12 .7 8.3 4.4 9 5l2.5-2.5z'
		/>
	</SVG>
);

export default toolbarSizing;
