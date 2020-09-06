/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const search = (
	<SVG
		className='search__icon'
		style={{
			width: '1em',
			height: '1em',
			verticalAlign: 'middle',
		}}
		viewBox='0 0 1024 1024'
		fill='currentColor'
		overflow='hidden'
	>
		<Path d='M959.744 870.592L759.936 670.784a382.08 382.08 0 0071.552-222.72c0-212.032-171.968-384-384-384S64 235.968 64 448s171.456 384 383.488 384a381.952 381.952 0 00222.72-71.552l199.808 199.808 89.728-89.664zM447.488 704a256 256 0 110-512 256 256 0 010 512z' />
	</SVG>
);

export default search;
