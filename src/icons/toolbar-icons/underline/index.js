/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const underline = (
	<SVG width={15.585} height={15.585} viewBox='0 0 15.585 15.585'>
		<g strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}>
			<Path transform='translate(.75 14.835)' d='M14.085 0L0 0' />
			<Path d='M12.018.75v6.779c0 3.609-1.849 5.106-4.314 5.106-2.377 0-4.137-1.409-4.137-5.018V.75' />
		</g>
	</SVG>
);

export default underline;
