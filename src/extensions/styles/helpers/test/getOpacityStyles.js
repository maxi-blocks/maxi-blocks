import getOpacityStyles from '../getOpacityStyles';

describe('getOpacityStyles', () => {
	it('Get a correct opacity styles', () => {
		const object = {
			'o-general': 1,
			'o-xxl': 0.56,
			'o-xl': 0.77,
			'o-l': 0.95,
			'o-m': 0.85,
			'o-s': 0.66,
			'o-xs': 0.99,
		};

		const result = getOpacityStyles(object);
		expect(result).toMatchSnapshot();
	});
});
