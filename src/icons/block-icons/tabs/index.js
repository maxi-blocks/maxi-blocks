/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const tabs = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='tabs__a'
				stroke='#ff4a17'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M2.35 6h19.8v15.15H2.35V6zm.5-.3V2.95h4.7V5.7l.1-2.75h4.75V5.7l.15-2.75h4.7V5.7'
			/>
		</defs>
		<use xlinkHref='#tabs__a' transform='translate(-.25 -.05)' />
	</SVG>
);

export default tabs;
