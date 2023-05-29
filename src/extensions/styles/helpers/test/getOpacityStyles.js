import getOpacityStyles from '../getOpacityStyles';

describe('getOpacityStyles', () => {
	it('Get a correct opacity styles', () => {
		const object = {
			'_o-g': 1,
			'_o-xxl': 0.56,
			'_o-xl': 0.77,
			'_o-l': 0.95,
			'_o-m': 0.85,
			'_o-s': 0.66,
			'_o-xs': 0.99,
		};

		const result = getOpacityStyles(object);
		expect(result).toMatchSnapshot();
	});
});
