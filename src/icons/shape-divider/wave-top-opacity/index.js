/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const waveTopOpacity = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 105'
	>
		<defs>
			<Path
				id='wave-top-opacity-a'
				opacity='.298'
				d='M1280 51.75V0H0v51.75q57.9-3.6 126.4-3.6 106.65 0 190 8.9 50 5.35 130 19.6 80 14.25 130 19.6 83.35 8.9 190 8.9 92.6 0 166.4-6.6 54.6-4.85 116.7-15.4 5.9-1 51.15-9 31-5.5 52.45-8.8 62.55-9.6 126.9-13.6z'
			/>
			<Path
				id='wave-top-opacity-b'
				opacity='.498'
				d='M1280 24.3V0H0v24.35q70.5-9.25 158.4-9.25 106.65 0 190 13.95 33.35 5.55 68.75 14.25 21.25 5.25 61.25 16.4 40 11.1 61.25 16.35 35.4 8.7 68.75 14.25 83.3 13.95 190 13.95 88.05 0 158.8-9.3 54.4-7.1 112.7-22.1 16.6-4.3 48.65-13.25 31.95-8.9 48.65-13.2 58.3-14.95 112.8-22.1z'
			/>
			<Path
				id='wave-top-opacity-c'
				d='M1280 3.45V0H0v3.45Q44.65.6 94.4.6q106.65 0 190.25 10.55 50.1 6.35 130.5 23.3 40.2 8.45 61.55 12.4 35.55 6.6 68.95 10.85Q629.2 68.25 735.9 68.25q97 0 173-8.05 54.95-5.85 119.9-18.85 17.9-3.6 53.35-11 31.9-6.45 56.1-10.6 67.6-11.6 141.75-16.3z'
			/>
		</defs>
		<use href='#wave-top-opacity-a' />
		<use href='#wave-top-opacity-b' />
		<use href='#wave-top-opacity-c' />
	</SVG>
);

export default waveTopOpacity;
