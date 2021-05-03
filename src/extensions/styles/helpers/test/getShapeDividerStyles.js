import {
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
} from '../getShapeDividerStyles';

describe('getShapeDividerStyles', () => {
	it('Get a correct shape divider styles', () => {
		const object = {
			'shape-divider-top-status': true,
			'shape-divider-top-height': 1,
			'shape-divider-top-height-unit': 'px',
			'shape-divider-top-opacity': 1,
			'shape-divider-top-shape-style': 'default',
			'shape-divider-top-effects-status': true,
			'shape-divider-bottom-status': true,
			'shape-divider-bottom-height': 3,
			'shape-divider-bottom-height-unit': 'px',
			'shape-divider-bottom-opacity': 0.51,
			'shape-divider-bottom-shape-style': 'default',
			'shape-divider-bottom-effects-status': true,
		};

		const objectSVGStyles = {
			'shape-divider-bottom-status': true,
			'shape-divider-bottom-height': 1,
			'shape-divider-bottom-height-unit': 'px',
			'shape-divider-bottom-opacity': 1,
			'shape-divider-bottom-shape-style': 'default',
			'shape-divider-bottom-effects-status': true,
			'shape-divider-bottom-background-color': 'rgb(255, 99, 71)',
			'shape-divider-top-status': true,
			'shape-divider-top-height': 3,
			'shape-divider-top-height-unit': 'px',
			'shape-divider-top-opacity': 0,98,
			'shape-divider-top-shape-style': 'default',
			'shape-divider-top-effects-status': true,
			'shape-divider-top-background-color': 'rgb(255, 99, 71)',
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
