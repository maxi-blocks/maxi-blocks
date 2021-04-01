/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const titleExtra = (
	<SVG
		preserveAspectRatio='none'
		x='0px'
		y='0px'
		width='24px'
		height='24px'
		viewBox='0 0 24 24'
	>
		<defs>
			<Path
				id='a'
				stroke='#ff4a17'
				strokeWidth={1}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M1.6 1.6V5h2v-.9q0-.25.2-.4.15-.2.4-.2h2.6v7.4q0 .35-.25.6t-.6.25H5.1v1.9h5.8v-1.9h-.8q-.35 0-.6-.25t-.25-.6V3.5h2.6q.25 0 .4.2.2.15.2.4V5h2V1.6H1.6zm.7 15.8h7.75m-8.1 4.75H22.1M1.95 20H22.1m-9.05-2.6h9.1'
			/>
		</defs>
		<use href='#a' />
	</SVG>
);

export default titleExtra;
