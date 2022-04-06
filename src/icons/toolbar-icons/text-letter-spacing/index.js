/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarTextLetterSpacing = (
	<SVG width={17.5} height={17.811} viewBox='0 0 17.5 17.811'>
		<g>
			<g>
				<g
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={1.5}
					transform='translate(-1.015 -.75)'
				>
					<Path d='M15.234 17.5l2.531-2.539-2.531-2.7' />
					<Path transform='translate(1.765 14.961)' d='M0 0L16 0' />
					<Path d='M4.3 12.264l-2.532 2.7L4.3 17.5' />
				</g>
			</g>
			<g
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={1.5}
				transform='translate(-1.015 -.75)'
			>
				<Path transform='translate(16.389 1.5)' d='M0 0L0 7.479' />
				<Path transform='translate(11.957 1.5)' d='M0 0L0 7.479' />
				<Path transform='translate(7.526 1.5)' d='M0 0L0 7.479' />
				<Path transform='translate(3.094 1.5)' d='M0 0L0 7.479' />
			</g>
		</g>
	</SVG>
);

export default toolbarTextLetterSpacing;
