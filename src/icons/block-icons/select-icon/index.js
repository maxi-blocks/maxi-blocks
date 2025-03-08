/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const selectIcon = (
	<SVG preserveAspectRatio='none' viewBox='0 0 24 24'>
		<defs>
			<Path
				id='select_icon'
				stroke='none'
				strokeLinejoin='round'
				strokeLinecap='round'
				fill='var(--maxi-primary-color)'
				d='M12 .1C5.4.1.1 5.4.1 12S5.4 23.9 12 23.9 23.9 18.6 23.9 12 18.6.1 12 .1zm0 21.8A9.86 9.86 0 0 1 2.1 12 9.86 9.86 0 0 1 12 2.1a9.86 9.86 0 0 1 9.9 9.9 9.86 9.86 0 0 1-9.9 9.9zm4.8-7a6.39 6.39 0 0 1-4.8 2.2 6.16 6.16 0 0 1-4.8-2.3c-.4-.4-1-.5-1.4-.1s-.5 1-.1 1.4c1.6 1.9 4 2.9 6.4 2.9 2.5 0 4.8-1.1 6.4-3a.97.97 0 0 0-.1-1.4c-.6-.2-1.2-.2-1.6.3zm-8.9-3.2c.9 0 1.7-.8 1.7-1.7s-.8-1.8-1.7-1.8-1.7.8-1.7 1.7.7 1.8 1.7 1.8zm8.2-3.5c-.9 0-1.7.8-1.7 1.7s.8 1.7 1.7 1.7 1.7-.8 1.7-1.7-.8-1.7-1.7-1.7z'
			/>
		</defs>
		<use xlinkHref='#select_icon' />
	</SVG>
);

export default selectIcon;
