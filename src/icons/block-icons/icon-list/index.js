/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const iconList = (
	<SVG preserveAspectRatio='none' width={24} height={24} viewBox='0 0 24 24'>
		<defs>
			<Path
				id='icons_list__a'
				stroke='var(--mpc)'
				strokeWidth={1.5}
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='none'
				d='M10.75 5.7h9.4M5.85 3.2L6.4 5h2.05q.05.05.05.15 0 .05-.1.1L6.85 6.4l.6 1.8q.05.05 0 .1l-.05.1q-.1 0-.2-.05L5.7 7.2 4.2 8.35q-.1.05-.15.05-.05 0-.1-.05-.05-.1 0-.15l.6-1.8L3 5.25q-.05-.05-.1-.05 0-.1.05-.15Q3 5 3.1 5H5l.6-1.8v-.1q.1-.05.15 0 .05 0 .1.1zm0 6.75l.55 1.8h2.05q.05.05.05.15 0 .05-.1.1l-1.55 1.15.6 1.8q.05.05 0 .1l-.05.1q-.1 0-.2-.05l-1.5-1.15-1.5 1.15q-.1.05-.15.05-.05 0-.1-.05-.05-.1 0-.15l.6-1.8L3 12q-.05-.05-.1-.05 0-.1.05-.15.05-.05.15-.05H5l.6-1.8v-.1q.1-.05.15 0 .05 0 .1.1zm0 6.65l.55 1.8h2.05q.05.05.05.15 0 .05-.1.1L6.85 19.8l.6 1.8q.05.05 0 .1l-.05.1q-.1 0-.2-.05L5.7 20.6l-1.5 1.15q-.1.05-.15.05-.05 0-.1-.05-.05-.1 0-.15l.6-1.8L3 18.65q-.05-.05-.1-.05 0-.1.05-.15.05-.05.15-.05H5l.6-1.8v-.1q.1-.05.15 0 .05 0 .1.1zm4.9 2.5h9.4m-9.4-6.65h9.4'
			/>
		</defs>
		<use xlinkHref='#icons_list__a' transform='translate(.5 -.4)' />
	</SVG>
);

export default iconList;
