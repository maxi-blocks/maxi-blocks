import {
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
} from '@extensions/styles/helpers/getShapeDividerStyles';

jest.mock('@extensions/styles/getColorRGBAString', () =>
	jest.fn().mockReturnValue('rgb(255, 99, 71)')
);

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
			'shape-divider-bottom-palette-status-general': true,
			'shape-divider-bottom-palette-color-general': 3,
		};

		const result = getShapeDividerStyles(object, 'top');
		expect(result).toMatchSnapshot();

		const resultSVGStyles = getShapeDividerSVGStyles(
			objectSVGStyles,
			'bottom'
		);
		expect(resultSVGStyles).toMatchSnapshot();
	});

	it('Should work when block has padding', () => {
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
			'padding-top-general': '10',
			'padding-top-unit-general': 'px',
			'padding-bottom-general': '10',
			'padding-bottom-unit-general': 'px',
			'padding-left-general': '10',
			'padding-left-unit-general': 'px',
			'padding-right-general': '10',
			'padding-right-unit-general': 'px',
			'padding-sync-general': 'all',
		};

		const result = getShapeDividerStyles(object, 'top');
		expect(result).toMatchSnapshot();
	});
});
