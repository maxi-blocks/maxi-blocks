/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const toolbarDynamicContent = props => (
	<SVG
		data-name='Group 1031'
		xmlns='http://www.w3.org/2000/svg'
		width={18}
		height={17.629}
		viewBox='0 0 17.644 17.629'
	>
		<defs>
			<clipPath id='a'>
				<Path
					data-name='Rectangle 517'
					fill='none'
					d='M0 0h17.644v17.629H0z'
				/>
			</clipPath>
		</defs>
		<g
			data-name='Group 1030'
			clipPath='url(#a)'
			fill='none'
			stroke='#141516'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={1.5}
		>
			<ellipse
				data-name='Ellipse 5'
				cx={8.072}
				cy={2.506}
				rx={8.072}
				ry={2.506}
				transform='translate(.75 .75)'
			/>
			<Path
				data-name='Path 292'
				d='M16.894 8.932c0 1.384-3.614 2.506-8.072 2.506S.75 10.316.75 8.932'
			/>
			<Path
				data-name='Path 293'
				d='M16.894 14.373c0 1.384-3.614 2.506-8.072 2.506S.75 15.757.75 14.373'
			/>
			<Path data-name='Line 774' d='M.75 3.256v11.178' />
			<Path data-name='Line 775' d='M16.894 3.256v11.178' />
		</g>
	</SVG>
);

export default toolbarDynamicContent;
