import getBackgroundStyles from '../getBackgroundStyles';

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
	it('Get a correct background styles', () => {
		const color = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media': 'color',
			'background-color': 'rgba(2,0,36,1)',
			'background-palette-color-status': true,
			'background-palette-color': 1,
			'background-palette-opacity': 20,
			'background-color-clip-path': 'rgba(2,0,36,1)',
			'border-top-left-radius-general': 1,
			'border-top-right-radius-general': 2,
			'border-bottom-right-radius-general': 3,
			'border-bottom-left-radius-general': 4,
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'border-top-left-radius-xxl': 1,
			'border-top-right-radius-xxl': 2,
			'border-bottom-right-radius-xxl': 3,
			'border-bottom-left-radius-xxl': 4,
			'border-sync-radius-xxl': true,
			'border-unit-radius-xxl': 'px',
			'border-top-left-radius-xl': 1,
			'border-top-right-radius-xl': 2,
			'border-bottom-right-radius-xl': 3,
			'border-bottom-left-radius-xl': 4,
			'border-sync-radius-xl': true,
			'border-unit-radius-xl': 'px',
			'border-top-left-radius-l': 1,
			'border-top-right-radius-l': 2,
			'border-bottom-right-radius-l': 3,
			'border-bottom-left-radius-l': 4,
			'border-sync-radius-l': true,
			'border-unit-radius-l': 'px',
			'border-top-left-radius-m': 1,
			'border-top-right-radius-m': 2,
			'border-bottom-right-radius-m': 3,
			'border-bottom-left-radius-m': 4,
			'border-sync-radius-m': true,
			'border-unit-radius-m': 'px',
			'border-top-left-radius-s': 1,
			'border-top-right-radius-s': 2,
			'border-bottom-right-radius-s': 3,
			'border-bottom-left-radius-s': 4,
			'border-sync-radius-s': true,
			'border-unit-radius-s': 'px',
			'border-top-left-radius-xs': 1,
			'border-top-right-radius-xs': 2,
			'border-bottom-right-radius-xs': 3,
			'border-bottom-left-radius-xs': 4,
			'border-sync-radius-xs': true,
			'border-unit-radius-xs': 'px',
		};

		const img = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media': 'image',
			'background-image-mediaID': 1,
			'background-image-mediaURL': '/test/',
			'background-image-size': 'auto',
			'background-image-width': 2,
			'background-image-width-unit': 'px',
			'background-image-height': 3,
			'background-image-height-unit': 'px',
			'background-image-crop-options': 'object',
			'background-image-repeat': 'no-repeat',
			'background-image-position': 'relative',
			'background-image-position-width-unit': 'relative',
			'background-image-position-width': 4,
			'background-image-position-height-unit': 'relative',
			'background-image-position-height': 1,
			'background-image-origin': 'padding-box',
			'background-image-clip': 'border-box',
			'background-image-attachment': 'scroll',
			'background-image-clip-path': 'none',
			'background-image-opacity': 0.3,
		};

		const video = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media': 'video',
			'background-video-mediaID': 3,
			'background-video-mediaURL': 'test.com',
			'background-video-startTime': '',
			'background-video-endTime': '',
			'background-video-loop': true,
			'background-video-clip-path': '',
			'background-video-fallbackID': 4,
			'background-video-fallbackURL': '',
			'background-video-playOnMobile': true,
			'background-video-opacity': 1,
		};

		const svg = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media': 'svg',
			'background-svg-SVGElement': '',
			'background-svg-SVGData': 'object',
			'background-svg-SVGMediaID': 3,
			'background-svg-SVGMediaURL': '',
			'background-svg-top--unit': '%',
			'background-svg-top': 4,
			'background-svg-left--unit': '%',
			'background-svg-left': 1,
			'background-svg-size': 2,
			'background-svg-size--unit': '%',
		};

		const gradient = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media': 'gradient',
			'background-gradient':
				'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(50,98,118) 49%,rgb(155,81,224) 100%)',
			'background-gradient-opacity': 0.66,
			'background-gradient-clip-path':
				'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);',
		};

		const layers = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media': 'layers',
			'background-layers': [
				{
					type: 'color',
					'background-color': 'rgba(12,233,75,1)',
					'background-color-clip-path': '',
					id: 0,
				},
				{
					type: 'image',
					'background-image-mediaID': 265399,
					'background-image-mediaURL':
						'https://test.img.com/uploads.png',
					'background-image-size': '',
					'background-image-width': 512,
					'background-image-width-unit': '%',
					'background-image-height': 512,
					'background-image-height-unit': '%',
					'background-image-crop-options': {},
					'background-image-repeat': 'no-repeat',
					'background-image-position': 'center center',
					'background-image-position-width-unit': '%',
					'background-image-position-width': 0,
					'background-image-position-height-unit': '%',
					'background-image-position-height': 0,
					'background-image-origin': 'padding-box',
					'background-image-clip': 'border-box',
					'background-image-attachment': 'scroll',
					'background-image-clip-path': '',
					'background-image-opacity': 1,
					id: 1,
				},
				{
					type: 'video',
					'background-video-mediaID': null,
					'background-video-mediaURL': 'https://youtu.be/EKLWC93nvAU',
					'background-video-startTime': '',
					'background-video-endTime': '',
					'background-video-loop': false,
					'background-video-clipPath': '',
					'background-video-fallbackID': null,
					'background-video-fallbackURL': '',
					'background-video-playOnMobile': false,
					'background-video-opacity': 0.72,
					id: 2,
				},
				{
					type: 'gradient',
					'background-gradient':
						'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(62,102,120) 40%,rgb(155,81,224) 100%)',
					'background-gradient-opacity': 0.51,
					'background-gradient-clip-path': '',
					id: 3,
				},
				{
					type: 'shape',
					'background-svg-SVGElement':
						'<svg xml:space="preserve" viewBox="0 0 36.1 36.1" version="1.1" y="0" x="0" xmlns="http://www.w3.org/2000/svg" data-item="group-maxi-374375__svg">\n\t<g>\n\t\t<path d="M24.5 7.8c-2.1-1.3-4.4-2.2-6.9-2.8-2.4-.6-4.8-.9-7.1-.7-2.4.1-4.4.7-6 1.6-1.8 1-3 2.4-3.7 4.1-.3.8-.4 1.7-.2 2.6.1.7.4 1.5.9 2.4.3.5.8 1.4 1.5 2.4.6 1 1 1.8 1.2 2.5.2.7.3 1.6.3 2.7 0 .6-.1 1.6-.1 2.9 0 1.1.2 2.1.5 2.8.4 1 1.1 1.8 2.1 2.4 1.2.8 2.4 1.1 3.7 1.1.9 0 2-.3 3.5-.8 1.8-.6 3-1 3.7-1.1 1.5-.3 2.9-.3 4.4.1 3.2.8 5.7 1.1 7.5.9 2.5-.2 4.2-1.2 5.1-3.1.7-1.3.9-2.8.7-4.6-.2-1.7-.8-3.6-1.7-5.5-1-2-2.2-3.8-3.8-5.5-1.7-1.8-3.6-3.2-5.6-4.4z" fill=""></path>\n\t</g>\n</svg>',
					'background-svg-SVGData': {
						'group-maxi-374375__786': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'background-svg-SVGMediaID': null,
					'background-svg-SVGMediaURL': null,
					'background-svg-top--unit': '%',
					'background-svg-top': null,
					'background-svg-left--unit': '%',
					'background-svg-left': null,
					'background-svg-size': 100,
					'background-svg-size--unit': '%',
					id: 4,
				},
			],
			'background-layers-status': true,
		};

		const resultColor = getBackgroundStyles(color);
		expect(resultColor).toMatchSnapshot();

		const resultImg = getBackgroundStyles(img);
		expect(resultImg).toMatchSnapshot();

		const resultVideo = getBackgroundStyles(video);
		expect(resultVideo).toMatchSnapshot();

		const resultSvg = getBackgroundStyles(svg);
		expect(resultSvg).toMatchSnapshot();

		const resultGradient = getBackgroundStyles(gradient);
		expect(resultGradient).toMatchSnapshot();

		const resultLayers = getBackgroundStyles(layers);
		expect(resultLayers).toMatchSnapshot();
	});
});
