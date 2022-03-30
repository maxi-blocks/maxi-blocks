/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarAlignJustify = (
	<SVG width={16} height={17.5} viewBox='0 0 16 17.5'>
		<g strokeLinejoin='round' strokeWidth={1.5}>
			<Path d='M16 0H0' transform='translate(0 .75)' />
			<Path d='M16 3.9H0' transform='translate(0 .75)' />
			<Path d='M16 7.7H0' transform='translate(0 .75)' />
			<Path d='M16 11.6H0' transform='translate(0 .75)' />
			<Path d='M16 16H0' transform='translate(0 .75)' />
		</g>
	</SVG>
);

export default toolbarAlignJustify;
