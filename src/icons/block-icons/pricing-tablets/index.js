/**
 * WordPress dependencies
 */
const { SVG, Path } = wp.primitives;

const pricingTablets = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='pricing_tables__a'
				stroke='#ff4a17'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M16.7 21.1h5.75V2.4H16.7M10.6 4h3M7.25 21.1h-5.8V2.4h5.8m-3.6 16.75h1.9m5 .75h3M7.75 1.5h8.45v20.6H7.75V1.5zM18.6 19.15h1.9'
			/>
		</defs>
		<use xlinkHref='#pricing_tables__a' transform='translate(.05)' />
	</SVG>
);

export default pricingTablets;
