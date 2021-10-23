import {
	getBlockBackgroundStyles,
	getBackgroundStyles,
} from '../getBackgroundStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

describe('getBackgroundStyles', () => {
	it('Get correct block background styles for color layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-color-status-general': true,
					'background-palette-color-general': 1,
					'background-palette-opacity-general': 7,
					'background-color-general': '',
					'background-color-clip-path-general':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					id: 0,
					'background-palette-color-status-xl': true,
					'background-palette-color-xl': 1,
					'background-palette-opacity-xl': 7,
					'background-color-xl': '',
					'background-color-clip-path-xl':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-color-clip-path-xxl':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-palette-color-status-xxl': true,
					'background-palette-color-xxl': 2,
					'background-palette-opacity-xxl': 20,
					'background-color-xxl': '',
					'background-palette-color-status-l': true,
					'background-palette-color-l': 4,
					'background-palette-opacity-l': 30,
					'background-color-l': '',
					'background-color-clip-path-l':
						'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'background-palette-color-status-m': true,
					'background-palette-color-m': 5,
					'background-palette-opacity-m': 59,
					'background-color-m': '',
					'background-color-clip-path-m':
						'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
					'background-palette-color-status-s': false,
					'background-palette-color-s': 5,
					'background-palette-opacity-s': 59,
					'background-color-s': 'rgba(204,68,68,0.59)',
					'background-color-clip-path-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'background-color-clip-path-xs':
						'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with different values on different responsive stages', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'image',
					'display-general': 'block',
					'background-image-mediaID-general': 302,
					'background-image-mediaURL-general':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-image-size-general': 'cover',
					'background-image-width-general': 470,
					'background-image-width-unit-general': '%',
					'background-image-height-general': 300,
					'background-image-height-unit-general': '%',
					'background-image-crop-options-general': null,
					'background-image-repeat-general': 'repeat-x',
					'background-image-position-general': 'left top',
					'background-image-position-width-unit-general': '%',
					'background-image-position-width-general': 0,
					'background-image-position-height-unit-general': '%',
					'background-image-position-height-general': 0,
					'background-image-origin-general': 'border-box',
					'background-image-clip-general': 'padding-box',
					'background-image-attachment-general': 'local',
					'background-image-clip-path-general':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-image-opacity-general': 0.52,
					id: 0,
					'background-image-mediaID-xl': 302,
					'background-image-mediaURL-xl':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-image-width-xl': 470,
					'background-image-height-xl': 300,
					'background-image-opacity-xl': 0.52,
					'background-image-size-xl': 'cover',
					'background-image-repeat-xl': 'repeat-x',
					'background-image-position-xl': 'left top',
					'background-image-attachment-xl': 'local',
					'background-image-origin-xl': 'border-box',
					'background-image-clip-xl': 'padding-box',
					'background-image-clip-path-xl':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-image-mediaID-l': 227,
					'background-image-mediaURL-l':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
					'background-image-width-l': 2560,
					'background-image-height-l': 1920,
					'background-image-size-l': 'contain',
					'background-image-repeat-l': 'space',
					'background-image-position-l': 'right top',
					'background-image-attachment-l': 'fixed',
					'background-image-origin-l': 'content-box',
					'background-image-clip-l': 'padding-box',
					'background-image-clip-path-l':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-image-opacity-m': 0.91,
					'background-image-opacity-xxl': 0.11,
					'background-image-clip-path-xxl':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'background-image-repeat-s': 'repeat-x',
					'background-image-attachment-s': 'scroll',
					'background-image-position-s': 'center top',
					'background-image-clip-path-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'background-image-mediaID-xs': 226,
					'background-image-mediaURL-xs':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'background-image-width-xs': 600,
					'background-image-height-xs': 600,
					'background-image-size-xs': 'auto',
				},
			],
		};

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for video layer with different values on different responsive stages', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'video',
					'display-general': 'block',
					'background-video-mediaID': null,
					'background-video-mediaURL':
						'https://www.youtube.com/watch?v=y1dbbrfekAM',
					'background-video-startTime': 285,
					'background-video-endTime': 625,
					'background-video-loop': false,
					'background-video-clipPath-general': '',
					'background-video-fallbackID-general': 302,
					'background-video-fallbackURL-general':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-video-opacity-general': 0.11,
					id: 0,
					'background-video-opacity-xl': 0.11,
					'background-video-fallbackID-xl': 302,
					'background-video-fallbackURL-xl':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-video-opacity-xxl': 0.37,
					'background-video-fallbackID-xxl': 227,
					'background-video-fallbackURL-xxl':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
					'background-video-opacity-l': 0.65,
					'background-video-fallbackID-l': 226,
					'background-video-fallbackURL-l':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'background-video-opacity-s': 0.25,
					'background-video-opacity-xs': 0.9,
				},
			],
		};

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for gradient layer with different values on different responsive stages', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'gradient',
					'display-general': 'block',
					'background-gradient-general':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'background-gradient-opacity-general': 0.15,
					'background-gradient-clip-path-general':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					id: 0,
					'background-gradient-opacity-xl': 0.15,
					'background-gradient-xl':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'background-gradient-clip-path-xl':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-gradient-opacity-xxl': 0.48,
					'background-gradient-clip-path-xxl':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-gradient-clip-path-l':
						'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
					'background-gradient-opacity-l': 0.8,
					'background-gradient-l':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'background-gradient-s':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
					'background-gradient-opacity-s': 0.17,
					'background-gradient-clip-path-s':
						'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
				},
			],
		};

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for shape layer with different values on different responsive stages', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'shape',
					'display-general': 'block',
					'background-palette-svg-color-status-general': true,
					'background-palette-svg-color-general': 5,
					'background-svg-SVGMediaID': null,
					'background-svg-SVGMediaURL': null,
					'background-svg-top-unit-general': '%',
					'background-svg-top-general': 0,
					'background-svg-left-unit-general': '%',
					'background-svg-left-general': 50,
					'background-svg-size-general': 34,
					'background-svg-size-unit-general': '%',
					id: 0,
					'background-svg-top-xl': 0,
					'background-svg-size-xl': 34,
					'background-palette-svg-color-status-xxl': true,
					'background-palette-svg-color-xxl': 2,
					'background-palette-svg-opacity-xxl': 37,
					'background-svg-top-xxl': 72,
					'background-svg-left-xxl': 14,
					'background-svg-size-xxl': 84,
					SVGElement:
						'<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><pattern xmlns="http://www.w3.org/1999/xhtml" id="group-maxi-12__30__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg" preserveaspectratio="xMidYMid"></image></pattern><path fill="url(#group-maxi-12__30__img)" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z" style="fill: url(#group-maxi-12__30__img)"/></svg>',
					SVGData: {
						'group-maxi-12__30': {
							color: '',
							imageID: 7,
							imageURL:
								'http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg',
						},
					},
					'background-palette-svg-color-status-l': true,
					'background-palette-svg-color-l': 3,
					'background-palette-svg-opacity-l': 37,
					'background-svg-top-l': 82,
					'background-svg-left-l': 62,
					'background-palette-svg-color-status-s': true,
					'background-palette-svg-color-s': 7,
					'background-palette-svg-opacity-s': 37,
					'background-svg-top-s': 23,
					'background-svg-left-s': 31,
					'background-svg-image-shape-flip-x-general': false,
					'background-svg-image-shape-flip-y-general': false,
					'background-svg-image-shape-position-general': '',
					'background-svg-image-shape-rotate-general': 104,
					'background-svg-image-shape-scale-general': 72,
				},
			],
		};

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for general responsive stage', () => {
		const result = getBlockBackgroundStyles({
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-color-status-general': true,
					'background-palette-color-general': 1,
					'background-color-general': '',
					'background-color-clip-path-general': '',
					id: 0,
				},
				{
					type: 'image',
					'display-general': 'block',
					'background-image-mediaID-general': '',
					'background-image-mediaURL-general': '',
					'background-image-size-general': '',
					'background-image-width-general': 100,
					'background-image-width-unit-general': '%',
					'background-image-height-general': 100,
					'background-image-height-unit-general': '%',
					'background-image-crop-options-general': null,
					'background-image-repeat-general': 'no-repeat',
					'background-image-position-general': 'center center',
					'background-image-position-width-unit-general': '%',
					'background-image-position-width-general': 0,
					'background-image-position-height-unit-general': '%',
					'background-image-position-height-general': 0,
					'background-image-origin-general': 'padding-box',
					'background-image-clip-general': 'border-box',
					'background-image-attachment-general': 'scroll',
					'background-image-clip-path-general': '',
					'background-image-opacity-general': 1,
					id: 1,
				},
				{
					type: 'video',
					'display-general': 'block',
					'background-video-mediaID-general': null,
					'background-video-mediaURL-general': '',
					'background-video-startTime-general': '',
					'background-video-endTime-general': '',
					'background-video-loop-general': false,
					'background-video-clipPath-general': '',
					'background-video-fallbackID-general': null,
					'background-video-fallbackURL-general': '',
					'background-video-playOnMobile-general': false,
					'background-video-opacity-general': 1,
					id: 2,
				},
				{
					type: 'gradient',
					'display-general': 'block',
					'background-gradient-general': '',
					'background-gradient-opacity-general': 1,
					'background-gradient-clip-path-general': '',
					id: 3,
				},
				{
					type: 'shape',
					'display-general': 'block',
					'background-palette-svg-color-status-general': true,
					'background-palette-svg-color-general': 5,
					'background-svg-SVGElement-general': '',
					'background-svg-SVGData-general': {},
					'background-svg-SVGMediaID-general': null,
					'background-svg-SVGMediaURL-general': '',
					'background-svg-top-unit-general': '%',
					'background-svg-top-general': null,
					'background-svg-left-unit-general': '%',
					'background-svg-left-general': null,
					'background-svg-size-general': 100,
					'background-svg-size-unit-general': '%',
					id: 4,
				},
			],
			'border-palette-color-status-general': true,
			'border-palette-color-general': 2,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct simple background styles', () => {
		const result = getBackgroundStyles({
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-active-media-general': 'color',
			'background-active-media-l': 'gradient',
			'background-active-media-m': 'color',
			'background-active-media-xs': 'gradient',
			'background-color-general': 'rgba(255,255,255,0.39)',
			'background-color-m': 'rgba(255,255,255,0.39)',
			'background-color-s': 'rgba(43,43,179,0.39)',
			'background-color-xl': 'rgba(255,255,255,0.39)',
			'background-color-xxl': 'rgba(255,255,255,0.39)',
			'background-gradient-l':
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(155,81,224) 100%)',
			'background-gradient-opacity-general': 1,
			'background-gradient-opacity-l': 0.29,
			'background-gradient-xs':
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(102,186,223) 67%,rgb(155,81,224) 100%)',
			'background-layers-status-general': false,
			'background-layers-status-general-hover': false,
			'background-palette-color-general': 1,
			'background-palette-color-general-hover': 6,
			'background-palette-color-m': 4,
			'background-palette-color-s': 4,
			'background-palette-color-status-general': true,
			'background-palette-color-status-general-hover': true,
			'background-palette-color-status-m': true,
			'background-palette-color-status-s': false,
			'background-palette-color-status-xl': true,
			'background-palette-color-status-xxl': true,
			'background-palette-color-xl': 1,
			'background-palette-color-xxl': 2,
			'background-palette-opacity-general': 39,
			'background-palette-opacity-m': 39,
			'background-palette-opacity-s': 39,
			'background-palette-opacity-xl': 39,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct parallax background styles', () => {
		const result = getBackgroundStyles({
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'parallax-background-image-attachment-general': 'scroll',
			'parallax-background-image-clip-general': 'border-box',
			'parallax-background-image-height-general': 300,
			'parallax-background-image-height-m': 600,
			'parallax-background-image-height-unit-general': '%',
			'parallax-background-image-height-xl': 300,
			'parallax-background-image-mediaID-general': 302,
			'parallax-background-image-mediaID-m': 226,
			'parallax-background-image-mediaID-xl': 302,
			'parallax-background-image-mediaURL-general':
				'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
			'parallax-background-image-mediaURL-m':
				'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
			'parallax-background-image-mediaURL-xl':
				'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
			'parallax-background-image-opacity-general': 0.23,
			'parallax-background-image-opacity-m': 0.78,
			'parallax-background-image-opacity-xl': 0.23,
			'parallax-background-image-opacity-xxl': 0.73,
			'parallax-background-image-origin-general': 'padding-box',
			'parallax-background-image-position-general': 'center center',
			'parallax-background-image-position-height-general': 0,
			'parallax-background-image-position-height-unit-general': '%',
			'parallax-background-image-position-width-general': 0,
			'parallax-background-image-position-width-unit-general': '%',
			'parallax-background-image-repeat-general': 'no-repeat',
			'parallax-background-image-size-general': 'auto',
			'parallax-background-image-width-general': 470,
			'parallax-background-image-width-m': 600,
			'parallax-background-image-width-unit-general': '%',
			'parallax-background-image-width-xl': 470,
			'parallax-direction': 'down',
			'parallax-speed': 4,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with different values on different responsive stages and hover', () => {
		const result = getBlockBackgroundStyles({
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-hover-status': true,
			'background-layers': [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-color-status-general': true,
					'background-palette-color-general': 1,
					'background-palette-opacity-general': 7,
					'background-color-general': '',
					'background-color-clip-path-general':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					id: 0,
					'background-palette-color-status-xl': true,
					'background-palette-color-xl': 1,
					'background-palette-opacity-xl': 7,
					'background-color-xl': '',
					'background-color-clip-path-xl':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-color-clip-path-xxl':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-palette-color-status-xxl': true,
					'background-palette-color-xxl': 2,
					'background-palette-opacity-xxl': 20,
					'background-color-xxl': '',
					'background-palette-color-status-l': true,
					'background-palette-color-l': 4,
					'background-palette-opacity-l': 30,
					'background-color-l': '',
					'background-color-clip-path-l':
						'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'background-palette-color-status-m': true,
					'background-palette-color-m': 5,
					'background-palette-opacity-m': 59,
					'background-color-m': '',
					'background-color-clip-path-m':
						'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
					'background-palette-color-status-s': false,
					'background-palette-color-s': 5,
					'background-palette-opacity-s': 59,
					'background-color-s': 'rgba(204,68,68,0.59)',
					'background-color-clip-path-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'background-color-clip-path-xs':
						'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
					'background-palette-color-status-xl-hover': true,
					'background-palette-color-xl-hover': 4,
					'background-palette-opacity-xl-hover': 59,
					'background-color-xl-hover': '',
					'background-palette-color-status-general-hover': true,
					'background-palette-color-general-hover': 4,
					'background-palette-opacity-general-hover': 59,
					'background-color-general-hover': '',
					'background-palette-color-status-xxl-hover': true,
					'background-palette-color-xxl-hover': 7,
					'background-palette-opacity-xxl-hover': 22,
					'background-color-xxl-hover': '',
					'background-palette-color-status-l-hover': true,
					'background-palette-color-l-hover': 1,
					'background-palette-opacity-l-hover': 59,
					'background-color-l-hover': '',
					'background-palette-color-status-s-hover': true,
					'background-palette-color-s-hover': 8,
					'background-palette-opacity-s-hover': 59,
					'background-color-s-hover': 'rgba(204,68,68,0.59)',
					'background-color-clip-path-l-hover':
						'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
					'background-color-clip-path-s-hover':
						'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with different values on different responsive stages and hovers', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-hover-status': true,
			'background-layers': [
				{
					type: 'image',
					'display-general': 'block',
					'background-image-mediaID-general': 302,
					'background-image-mediaURL-general':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-image-size-general': 'cover',
					'background-image-width-general': 470,
					'background-image-width-unit-general': '%',
					'background-image-height-general': 300,
					'background-image-height-unit-general': '%',
					'background-image-crop-options-general': null,
					'background-image-repeat-general': 'repeat-x',
					'background-image-position-general': 'left top',
					'background-image-position-width-unit-general': '%',
					'background-image-position-width-general': 0,
					'background-image-position-height-unit-general': '%',
					'background-image-position-height-general': 0,
					'background-image-origin-general': 'border-box',
					'background-image-clip-general': 'padding-box',
					'background-image-attachment-general': 'local',
					'background-image-clip-path-general':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-image-opacity-general': 0.52,
					id: 0,
					'background-image-mediaID-xl': 302,
					'background-image-mediaURL-xl':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-image-width-xl': 470,
					'background-image-height-xl': 300,
					'background-image-opacity-xl': 0.52,
					'background-image-size-xl': 'cover',
					'background-image-repeat-xl': 'repeat-x',
					'background-image-position-xl': 'left top',
					'background-image-attachment-xl': 'local',
					'background-image-origin-xl': 'border-box',
					'background-image-clip-xl': 'padding-box',
					'background-image-clip-path-xl':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-image-mediaID-l': 227,
					'background-image-mediaURL-l':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
					'background-image-width-l': 2560,
					'background-image-height-l': 1920,
					'background-image-size-l': 'contain',
					'background-image-repeat-l': 'space',
					'background-image-position-l': 'right top',
					'background-image-attachment-l': 'fixed',
					'background-image-origin-l': 'content-box',
					'background-image-clip-l': 'padding-box',
					'background-image-clip-path-l':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-image-opacity-m': 0.91,
					'background-image-opacity-xxl': 0.11,
					'background-image-clip-path-xxl':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'background-image-repeat-s': 'repeat-x',
					'background-image-attachment-s': 'scroll',
					'background-image-position-s': 'center top',
					'background-image-clip-path-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'background-image-mediaID-xs': 226,
					'background-image-mediaURL-xs':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'background-image-width-xs': 600,
					'background-image-height-xs': 600,
					'background-image-size-xs': 'auto',
					'background-image-mediaID-xl-hover': 226,
					'background-image-mediaURL-xl-hover':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'background-image-width-xl-hover': 600,
					'background-image-height-xl-hover': 600,
					'background-image-mediaID-general-hover': 226,
					'background-image-mediaURL-general-hover':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'background-image-width-general-hover': 600,
					'background-image-height-general-hover': 600,
					'background-image-opacity-xl-hover': 0.17,
					'background-image-opacity-general-hover': 0.17,
					'background-image-clip-path-xl-hover':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-image-clip-path-general-hover':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-image-mediaID-xxl-hover': 210,
					'background-image-mediaURL-xxl-hover':
						'http://localhost:8888/wp-content/uploads/2021/09/Captura-de-pantalla-2021-09-13-a-las-17.16.06.png',
					'background-image-width-xxl-hover': 788,
					'background-image-height-xxl-hover': 732,
					'background-image-opacity-xxl-hover': 0.79,
					'background-image-mediaID-l-hover': 302,
					'background-image-mediaURL-l-hover':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-image-width-l-hover': 470,
					'background-image-height-l-hover': 300,
					'background-image-opacity-l-hover': 0.81,
					'background-image-clip-path-s-hover':
						'ellipse(25% 40% at 50% 50%)',
				},
			],
		};

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for video layer with different values on different responsive stages and hovers', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-hover-status': true,
			'background-layers': [
				{
					type: 'video',
					'display-general': 'block',
					'background-video-mediaID': null,
					'background-video-mediaURL':
						'https://www.youtube.com/watch?v=y1dbbrfekAM',
					'background-video-startTime': 285,
					'background-video-endTime': 625,
					'background-video-loop': false,
					'background-video-clipPath-general': '',
					'background-video-fallbackID-general': 302,
					'background-video-fallbackURL-general':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-video-opacity-general': 0.11,
					id: 0,
					'background-video-opacity-xl': 0.11,
					'background-video-fallbackID-xl': 302,
					'background-video-fallbackURL-xl':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'background-video-opacity-xxl': 0.37,
					'background-video-fallbackID-xxl': 227,
					'background-video-fallbackURL-xxl':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
					'background-video-opacity-l': 0.65,
					'background-video-fallbackID-l': 226,
					'background-video-fallbackURL-l':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'background-video-opacity-s': 0.25,
					'background-video-opacity-xs': 0.9,
					'background-video-opacity-xl-hover': 0.82,
					'background-video-opacity-general-hover': 0.82,
					'background-video-opacity-xxl-hover': 0.21,
					'background-video-opacity-m-hover': 0.06,
					'background-video-opacity-s-hover': 1,
				},
			],
		};

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for gradient layer with different values on different responsive stages and hovers', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'gradient',
					'display-general': 'block',
					'background-gradient-general':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'background-gradient-opacity-general': 0.15,
					'background-gradient-clip-path-general':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					id: 0,
					'background-gradient-opacity-xl': 0.15,
					'background-gradient-xl':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'background-gradient-clip-path-xl':
						'polygon(50% 0%, 0% 100%, 100% 100%)',
					'background-gradient-opacity-xxl': 0.48,
					'background-gradient-clip-path-xxl':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'background-gradient-clip-path-l':
						'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
					'background-gradient-opacity-l': 0.8,
					'background-gradient-l':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'background-gradient-s':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
					'background-gradient-opacity-s': 0.17,
					'background-gradient-clip-path-s':
						'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
					'background-gradient-xl-hover':
						'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
					'background-gradient-general-hover':
						'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
					'background-gradient-opacity-xl-hover': 0.71,
					'background-gradient-opacity-general-hover': 0.71,
					'background-gradient-xxl-hover':
						'linear-gradient(205deg,rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
					'background-gradient-clip-path-xxl-hover':
						'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
					'background-gradient-clip-path-xl-hover':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'background-gradient-clip-path-general-hover':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'background-gradient-clip-path-l-hover':
						'circle(50% at 50% 50%)',
					'background-gradient-l-hover':
						'radial-gradient(rgb(26,229,6) 0%,rgb(89,136,156) 25%,rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
					'background-gradient-opacity-l-hover': 0.37,
					'background-gradient-s-hover':
						'radial-gradient(rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
					'background-gradient-clip-path-s-hover':
						'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'background-gradient-opacity-s-hover': 0.91,
				},
			],
		};

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for shape layer with different values on different responsive stages and hovers', () => {
		const result = {
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-layers': [
				{
					type: 'shape',
					'display-general': 'block',
					'background-palette-svg-color-status-general': true,
					'background-palette-svg-color-general': 5,
					'background-svg-SVGElement':
						'<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z"></path></svg>',
					'background-svg-SVGData': {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'background-svg-SVGMediaID': null,
					'background-svg-SVGMediaURL': null,
					'background-svg-top-unit-general': '%',
					'background-svg-top-general': 0,
					'background-svg-left-unit-general': '%',
					'background-svg-left-general': 50,
					'background-svg-size-general': 34,
					'background-svg-size-unit-general': '%',
					id: 0,
					'background-svg-top-xl': 0,
					'background-svg-size-xl': 34,
					'SVGElement-xxl':
						'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					'SVGData-xxl': {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'background-palette-svg-color-status-xxl': true,
					'background-palette-svg-color-xxl': 2,
					'background-palette-svg-opacity-xxl': 37,
					'background-svg-top-xxl': 72,
					'background-svg-left-xxl': 14,
					'background-svg-size-xxl': 84,
					SVGElement:
						'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-1718__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					SVGData: {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'SVGElement-l':
						'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					'SVGData-l': {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'background-palette-svg-color-status-l': true,
					'background-palette-svg-color-l': 3,
					'background-palette-svg-opacity-l': 37,
					'background-svg-top-l': 82,
					'background-svg-left-l': 62,
					'SVGElement-s':
						'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					'SVGData-s': {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'background-palette-svg-color-status-s': true,
					'background-palette-svg-color-s': 7,
					'background-palette-svg-opacity-s': 37,
					'background-svg-top-s': 23,
					'background-svg-left-s': 31,
					'background-palette-svg-color-status-xl-hover': true,
					'background-palette-svg-color-xl-hover': 4,
					'background-palette-svg-opacity-xl-hover': 92,
					'background-palette-svg-color-status-general-hover': true,
					'background-palette-svg-color-general-hover': 4,
					'background-palette-svg-opacity-general-hover': 92,
					'background-svg-top-xl-hover': 57,
					'background-svg-top-general-hover': 57,
					'background-svg-left-xl-hover': 39,
					'background-svg-left-general-hover': 39,
					'background-svg-size-xl-hover': 211,
					'background-svg-size-general-hover': 211,
					'background-palette-svg-color-status-xxl-hover': true,
					'background-palette-svg-color-xxl-hover': 3,
					'background-palette-svg-opacity-xxl-hover': 17,
					'background-svg-top-xxl-hover': 16,
					'background-svg-left-xxl-hover': 11,
					'background-svg-size-xxl-hover': 50,
					'background-palette-svg-color-status-s-hover': true,
					'background-palette-svg-color-s-hover': 8,
					'background-palette-svg-opacity-s-hover': 92,
					'background-svg-top-s-hover': 10,
					'background-svg-left-s-hover': 72,
					'background-svg-size-s-hover': 55,
				},
			],
		};

		expect(result).toMatchSnapshot();
	});
});
