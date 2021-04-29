import getOpacityStyles from '../getOpacityStyles';

describe('getOpacityStyles', () => {
	it('Get a correct alignment', () => {
		const object = {
			'opacity-general': 1,
			'opacity-xxl': 2,
			'opacity-xl': 3,
			'opacity-l': 4,
			'opacity-m': 1,
			'opacity-s': 2,
			'opacity-xs': 3,
		};

		const result = getOpacityStyles(object);
		expect(result).toMatchSnapshot();
	});
});
