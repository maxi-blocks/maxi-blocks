import {
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
} from '../getShapeDividerStyles';

describe('getShapeDividerStyles', () => {
	it('Get a correct Shape Divider', () => {
		const object = {
			'shape-divider-top-status': 'true',
			'shape-divider-top-height': 1,
			'shape-divider-top-height-unit': 'px',
			'shape-divider-top-opacity': 2,
			'shape-divider-top-shape-style': 'test',
			'shape-divider-top-effects-status': 'true',
			'shape-divider-bottom-status': 'true',
			'shape-divider-bottom-height': 3,
			'shape-divider-bottom-height-unit': 'px',
			'shape-divider-bottom-opacity': 4,
			'shape-divider-bottom-shape-style': 'test',
			'shape-divider-bottom-effects-status': 'true',
		};

		const objectSVGStyles = {
			'shape-divider-bottom-status': 'true',
			'shape-divider-bottom-height': 1,
			'shape-divider-bottom-height-unit': 'px',
			'shape-divider-bottom-opacity': 2,
			'shape-divider-bottom-shape-style': 'test',
			'shape-divider-bottom-effects-status': 'true',
			'shape-divider-bottom-background-color': 'red',
			'shape-divider-top-status': 'true',
			'shape-divider-top-height': 3,
			'shape-divider-top-height-unit': 'px',
			'shape-divider-top-opacity': 4,
			'shape-divider-top-shape-style': 'test',
			'shape-divider-top-effects-status': 'true',
			'shape-divider-top-background-color': 'red',
		};

		const result = getShapeDividerStyles(object, 'top');
		expect(result).toMatchSnapshot();

		const resultSVGStyles = getShapeDividerSVGStyles(
			objectSVGStyles,
			'bottom'
		);
		expect(resultSVGStyles).toMatchSnapshot();
	});
});
