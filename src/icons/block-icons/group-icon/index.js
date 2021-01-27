/**
 * WordPress dependencies
 */
const { SVG, Path, Circle } = wp.primitives;

const group = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='container__a'
				stroke='#ff4a17'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M12.4 18.9h3M1.4 1.2h13.5v14.3H1.4z'
			/>
			<Path
				id='container__b'
				stroke='#ff4a17'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M9 8.4h13.5v14.3H9zM18.3 18.9h1.9'
			/>
			<Circle
				id='container__c'
				stroke='#ff4a17'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				cx={6}
				cy={5.4}
				r={2.1}
			/>
		</defs>
		<use xlinkHref='#container__a' />
		<use xlinkHref='#container__b' />
		<use xlinkHref='#container__c' />
	</SVG>
);

export default group;
