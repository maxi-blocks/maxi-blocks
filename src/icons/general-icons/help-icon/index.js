/**
 * WordPress dependencies
 */
import { SVG, Path, G } from '@wordpress/primitives';

const helpIcon = (
	<SVG width={11.244} height={11.244} viewBox='0 0 11.244 11.244'>
		<G
			fill='none'
			stroke='#007cba'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={1.5}
		>
			<G transform='translate(-398 -1217.951) translate(399.5 1219.451)'>
				<circle cx={4.122} cy={4.122} r={4.122} stroke='none' />
				<circle cx={4.122} cy={4.122} r={4.872} />
			</G>
			<Path
				d='M401.423 1222.475c0-.758.984-1.374 2.2-1.374s2.2.615 2.2 1.374-.984 1.374-2.2 1.374v1.373'
				transform='translate(-398 -1217.951)'
			/>
		</G>
	</SVG>
);

export default helpIcon;
