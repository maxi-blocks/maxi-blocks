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
	it('Get a correct colour background styles', () => {
		const color = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			blockStyle: 'light',
			'background-active-media-general': 'color',
			'background-color-general': 'rgba(2,0,36,1)',
			'background-palette-color-status-general': true,
			'background-palette-color-general': 1,
			'background-palette-opacity-general': 20,
			'background-color-clip-path-general':
				'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);',
		};

		const resultColor = getBackgroundStyles(color);
		expect(resultColor).toMatchSnapshot();
	});

	it('Get a correct image background styles', () => {
		const img = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media-general': 'image',
			'background-image-mediaID-general': 1,
			'background-image-mediaURL-general': '/test/',
			'background-image-size-general': 'auto',
			'background-image-crop-options-general': 'object',
			'background-image-repeat-general': 'no-repeat',
			'background-image-position-general': 'relative',
			'background-image-position-width-unit-general': 'relative',
			'background-image-position-width-general': 4,
			'background-image-position-height-unit-general': 'relative',
			'background-image-position-height-general': 1,
			'background-image-origin-general': 'padding-box',
			'background-image-clip-general': 'border-box',
			'background-image-attachment-general': 'scroll',
			'background-image-clip-path-general': 'none',
			'background-image-opacity-general': 0.3,
		};

		const resultImg = getBackgroundStyles(img);
		expect(resultImg).toMatchSnapshot();
	});

	it('Get a correct video background styles', () => {
		const video = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media-general': 'video',
			'background-video-clip-path-general':
				'polygon(50% 0%, 0% 100%, 100% 100%)',
			'background-video-fallbackURL-general': '/test/',
			'background-video-opacity-general': 30,
		};

		const resultVideo = getBackgroundStyles(video);
		expect(resultVideo).toMatchSnapshot();
	});

	it('Get a correct SVG background styles', () => {
		const svg = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			blockStyle: 'light',
			'background-active-media-general': 'svg',
			'background-svg-SVGElement-general':
				'<svg viewBox="1.2999999523162842, 9.599998474121094, 33.5, 17" class="shape-23-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M34.8 14.7v11.9H1.3v-17s3.2 4.3 10.7 6.3c5 1.3 13.3 1.6 22.8-1.2z"></path></svg>',
			'background-svg-top--unit-general': '%',
			'background-svg-top-general': 4,
			'background-svg-left--unit-general': '%',
			'background-svg-left-general': 1,
			'background-svg-size-general': 2,
			'background-svg-size--unit-general': '%',
			'background-palette-svg-color-general': 4,
			'background-palette-svg-opacity-general': 40,
			'background-palette-svg-color-status-general': true,
		};

		const resultSvg = getBackgroundStyles(svg);
		expect(resultSvg).toMatchSnapshot();
	});

	it('Get a correct gradient background styles', () => {
		const gradient = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media-general': 'gradient',
			'background-gradient-general':
				'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(50,98,118) 49%,rgb(155,81,224) 100%)',
			'background-gradient-opacity-general': 0.66,
			'background-gradient-clip-path-general':
				'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);',
		};

		const resultGradient = getBackgroundStyles(gradient);
		expect(resultGradient).toMatchSnapshot();
	});

	it('Get a correct colour background styles with border', () => {
		const color = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			blockStyle: 'light',
			'background-active-media-general': 'color',
			'background-color-general': 'rgba(2,0,36,1)',
			'background-palette-color-status-general': true,
			'background-palette-color-general': 1,
			'background-palette-opacity-general': 20,
			'background-color-clip-path-general':
				'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);',
			'border-palette-color-status-general': true,
			'border-palette-color-general': 4,
			'border-style-general': 'solid',
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'border-top-width-general': 3,
			'border-right-width-general': 3,
			'border-bottom-width-general': 3,
			'border-left-width-general': 3,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-status-hover': false,
			'border-palette-color-status-general-hover': true,
			'border-palette-color-general-hover': 6,
			'border-unit-radius-general-hover': 'px',
		};

		const resultColor = getBackgroundStyles(color);
		expect(resultColor).toMatchSnapshot();
	});

	it('Get a correct colour background styles on different breakpoints', () => {
		const color = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			blockStyle: 'light',
			'background-active-media-general': 'color',
			'background-color-general': 'rgba(2,0,36,1)',
			'background-palette-color-status-general': true,
			'background-palette-color-general': 1,
			'background-palette-opacity-general': 20,
			'background-color-clip-path-general':
				'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);',
			'background-palette-color-l': 2,
			'background-palette-color-m': 3,
			'background-palette-opacity-s': 80,
		};

		const resultColor = getBackgroundStyles(color);
		expect(resultColor).toMatchSnapshot();
	});

	it('Get a correct image background styles on different breakpoints', () => {
		const img = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media-general': 'image',
			'background-image-mediaID-general': 1,
			'background-image-mediaURL-general': '/test/',
			'background-image-size-general': 'auto',
			'background-image-crop-options-general': 'object',
			'background-image-repeat-general': 'no-repeat',
			'background-image-position-general': 'relative',
			'background-image-position-width-unit-general': 'relative',
			'background-image-position-width-general': 4,
			'background-image-position-height-unit-general': 'relative',
			'background-image-position-height-general': 1,
			'background-image-origin-general': 'padding-box',
			'background-image-clip-general': 'border-box',
			'background-image-attachment-general': 'scroll',
			'background-image-clip-path-general': 'none',
			'background-image-opacity-general': 0.3,
			'background-image-mediaID-l': 4,
			'background-image-mediaURL-l': '/test-4/',
			'background-image-position-l': 'custom',
			'background-image-position-width-l': 2,
			'background-image-position-width-unit-l': 'px',
			'background-image-position-height-l': 3,
			'background-image-position-height-unit-l': 'px',
			'background-image-mediaID-s': 5,
			'background-image-mediaURL-s': '/test-5/',
			'background-image-position-height-s': 4,
		};

		const resultImg = getBackgroundStyles(img);
		expect(resultImg).toMatchSnapshot();
	});

	it('Get a correct video background styles on different breakpoints', () => {
		const video = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			'background-active-media-general': 'video',
			'background-video-clip-path-general':
				'polygon(50% 0%, 0% 100%, 100% 100%)',
			'background-video-fallbackURL-general': '/test/',
			'background-video-opacity-general': 30,
			'background-video-clip-path-l':
				'polygon(40% 0%, 0% 100%, 90% 100%)',
			'background-video-fallbackURL-l': '/test-2/',
			'background-video-opacity-l': 60,
			'background-video-opacity-s': 40,
		};

		const resultVideo = getBackgroundStyles(video);
		expect(resultVideo).toMatchSnapshot();
	});

	it('Get a correct SVG background styles on different breakpoints', () => {
		const svg = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			blockStyle: 'light',
			'background-active-media-general': 'svg',
			'background-svg-SVGElement-general':
				'<svg viewBox="1.2999999523162842, 9.599998474121094, 33.5, 17" class="shape-23-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M34.8 14.7v11.9H1.3v-17s3.2 4.3 10.7 6.3c5 1.3 13.3 1.6 22.8-1.2z"></path></svg>',
			'background-svg-top--unit-general': '%',
			'background-svg-top-general': 4,
			'background-svg-left--unit-general': '%',
			'background-svg-left-general': 1,
			'background-svg-size-general': 2,
			'background-svg-size--unit-general': '%',
			'background-palette-svg-color-general': 4,
			'background-palette-svg-opacity-general': 40,
			'background-palette-svg-color-status-general': true,
			'background-svg-top--unit-l': 'px',
			'background-palette-svg-color-l': 2,
			'background-palette-svg-opacity-l': 60,
		};

		const resultSvg = getBackgroundStyles(svg);
		expect(resultSvg).toMatchSnapshot();
	});

	it('Get correct displays on different breakpoints without video and svg', () => {
		const activeMedias = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			blockStyle: 'light',
			'background-active-media-general': 'color',
			'background-active-media-l': 'gradient',
			'background-active-media-m': 'image',
			'background-active-media-s': 'gradient',
			'background-active-media-xs': 'color',
		};

		const result = getBackgroundStyles(activeMedias);
		expect(result).toMatchSnapshot();
	});

	it('Get correct displays on different breakpoints with video and svg', () => {
		const activeMedias = {
			target: 'maxi-test',
			isHover: false,
			prefix: '',
			blockStyle: 'light',
			'background-active-media-general': 'svg',
			'background-svg-SVGElement-general':
				'<svg viewBox="1.2999999523162842, 9.599998474121094, 33.5, 17" class="shape-23-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M34.8 14.7v11.9H1.3v-17s3.2 4.3 10.7 6.3c5 1.3 13.3 1.6 22.8-1.2z"></path></svg>',
			'background-active-media-l': 'gradient',
			'background-active-media-m': 'video',
			'background-active-media-s': 'gradient',
			'background-active-media-xs': 'svg',
			'background-svg-SVGElement-xs':
				'<svg viewBox="1.2999999523162842, 9.599998474121094, 33.5, 17" class="shape-34-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M34.8 14.7v11.9H1.3v-17s3.2 4.3 10.7 6.3c5 1.3 13.3 1.6 22.8-1.2z"></path></svg>',
		};

		const result = getBackgroundStyles(activeMedias);
		expect(result).toMatchSnapshot();
	});

	it('Gets correct styles on different breakpoints, with different types of background and options', () => {
		debugger;
		const result = getBackgroundStyles({
			target: 'maxi-test',
			isHover: false,
			blockStyle: 'light',
			'background-active-media-general': 'svg',
			'background-layers-status-general': false,
			'background-active-media-xl': 'color',
			'background-active-media-l': 'image',
			'background-active-media-m': 'svg',
			'background-active-media-s': 'gradient',
			'background-active-media-xs': 'video',
			'background-palette-color-status-general': true,
			'background-palette-color-general': 1,
			'background-palette-color-status-xl': true,
			'background-palette-color-xl': 4,
			'background-image-size-general': 'auto',
			'background-image-width-general': 100,
			'background-image-width-unit-general': '%',
			'background-image-height-general': 100,
			'background-image-height-unit-general': '%',
			'background-image-repeat-general': 'no-repeat',
			'background-image-position-general': 'center center',
			'background-image-position-width-unit-general': '%',
			'background-image-position-width-general': 0,
			'background-image-position-height-unit-general': '%',
			'background-image-position-height-general': 0,
			'background-image-origin-general': 'padding-box',
			'background-image-clip-general': 'border-box',
			'background-image-attachment-general': 'scroll',
			'background-image-opacity-general': 1,
			'background-image-mediaID-l': 7,
			'background-image-mediaURL-l':
				'http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg',
			'background-image-width-l': 1080,
			'background-image-height-l': 810,
			'background-video-loop-general': false,
			'background-video-playOnMobile-general': false,
			'background-video-opacity-general': 100,
			'background-video-mediaURL-xs':
				'https://www.youtube.com/watch?v=XTGmTrQXrwg',
			'background-video-fallbackID-xs': 7,
			'background-video-fallbackURL-xs':
				'http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg',
			'background-video-opacity-xs': '',
			'background-gradient-opacity-general': 1,
			'background-gradient-s':
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(69,159,197) 53%,rgb(155,81,224) 100%)',
			'background-palette-svg-color-status-general': true,
			'background-palette-svg-color-general': 4,
			'background-svg-SVGElement-general':
				'<svg viewBox="1.2999999523162842, 9.599998474121094, 33.5, 17" class="shape-23-maxi-svg" data-item="group-maxi-5758__svg"><path fill="" data-fill="" d="M34.8 14.7v11.9H1.3v-17s3.2 4.3 10.7 6.3c5 1.3 13.3 1.6 22.8-1.2z"></path></svg>',
			'background-svg-SVGData-general': {
				'group-maxi-5758__90': {
					color: '',
					imageID: '',
					imageURL: '',
				},
			},
			'background-svg-top--unit-general': '%',
			'background-svg-top-general': 0,
			'background-svg-left--unit-general': '%',
			'background-svg-left-general': 50,
			'background-svg-size-general': 100,
			'background-svg-size--unit-general': '%',
			'background-palette-svg-color-status-xxl': true,
			'background-palette-svg-color-status-m': true,
			'background-palette-svg-color-xxl': 7,
			'background-palette-svg-color-m': 1,
			'background-svg-SVGElement-m':
				'<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-5758__svg"><path fill="" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z"></path></svg>',
			'background-svg-SVGData-m': {
				'group-maxi-5758__287': {
					color: '',
					imageID: '',
					imageURL: '',
				},
			},
			'border-palette-color-status-general': true,
			'border-palette-color-general': 2,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'background-status-hover': false,
			'background-layers-status-hover': false,
			'border-status-hover': false,
			'border-palette-color-status-general-hover': true,
			'border-palette-color-general-hover': 6,
			'border-unit-radius-general-hover': 'px',
		});

		expect(result).toMatchSnapshot();
	});
});

