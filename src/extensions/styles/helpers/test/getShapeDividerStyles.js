import {
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
} from '@extensions/styles/helpers/getShapeDividerStyles';

describe('getShapeDividerStyles', () => {
	it('Get a correct shape divider styles', () => {
		const object = {
			'shape-divider-top-status': true,
			'shape-divider-top-height-general': 1,
			'shape-divider-top-height-unit-general': 'px',
			'shape-divider-top-opacity-general': 1,
			'shape-divider-top-shape-style': 'default',
			'shape-divider-top-effects-status': true,
			'shape-divider-top-color-general': 'rgb(255, 99, 71)',
			'shape-divider-bottom-status': true,
			'shape-divider-bottom-height-general': 3,
			'shape-divider-bottom-height-unit-general': 'px',
			'shape-divider-bottom-opacity-general': 0.51,
			'shape-divider-bottom-shape-style': 'default',
			'shape-divider-bottom-effects-status': true,
			'shape-divider-bottom-color-general': 'rgb(255, 99, 71)',
		};

		const objectSVGStyles = {
			'shape-divider-top-status': true,
			'shape-divider-top-height-general': 3,
			'shape-divider-top-height-unit-general': 'px',
			'shape-divider-top-opacity-general': 0.98,
			'shape-divider-top-shape-style': 'default',
			'shape-divider-top-effects-status': true,
			'shape-divider-top-color-general': 'rgb(255, 99, 71)',
			'shape-divider-bottom-status': true,
			'shape-divider-bottom-height-general': 1,
			'shape-divider-bottom-height-unit-general': 'px',
			'shape-divider-bottom-opacity-general': 1,
			'shape-divider-bottom-shape-style': 'default',
			'shape-divider-bottom-effects-status': true,
			'shape-divider-bottom-color-general': 'rgb(255, 99, 71)',
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
