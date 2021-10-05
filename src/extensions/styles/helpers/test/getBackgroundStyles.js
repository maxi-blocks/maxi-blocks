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
	it('Get correct layers background styles for general responsive stage', () => {
		const result = getBackgroundStyles({
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
					'background-svg-top--unit-general': '%',
					'background-svg-top-general': null,
					'background-svg-left--unit-general': '%',
					'background-svg-left-general': null,
					'background-svg-size-general': 100,
					'background-svg-size--unit-general': '%',
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
});