// eslint-disable-next-line jest/no-commented-out-tests
// it('Get a correct layers background styles', () => {
// 	const layers = {
// 		target: 'maxi-test',
// 		isHover: false,
// 		prefix: '',
// 		'background-active-media': 'layers',
// 		'background-layers': [
// 			{
// 				type: 'color',
// 				'background-color': 'rgba(12,233,75,1)',
// 				'background-color-clip-path': '',
// 				id: 0,
// 			},
// 			{
// 				type: 'image',
// 				'background-image-mediaID': 265399,
// 				'background-image-mediaURL':
// 					'https://test.img.com/uploads.png',
// 				'background-image-size': '',
// 				'background-image-width': 512,
// 				'background-image-width-unit': '%',
// 				'background-image-height': 512,
// 				'background-image-height-unit': '%',
// 				'background-image-crop-options': {},
// 				'background-image-repeat': 'no-repeat',
// 				'background-image-position': 'center center',
// 				'background-image-position-width-unit': '%',
// 				'background-image-position-width': 0,
// 				'background-image-position-height-unit': '%',
// 				'background-image-position-height': 0,
// 				'background-image-origin': 'padding-box',
// 				'background-image-clip': 'border-box',
// 				'background-image-attachment': 'scroll',
// 				'background-image-clip-path': '',
// 				'background-image-opacity': 1,
// 				id: 1,
// 			},
// 			{
// 				type: 'video',
// 				'background-video-mediaID': null,
// 				'background-video-mediaURL': 'https://youtu.be/EKLWC93nvAU',
// 				'background-video-startTime': '',
// 				'background-video-endTime': '',
// 				'background-video-loop': false,
// 				'background-video-clipPath': '',
// 				'background-video-fallbackID': null,
// 				'background-video-fallbackURL': '',
// 				'background-video-playOnMobile': false,
// 				'background-video-opacity': 0.72,
// 				id: 2,
// 			},
// 			{
// 				type: 'gradient',
// 				'background-gradient':
// 					'linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(62,102,120) 40%,rgb(155,81,224) 100%)',
// 				'background-gradient-opacity': 0.51,
// 				'background-gradient-clip-path': '',
// 				id: 3,
// 			},
// 			{
// 				type: 'shape',
// 				'background-svg-SVGElement':
// 					'<svg xml:space="preserve" viewBox="0 0 36.1 36.1" version="1.1" y="0" x="0" xmlns="http://www.w3.org/2000/svg" data-item="group-maxi-374375__svg">\n\t<g>\n\t\t<path d="M24.5 7.8c-2.1-1.3-4.4-2.2-6.9-2.8-2.4-.6-4.8-.9-7.1-.7-2.4.1-4.4.7-6 1.6-1.8 1-3 2.4-3.7 4.1-.3.8-.4 1.7-.2 2.6.1.7.4 1.5.9 2.4.3.5.8 1.4 1.5 2.4.6 1 1 1.8 1.2 2.5.2.7.3 1.6.3 2.7 0 .6-.1 1.6-.1 2.9 0 1.1.2 2.1.5 2.8.4 1 1.1 1.8 2.1 2.4 1.2.8 2.4 1.1 3.7 1.1.9 0 2-.3 3.5-.8 1.8-.6 3-1 3.7-1.1 1.5-.3 2.9-.3 4.4.1 3.2.8 5.7 1.1 7.5.9 2.5-.2 4.2-1.2 5.1-3.1.7-1.3.9-2.8.7-4.6-.2-1.7-.8-3.6-1.7-5.5-1-2-2.2-3.8-3.8-5.5-1.7-1.8-3.6-3.2-5.6-4.4z" fill=""></path>\n\t</g>\n</svg>',
// 				'background-svg-SVGData': {
// 					'group-maxi-374375__786': {
// 						color: '',
// 						imageID: '',
// 						imageURL: '',
// 					},
// 				},
// 				'background-svg-SVGMediaID': null,
// 				'background-svg-SVGMediaURL': null,
// 				'background-svg-top--unit': '%',
// 				'background-svg-top': null,
// 				'background-svg-left--unit': '%',
// 				'background-svg-left': null,
// 				'background-svg-size': 100,
// 				'background-svg-size--unit': '%',
// 				id: 4,
// 			},
// 		],
// 		'background-layers-status': true,
// 	};

// 	const resultLayers = getBackgroundStyles(layers);
// 	expect(resultLayers).toMatchSnapshot();
// });
