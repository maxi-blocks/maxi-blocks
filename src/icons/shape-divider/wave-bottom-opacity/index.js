/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

const waveBottomOpacity = (
	<SVG
		xmlns='http://www.w3.org/2000/svg'
		xlink='http://www.w3.org/1999/xlink'
		preserveAspectRatio='none'
		viewBox='0 0 1280 139'
	>
		<defs>
			<Path
				id='wave-bottom-opacity-a'
				opacity='.298'
				d='M1280 140V3.45q-74.6 4.75-141.95 18.85-24.9 5.2-56.35 13.3-35.65 9.35-53.65 14-66.2 17-120.45 24.6-76.55 10.65-173.2 10.65-106.7 0-190-13.15-33.35-5.3-68.75-13.5-21.25-4.95-61.25-15.45-40-10.55-61.25-15.5-35.4-8.2-68.75-13.5Q201.05.6 94.4.6 44.65.6 0 3.45V140h1280z'
			/>
			<Path
				id='wave-bottom-opacity-b'
				opacity='.498'
				d='M1280 139.4V23.7q-39.3-1.75-85.2 5.55-29.9 4.75-95.35 19.8Q1021.25 67 974 76.1q-84.6 16.4-175.6 27.55-109.6 13.45-184.1 7.65-32.85-2.55-64.5-9.05-25.45-5.25-57.7-14.8-38.4-11.9-59.5-18.4-38.3-11.7-69.95-19.7-91.8-23.1-206-34.85-40.75-4.15-85.85.05-15.65 1.5-36.9 4.45Q10.85 22.35 0 23.75V139.4h1280z'
			/>
			<Path
				id='wave-bottom-opacity-c'
				d='M1280 139.4V51.15q-64.35 4-126.9 13.6-21.45 3.3-52.45 8.8-45.25 8-51.15 9-62.1 10.55-116.7 15.4-73.8 6.6-166.4 6.6-106.65 0-190-8.9-50-5.35-130-19.6-80-14.25-130-19.6-83.35-8.9-190-8.9-68.5 0-126.4 3.6v88.25h1280z'
			/>
		</defs>
		<use transform='translate(0 -.6)' href='#wave-bottom-opacity-a' />
		<use href='#wave-bottom-opacity-b' />
		<use href='#wave-bottom-opacity-c' />
	</SVG>
);

export default waveBottomOpacity;
