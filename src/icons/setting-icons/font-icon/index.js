/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const fontIcon = (
	<SVG viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
		<Path
			style={{
				fill: 'none',
				stroke: '#464a53',
				strokeWidth: '1.5',
				strokeMiterlimit: '10',
			}}
			d='M23,12c0,6.1-4.9,11-11,11C5.9,23,1,18.1,1,12S5.9,1,12,1C18.1,1,23,5.9,23,12z'
		/>
		<Path
			style={{
				fill: 'none',
				stroke: '#464a53',
				strokeWidth: '1.5',
				strokeMiterlimit: '10',
			}}
			d='M17.6,15.5c-1.4,1.7-3.5,2.6-5.6,2.6c-2.2,0-4.2-1-5.6-2.6'
		/>
		<Path
			style={{
				fill: 'none',
				stroke: '#464a53',
				strokeWidth: '1.5',
				strokeMiterlimit: '10',
			}}
			d='M6.8,10.2c0-0.8,0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5c0,0.8-0.7,1.5-1.5,1.5S6.8,11,6.8,10.2z'
		/>
		<Path
			style={{
				fill: 'none',
				stroke: '#464a53',
				strokeWidth: '1.5',
				strokeMiterlimit: '10',
			}}
			d='M14.2,10.2c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5c0,0.8-0.7,1.5-1.5,1.5C14.9,11.7,14.2,11,14.2,10.2z'
		/>
	</SVG>
);

export default fontIcon;
