import getContainerStyles from '../getContainerStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

describe('getContainerStyles', () => {
	it('Get a correct container styles', () => {
		const object = {
			'container-size-advanced-options': false,
			'container-max-width-general': 1170,
			'container-max-width-xl': 1170,
			'container-max-width-l': 90,
			'container-max-width-m': 90,
			'container-max-width-s': 90,
			'container-max-width-xs': 90,
			'container-max-width-unit-general': 'px',
			'container-max-width-unit-xxl': 'px',
			'container-max-width-unit-xl': 'px',
			'container-max-width-unit-l': '%',
			'container-max-width-unit-m': '%',
			'container-max-width-unit-s': '%',
			'container-max-width-unit-xs': '%',
			'container-width-l': 1170,
			'container-width-unit-l': 'px',
			'container-width-general': 1170,
			'container-width-unit-general': 'px',
			'container-width-xl': 1170,
			'container-width-unit-xl': 'px',
			'container-width-xxl': 1170,
			'container-width-unit-xxl': 'px',
			'container-width-m': 1000,
			'container-width-unit-m': 'px',
			'container-width-s': 700,
			'container-width-unit-s': 'px',
			'container-width-xs': 460,
			'container-width-unit-xs': 'px',
			'container-max-width-xxl': 1790,
		};

		const result = getContainerStyles(object);
		expect(result).toMatchSnapshot();
	});
});
