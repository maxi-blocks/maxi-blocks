import getBackgroundStyles from '../getBackgroundStyles';

describe('getBackgroundStyles', () => {
	it('Get a correct background styles', () => {
		const object = {
			'background-active-media': 'test',
			'background-layers': 'array',
			'background-layers-status': true,
			'background-color': 'rgba(2,0,36,1)',
			'background-color-clip-path': 'rgba(2,0,36,1)',
			'background-image-mediaID': 1,
			'background-image-mediaURL': 'test',
			'background-image-size': 'test',
			'background-image-width': 2,
			'background-image-width-unit': 'test',
			'background-image-height': 3,
			'background-image-height-unit': 'test',
			'background-image-crop-options': 'object',
			'background-image-repeat': 'no-repeat',
			'background-image-position': 'relative',
			'background-image-position-width-unit': 'relative',
			'background-image-position-width': 4,
			'background-image-position-height-unit': 'relative',
			'background-image-position-height': 1,
			'background-image-origin': 'test',
			'background-image-clip': 'test',
			'background-image-attachment': 'test',
			'background-image-clip-path': 'test',
			'background-image-opacity': 0.3,
			'background-video-mediaID': 3,
			'background-video-mediaURL': 'test',
			'background-video-startTime': 'test',
			'background-video-endTime': 'test',
			'background-video-loop': true,
			'background-video-clip-path': 'test',
			'background-video-fallbackID': 4,
			'background-video-fallbackURL': 'test',
			'background-video-playOnMobile': true,
			'background-video-opacity': 1,
			'background-gradient': 'test',
			'background-gradient-opacity': 0.66,
			'background-gradient-clip-path': 'test',
			'background-svg-SVGCurrentElement': 'test',
			'background-svg-SVGElement': 'test',
			'background-svg-SVGData': 'object',
			'background-svg-SVGMediaID': 3,
			'background-svg-SVGMediaURL': 'test',
			'background-svg-top--unit': '%',
			'background-svg-top': 4,
			'background-svg-left--unit': '%',
			'background-svg-left': 1,
			'background-svg-size': 2,
			'background-svg-size--unit': '%',
		};

		const result = getBackgroundStyles(object);
		expect(result).toMatchSnapshot();
	});
});
